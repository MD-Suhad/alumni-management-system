import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/rbac.middleware.js';
import { ROLES } from '../../config/roles.js';

const router = Router();

// Protect all admin routes with authentication and admin/super_admin role check
router.use(authenticate);
router.use(authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/stats', adminController.getDashboardStats);
router.get('/alumni/pending', adminController.getPendingAlumni);
router.patch('/alumni/:id/status', adminController.updateAlumniStatus);
router.get('/reports/export-csv', adminController.exportAlumniCsv);

// Super admin exclusive routes
router.get('/audit-logs', authorizeRoles(ROLES.SUPER_ADMIN), adminController.getAuditLogs);

export default router;
