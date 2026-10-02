import { Router } from 'express';
import * as authController from './auth.controller.ts';
import { requireAdmin, authenticateToken } from '../common/middleware/auth.middleware.ts';
import { rateLimiter } from '../common/middleware/security.middleware.ts';

const router = Router();

// Brute-force protection rate limiter
const loginLimiter = rateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000,
  message: 'Too many login attempts. Please wait 1 minute before trying again.',
});

router.post('/login', loginLimiter, authController.login);
router.post('/forgot-password', loginLimiter, authController.forgotPassword);
router.post('/verify-reset-code', loginLimiter, authController.verifyResetCode);
router.post('/reset-password', loginLimiter, authController.resetPassword);
router.get('/me', authenticateToken, authController.me);
router.post('/logout', authController.logout);
router.put('/credentials', requireAdmin, authController.updateCredentials);

router.get('/sessions', authController.getSessions);
router.post('/sessions', authController.upsertSession);
router.delete('/sessions/:id', authController.deleteSession);
router.post('/sessions/logout-all', authController.logoutAllSessions);

export default router;
