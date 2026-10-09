import { ApiError } from '../utils/apiError.js';
import { ROLE_HIERARCHY } from '../config/roles.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required prior to role authorization.'));
    }

    // Super admin can access all role-guarded endpoints
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Role '${req.user.role}' is not authorized to access this resource.`)
      );
    }

    next();
  };
};

export const requireApprovedAlumni = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  // Admins can bypass alumni status checks
  if (['super_admin', 'admin'].includes(req.user.role)) {
    return next();
  }

  if (req.user.status !== 'approved') {
    return next(
      new ApiError(403, `Your alumni profile is currently '${req.user.status}'. Access to directory and networking is restricted until admin approval.`)
    );
  }

  next();
};
