import 'dotenv/config';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './src/api/index.ts';
import { securityHeaders, sanitizeInput } from './src/api/common/middleware/security.middleware.ts';
import { errorHandler } from './src/api/common/errors/errorHandler.ts';
import { authenticateToken } from './src/api/common/middleware/auth.middleware.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 1. Core security & body parsing middleware
  app.use(securityHeaders);
  app.use(cookieParser());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(sanitizeInput);

  // 2. Authentication extraction (from HTTP-only cookies)
  app.use(authenticateToken);

  // 3. Mount all modular API routes
  app.use('/api', apiRouter);

  // 4. Centralized error handling middleware for API routes
  app.use('/api', errorHandler);

  // 5. Vite development middleware or static production serving
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
    console.log(`[Production Full-Stack Server] Gunjan Shrestha Platform running on port ${PORT}`);
    console.log(`[Database] PostgreSQL Cloud SQL active`);
  });
}

startServer();
