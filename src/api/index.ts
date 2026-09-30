import { Router } from 'express';
import authRoutes from './auth/auth.routes.ts';
import profileRoutes from './profile/profile.routes.ts';
import experienceRoutes from './experience/experience.routes.ts';
import educationRoutes from './education/education.routes.ts';
import skillRoutes from './skill/skill.routes.ts';
import serviceRoutes from './service/service.routes.ts';
import projectRoutes from './project/project.routes.ts';
import galleryRoutes from './gallery/gallery.routes.ts';
import blogRoutes from './blog/blog.routes.ts';
import categoryRoutes from './category/category.routes.ts';
import socialRoutes from './social/social.routes.ts';
import settingsRoutes from './settings/settings.routes.ts';
import messageRoutes from './message/message.routes.ts';
import auditRoutes from './audit/audit.routes.ts';
import portfolioRoutes from './portfolio/portfolio.routes.ts';

// Top-level aliases
import * as messageController from './message/message.controller.ts';
import * as authController from './auth/auth.controller.ts';
import * as portfolioController from './portfolio/portfolio.controller.ts';
import { requireAdmin } from './common/middleware/auth.middleware.ts';

const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'PostgreSQL Cloud SQL',
    timestamp: new Date().toISOString(),
  });
});

// Domain-driven Feature API Modules
apiRouter.use('/auth', authRoutes);
apiRouter.use('/portfolio', portfolioRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/experiences', experienceRoutes);
apiRouter.use('/educations', educationRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/services', serviceRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/gallery', galleryRoutes);
apiRouter.use('/blog-posts', blogRoutes);
apiRouter.use('/content-categories', categoryRoutes);
apiRouter.use('/social-links', socialRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/messages', messageRoutes);
apiRouter.use('/audit-logs', auditRoutes);

// Direct convenient endpoints
apiRouter.post('/contact', messageController.submitContact);
apiRouter.post('/admin/login', authController.login);
apiRouter.put('/admin/credentials', requireAdmin, authController.updateCredentials);
apiRouter.get('/admin/sessions', authController.getSessions);
apiRouter.post('/admin/sessions', authController.upsertSession);
apiRouter.delete('/admin/sessions/:id', authController.deleteSession);
apiRouter.post('/admin/sessions/logout-all', authController.logoutAllSessions);
apiRouter.post('/admin/reset-database', requireAdmin, portfolioController.resetDatabase);

// Skill categories alias
apiRouter.get('/skill-categories', (req, res) => res.redirect(307, '/api/skills/categories'));
apiRouter.post('/skill-categories', requireAdmin, (req, res) => res.redirect(307, '/api/skills/categories'));

export default apiRouter;
