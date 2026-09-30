import { Router } from 'express';
import * as galleryController from './gallery.controller.ts';
import { requireAdmin } from '../common/middleware/auth.middleware.ts';

const router = Router();

router.get('/', galleryController.getGalleryImages);
router.get('/:id', galleryController.getGalleryImageById);
router.post('/', requireAdmin, galleryController.createGalleryImage);
router.put('/:id', requireAdmin, galleryController.updateGalleryImage);
router.delete('/:id', requireAdmin, galleryController.deleteGalleryImage);

export default router;
