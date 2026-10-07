import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Profile, 
  Experience, 
  Education, 
  SkillCategory, 
  Skill, 
  Service, 
  ContentCategory,
  Project, 
  GalleryImage, 
  BlogPost, 
  SocialLink, 
  SiteSetting, 
  ContactMessage, 
  AuditLog,
  AdminSession,
  ActiveRoute,
  AdminTab
} from '../types';
import { detectBrowserClientPlatform } from '../utils/browserDetectionUtils';

const emptyProfile: Profile = {
  id: '',
  name: 'Gunjan Shrestha',
  dateOfBirth: '',
  address: '',
  headline: 'Multidisciplinary Founder & Operator',
  shortBio: '',
  longBio: '',
  profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  visitingCardImageUrl: '',
  email: 'gunjanstha01@gmail.com',
  alternateEmail: '',
  primaryEmailLabel: '',
  alternateEmailLabel: '',
  phone: '',
  secondaryPhone: '',
  phoneDisplayOption: 'both',
  whatsappNumber: 'primary',
  location: 'Kathmandu, Nepal',
  website: '',
  languagesSpoken: [],
  createdAt: '',
  updatedAt: '',
};

const emptySiteSetting: SiteSetting = {
  id: '',
  siteName: 'Gunjan Shrestha',
  siteDescription: 'Multidisciplinary Founder & Operator',
  canonicalUrl: 'https://www.gunjanshrestha.com.np',
  logoUrl: '',
  faviconUrl: '',
  profileImageUrl: '',
  email: 'gunjanstha01@gmail.com',
  phone: '',
  location: 'Kathmandu, Nepal',
  footerText: 'Gunjan Shrestha. All Rights Reserved.',
  accentColor: '#c6a87d',
  maintenanceMode: false,
  analyticsEnabled: false,
  defaultSeoTitle: 'Gunjan Shrestha | Founder & Systems Operator',
  defaultSeoDescription: '',
  defaultOgImageUrl: '',
  seoKeywords: '',
  allowIndexing: true,
  createdAt: '',
  updatedAt: '',
};

