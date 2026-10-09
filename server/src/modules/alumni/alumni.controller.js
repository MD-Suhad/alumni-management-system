import * as alumniService from './alumni.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await alumniService.getMyProfile(req.user._id);
    return ApiResponse.success(res, profile, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await alumniService.updateMyProfile(req.user._id, req.body);
    return ApiResponse.success(res, updated, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getDirectory = async (req, res, next) => {
  try {
    const viewerRole = req.user ? req.user.role : 'guest';
    const result = await alumniService.searchDirectory(req.query, viewerRole);
    return ApiResponse.success(res, result, 'Alumni directory retrieved');
  } catch (error) {
    next(error);
  }
};
