import * as authService from './auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { config } from '../../config/env.js';

const REFRESH_COOKIE_NAME = 'jid';

const cookieOptions = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: config.env === 'production' ? 'Strict' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return ApiResponse.created(res, result, 'Registration successful. Please verify your email.');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    // Set HttpOnly refresh token cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);

    return ApiResponse.success(res, { user, accessToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(token);

    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, cookieOptions);

    return ApiResponse.success(res, { accessToken }, 'Access token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
  return ApiResponse.success(res, null, 'Logged out successfully');
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyEmailToken(token);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res) => {
  return ApiResponse.success(res, { user: req.user }, 'Current user profile fetched');
};
