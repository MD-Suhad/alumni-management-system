import { Router } from 'express';
import * as eventController from './event.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles, requireApprovedAlumni } from '../../middleware/rbac.middleware.js';
import { ROLES } from '../../config/roles.js';

const router = Router();

// Publicly viewable events
router.get('/', eventController.getEvents);
router.get('/:slug', eventController.getEventBySlug);

// Alumni authenticated actions
router.post('/:id/register', authenticate, requireApprovedAlumni, eventController.registerForEvent);
router.get('/registrations/me', authenticate, eventController.getMyRegistrations);

// Staff / Event Manager / Admin actions
router.post('/', authenticate, authorizeRoles(ROLES.EVENT_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN), eventController.createEvent);
router.post('/check-in', authenticate, authorizeRoles(ROLES.EVENT_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN), eventController.checkInAttendee);

export default router;
