import { Router } from 'express';
import * as settingsController from './settings.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', settingsController.getSettings);
router.put('/', requireAdmin, settingsController.updateSettings);

export default router;
