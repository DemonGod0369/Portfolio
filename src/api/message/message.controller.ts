import { Request, Response } from 'express';
import * as queries from '../../db/queries.ts';

export async function getMessages(req: Request, res: Response) {
  try {
    const list = await queries.getContactMessages();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch messages' });
  }
}

export async function getMessageById(req: Request, res: Response) {
  try {
    const list = await queries.getContactMessages();
    const found = list.find(m => m.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, data: found });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch message' });
  }
}

export async function submitContact(req: Request, res: Response) {
  try {
    const { name, email, subject, message, honeypot } = req.body;
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message received.' });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, subject, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const ipHash = Buffer.from(clientIp).toString('base64').substring(0, 16);
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    const saved = await queries.submitContactMessage({
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 254),
      subject: String(subject).slice(0, 200),
      message: String(message).slice(0, 5000),
      ipHash,
      userAgent,
    });

    await queries.createAuditEntry({
      action: 'CONTACT_FORM_SUBMISSION',
      entityType: 'ContactMessage',
      entityId: String(saved?.id || ''),
      metadata: { name, email, subject },
      ipHash,
      userAgent,
    });

    res.status(201).json({
      success: true,
      data: saved,
      message: 'Message securely delivered and saved to PostgreSQL.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to submit contact message' });
  }
}

export async function updateMessageStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!['NEW', 'READ', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be NEW, READ, or ARCHIVED.' });
    }

    const updated = await queries.updateContactMessageStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update message status' });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  try {
    const deleted = await queries.deleteContactMessage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    await queries.createAuditEntry({
      action: 'DELETE_CONTACT_MESSAGE',
      entityType: 'ContactMessage',
      entityId: req.params.id,
    });
    res.json({ success: true, data: deleted, message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete message' });
  }
}
