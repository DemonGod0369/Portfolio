import { Router } from 'express';
import * as socialController from './social.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', socialController.getSocialLinks);
router.get('/:id', socialController.getSocialLinkById);
router.post('/', requireAdmin, socialController.createSocialLink);
router.put('/:id', requireAdmin, socialController.updateSocialLink);
router.delete('/:id', requireAdmin, socialController.deleteSocialLink);

export default router;
