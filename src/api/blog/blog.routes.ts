import { Router } from 'express';
import * as blogController from './blog.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', blogController.getBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.post('/', requireAdmin, blogController.createBlogPost);
router.put('/:id', requireAdmin, blogController.updateBlogPost);
router.delete('/:id', requireAdmin, blogController.deleteBlogPost);

export default router;
