import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getBlogPosts(req: Request, res: Response) {
  try {
    const list = await queries.getBlogPosts();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch blog posts' });
  }
}

export async function getBlogPostById(req: Request, res: Response) {
  try {
    const list = await queries.getBlogPosts();
    const found = list.find(b => b.id === req.params.id || b.slug === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch article' });
  }
}

export async function createBlogPost(req: Request, res: Response) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }
    const created = await queries.createBlogPost(req.body);
    await queries.createAuditEntry({
      action: 'CREATE_BLOG_POST',
      entityType: 'BlogPost',
      entityId: created.id,
      metadata: { title: created.title },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create blog post' });
  }
}

export async function updateBlogPost(req: Request, res: Response) {
  try {
    const updated = await queries.updateBlogPost(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    await queries.createAuditEntry({
      action: 'UPDATE_BLOG_POST',
      entityType: 'BlogPost',
      entityId: req.params.id,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update blog post' });
  }
}

export async function deleteBlogPost(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteBlogPost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_BLOG_POST',
      entityType: 'BlogPost',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete blog post' });
  }
}
