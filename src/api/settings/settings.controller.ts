import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await queries.getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch settings' });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const updated = await queries.updateSiteSettings(req.body);
    await queries.createAuditEntry({
      action: 'UPDATE_SITE_SETTINGS',
      entityType: 'SiteSetting',
      entityId: updated.id,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update settings' });
  }
}
