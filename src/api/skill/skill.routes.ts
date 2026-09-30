import { Router } from 'express';
import * as skillController from './skill.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

// Skill categories
router.get('/categories', skillController.getSkillCategories);
router.post('/categories', requireAdmin, skillController.createSkillCategory);
router.put('/categories/:id', requireAdmin, skillController.updateSkillCategory);
router.delete('/categories/:id', requireAdmin, skillController.deleteSkillCategory);

// Skills
router.get('/', skillController.getSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', requireAdmin, skillController.createSkill);
router.put('/:id', requireAdmin, skillController.updateSkill);
router.delete('/:id', requireAdmin, skillController.deleteSkill);

export default router;
