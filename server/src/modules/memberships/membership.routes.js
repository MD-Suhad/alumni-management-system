import { Router } from 'express';
import * as membershipController from './membership.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireApprovedAlumni } from '../../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireApprovedAlumni);

router.get('/my', membershipController.getMyMemberships);
router.post('/apply', membershipController.applyMembership);

export default router;
