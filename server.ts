import 'dotenv/config';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { prisma } from './src/db/connection.ts';
import apiRouter from './src/api/index.ts';
import { securityHeaders, sanitizeInput } from './src/api/common/middleware/security.middleware.ts';
import { errorHandler } from './src/api/common/errors/errorHandler.ts';
import { authenticateToken } from './src/api/common/middleware/auth.middleware.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing and security middleware
app.use(securityHeaders);
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(sanitizeInput);
app.use(authenticateToken);

// Mount modular API routes
app.use('/api', apiRouter);
app.use('/api', errorHandler);

async function startServer() {
  // 1. Connect to Database and log status
  try {
    await prisma.$connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }

  // 2. Frontend bundler / static middleware
  // In development, Vite compiles Tailwind CSS v4 and React components dynamically
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

  // 3. Start Express server on specified port
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
