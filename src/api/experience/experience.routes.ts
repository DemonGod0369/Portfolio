import { Router } from 'express';
import * as experienceController from './experience.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', experienceController.getExperiences);
router.get('/:id', experienceController.getExperienceById);
router.post('/', requireAdmin, experienceController.createExperience);
router.put('/:id', requireAdmin, experienceController.updateExperience);
router.delete('/:id', requireAdmin, experienceController.deleteExperience);

export default router;
