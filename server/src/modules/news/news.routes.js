import { Router } from 'express';
import * as newsController from './news.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/rbac.middleware.js';
import { ROLES } from '../../config/roles.js';

const router = Router();

router.get('/', newsController.getNews);
router.get('/:slug', newsController.getNewsBySlug);
router.post('/', authenticate, authorizeRoles(ROLES.EDITOR, ROLES.ADMIN, ROLES.SUPER_ADMIN), newsController.createNews);

export default router;
