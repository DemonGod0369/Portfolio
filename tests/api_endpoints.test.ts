import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import apiRouter from '../src/api/index.ts';
import { securityHeaders, sanitizeInput } from '../src/api/common/middleware/security.middleware.ts';
import { authenticateToken } from '../src/api/common/middleware/auth.middleware.ts';
import { errorHandler } from '../src/api/common/errors/errorHandler.ts';
import { createAuthToken } from '../src/api/common/utils/token.utils.ts';

let server: http.Server;
let baseUrl: string;
let adminCookie: string;

beforeAll(async () => {
  const app = express();
  app.use(securityHeaders);
  app.use(cookieParser());
  app.use(express.json());
  app.use(sanitizeInput);
  app.use(authenticateToken);
  app.use('/api', apiRouter);
  app.use('/api', errorHandler);

  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });

  // Create valid signed auth token
  const token = createAuthToken('gunjanstha01@gmail.com', 'admin');
  adminCookie = `auth_token=${token}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

describe('Modular API Endpoints & Professional Backend Suite', () => {
  // 1. Health Endpoint
  it('GET /api/health: returns healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.status).toBe('healthy');
  });

  // 2. Auth Endpoints
  describe('Authentication & Cookie Endpoints', () => {
    it('POST /api/auth/login: fails with incorrect password', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gunjanstha01@gmail.com', password: 'wrongpassword' }),
      });
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('POST /api/auth/login: succeeds and sets HTTP-only cookie', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gunjanstha01@gmail.com', password: 'gunjan2026' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.email).toBe('gunjanstha01@gmail.com');
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('auth_token=');
      expect(setCookie).toContain('HttpOnly');
    });

    it('GET /api/auth/me: identifies admin session via cookie', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Cookie: adminCookie },
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.authenticated).toBe(true);
      expect(json.user.email).toBe('gunjanstha01@gmail.com');
    });

    it('GET /api/auth/me: returns 401 without cookie', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`);
      expect(res.status).toBe(401);
    });

    it('POST /api/auth/forgot-password: fails for unregistered email', async () => {
      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'unknown_user_99@gmail.com' }),
      });
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    let recoveryCode = '';
    it('POST /api/auth/forgot-password: generates 6-digit code for registered administrator', async () => {
      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gunjanstha01@gmail.com' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.recoveryCode).toBeDefined();
      expect(json.recoveryCode.length).toBe(6);
      recoveryCode = json.recoveryCode;
    });

    it('POST /api/auth/verify-reset-code: rejects invalid code', async () => {
      const res = await fetch(`${baseUrl}/api/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gunjanstha01@gmail.com', code: '000000' }),
      });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('POST /api/auth/verify-reset-code: accepts valid recovery code', async () => {
      const res = await fetch(`${baseUrl}/api/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gunjanstha01@gmail.com', code: recoveryCode }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it('POST /api/auth/reset-password: resets password and enables login with new credentials', async () => {
      const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'gunjanstha01@gmail.com',
          code: recoveryCode,
          newPassword: 'gunjan2026_testreset',
        }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);

      // Verify new login works
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'gunjanstha01@gmail.com',
          password: 'gunjan2026_testreset',
        }),
      });
      expect(loginRes.status).toBe(200);

      // Restore password back to gunjan2026 for following tests
      const forgotRes = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gunjanstha01@gmail.com' }),
      });
      const forgotJson = await forgotRes.json();
      await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'gunjanstha01@gmail.com',
          code: forgotJson.recoveryCode,
          newPassword: 'gunjan2026',
        }),
      });
    });
  });

  // 3. Public Portfolio Initial Load
  it('GET /api/portfolio/public: loads all public data dynamically from PostgreSQL', async () => {
    const res = await fetch(`${baseUrl}/api/portfolio/public`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.profile.name).toBe('Gunjan Shrestha');
    expect(Array.isArray(json.data.experiences)).toBe(true);
    expect(Array.isArray(json.data.projects)).toBe(true);
    expect(Array.isArray(json.data.skills)).toBe(true);
  });

  // 4. Profile CRUD
  describe('Profile Endpoints', () => {
    it('GET /api/profile: retrieves profile', async () => {
      const res = await fetch(`${baseUrl}/api/profile`);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.name).toBe('Gunjan Shrestha');
    });

    it('PUT /api/profile: requires authentication', async () => {
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacker' }),
      });
      expect(res.status).toBe(401);
    });

    it('PUT /api/profile: updates profile with admin cookie', async () => {
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({ headline: 'Multidisciplinary Founder & Operator' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  // 5. Experiences Endpoints
  describe('Experiences CRUD Endpoints', () => {
    let createdId: string;

    it('POST /api/experiences: creates new milestone', async () => {
      const res = await fetch(`${baseUrl}/api/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          category: 'Operations',
          title: 'Executive Managing Director',
          organization: 'Apex Ventures',
          location: 'Kathmandu',
          startDate: '2026',
          isCurrent: true,
          shortDescription: 'Enterprise leadership & strategy.',
          description: 'Managing cross-functional digital and operational assets.',
          tags: ['Operations', 'Strategy'],
          displayOrder: 1,
          published: true,
        }),
      });
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.data.id).toBeDefined();
      createdId = json.data.id;
    });

    it('GET /api/experiences/:id: retrieves created milestone', async () => {
      const res = await fetch(`${baseUrl}/api/experiences/${createdId}`);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.title).toBe('Executive Managing Director');
    });

    it('PUT /api/experiences/:id: updates milestone', async () => {
      const res = await fetch(`${baseUrl}/api/experiences/${createdId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({ title: 'Senior Managing Director' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.title).toBe('Senior Managing Director');
    });

    it('DELETE /api/experiences/:id: deletes milestone', async () => {
      const res = await fetch(`${baseUrl}/api/experiences/${createdId}`, {
        method: 'DELETE',
        headers: { Cookie: adminCookie },
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  // 6. Projects Endpoints
  describe('Projects CRUD Endpoints', () => {
    let projId: string;

    it('POST /api/projects: creates project case study', async () => {
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          title: 'High-Volume Ledger Integration',
          slug: `ledger-integ-${Date.now()}`,
          category: 'Fintech',
          shortSummary: 'Distributed accounting engine',
          featured: true,
          published: true,
          displayOrder: 1,
          images: [],
        }),
      });
      expect(res.status).toBe(201);
      const json = await res.json();
      projId = json.data.id;
    });

    it('GET /api/projects: returns project list', async () => {
      const res = await fetch(`${baseUrl}/api/projects`);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.some((p: any) => p.id === projId)).toBe(true);
    });

    it('DELETE /api/projects/:id: deletes project', async () => {
      const res = await fetch(`${baseUrl}/api/projects/${projId}`, {
        method: 'DELETE',
        headers: { Cookie: adminCookie },
      });
      expect(res.status).toBe(200);
    });
  });

  // 7. Contact Message Endpoints
  describe('Contact Message Endpoints', () => {
    let msgId: string;

    it('POST /api/contact: submits message', async () => {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sarah Connor',
          email: 'sarah@skynet-defense.org',
          subject: 'Cybersecurity Architecture Inquiry',
          message: 'Discussing zero-trust cloud microservices infrastructure.',
        }),
      });
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      msgId = json.data.id;
    });

    it('GET /api/messages: requires admin cookie', async () => {
      const res = await fetch(`${baseUrl}/api/messages`);
      expect(res.status).toBe(401);
    });

    it('GET /api/messages: lists messages with admin cookie', async () => {
      const res = await fetch(`${baseUrl}/api/messages`, {
        headers: { Cookie: adminCookie },
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.some((m: any) => m.id === msgId)).toBe(true);
    });

    it('PATCH /api/messages/:id/status: updates status to READ', async () => {
      const res = await fetch(`${baseUrl}/api/messages/${msgId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({ status: 'READ' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.status).toBe('READ');
    });

    it('DELETE /api/messages/:id: removes message', async () => {
      const res = await fetch(`${baseUrl}/api/messages/${msgId}`, {
        method: 'DELETE',
        headers: { Cookie: adminCookie },
      });
      expect(res.status).toBe(200);
    });
  });

  // 8. Services Endpoints
  describe('Services CRUD Endpoints', () => {
    let serviceId: string;

    it('POST /api/services: creates service', async () => {
      const res = await fetch(`${baseUrl}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          title: 'Full-Stack Database Architecture',
          slug: `db-arch-${Date.now()}`,
          shortDescription: 'Scalable PostgreSQL data tier',
          description: 'High-availability PostgreSQL deployment with connection pooling.',
          displayOrder: 1,
        }),
      });
      expect(res.status).toBe(201);
      const json = await res.json();
      serviceId = json.data.id;
    });

    it('DELETE /api/services/:id: deletes service', async () => {
      const res = await fetch(`${baseUrl}/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Cookie: adminCookie },
      });
      expect(res.status).toBe(200);
    });
  });

  // 9. Site Settings Endpoints
  describe('Site Settings Endpoints', () => {
    it('GET /api/settings: fetches platform settings', async () => {
      const res = await fetch(`${baseUrl}/api/settings`);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.siteName).toBeDefined();
    });

    it('PUT /api/settings: updates settings with admin cookie', async () => {
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        },
        body: JSON.stringify({
          defaultSeoTitle: 'Gunjan Shrestha | Verified Multidisciplinary Founder',
        }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.defaultSeoTitle).toContain('Gunjan Shrestha');
    });
  });
});
