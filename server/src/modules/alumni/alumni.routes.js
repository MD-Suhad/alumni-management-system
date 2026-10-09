import { Router } from 'express';
import * as alumniController from './alumni.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireApprovedAlumni } from '../../middleware/rbac.middleware.js';

const router = Router();

// Profile operations (requires authenticated user)
router.get('/profile', authenticate, alumniController.getProfile);
router.put('/profile', authenticate, alumniController.updateProfile);

// Directory search (requires authenticated & approved alumni or admins)
router.get('/directory', authenticate, requireApprovedAlumni, alumniController.getDirectory);

export default router;
