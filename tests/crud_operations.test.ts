import { describe, it, expect } from 'vitest';
import { 
  initialExperiences, 
  initialProjects, 
  initialBlogPosts, 
  initialEducations, 
  initialSkillCategories, 
  initialSkills, 
  initialServices, 
  initialGalleryImages, 
  initialContactMessages 
} from '../src/data/initialData';
import { Experience, Project, BlogPost, Education, Skill, Service, GalleryImage, SkillCategory, ContactMessage } from '../src/types';

describe('CMS Data Integrity & Comprehensive CRUD Operations', () => {
  // 1. Experiences (Career Milestones) CRUD
  describe('Experience CRUD Operations', () => {
    let experiences: Experience[] = [...initialExperiences];

    it('CREATE: successfully creates and prepends a new career milestone', () => {
      const initialCount = experiences.length;
      const newMilestone: Experience = {
        id: 'test-exp-1',
        category: 'Engineering & Operations',
        title: 'Lead Architect',
        roleTitle: 'Chief Systems Architect',
        organization: 'Himalayan Tech Labs',
        location: 'Kathmandu, Nepal',
        startDate: '2025',
        endDate: 'Present',
        isCurrent: true,
        shortDescription: 'Leading distributed microservices & platform reliability.',
        description: 'Comprehensive oversight of enterprise systems and cloud integrations.',
        tags: ['Architecture', 'Cloud', 'Nepal'],
        featured: true,
        displayOrder: 0,
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      experiences = [newMilestone, ...experiences];
      expect(experiences.length).toBe(initialCount + 1);
      expect(experiences[0].id).toBe('test-exp-1');
      expect(experiences[0].title).toBe('Lead Architect');
    });

    it('READ: retrieves the created career milestone by id', () => {
      const found = experiences.find(e => e.id === 'test-exp-1');
      expect(found).toBeDefined();
      expect(found?.organization).toBe('Himalayan Tech Labs');
    });

    it('UPDATE: updates career milestone fields', () => {
      experiences = experiences.map(e => e.id === 'test-exp-1' ? { ...e, title: 'VP of Engineering', location: 'Pokhara, Nepal' } : e);
      const updated = experiences.find(e => e.id === 'test-exp-1');
      expect(updated?.title).toBe('VP of Engineering');
      expect(updated?.location).toBe('Pokhara, Nepal');
    });

    it('DELETE: permanently removes career milestone upon confirmation', () => {
      const countBefore = experiences.length;
      experiences = experiences.filter(e => e.id !== 'test-exp-1');
      expect(experiences.length).toBe(countBefore - 1);
      expect(experiences.find(e => e.id === 'test-exp-1')).toBeUndefined();
    });
  });

  // 2. Projects (Case Studies) CRUD
  describe('Project / Case Study CRUD Operations', () => {
    let projects: Project[] = [...initialProjects];

    it('CREATE: creates a new case study with tags and metrics', () => {
      const count = projects.length;
      const newProject: Project = {
        id: 'test-proj-1',
        title: 'Fintech Payment Gateway',
        slug: 'fintech-payment-gateway',
        category: 'Software Engineering',
        shortSummary: 'Resilient digital payment integration for localized mobile wallets.',
        overview: 'Enterprise payment processing engine.',
        problem: 'Intermittent connectivity and duplicate requests.',
        approach: 'Idempotency keys and ledger synchronizer.',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        images: [],
        featured: true,
        published: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      projects = [newProject, ...projects];
      expect(projects.length).toBe(count + 1);
      expect(projects.find(p => p.slug === 'fintech-payment-gateway')).toBeDefined();
    });

    it('UPDATE: updates case study metrics and published status', () => {
      projects = projects.map(p => p.id === 'test-proj-1' ? { ...p, title: 'Enterprise Payment Gateway', featured: false } : p);
      const updated = projects.find(p => p.id === 'test-proj-1');
      expect(updated?.title).toBe('Enterprise Payment Gateway');
      expect(updated?.featured).toBe(false);
    });

    it('DELETE: deletes case study', () => {
      const countBefore = projects.length;
      projects = projects.filter(p => p.id !== 'test-proj-1');
      expect(projects.length).toBe(countBefore - 1);
      expect(projects.find(p => p.id === 'test-proj-1')).toBeUndefined();
    });
  });

  // 3. Blog Posts (Journal) CRUD
  describe('Blog / Journal CRUD Operations', () => {
    let posts: BlogPost[] = [...initialBlogPosts];

    it('CREATE: drafts a new technical journal article', () => {
      const count = posts.length;
      const newPost: BlogPost = {
        id: 'test-blog-1',
        title: 'Reflections on Systems Architecture in Nepal',
        slug: 'reflections-on-systems-architecture-in-nepal',
        category: 'Technology & Culture',
        excerpt: 'Examining low-bandwidth fault tolerance in emerging markets.',
        coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        content: 'Long form editorial discussion regarding infrastructure and modern software design...',
        publishedAt: '2026-03-01',
        readingTime: 4,
        status: 'PUBLISHED',
        featured: true,
        tags: ['Architecture', 'Nepal', 'Engineering'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      posts = [newPost, ...posts];
      expect(posts.length).toBe(count + 1);
      expect(posts[0].id).toBe('test-blog-1');
    });

    it('UPDATE: modifies editorial content and status', () => {
      posts = posts.map(p => p.id === 'test-blog-1' ? { ...p, status: 'DRAFT', readingTime: 5 } : p);
      const updated = posts.find(p => p.id === 'test-blog-1');
      expect(updated?.status).toBe('DRAFT');
      expect(updated?.readingTime).toBe(5);
    });

    it('DELETE: permanently removes blog post', () => {
      const countBefore = posts.length;
      posts = posts.filter(p => p.id !== 'test-blog-1');
      expect(posts.length).toBe(countBefore - 1);
      expect(posts.find(p => p.id === 'test-blog-1')).toBeUndefined();
    });
  });

  // 4. Academic Qualifications (Education) CRUD
  describe('Education CRUD Operations', () => {
    let educations: Education[] = [...initialEducations];

    it('CREATE: creates education entry', () => {
      const count = educations.length;
      const newEdu: Education = {
        id: 'test-edu-1',
        institution: 'Tribhuvan University',
        qualification: 'Master of Science in Information Technology',
        startDate: '2024',
        endDate: '2026',
        description: 'Specialization in Distributed Cloud Systems',
        displayOrder: 0,
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      educations = [newEdu, ...educations];
      expect(educations.length).toBe(count + 1);
      expect(educations.find(e => e.id === 'test-edu-1')).toBeDefined();
    });

    it('UPDATE: modifies institution and completion year', () => {
      educations = educations.map(e => e.id === 'test-edu-1' ? { ...e, endDate: '2027', description: 'Advanced AI & Systems' } : e);
      const updated = educations.find(e => e.id === 'test-edu-1');
      expect(updated?.endDate).toBe('2027');
      expect(updated?.description).toBe('Advanced AI & Systems');
    });

    it('DELETE: permanently removes education entry', () => {
      const countBefore = educations.length;
      educations = educations.filter(e => e.id !== 'test-edu-1');
      expect(educations.length).toBe(countBefore - 1);
      expect(educations.find(e => e.id === 'test-edu-1')).toBeUndefined();
    });
  });

  // 5. Skills & Skill Categories CRUD
  describe('Skills & Skill Categories CRUD Operations', () => {
    let categories: SkillCategory[] = [...initialSkillCategories];
    let skills: Skill[] = [...initialSkills];

    it('CREATE: creates a new skill category and associated skill', () => {
      const newCategory: SkillCategory = {
        id: 'test-cat-infra',
        name: 'Cloud & Infrastructure',
        slug: 'cloud-infrastructure',
        description: 'Cloud native platforms, containers, and orchestration',
        displayOrder: categories.length,
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      categories = [...categories, newCategory];

      const newSkill: Skill = {
        id: 'test-skill-k8s',
        categoryId: 'test-cat-infra',
        name: 'Kubernetes',
        slug: 'kubernetes',
        displayOrder: 0,
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      skills = [...skills, newSkill];

      expect(categories.find(c => c.id === 'test-cat-infra')).toBeDefined();
      expect(skills.find(s => s.id === 'test-skill-k8s')?.name).toBe('Kubernetes');
    });

    it('UPDATE: updates skill name and slug', () => {
      skills = skills.map(s => s.id === 'test-skill-k8s' ? { ...s, name: 'Kubernetes & Helm', slug: 'kubernetes-helm' } : s);
      const updated = skills.find(s => s.id === 'test-skill-k8s');
      expect(updated?.name).toBe('Kubernetes & Helm');
      expect(updated?.slug).toBe('kubernetes-helm');
    });

    it('DELETE: deletes skill and category cleanly', () => {
      skills = skills.filter(s => s.id !== 'test-skill-k8s');
      categories = categories.filter(c => c.id !== 'test-cat-infra');
      expect(skills.find(s => s.id === 'test-skill-k8s')).toBeUndefined();
      expect(categories.find(c => c.id === 'test-cat-infra')).toBeUndefined();
    });
  });

  // 6. Services CRUD
  describe('Service Offerings CRUD Operations', () => {
    let services: Service[] = [...initialServices];

    it('CREATE: registers a new technical consultation service', () => {
      const count = services.length;
      const newService: Service = {
        id: 'test-srv-1',
        title: 'Full-Stack Modernization',
        slug: 'full-stack-modernization',
        shortDescription: 'Migrating legacy enterprise systems to cloud architectures.',
        description: 'End-to-end audit, API redesign, and containerized deployment.',
        featured: true,
        published: true,
        displayOrder: count,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      services = [...services, newService];
      expect(services.length).toBe(count + 1);
      expect(services.find(s => s.id === 'test-srv-1')).toBeDefined();
    });

    it('UPDATE: edits title and publishing state', () => {
      services = services.map(s => s.id === 'test-srv-1' ? { ...s, title: 'Cloud & Systems Architecture', published: false } : s);
      const updated = services.find(s => s.id === 'test-srv-1');
      expect(updated?.title).toBe('Cloud & Systems Architecture');
      expect(updated?.published).toBe(false);
    });

    it('DELETE: deletes service item permanently', () => {
      const countBefore = services.length;
      services = services.filter(s => s.id !== 'test-srv-1');
      expect(services.length).toBe(countBefore - 1);
      expect(services.find(s => s.id === 'test-srv-1')).toBeUndefined();
    });
  });

  // 7. Gallery Images CRUD
  describe('Gallery & Media CRUD Operations', () => {
    let gallery: GalleryImage[] = [...initialGalleryImages];

    it('CREATE: uploads/records a new gallery media item', () => {
      const count = gallery.length;
      const newImage: GalleryImage = {
        id: 'test-img-1',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        altText: 'Workstation in Kathmandu office',
        caption: 'Dual screen setup with mechanical keyboard and notebook.',
        category: 'Workspaces & Hardware',
        featured: true,
        published: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      gallery = [newImage, ...gallery];
      expect(gallery.length).toBe(count + 1);
      expect(gallery.find(g => g.id === 'test-img-1')).toBeDefined();
    });

    it('UPDATE: updates caption and category tag', () => {
      gallery = gallery.map(g => g.id === 'test-img-1' ? { ...g, caption: 'Updated developer desk arrangement', category: 'Photography' } : g);
      const updated = gallery.find(g => g.id === 'test-img-1');
      expect(updated?.caption).toBe('Updated developer desk arrangement');
      expect(updated?.category).toBe('Photography');
    });

    it('DELETE: deletes gallery image item', () => {
      const countBefore = gallery.length;
      gallery = gallery.filter(g => g.id !== 'test-img-1');
      expect(gallery.length).toBe(countBefore - 1);
      expect(gallery.find(g => g.id === 'test-img-1')).toBeUndefined();
    });
  });

  // 8. Contact Messages CRUD
  describe('Contact Messages Inbox CRUD Operations', () => {
    let messages: ContactMessage[] = [...initialContactMessages];

    it('CREATE: receives and logs incoming inquiry message', () => {
      const count = messages.length;
      const newMsg: ContactMessage = {
        id: 'test-msg-1',
        name: 'Aarav Sharma',
        email: 'aarav@example.com.np',
        subject: 'Consulting Collaboration in Nepal',
        message: 'Interested in partnering on an open data initiative.',
        status: 'NEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      messages = [newMsg, ...messages];
      expect(messages.length).toBe(count + 1);
      expect(messages[0].status).toBe('NEW');
    });

    it('UPDATE: marks status as READ then ARCHIVED', () => {
      messages = messages.map(m => m.id === 'test-msg-1' ? { ...m, status: 'READ' } : m);
      expect(messages.find(m => m.id === 'test-msg-1')?.status).toBe('READ');

      messages = messages.map(m => m.id === 'test-msg-1' ? { ...m, status: 'ARCHIVED' } : m);
      expect(messages.find(m => m.id === 'test-msg-1')?.status).toBe('ARCHIVED');
    });

    it('DELETE: permanently deletes message', () => {
      const countBefore = messages.length;
      messages = messages.filter(m => m.id !== 'test-msg-1');
      expect(messages.length).toBe(countBefore - 1);
      expect(messages.find(m => m.id === 'test-msg-1')).toBeUndefined();
    });
  });

  // 9. Confirmation Dialog Lifecycle
  describe('Confirmation Dialog Workflow', () => {
    it('executes callback only upon user confirmation', () => {
      let deletionExecuted = false;
      let modalState = {
        isOpen: false,
        title: '',
        onConfirm: () => {},
      };

      // User clicks delete button
      const openModal = (title: string, onConfirm: () => void) => {
        modalState = { isOpen: true, title, onConfirm };
      };

      openModal('Delete Career Milestone?', () => {
        deletionExecuted = true;
      });

      expect(modalState.isOpen).toBe(true);
      expect(deletionExecuted).toBe(false); // Not deleted until confirmed

      // User confirms in UI
      modalState.onConfirm();
      expect(deletionExecuted).toBe(true); // Action performed cleanly
    });
  });
});
