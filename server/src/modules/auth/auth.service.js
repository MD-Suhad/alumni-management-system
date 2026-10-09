import { User } from '../users/user.model.js';
import { AlumniProfile } from '../alumni/alumniProfile.model.js';
import { ApiError } from '../../utils/apiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyToken
} from '../../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/emailService.js';
import { config } from '../../config/env.js';
import { ROLES, ALUMNI_STATUS } from '../../config/roles.js';

export const registerUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // Create user with default ALUMNI role and PENDING verification
  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email.toLowerCase(),
    password: data.password,
    role: ROLES.ALUMNI,
    status: ALUMNI_STATUS.PENDING,
    phone: data.phone || ''
  });

  // Create linked alumni profile
  await AlumniProfile.create({
    user: user._id,
    studentId: data.studentId,
    department: data.departmentId,
    graduationYear: data.graduationYear,
    degree: data.degree
  });

  // Generate verification token and send email
  const verificationToken = generateEmailVerificationToken(user._id);
  await sendVerificationEmail(user.email, user.fullName, verificationToken);

  return {
    userId: user._id,
    email: user.email,
    message: 'Registration successful. Please check your email to verify your address.'
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  if (user.status === ALUMNI_STATUS.SUSPENDED) {
    throw new ApiError(403, 'Account is suspended. Please contact the administrator.');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar
    },
    accessToken,
    refreshToken
  };
};

export const verifyEmailToken = async (token) => {
  const decoded = verifyToken(token, config.jwt.verificationSecret);
  if (!decoded || !decoded.id) {
    throw new ApiError(400, 'Invalid or expired email verification token.');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, 'User account not found.');
  }

  if (user.isEmailVerified) {
    return { message: 'Email address is already verified.' };
  }

  user.isEmailVerified = true;
  await user.save();

  return { message: 'Email verified successfully! Your account is now in the administrative review queue.' };
};

export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new ApiError(401, 'Refresh token required.');
  }

  const decoded = verifyToken(token, config.jwt.refreshSecret);
  if (!decoded || !decoded.id) {
    throw new ApiError(401, 'Invalid or expired refresh token.');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.tokenVersion !== decoded.tokenVersion) {
    throw new ApiError(401, 'Token revoked or user invalidated.');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Return standard message to prevent email enumeration
    return { message: 'If that email address is in our system, you will receive a reset link shortly.' };
  }

  const resetToken = generatePasswordResetToken(user._id);
  await sendPasswordResetEmail(user.email, user.fullName, resetToken);

  return { message: 'Password reset link sent to your registered email address.' };
};

export const resetPassword = async (token, newPassword) => {
  const decoded = verifyToken(token, config.jwt.resetSecret);
  if (!decoded || !decoded.id) {
    throw new ApiError(400, 'Invalid or expired password reset token.');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  user.password = newPassword;
  user.tokenVersion += 1; // Invalidate all prior refresh tokens
  await user.save();

  return { message: 'Password has been reset successfully. You may now log in.' };
};
