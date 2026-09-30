import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getGalleryImages(req: Request, res: Response) {
  try {
    const list = await queries.getGalleryImages();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch gallery images' });
  }
}

export async function getGalleryImageById(req: Request, res: Response) {
  try {
    const list = await queries.getGalleryImages();
    const found = list.find(g => g.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch gallery image' });
  }
}

export async function createGalleryImage(req: Request, res: Response) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }
    const created = await queries.createGalleryImage(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_GALLERY_IMAGE',
      entityType: 'GalleryImage',
      entityId: created.id,
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create gallery image' });
  }
}

export async function updateGalleryImage(req: Request, res: Response) {
  try {
    const updated = await queries.updateGalleryImage(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update gallery image' });
  }
}

export async function deleteGalleryImage(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteGalleryImage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_GALLERY_IMAGE',
      entityType: 'GalleryImage',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Gallery image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete gallery image' });
  }
}
