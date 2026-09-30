import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getExperiences(req: Request, res: Response) {
  try {
    const list = await queries.getExperiences();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch experiences' });
  }
}

export async function getExperienceById(req: Request, res: Response) {
  try {
    const list = await queries.getExperiences();
    const found = list.find(e => e.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch experience' });
  }
}

export async function createExperience(req: Request, res: Response) {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, error: 'Title and category are required' });
    }
    const created = await queries.createExperience(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_EXPERIENCE',
      entityType: 'Experience',
      entityId: created.id,
      metadata: { title: created.title },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create experience' });
  }
}

export async function updateExperience(req: Request, res: Response) {
  try {
    const updated = await queries.updateExperience(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    await queries.createAuditEntry({
      action: 'UPDATE_EXPERIENCE',
      entityType: 'Experience',
      entityId: req.params.id,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update experience' });
  }
}

export async function deleteExperience(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteExperience(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_EXPERIENCE',
      entityType: 'Experience',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Experience deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete experience' });
  }
}
