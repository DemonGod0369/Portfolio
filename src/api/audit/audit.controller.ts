import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getAuditLogs(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await queries.getAuditLogs(limit);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch audit logs' });
  }
}

export async function createAuditLog(req: Request, res: Response) {
  try {
    const { action, entityType, entityId, metadata } = req.body;
    if (!action) {
      return res.status(400).json({ success: false, error: 'Action is required' });
    }
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const ipHash = Buffer.from(clientIp).toString('base64').substring(0, 16);
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    const entry = await queries.createAuditEntry({
      action,
      entityType,
      entityId,
      metadata,
      ipHash,
      userAgent,
    });
    res.status(201).json({ success: true, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create audit log' });
  }
}
