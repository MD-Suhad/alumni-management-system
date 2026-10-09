import { User } from '../users/user.model.js';
import { AlumniProfile } from '../alumni/alumniProfile.model.js';
import { Event } from '../events/event.model.js';
import { Job } from '../jobs/job.model.js';
import { Membership } from '../memberships/membership.model.js';
import { AuditLog } from '../auditLogs/auditLog.model.js';
import { ApiError } from '../../utils/apiError.js';
import { ALUMNI_STATUS, ROLES } from '../../config/roles.js';

export const getPendingAlumni = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const pendingUsers = await User.find({ status: ALUMNI_STATUS.PENDING })
    .select('firstName lastName email phone isEmailVerified createdAt')
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();

  const userIds = pendingUsers.map((u) => u._id);
  const profiles = await AlumniProfile.find({ user: { $in: userIds } })
    .populate('department', 'name code')
    .lean();

  const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

  const combined = pendingUsers.map((u) => ({
    ...u,
    profile: profileMap.get(u._id.toString()) || null
  }));

  const total = await User.countDocuments({ status: ALUMNI_STATUS.PENDING });

  return {
    data: combined,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    }
  };
};

export const updateAlumniStatus = async (userId, { status, rejectionReason }, adminUser) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  if (![ALUMNI_STATUS.APPROVED, ALUMNI_STATUS.REJECTED, ALUMNI_STATUS.SUSPENDED].includes(status)) {
    throw new ApiError(400, 'Invalid status update provided.');
  }

  user.status = status;
  user.verificationReviewedBy = adminUser._id;
  user.verificationReviewedAt = new Date();
  if (rejectionReason) user.rejectionReason = rejectionReason;

  await user.save();

  // Record audit log
  await AuditLog.create({
    user: adminUser._id,
    userEmail: adminUser.email,
    action: `ALUMNI_STATUS_${status.toUpperCase()}`,
    module: 'ALUMNI_VERIFICATION',
    targetId: user._id.toString(),
    details: { newStatus: status, reason: rejectionReason }
  });

  return user;
};

export const getDashboardStats = async () => {
  const [
    totalUsers,
    approvedAlumni,
    pendingVerifications,
    totalEvents,
    activeJobs,
    totalMemberships
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: ALUMNI_STATUS.APPROVED }),
    User.countDocuments({ status: ALUMNI_STATUS.PENDING }),
    Event.countDocuments(),
    Job.countDocuments({ status: 'active' }),
    Membership.countDocuments({ paymentStatus: 'completed' })
  ]);

  return {
    totalUsers,
    approvedAlumni,
    pendingVerifications,
    totalEvents,
    activeJobs,
    totalMemberships
  };
};

export const getAuditLogs = async (query = {}) => {
  const { page = 1, limit = 20 } = query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [logs, total] = await Promise.all([
    AuditLog.find()
      .populate('user', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    AuditLog.countDocuments()
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    }
  };
};

export const exportAlumniCsv = async () => {
  const profiles = await AlumniProfile.find()
    .populate('user', 'firstName lastName email phone status')
    .populate('department', 'name code')
    .lean();

  const headers = ['Full Name,Email,Phone,Student ID,Department,Graduation Year,Status,Company,Designation\n'];
  const rows = profiles.map((p) => {
    const name = `"${p.user?.firstName || ''} ${p.user?.lastName || ''}"`;
    const email = p.user?.email || '';
    const phone = p.user?.phone || '';
    const studentId = p.studentId || '';
    const dept = p.department?.code || '';
    const gradYear = p.graduationYear || '';
    const status = p.user?.status || '';
    const company = `"${p.currentCompany || ''}"`;
    const designation = `"${p.designation || ''}"`;
    return `${name},${email},${phone},${studentId},${dept},${gradYear},${status},${company},${designation}`;
  });

  return headers.concat(rows).join('\n');
};
