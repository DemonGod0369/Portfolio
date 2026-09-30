import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getContentCategories(req: Request, res: Response) {
  try {
    const list = await queries.getContentCategories();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch categories' });
  }
}

export async function getContentCategoryById(req: Request, res: Response) {
  try {
    const list = await queries.getContentCategories();
    const found = list.find(c => c.id === req.params.id || c.slug === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch category' });
  }
}

export async function createContentCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }
    const created = await queries.createContentCategory(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create category' });
  }
}

export async function updateContentCategory(req: Request, res: Response) {
  try {
    const updated = await queries.updateContentCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update category' });
  }
}

export async function deleteContentCategory(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteContentCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, data: deleted, message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete category' });
  }
}
