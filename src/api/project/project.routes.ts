import { Router } from 'express';
import * as projectController from './project.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', requireAdmin, projectController.createProject);
router.put('/:id', requireAdmin, projectController.updateProject);
router.delete('/:id', requireAdmin, projectController.deleteProject);

export default router;
