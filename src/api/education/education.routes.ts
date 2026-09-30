import { Router } from 'express';
import * as educationController from './education.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', educationController.getEducations);
router.get('/:id', educationController.getEducationById);
router.post('/', requireAdmin, educationController.createEducation);
router.put('/:id', requireAdmin, educationController.updateEducation);
router.delete('/:id', requireAdmin, educationController.deleteEducation);

export default router;
