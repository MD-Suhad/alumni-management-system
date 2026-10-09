import { Job } from './job.model.js';
import { ApiError } from '../../utils/apiError.js';
import { JOB_STATUS, ROLES } from '../../config/roles.js';

export const getJobs = async (query = {}, userRole = 'guest') => {
  const { employmentType, experienceLevel, search, isRemote, page = 1, limit = 10 } = query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const filter = {};

  // Non-moderators only see active, non-expired jobs
  if (!['admin', 'super_admin', 'moderator'].includes(userRole)) {
    filter.status = JOB_STATUS.ACTIVE;
    filter.deadline = { $gte: new Date() };
  } else if (query.status) {
    filter.status = query.status;
  }

  if (employmentType) filter.employmentType = employmentType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (isRemote !== undefined) filter['location.isRemote'] = isRemote === 'true';

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('postedBy', 'firstName lastName email'),
    Job.countDocuments(filter)
  ]);

  return {
    data: jobs,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    }
  };
};

export const createJob = async (data, user) => {
  // If posted by admin/moderator, activate automatically; otherwise set to pending
  const isPrivileged = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR].includes(user.role);
  const status = isPrivileged ? JOB_STATUS.ACTIVE : JOB_STATUS.PENDING;

  const job = await Job.create({
    ...data,
    postedBy: user._id,
    status
  });

  return job;
};

export const updateJobStatus = async (jobId, status, reviewerId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, 'Job posting not found.');
  }

  if (!Object.values(JOB_STATUS).includes(status)) {
    throw new ApiError(400, 'Invalid job status.');
  }

  job.status = status;
  job.reviewedBy = reviewerId;
  await job.save();

  return job;
};
