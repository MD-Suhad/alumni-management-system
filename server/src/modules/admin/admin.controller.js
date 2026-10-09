import * as adminService from './admin.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getPendingAlumni = async (req, res, next) => {
  try {
    const result = await adminService.getPendingAlumni(req.query);
    return ApiResponse.success(res, result, 'Pending alumni verifications fetched');
  } catch (error) {
    next(error);
  }
};

export const updateAlumniStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const updatedUser = await adminService.updateAlumniStatus(id, { status, rejectionReason }, req.user);
    return ApiResponse.success(res, updatedUser, `Alumni status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return ApiResponse.success(res, stats, 'Dashboard metrics fetched');
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await adminService.getAuditLogs(req.query);
    return ApiResponse.success(res, logs, 'System audit logs fetched');
  } catch (error) {
    next(error);
  }
};

export const exportAlumniCsv = async (req, res, next) => {
  try {
    const csvData = await adminService.exportAlumniCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="alumni-directory-export.csv"');
    return res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};
