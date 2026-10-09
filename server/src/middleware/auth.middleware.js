import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../modules/users/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization Header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Authentication required. No token provided.');
    }

    // 2. Verify Access Token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.accessSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token has expired. Please refresh session.');
      }
      throw new ApiError(401, 'Invalid authentication token.');
    }

    // 3. Fetch User and ensure active
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'User account associated with this token no longer exists.');
    }

    if (user.status === 'suspended') {
      throw new ApiError(403, 'Account is suspended. Contact administration.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
