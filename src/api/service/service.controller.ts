import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getServices(req: Request, res: Response) {
  try {
    const list = await queries.getServices();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch services' });
  }
}

export async function getServiceById(req: Request, res: Response) {
  try {
    const list = await queries.getServices();
    const found = list.find(s => s.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch service' });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    const created = await queries.createService(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_SERVICE',
      entityType: 'Service',
      entityId: created.id,
      metadata: { title: created.title },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create service' });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const updated = await queries.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    await queries.createAuditEntry({
      action: 'UPDATE_SERVICE',
      entityType: 'Service',
      entityId: req.params.id,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update service' });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_SERVICE',
      entityType: 'Service',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete service' });
  }
}
