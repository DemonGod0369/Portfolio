import { Router } from 'express';
import * as messageController from './message.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';
import { rateLimiter } from '../common/middleware/security.middleware.ts';

const router = Router();

const contactLimiter = rateLimiter({
  maxRequests: 10,
  windowMs: 10 * 60 * 1000,
  message: 'Too many messages sent. Please wait before submitting another inquiry.',
});

router.post('/contact', contactLimiter, messageController.submitContact);

router.get('/', requireAdmin, messageController.getMessages);
router.get('/:id', requireAdmin, messageController.getMessageById);
router.patch('/:id/status', requireAdmin, messageController.updateMessageStatus);
router.delete('/:id', requireAdmin, messageController.deleteMessage);

export default router;
