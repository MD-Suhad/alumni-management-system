import { Router } from 'express';
import * as metadataController from './metadata.controller.js';

const router = Router();

router.get('/', metadataController.getMetadata);

export default router;
