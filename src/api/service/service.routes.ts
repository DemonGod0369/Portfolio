import { Router } from 'express';
import * as serviceController from './service.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', requireAdmin, serviceController.createService);
router.put('/:id', requireAdmin, serviceController.updateService);
router.delete('/:id', requireAdmin, serviceController.deleteService);

export default router;
