import { Router } from 'express';
import * as jobController from './job.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles, requireApprovedAlumni } from '../../middleware/rbac.middleware.js';
import { ROLES } from '../../config/roles.js';

const router = Router();

// Publicly browse active jobs
router.get('/', jobController.getJobs);

// Verified alumni can post a job
router.post('/', authenticate, requireApprovedAlumni, jobController.createJob);

// Moderator and admin can change job status
router.patch('/:id/status', authenticate, authorizeRoles(ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN), jobController.updateStatus);

export default router;
