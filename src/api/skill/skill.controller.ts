import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

// Categories
export async function getSkillCategories(req: Request, res: Response) {
  try {
    const list = await queries.getSkillCategories();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch skill categories' });
  }
}

export async function createSkillCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    const created = await queries.createSkillCategory(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_SKILL_CATEGORY',
      entityType: 'SkillCategory',
      entityId: created.id,
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create skill category' });
  }
}

export async function updateSkillCategory(req: Request, res: Response) {
  try {
    const updated = await queries.updateSkillCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Skill category not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update skill category' });
  }
}

export async function deleteSkillCategory(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteSkillCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Skill category not found' });
    }
    res.json({ success: true, data: deleted, message: 'Skill category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete skill category' });
  }
}

// Skills
export async function getSkills(req: Request, res: Response) {
  try {
    const list = await queries.getSkills();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch skills' });
  }
}

export async function getSkillById(req: Request, res: Response) {
  try {
    const list = await queries.getSkills();
    const found = list.find(s => s.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch skill' });
  }
}

export async function createSkill(req: Request, res: Response) {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
      return res.status(400).json({ success: false, error: 'Name and categoryId are required' });
    }
    const created = await queries.createSkill(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_SKILL',
      entityType: 'Skill',
      entityId: created.id,
      metadata: { name: created.name },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create skill' });
  }
}

export async function updateSkill(req: Request, res: Response) {
  try {
    const updated = await queries.updateSkill(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update skill' });
  }
}

export async function deleteSkill(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteSkill(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true, data: deleted, message: 'Skill deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete skill' });
  }
}
