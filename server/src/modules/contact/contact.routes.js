import { Router } from 'express';
import * as contactController from './contact.controller.js';

const router = Router();

router.post('/', contactController.submitInquiry);

export default router;
