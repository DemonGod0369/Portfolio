import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { seedDatabaseIfEmpty, getPublicPortfolioData, submitContactMessage, createAuditEntry } from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize DB seeding asynchronously
  seedDatabaseIfEmpty().catch((err) => {
    console.warn('Initial DB check/seeding note (DB optional):', err?.message || err);
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Public portfolio data from PostgreSQL
  app.get('/api/portfolio/public', async (req: Request, res: Response) => {
    try {
      const data = await getPublicPortfolioData();
      res.json({ success: true, data });
    } catch (error: any) {
      console.error('API /api/portfolio/public error:', error);
      res.status(500).json({ success: false, error: 'Failed to load portfolio data.' });
    }
  });

  // Contact message submission
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message, honeypot } = req.body;
      
      // Honeypot spam check
      if (honeypot) {
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
      }

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const ipHash = Buffer.from(String(clientIp)).toString('base64').substring(0, 16);
      const userAgent = req.headers['user-agent'] || 'unknown';

      const savedMessage = await submitContactMessage({
        name: String(name).slice(0, 100),
        email: String(email).slice(0, 254),
        subject: String(subject).slice(0, 200),
        message: String(message).slice(0, 5000),
        ipHash,
        userAgent,
      });

      await createAuditEntry({
        action: 'CONTACT_FORM_SUBMISSION',
        entityType: 'ContactMessage',
        entityId: String(savedMessage?.id || ''),
        metadata: { name, email, subject },
        ipHash,
        userAgent,
      });

      res.json({ success: true, message: 'Message received and stored securely.' });
    } catch (error: any) {
      console.error('Contact submission error:', error);
      res.status(500).json({ success: false, error: 'Failed to submit contact message.' });
    }
  });

  // Vite development middleware or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gunjan Shrestha Platform server running on port ${PORT}`);
  });
}

startServer();
