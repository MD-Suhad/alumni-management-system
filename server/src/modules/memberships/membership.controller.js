import * as membershipService from './membership.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getMyMemberships = async (req, res, next) => {
  try {
    const list = await membershipService.getMyMemberships(req.user._id);
    return ApiResponse.success(res, list, 'My memberships retrieved');
  } catch (error) {
    next(error);
  }
};

export const applyMembership = async (req, res, next) => {
  try {
    const membership = await membershipService.applyMembership(req.user._id, req.body);
    return ApiResponse.created(res, membership, 'Membership application submitted');
  } catch (error) {
    next(error);
  }
};
