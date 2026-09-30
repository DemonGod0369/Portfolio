import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getProfile(req: Request, res: Response) {
  try {
    const profile = await queries.getProfile();
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch profile' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const updated = await queries.updateProfile(req.body);
    await queries.createAuditEntry({
      action: 'UPDATE_PROFILE',
      entityType: 'Profile',
      entityId: updated.id,
      metadata: { fields: Object.keys(req.body) },
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update profile' });
  }
}
