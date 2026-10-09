import { AlumniProfile } from './alumniProfile.model.js';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { ALUMNI_STATUS } from '../../config/roles.js';

export const getMyProfile = async (userId) => {
  const profile = await AlumniProfile.findOne({ user: userId })
    .populate('user', 'firstName lastName email phone avatar role status isEmailVerified')
    .populate('department', 'name code')
    .populate('program', 'name degreeType')
    .populate('batch', 'name passingYear');

  if (!profile) {
    throw new ApiError(404, 'Alumni profile record not found.');
  }

  return profile;
};

export const updateMyProfile = async (userId, data) => {
  const profile = await AlumniProfile.findOne({ user: userId });
  if (!profile) {
    throw new ApiError(404, 'Profile not found.');
  }

  // Update profile fields
  const allowedFields = [
    'currentCompany',
    'designation',
    'industry',
    'location',
    'bloodGroup',
    'bio',
    'socialLinks',
    'skills',
    'privacySettings'
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      profile[field] = data[field];
    }
  });

  await profile.save();

  // If user avatar or phone was passed, update User record
  if (data.phone || data.avatar) {
    await User.findByIdAndUpdate(userId, {
      ...(data.phone && { phone: data.phone }),
      ...(data.avatar && { avatar: data.avatar })
    });
  }

  return getMyProfile(userId);
};

export const searchDirectory = async (query = {}, viewerRole = 'guest') => {
  const { search, department, batch, graduationYear, bloodGroup, page = 1, limit = 12 } = query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  // Filter only approved alumni
  const approvedUsers = await User.find({ status: ALUMNI_STATUS.APPROVED }).select('_id');
  const approvedUserIds = approvedUsers.map((u) => u._id);

  const filter = {
    user: { $in: approvedUserIds }
  };

  if (department) filter.department = department;
  if (batch) filter.batch = batch;
  if (graduationYear) filter.graduationYear = parseInt(graduationYear, 10);
  if (bloodGroup) filter.bloodGroup = bloodGroup;

  if (search) {
    filter.$or = [
      { currentCompany: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } }
    ];
  }

  const [profiles, total] = await Promise.all([
    AlumniProfile.find(filter)
      .populate('user', 'firstName lastName email phone avatar role')
      .populate('department', 'name code')
      .populate('batch', 'name passingYear')
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    AlumniProfile.countDocuments(filter)
  ]);

  // Apply privacy redactions based on profile settings and viewer role
  const sanitizedProfiles = profiles.map((p) => {
    const isOwnerOrAdmin = ['admin', 'super_admin'].includes(viewerRole);
    if (!isOwnerOrAdmin) {
      if (!p.privacySettings?.showEmail && p.user) {
        delete p.user.email;
      }
      if (!p.privacySettings?.showPhone && p.user) {
        delete p.user.phone;
      }
      if (!p.privacySettings?.showCurrentCompany) {
        delete p.currentCompany;
        delete p.designation;
      }
      if (!p.privacySettings?.showBloodGroup) {
        delete p.bloodGroup;
      }
    }
    return p;
  });

  return {
    data: sanitizedProfiles,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    }
  };
};
