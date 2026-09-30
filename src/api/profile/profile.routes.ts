import { Router } from 'express';
import * as profileController from './profile.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', profileController.getProfile);
router.put('/', requireAdmin, profileController.updateProfile);

export default router;