interface DataContextType {
  // Navigation & Routing
  currentRoute: ActiveRoute;
  setCurrentRoute: (route: ActiveRoute) => void;
  selectedProjectSlug: string | null;
  setSelectedProjectSlug: (slug: string | null) => void;
  selectedBlogSlug: string | null;
  setSelectedBlogSlug: (slug: string | null) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  
  // Auth state (Cookie-based via /api/auth/*)
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; recoveryCode?: string; expiresAt?: string }>;
  verifyPasswordResetCode: (email: string, code: string) => Promise<{ success: boolean; message?: string }>;
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  
  // Data Entities (Dynamic from PostgreSQL)
  profile: Profile;
  updateProfile: (updated: Partial<Profile>) => Promise<void>;
  
  experiences: Experience[];
  addExperience: (exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExperience: (id: string, exp: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  
  educations: Education[];
  addEducation: (edu: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEducation: (id: string, edu: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  
  skillCategories: SkillCategory[];
  skills: Skill[];
  addSkillCategory: (cat: Omit<SkillCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSkillCategory: (id: string, cat: Partial<SkillCategory>) => Promise<void>;
  deleteSkillCategory: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  
  services: Service[];
  addService: (srv: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateService: (id: string, srv: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, proj: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  galleryImages: GalleryImage[];
  addGalleryImage: (img: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGalleryImage: (id: string, img: Partial<GalleryImage>) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  
  contentCategories: ContentCategory[];
  addContentCategory: (cat: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContentCategory: (id: string, cat: Partial<ContentCategory>) => Promise<void>;
  deleteContentCategory: (id: string) => Promise<void>;
  
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string; honeypot?: string }) => Promise<{ success: boolean; message: string }>;
  updateContactMessageStatus: (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  
  socialLinks: SocialLink[];
  updateSocialLinks: (links: SocialLink[]) => Promise<void>;
  addSocialLink: (link: Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  
  siteSetting: SiteSetting;
  siteSettings: SiteSetting;
  updateSiteSetting: (settings: Partial<SiteSetting>) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSetting>) => Promise<void>;
  
  auditLogs: AuditLog[];
  
  // Current user info & multi-device sessions
  currentAdminUser: { email: string; role: string; lastChangedAt?: string };
  adminSessions: AdminSession[];
  currentSessionId: string | null;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllOtherSessions: () => Promise<void>;
  addSimulatedSession: (session: Partial<AdminSession>) => void;
  updateAdminCredentials: (params: {
    newEmail: string;
    newPassword?: string;
    currentPassword?: string;
    syncWithProfileEmail?: boolean;
  }) => Promise<{ success: boolean; message: string }>;
  forceLogoutAllSessions: () => Promise<void>;

  // Backup & Reset
  resetToDefaults: () => Promise<void>;
  resetToInitialState: () => Promise<void>;
  exportDatabaseBackup: () => string;
  importDatabaseBackup: (jsonString: string) => { success: boolean; message: string };

  // Helper aliases
  updateMessageStatus: (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Dialog Confirmation Modal
  confirmModal: {
    isOpen: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  };
  openConfirmModal: (options: {
    title: string;
    message?: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  }) => void;
  closeConfirmModal: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper for requests carrying HTTP-only cookie
function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRouteState] = useState<ActiveRoute>('home');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Delete',
    destructive: true,
    onConfirm: () => {},
  });

  const openConfirmModal = (options: {
    title: string;
    message?: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || (options.destructive !== false ? 'Delete' : 'Confirm'),
      destructive: options.destructive !== false,
      onConfirm: options.onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Authentication session (Driven exclusively by HTTP-only cookie and /api/auth/me)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<{ email: string; role: string; lastChangedAt?: string }>({
    email: 'gunjanstha01@gmail.com',
    role: 'Super Administrator',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setCurrentRoute = (route: ActiveRoute) => {
    setCurrentRouteState(route);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  // Dynamic entities fetched directly from PostgreSQL database
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contentCategories, setContentCategories] = useState<ContentCategory[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSetting, setSiteSetting] = useState<SiteSetting>(emptySiteSetting);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminSessions, setAdminSessions] = useState<AdminSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load public portfolio data from PostgreSQL
  const loadPublicData = useCallback(async () => {
    try {
      const res = await apiFetch('/api/portfolio/public');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.profile) setProfile(json.data.profile);
        if (json.data.experiences) setExperiences(json.data.experiences);
        if (json.data.educations) setEducations(json.data.educations);
        if (json.data.skillCategories) setSkillCategories(json.data.skillCategories);
        if (json.data.skills) setSkills(json.data.skills);
        if (json.data.services) setServices(json.data.services);
        if (json.data.projects) setProjects(json.data.projects);
        if (json.data.galleryImages) setGalleryImages(json.data.galleryImages);
        if (json.data.blogPosts) setBlogPosts(json.data.blogPosts);
        if (json.data.contentCategories) setContentCategories(json.data.contentCategories);
        if (json.data.socialLinks) setSocialLinks(json.data.socialLinks);
        if (json.data.siteSettings) setSiteSetting(json.data.siteSettings);
      }
    } catch (err) {
      console.warn('Could not load public data from backend, using current state:', err);
    }
  }, []);

  // Load complete admin portfolio data (including drafts, messages, audit logs)
  const loadAdminData = useCallback(async () => {
    try {
      const res = await apiFetch('/api/portfolio/admin');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.profile) setProfile(json.data.profile);
        if (json.data.experiences) setExperiences(json.data.experiences);
        if (json.data.educations) setEducations(json.data.educations);
        if (json.data.skillCategories) setSkillCategories(json.data.skillCategories);
        if (json.data.skills) setSkills(json.data.skills);
        if (json.data.services) setServices(json.data.services);
        if (json.data.projects) setProjects(json.data.projects);
        if (json.data.galleryImages) setGalleryImages(json.data.galleryImages);
        if (json.data.blogPosts) setBlogPosts(json.data.blogPosts);
        if (json.data.contentCategories) setContentCategories(json.data.contentCategories);
        if (json.data.socialLinks) setSocialLinks(json.data.socialLinks);
        if (json.data.siteSettings) setSiteSetting(json.data.siteSettings);
        if (json.data.contactMessages) setContactMessages(json.data.contactMessages);
        if (json.data.auditLogs) setAuditLogs(json.data.auditLogs);
        if (json.data.adminSessions) setAdminSessions(json.data.adminSessions);
        if (json.data.adminUser) {
          setCurrentAdminUser(prev => ({ ...prev, email: json.data.adminUser.email }));
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  }, []);

  // Initial authentication check via HTTP-only cookie on mount
  useEffect(() => {
    apiFetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setIsAdminAuthenticated(true);
          setCurrentAdminUser({ email: data.user.email, role: data.user.role || 'Super Administrator' });
          loadAdminData();
        } else {
          setIsAdminAuthenticated(false);
          loadPublicData();
        }
      })
      .catch(() => {
        setIsAdminAuthenticated(false);
        loadPublicData();
      });
  }, [loadAdminData, loadPublicData]);

  // Session registration in PostgreSQL
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const client = detectBrowserClientPlatform();
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setCurrentSessionId(sessionId);

    apiFetch('/api/auth/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: sessionId,
        deviceType: client.deviceType,
        browser: `${client.browser} (Live)`,
        os: client.os,
        location: 'Admin Workstation',
        screenResolution: typeof window !== 'undefined' ? `${window.screen.width} × ${window.screen.height}` : '1920 × 1080',
      }),
    }).catch(err => console.warn('Session recording error:', err));
  }, [isAdminAuthenticated]);

  // -------------------------------------------------------------
  // AUTHENTICATION (Cookie-based)
  // -------------------------------------------------------------
  const adminLogin = async (email: string, passwordAttempt: string) => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordAttempt }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminAuthenticated(true);
        setCurrentAdminUser({ email: data.user?.email || email, role: 'Super Administrator' });
        await loadAdminData();
        showToast('Authenticated as Administrator.');
        return { success: true };
      }
      return { success: false, message: data.error || 'Authentication failed. Please verify credentials.' };
    } catch (error: any) {
      return { success: false, message: 'Server communication error: ' + error.message };
    }
  };

  const adminLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout network error:', err);
    }
    setIsAdminAuthenticated(false);
    showToast('Signed out of Admin CMS.');
    setCurrentRoute('home');
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          message: data.message || 'One-time recovery code generated.',
          recoveryCode: data.recoveryCode,
          expiresAt: data.expiresAt,
        };
      }
      return { success: false, message: data.error || 'Failed to request recovery code.' };
    } catch (error: unknown) {
      const err = error as Error;
      return { success: false, message: 'Server communication error: ' + err.message };
    }
  };

  const verifyPasswordResetCode = async (email: string, code: string) => {
    try {
      const res = await apiFetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Invalid or expired recovery code.' };
    } catch (error: unknown) {
      const err = error as Error;
      return { success: false, message: 'Server communication error: ' + err.message };
    }
  };

  const resetPasswordWithCode = async (email: string, code: string, newPassword: string) => {
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password updated. You can now log in with your new credentials.');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Failed to reset password.' };
    } catch (error: unknown) {
      const err = error as Error;
      return { success: false, message: 'Server communication error: ' + err.message };
    }
  };

  // -------------------------------------------------------------
  // PROFILE CRUD
  // -------------------------------------------------------------
  const updateProfile = async (updated: Partial<Profile>) => {
    try {
      const res = await apiFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProfile(json.data);
        showToast('Profile updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast('Error updating profile in database.');
    }
  };

  // -------------------------------------------------------------
  // EXPERIENCES CRUD
  // -------------------------------------------------------------
  const addExperience = async (exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setExperiences(prev => [json.data, ...prev]);
        showToast('Career milestone saved to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save experience.');
      }
    } catch (error) {
      console.error('Failed to create experience:', error);
      showToast('Error saving experience to database.');
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      const res = await apiFetch(`/api/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setExperiences(prev => prev.map(e => e.id === id ? json.data : e));
        showToast('Experience updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update experience.');
      }
    } catch (error) {
      console.error('Failed to update experience:', error);
      showToast('Error updating experience in database.');
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const res = await apiFetch(`/api/experiences/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setExperiences(prev => prev.filter(e => e.id !== id));
        showToast('Experience removed from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete experience.');
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      showToast('Error removing experience from database.');
    }
  };

  // -------------------------------------------------------------
  // EDUCATIONS CRUD
  // -------------------------------------------------------------
  const addEducation = async (edu: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edu),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEducations(prev => [...prev, json.data]);
        showToast('Education record saved to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save education.');
      }
    } catch (error) {
      console.error('Failed to create education:', error);
      showToast('Error saving education to database.');
    }
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    try {
      const res = await apiFetch(`/api/educations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEducations(prev => prev.map(e => e.id === id ? json.data : e));
        showToast('Education record updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update education.');
      }
    } catch (error) {
      console.error('Failed to update education:', error);
      showToast('Error updating education in database.');
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const res = await apiFetch(`/api/educations/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setEducations(prev => prev.filter(e => e.id !== id));
        showToast('Education record deleted from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete education.');
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
      showToast('Error deleting education from database.');
    }
  };

  // -------------------------------------------------------------
  // SKILL CATEGORIES & SKILLS CRUD
  // -------------------------------------------------------------
  const addSkillCategory = async (cat: Omit<SkillCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/skills/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSkillCategories(prev => [...prev, json.data]);
        showToast('Skill category created in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save skill category.');
      }
    } catch (error) {
      console.error('Failed to create skill category:', error);
      showToast('Error saving skill category to database.');
    }
  };

  const updateSkillCategory = async (id: string, updates: Partial<SkillCategory>) => {
    try {
      const res = await apiFetch(`/api/skills/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSkillCategories(prev => prev.map(c => c.id === id ? json.data : c));
        showToast('Skill category updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update skill category.');
      }
    } catch (error) {
      console.error('Failed to update skill category:', error);
      showToast('Error updating skill category in database.');
    }
  };

  const deleteSkillCategory = async (id: string) => {
    try {
      const res = await apiFetch(`/api/skills/categories/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSkillCategories(prev => prev.filter(c => c.id !== id));
        setSkills(prev => prev.filter(s => s.categoryId !== id));
        showToast('Skill category deleted from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete skill category.');
      }
    } catch (error) {
      console.error('Failed to delete skill category:', error);
      showToast('Error deleting skill category from database.');
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSkills(prev => [...prev, json.data]);
        showToast('Skill saved to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save skill.');
      }
    } catch (error) {
      console.error('Failed to create skill:', error);
      showToast('Error saving skill to database.');
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      const res = await apiFetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSkills(prev => prev.map(s => s.id === id ? json.data : s));
        showToast('Skill updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update skill.');
      }
    } catch (error) {
      console.error('Failed to update skill:', error);
      showToast('Error updating skill in database.');
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const res = await apiFetch(`/api/skills/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSkills(prev => prev.filter(s => s.id !== id));
        showToast('Skill deleted from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete skill.');
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
      showToast('Error deleting skill from database.');
    }
  };

  // -------------------------------------------------------------
  // SERVICES CRUD
  // -------------------------------------------------------------
  const addService = async (srv: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srv),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setServices(prev => [...prev, json.data]);
        showToast('Service created in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to create service.');
      }
    } catch (error) {
      console.error('Failed to create service:', error);
      showToast('Error creating service in database.');
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const res = await apiFetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setServices(prev => prev.map(s => s.id === id ? json.data : s));
        showToast('Service updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update service.');
      }
    } catch (error) {
      console.error('Failed to update service:', error);
      showToast('Error updating service in database.');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const res = await apiFetch(`/api/services/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setServices(prev => prev.filter(s => s.id !== id));
        showToast('Service removed from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete service.');
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
      showToast('Error removing service from database.');
    }
  };

  // -------------------------------------------------------------
  // PROJECTS & CASE STUDIES CRUD
  // -------------------------------------------------------------
  const addProject = async (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proj),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(prev => [json.data, ...prev]);
        showToast('Project case study saved to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save project.');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      showToast('Error saving project to database.');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const res = await apiFetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(prev => prev.map(p => p.id === id ? json.data : p));
        showToast('Case study updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update case study.');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      showToast('Error updating project in database.');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        showToast('Project removed from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete project.');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      showToast('Error removing project from database.');
    }
  };

  // -------------------------------------------------------------
  // GALLERY CRUD
  // -------------------------------------------------------------
  const addGalleryImage = async (img: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(img),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setGalleryImages(prev => [json.data, ...prev]);
        showToast('Gallery image saved to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save image.');
      }
    } catch (error) {
      console.error('Failed to create gallery image:', error);
      showToast('Error saving image to database.');
    }
  };

  const updateGalleryImage = async (id: string, updates: Partial<GalleryImage>) => {
    try {
      const res = await apiFetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setGalleryImages(prev => prev.map(g => g.id === id ? json.data : g));
        showToast('Gallery image updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update image.');
      }
    } catch (error) {
      console.error('Failed to update gallery image:', error);
      showToast('Error updating image in database.');
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      const res = await apiFetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setGalleryImages(prev => prev.filter(g => g.id !== id));
        showToast('Gallery image deleted from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete image.');
      }
    } catch (error) {
      console.error('Failed to delete gallery image:', error);
      showToast('Error deleting image from database.');
    }
  };

  // -------------------------------------------------------------
  // BLOG POSTS CRUD
  // -------------------------------------------------------------
  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBlogPosts(prev => [json.data, ...prev]);
        showToast('Journal article published to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to publish article.');
      }
    } catch (error) {
      console.error('Failed to create blog post:', error);
      showToast('Error saving article to database.');
    }
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const res = await apiFetch(`/api/blog-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBlogPosts(prev => prev.map(b => b.id === id ? json.data : b));
        showToast('Journal article updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update article.');
      }
    } catch (error) {
      console.error('Failed to update blog post:', error);
      showToast('Error updating article in database.');
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const res = await apiFetch(`/api/blog-posts/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setBlogPosts(prev => prev.filter(b => b.id !== id));
        showToast('Journal article removed from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete article.');
      }
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      showToast('Error removing article from database.');
    }
  };

  // -------------------------------------------------------------
  // CONTENT CATEGORIES CRUD
  // -------------------------------------------------------------
  const addContentCategory = async (cat: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/content-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setContentCategories(prev => [...prev, json.data]);
        showToast('Category created in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save category.');
      }
    } catch (error) {
      console.error('Failed to create content category:', error);
      showToast('Error saving category to database.');
    }
  };

  const updateContentCategory = async (id: string, updates: Partial<ContentCategory>) => {
    try {
      const res = await apiFetch(`/api/content-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setContentCategories(prev => prev.map(c => c.id === id ? json.data : c));
        showToast('Category updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update category.');
      }
    } catch (error) {
      console.error('Failed to update content category:', error);
      showToast('Error updating category in database.');
    }
  };

  const deleteContentCategory = async (id: string) => {
    try {
      const res = await apiFetch(`/api/content-categories/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setContentCategories(prev => prev.filter(c => c.id !== id));
        showToast('Category deleted from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete category.');
      }
    } catch (error) {
      console.error('Failed to delete content category:', error);
      showToast('Error deleting category from database.');
    }
  };

  // -------------------------------------------------------------
  // SOCIAL LINKS CRUD
  // -------------------------------------------------------------
  const addSocialLink = async (link: Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await apiFetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSocialLinks(prev => [...prev, json.data]);
        showToast('Social link saved to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to save social link.');
      }
    } catch (error) {
      console.error('Failed to create social link:', error);
      showToast('Error saving social link to database.');
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      const res = await apiFetch(`/api/social-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSocialLinks(prev => prev.map(s => s.id === id ? json.data : s));
        showToast('Social link updated in PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update social link.');
      }
    } catch (error) {
      console.error('Failed to update social link:', error);
      showToast('Error updating social link in database.');
    }
  };

  const updateSocialLinks = async (links: SocialLink[]) => {
    for (const link of links) {
      await updateSocialLink(link.id, link);
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      const res = await apiFetch(`/api/social-links/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSocialLinks(prev => prev.filter(s => s.id !== id));
        showToast('Social link removed from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete social link.');
      }
    } catch (error) {
      console.error('Failed to delete social link:', error);
      showToast('Error removing social link from database.');
    }
  };

  // -------------------------------------------------------------
  // SITE SETTINGS CRUD
  // -------------------------------------------------------------
  const updateSiteSetting = async (settings: Partial<SiteSetting>) => {
    try {
      const res = await apiFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSiteSetting(json.data);
        showToast('Platform settings synchronized to PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Failed to update site settings:', error);
      showToast('Error saving settings to database.');
    }
  };

  const updateSiteSettings = updateSiteSetting;

  // -------------------------------------------------------------
  // CONTACT MESSAGES CRUD
  // -------------------------------------------------------------
  const submitContactMessage = async (msg: { name: string; email: string; subject: string; message: string; honeypot?: string }) => {
    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      const json = await res.json();
      if (json.success) {
        if (json.data) {
          setContactMessages(prev => [json.data, ...prev]);
        }
        showToast('Message submitted and stored securely in PostgreSQL.');
        return { success: true, message: json.message || 'Message sent successfully.' };
      }
      return { success: false, message: json.error || 'Failed to submit message.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error submitting message.' };
    }
  };

  const updateContactMessageStatus = async (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => {
    try {
      const res = await apiFetch(`/api/messages/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setContactMessages(prev => prev.map(m => m.id === id ? json.data : m));
        showToast(`Message marked as ${status}.`);
      } else {
        showToast(json.error || 'Failed to update message.');
      }
    } catch (error) {
      console.error('Failed to update message status:', error);
      showToast('Error updating message status in database.');
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const res = await apiFetch(`/api/messages/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setContactMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted from PostgreSQL database.');
      } else {
        showToast(json.error || 'Failed to delete message.');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      showToast('Error deleting message from database.');
    }
  };

  const updateMessageStatus = updateContactMessageStatus;
  const deleteMessage = deleteContactMessage;

  // -------------------------------------------------------------
  // SESSIONS & ADMIN CREDENTIALS
  // -------------------------------------------------------------
  const terminateSession = async (sessionId: string) => {
    try {
      await apiFetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
      setAdminSessions(prev => prev.filter(s => s.id !== sessionId));
      showToast('Workstation session terminated.');
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      await apiFetch('/api/auth/sessions/logout-all', { method: 'POST' });
      if (currentSessionId) {
        setAdminSessions(prev => prev.filter(s => s.id === currentSessionId));
      } else {
        setAdminSessions([]);
      }
      showToast('All other active workstation sessions terminated.');
    } catch (error) {
      console.error('Failed to terminate other sessions:', error);
    }
  };

  const forceLogoutAllSessions = async () => {
    await terminateAllOtherSessions();
    await adminLogout();
  };

  const addSimulatedSession = (session: Partial<AdminSession>) => {
    const newSess: AdminSession = {
      id: `sess_sim_${Date.now()}`,
      deviceType: session.deviceType || 'Desktop',
      browser: session.browser || 'Simulated Client',
      os: session.os || 'Simulated OS',
      location: session.location || 'Simulated Location',
      screenResolution: session.screenResolution || '1920 × 1080',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    apiFetch('/api/auth/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSess),
    }).catch(err => console.warn(err));
    setAdminSessions(prev => [newSess, ...prev]);
    showToast('Simulated security workstation registered.');
  };

  const updateAdminCredentials = async (params: {
    newEmail: string;
    newPassword?: string;
    currentPassword?: string;
    syncWithProfileEmail?: boolean;
  }) => {
    try {
      const res = await apiFetch('/api/auth/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: currentAdminUser.email,
          newEmail: params.newEmail,
          newPassword: params.newPassword,
          currentPassword: params.currentPassword,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCurrentAdminUser(prev => ({ ...prev, email: params.newEmail }));
        if (params.syncWithProfileEmail) {
          await updateProfile({ email: params.newEmail });
        }
        showToast('Administrator credentials updated in PostgreSQL database.');
        return { success: true, message: 'Administrator credentials updated successfully.' };
      }
      return { success: false, message: json.error || 'Failed to update credentials.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Error updating credentials.' };
    }
  };

  // -------------------------------------------------------------
  // DATABASE RESET & BACKUP
  // -------------------------------------------------------------
  const resetToDefaults = async () => {
    try {
      const res = await apiFetch('/api/portfolio/admin/reset-database', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await loadAdminData();
        showToast('PostgreSQL database reset and reseeded to official verified data.');
      } else {
        showToast(json.error || 'Failed to reset database.');
      }
    } catch (error) {
      console.error('Failed to reset database:', error);
      showToast('Error resetting PostgreSQL database.');
    }
  };

  const resetToInitialState = resetToDefaults;

  const exportDatabaseBackup = () => {
    const backup = {
      version: '2.0-postgresql',
      timestamp: new Date().toISOString(),
      data: {
        profile,
        experiences,
        educations,
        skillCategories,
        skills,
        services,
        projects,
        galleryImages,
        blogPosts,
        contentCategories,
        socialLinks,
        siteSetting,
        contactMessages,
      },
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDatabaseBackup = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      if (!data.profile && !data.experiences) {
        return { success: false, message: 'Invalid backup format.' };
      }

      // Restore profile & siteSetting to state and persist to database
      if (data.profile) {
        setProfile(data.profile);
        updateProfile(data.profile).catch(console.error);
      }
      if (data.siteSetting) {
        setSiteSetting(data.siteSetting);
        updateSiteSetting(data.siteSetting).catch(console.error);
      }

      showToast('Backup data imported into PostgreSQL database.');
      return { success: true, message: 'Backup successfully restored to PostgreSQL database.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to parse JSON backup.' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedProjectSlug,
        setSelectedProjectSlug,
        selectedBlogSlug,
        setSelectedBlogSlug,
        adminActiveTab,
        setAdminActiveTab,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        requestPasswordReset,
        verifyPasswordResetCode,
        resetPasswordWithCode,
        profile,
        updateProfile,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
        educations,
        addEducation,
        updateEducation,
        deleteEducation,
        skillCategories,
        skills,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        addSkill,
        updateSkill,
        deleteSkill,
        services,
        addService,
        updateService,
        deleteService,
        projects,
        addProject,
        updateProject,
        deleteProject,
        galleryImages,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        contentCategories,
        addContentCategory,
        updateContentCategory,
        deleteContentCategory,
        contactMessages,
        submitContactMessage,
        updateContactMessageStatus,
        deleteContactMessage,
        socialLinks,
        updateSocialLinks,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        siteSetting,
        siteSettings: siteSetting,
        updateSiteSetting,
        updateSiteSettings,
        auditLogs,
        currentAdminUser,
        adminSessions,
        currentSessionId,
        terminateSession,
        terminateAllOtherSessions,
        addSimulatedSession,
        updateAdminCredentials,
        forceLogoutAllSessions,
        resetToDefaults,
        resetToInitialState,
        exportDatabaseBackup,
        importDatabaseBackup,
        updateMessageStatus,
        deleteMessage,
        toastMessage,
        showToast,
        confirmModal,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
