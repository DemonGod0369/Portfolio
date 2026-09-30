import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getPublicPortfolio(req: Request, res: Response) {
  try {
    const data = await queries.getPublicPortfolioData();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to load public portfolio' });
  }
}

export async function getAdminPortfolio(req: Request, res: Response) {
  try {
    const data = await queries.getAllAdminPortfolioData();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to load admin portfolio' });
  }
}

export async function resetDatabase(req: Request, res: Response) {
  try {
    const result = await queries.resetAndReseedDatabase();
    await queries.createAuditEntry({
      action: 'DATABASE_RESET_AND_RESEEDED',
      entityType: 'System',
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to reset database' });
  }
}
