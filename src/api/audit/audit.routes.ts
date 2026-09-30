import { Router } from 'express';
import * as auditController from './audit.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', requireAdmin, auditController.getAuditLogs);
router.post('/', requireAdmin, auditController.createAuditLog);

export default router;
