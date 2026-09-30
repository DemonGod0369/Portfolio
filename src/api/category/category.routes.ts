import { Router } from 'express';
import * as categoryController from './category.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', categoryController.getContentCategories);
router.get('/:id', categoryController.getContentCategoryById);
router.post('/', requireAdmin, categoryController.createContentCategory);
router.put('/:id', requireAdmin, categoryController.updateContentCategory);
router.delete('/:id', requireAdmin, categoryController.deleteContentCategory);

export default router;
