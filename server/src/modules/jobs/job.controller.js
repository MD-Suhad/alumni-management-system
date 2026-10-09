import * as jobService from './job.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getJobs = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role : 'guest';
    const result = await jobService.getJobs(req.query, role);
    return ApiResponse.success(res, result, 'Jobs retrieved');
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body, req.user);
    const message = job.status === 'active' ? 'Job posted successfully.' : 'Job submitted for moderation review.';
    return ApiResponse.created(res, job, message);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await jobService.updateJobStatus(id, status, req.user._id);
    return ApiResponse.success(res, updated, `Job status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};
