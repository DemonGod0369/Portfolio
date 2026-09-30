import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getProjects(req: Request, res: Response) {
  try {
    const list = await queries.getProjects();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch projects' });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const list = await queries.getProjects();
    const found = list.find(p => p.id === req.params.id || p.slug === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch project' });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { title, slug } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    const created = await queries.createProject(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_PROJECT',
      entityType: 'Project',
      entityId: created.id,
      metadata: { title: created.title, slug: created.slug },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create project' });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const updated = await queries.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    await queries.createAuditEntry({
      action: 'UPDATE_PROJECT',
      entityType: 'Project',
      entityId: req.params.id,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update project' });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_PROJECT',
      entityType: 'Project',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete project' });
  }
}
