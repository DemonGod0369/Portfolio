import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getEducations(req: Request, res: Response) {
  try {
    const list = await queries.getEducations();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch educations' });
  }
}

export async function getEducationById(req: Request, res: Response) {
  try {
    const list = await queries.getEducations();
    const found = list.find(e => e.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Education record not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch education' });
  }
}

export async function createEducation(req: Request, res: Response) {
  try {
    const { institution, qualification } = req.body;
    if (!institution || !qualification) {
      return res.status(400).json({ success: false, error: 'Institution and qualification are required' });
    }
    const created = await queries.createEducation(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_EDUCATION',
      entityType: 'Education',
      entityId: created.id,
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create education' });
  }
}

export async function updateEducation(req: Request, res: Response) {
  try {
    const updated = await queries.updateEducation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Education record not found' });
    }
    await queries.createAuditEntry({
      action: 'UPDATE_EDUCATION',
      entityType: 'Education',
      entityId: req.params.id,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update education' });
  }
}

export async function deleteEducation(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteEducation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Education record not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_EDUCATION',
      entityType: 'Education',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Education deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete education' });
  }
}
