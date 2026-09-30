import { Router } from 'express';
import * as portfolioController from './portfolio.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', portfolioController.getPublicPortfolio);
router.get('/public', portfolioController.getPublicPortfolio);
router.get('/admin', requireAdmin, portfolioController.getAdminPortfolio);
router.post('/admin/reset-database', requireAdmin, portfolioController.resetDatabase);

export default router;
