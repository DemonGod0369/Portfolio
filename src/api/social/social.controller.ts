import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getSocialLinks(req: Request, res: Response) {
  try {
    const list = await queries.getSocialLinks();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch social links' });
  }
}

export async function getSocialLinkById(req: Request, res: Response) {
  try {
    const list = await queries.getSocialLinks();
    const found = list.find(s => s.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Social link not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch social link' });
  }
}

export async function createSocialLink(req: Request, res: Response) {
  try {
    const { platform, url } = req.body;
    if (!platform || !url) {
      return res.status(400).json({ success: false, error: 'Platform and URL are required' });
    }
    const created = await queries.createSocialLink(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create social link' });
  }
}

export async function updateSocialLink(req: Request, res: Response) {
  try {
    const updated = await queries.updateSocialLink(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Social link not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update social link' });
  }
}

export async function deleteSocialLink(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteSocialLink(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Social link not found' });
    }
    res.json({ success: true, data: deleted, message: 'Social link deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete social link' });
  }
}
