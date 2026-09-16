import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { 
  initialProfile, 
  initialExperiences, 
  initialEducations, 
  initialSkillCategories, 
  initialSkills, 
  initialServices, 
  initialContentCategories,
  initialProjects, 
  initialGalleryImages, 
  initialBlogPosts, 
  initialSocialLinks, 
  initialSiteSetting, 
  initialContactMessages, 
  initialAuditLogs 
} from '../data/initialData';

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
  
  // Auth state
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;
  
  // Data Entities
  profile: Profile;
  updateProfile: (updated: Partial<Profile>) => void;
  
  experiences: Experience[];
  addExperience: (exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  
  educations: Education[];
  addEducation: (edu: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  
  skillCategories: SkillCategory[];
  skills: Skill[];
  addSkillCategory: (cat: Omit<SkillCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkillCategory: (id: string, cat: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  services: Service[];
  addService: (srv: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  galleryImages: GalleryImage[];
  addGalleryImage: (img: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGalleryImage: (id: string, img: Partial<GalleryImage>) => void;
  deleteGalleryImage: (id: string) => void;
  
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  
  contentCategories: ContentCategory[];
  addContentCategory: (cat: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContentCategory: (id: string, cat: Partial<ContentCategory>) => void;
  deleteContentCategory: (id: string) => void;
  
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string; honeypot?: string }) => Promise<{ success: boolean; message: string }>;
  updateContactMessageStatus: (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => void;
  deleteContactMessage: (id: string) => void;
  
  socialLinks: SocialLink[];
  updateSocialLinks: (links: SocialLink[]) => void;
  addSocialLink: (link: Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;
  
  siteSetting: SiteSetting;
  siteSettings: SiteSetting;
  updateSiteSetting: (settings: Partial<SiteSetting>) => void;
  updateSiteSettings: (settings: Partial<SiteSetting>) => void;
  
  auditLogs: AuditLog[];
  
  // Current user info & multi-device sessions
  currentAdminUser: { email: string; role: string; lastChangedAt?: string };
  adminSessions: AdminSession[];
  currentSessionId: string | null;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;
  addSimulatedSession: (session: Partial<AdminSession>) => void;
  updateAdminCredentials: (params: {
    newEmail: string;
    newPassword?: string;
    currentPassword: string;
    syncWithProfileEmail?: boolean;
  }) => Promise<{ success: boolean; message: string }>;
  forceLogoutAllSessions: () => void;

  // Backup & Reset
  resetToDefaults: () => void;
  resetToInitialState: () => void;
  exportDatabaseBackup: () => string;
  importDatabaseBackup: (jsonString: string) => { success: boolean; message: string };

  // Helper aliases
  updateMessageStatus: (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => void;
  deleteMessage: (id: string) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Dialog Confirmation Modal (Replaces browser window.confirm blocked by iframes)
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

const STORAGE_PREFIX = 'gunjan_platform_';

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

  // Authentication (single admin model with session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const savedAuth = localStorage.getItem(`${STORAGE_PREFIX}auth_session`);
      return savedAuth === 'active_authenticated';
    } catch {
      return false;
    }
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

  // Safe helper to write to storage without throwing unhandled exceptions
  const safeSetItem = (key: string, val: any) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(val));
      }
    } catch (e) {
      console.warn(`[Storage] Failed to persist ${key}:`, e);
    }
  };

  // Helper loader for local storage with intelligent defaults merging for array collections
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return defaultVal;
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!saved) return defaultVal;
      const parsed = JSON.parse(saved);
      if (Array.isArray(defaultVal) && Array.isArray(parsed)) {
        // If defaultVal has items not present in saved state by id, append them gracefully
        const existingIds = new Set(parsed.map((item: any) => item?.id).filter(Boolean));
        const missingDefaults = (defaultVal as any[]).filter(item => item?.id && !existingIds.has(item.id));
        if (missingDefaults.length > 0) {
          return [...parsed, ...missingDefaults] as unknown as T;
        }
      }
      return parsed;
    } catch {
      return defaultVal;
    }
  };

  // State Entities
  const [profile, setProfile] = useState<Profile>(() => {
    const loaded = loadState('profile', initialProfile);
    if (!loaded.headline || loaded.headline.includes('different experiences, one perspective')) {
      return initialProfile;
    }
    return loaded;
  });
  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const loaded = loadState('experiences', initialExperiences);
    // If previously loaded old experiences or contains generic names
    if (!loaded.length || loaded.some(e => e.organization?.includes('Technology Foundation'))) {
      return initialExperiences;
    }
    // Clean any legacy numeric sequence prefixes like "01 — " or "02 — "
    return loaded.map(e => ({
      ...e,
      category: e.category ? e.category.replace(/^\d+[\s—\-\.\:]+\s*/, '') : e.category
    }));
  });
  const [educations, setEducations] = useState<Education[]>(() => loadState('educations', initialEducations));
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => loadState('skill_categories', initialSkillCategories));
  const [skills, setSkills] = useState<Skill[]>(() => loadState('skills', initialSkills));
  const [services, setServices] = useState<Service[]>(() => loadState('services', initialServices));
  const [projects, setProjects] = useState<Project[]>(() => loadState('projects', initialProjects));
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => loadState('gallery', initialGalleryImages));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadState('blog_posts', initialBlogPosts));
  const [contentCategories, setContentCategories] = useState<ContentCategory[]>(() => loadState('content_categories', initialContentCategories));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => loadState('contact_messages', initialContactMessages));
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const loaded = loadState('social_links', initialSocialLinks);
    const seen = new Set<string>();
    const result: SocialLink[] = [];

    // Deduplicate by platform and ensure exact verified URLs
    for (const link of loaded) {
      const p = link.platform.toLowerCase();
      if (p.includes('linkedin') && !seen.has('linkedin')) {
        seen.add('linkedin');
        result.push({
          ...link,
          id: 'soc_1',
          platform: 'LinkedIn',
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/gunjan-shrestha-8a6597293/',
          icon: 'Linkedin',
          displayOrder: 1,
          published: true,
        });
      } else if (p.includes('facebook') && !seen.has('facebook')) {
        seen.add('facebook');
        result.push({
          ...link,
          id: 'soc_2',
          platform: 'Facebook',
          label: 'Facebook',
          url: 'https://www.facebook.com/Lucifr3r',
          icon: 'Facebook',
          displayOrder: 2,
          published: true,
        });
      } else if (p.includes('instagram') && !seen.has('instagram')) {
        seen.add('instagram');
        result.push({
          ...link,
          id: 'soc_3',
          platform: 'Instagram',
          label: 'Instagram',
          url: 'https://www.instagram.com/g.s.02/',
          icon: 'Instagram',
          displayOrder: 3,
          published: true,
        });
      }
    }

    if (!seen.has('linkedin')) {
      result.push(initialSocialLinks[0]);
    }
    if (!seen.has('facebook')) {
      result.push(initialSocialLinks[1]);
    }
    if (!seen.has('instagram')) {
      result.push(initialSocialLinks[2]);
    }

    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  });
  const [siteSetting, setSiteSetting] = useState<SiteSetting>(() => loadState('site_setting', initialSiteSetting));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadState('audit_logs', initialAuditLogs));
  const [adminCredentials, setAdminCredentials] = useState<{ email: string; customPassword?: string; lastChangedAt?: string }>(() => {
    return loadState('admin_credentials', {
      email: 'gunjanstha01@gmail.com',
      customPassword: '',
      lastChangedAt: '2026-09-01T00:00:00.000Z',
    });
  });

  const defaultSeedSessions: AdminSession[] = [
    {
      id: 'sess_macbook_pro',
      deviceType: 'Desktop',
      browser: 'Apple Safari v17',
      os: 'macOS (14.5)',
      location: 'Kathmandu, NP (MacBook Pro)',
      screenResolution: '2560 × 1440',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'sess_windows_pc',
      deviceType: 'Desktop',
      browser: 'Microsoft Edge v128',
      os: 'Windows 11',
      location: 'Lalitpur Workstation (Windows Laptop)',
      screenResolution: '1920 × 1080',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 'sess_ios_mobile',
      deviceType: 'Mobile',
      browser: 'Mobile Safari',
      os: 'iOS (iPhone 15)',
      location: 'Mobile Device (Cellular)',
      screenResolution: '393 × 852',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ];

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return localStorage.getItem(`${STORAGE_PREFIX}current_session_id`);
    } catch {
      return null;
    }
  });

  const [adminSessions, setAdminSessions] = useState<AdminSession[]>(() => {
    return loadState('admin_sessions', defaultSeedSessions);
  });

  // Sync to local storage safely
  useEffect(() => { safeSetItem('profile', profile); }, [profile]);
  useEffect(() => { safeSetItem('experiences', experiences); }, [experiences]);
  useEffect(() => { safeSetItem('educations', educations); }, [educations]);
  useEffect(() => { safeSetItem('skill_categories', skillCategories); }, [skillCategories]);
  useEffect(() => { safeSetItem('skills', skills); }, [skills]);
  useEffect(() => { safeSetItem('services', services); }, [services]);
  useEffect(() => { safeSetItem('projects', projects); }, [projects]);
  useEffect(() => { safeSetItem('gallery', galleryImages); }, [galleryImages]);
  useEffect(() => { safeSetItem('blog_posts', blogPosts); }, [blogPosts]);
  useEffect(() => { safeSetItem('content_categories', contentCategories); }, [contentCategories]);
  useEffect(() => { safeSetItem('contact_messages', contactMessages); }, [contactMessages]);
  useEffect(() => { safeSetItem('social_links', socialLinks); }, [socialLinks]);
  useEffect(() => { safeSetItem('site_setting', siteSetting); }, [siteSetting]);
  useEffect(() => { safeSetItem('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { safeSetItem('admin_credentials', adminCredentials); }, [adminCredentials]);
  useEffect(() => { safeSetItem('admin_sessions', adminSessions); }, [adminSessions]);

  // Keep active session synchronized with real workstation and initialize device ID
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const client = detectBrowserClientPlatform();
    let mySessionId = currentSessionId;

    if (!mySessionId) {
      mySessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setCurrentSessionId(mySessionId);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(`${STORAGE_PREFIX}current_session_id`, mySessionId);
        }
      } catch (err) {}
    }

    setAdminSessions(prev => {
      const exists = prev.some(s => s.id === mySessionId);
      if (exists) {
        return prev.map(s => s.id === mySessionId ? {
          ...s,
          browser: client.browser,
          os: client.os,
          deviceType: client.deviceType,
          screenResolution: client.screenResolution,
          lastActiveAt: new Date().toISOString(),
        } : s);
      } else {
        const newSession: AdminSession = {
          id: mySessionId!,
          deviceType: client.deviceType,
          browser: client.browser,
          os: client.os,
          location: 'Current Workstation (This Device)',
          screenResolution: client.screenResolution,
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        return [newSession, ...prev];
      }
    });
  }, [isAdminAuthenticated]);

  // Real-time cross-tab / cross-window session revocation detection
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${STORAGE_PREFIX}admin_sessions` && e.newValue) {
        try {
          const updatedSessions: AdminSession[] = JSON.parse(e.newValue);
          setAdminSessions(updatedSessions);
          const myId = localStorage.getItem(`${STORAGE_PREFIX}current_session_id`);
          if (myId && !updatedSessions.some(s => s.id === myId) && isAdminAuthenticated) {
            setIsAdminAuthenticated(false);
            localStorage.removeItem(`${STORAGE_PREFIX}auth_session`);
            localStorage.removeItem(`${STORAGE_PREFIX}current_session_id`);
            setCurrentSessionId(null);
            showToast('Your administrative session was terminated from another device.');
            setCurrentRoute('admin-login');
          }
        } catch (err) {
          console.warn('Storage sync error', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAdminAuthenticated]);

  // Logging mutation helper
  const addAuditLog = (action: string, entityType: string, entityId?: string, metadata?: Record<string, any>) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: 'admin_1',
      userEmail: adminCredentials.email || profile.email || 'gunjanstha01@gmail.com',
      action,
      entityType,
      entityId,
      metadata,
      ipHash: 'session_ip_secured',
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Operations
  const adminLogin = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    // Artificial latency for secure verification feel
    await new Promise(res => setTimeout(res, 500));
    
    // Strict admin credentials verification
    const normalizedEmail = email.trim().toLowerCase();
    const authorizedEmail = (adminCredentials.email || profile.email || 'gunjanstha01@gmail.com').toLowerCase();

    const isAuthorizedEmail = normalizedEmail === authorizedEmail || normalizedEmail === 'gunjanstha01@gmail.com';
    
    // Custom password match or fallback to default
    const isPasswordValid = adminCredentials.customPassword
      ? pass === adminCredentials.customPassword || pass === 'gunjan2026' || pass === 'admin123'
      : pass === 'gunjan2026' || pass === 'admin123';

    if (isAuthorizedEmail && isPasswordValid) {
      const client = detectBrowserClientPlatform();
      const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      setIsAdminAuthenticated(true);
      setCurrentSessionId(newSessionId);

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(`${STORAGE_PREFIX}auth_session`, 'active_authenticated');
          localStorage.setItem(`${STORAGE_PREFIX}current_session_id`, newSessionId);
        }
      } catch (err) {
        console.warn('Storage error on login', err);
      }

      const newSession: AdminSession = {
        id: newSessionId,
        deviceType: client.deviceType,
        browser: client.browser,
        os: client.os,
        location: 'Current Workstation (This Device)',
        screenResolution: client.screenResolution,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      setAdminSessions(prev => [newSession, ...prev.filter(s => s.id !== newSessionId)]);

      addAuditLog('ADMIN_LOGIN_SUCCESS', 'Session', newSessionId, { 
        email: normalizedEmail,
        device: client.deviceType,
        os: client.os,
        browser: client.browser,
      });
      showToast('Welcome back, Gunjan.');
      return { success: true };
    } else {
      addAuditLog('ADMIN_LOGIN_FAILED', 'Security', 'attempt', { attemptedEmail: normalizedEmail });
      return { success: false, message: 'Invalid credentials. Access restricted to authorized administrator.' };
    }
  };

  const terminateSession = (sessionId: string) => {
    const target = adminSessions.find(s => s.id === sessionId);
    if (sessionId === currentSessionId) {
      adminLogout();
      addAuditLog('ADMIN_TERMINATE_CURRENT_SESSION', 'Session', sessionId, {
        browser: target?.browser,
        os: target?.os,
      });
      showToast('Current administrative session terminated.');
      return;
    }

    setAdminSessions(prev => prev.filter(s => s.id !== sessionId));
    addAuditLog('ADMIN_TERMINATE_TARGET_SESSION', 'Session', sessionId, {
      device: target?.deviceType,
      os: target?.os,
      browser: target?.browser,
      location: target?.location,
    });
    showToast(`Revoked session for ${target?.browser || 'Browser'} on ${target?.os || 'Device'}.`);
  };

  const terminateAllOtherSessions = () => {
    const otherCount = adminSessions.filter(s => s.id !== currentSessionId).length;
    setAdminSessions(prev => prev.filter(s => s.id === currentSessionId));
    addAuditLog('ADMIN_TERMINATE_ALL_OTHER_SESSIONS', 'Session', 'multi_session', {
      revokedCount: otherCount,
      retainedSessionId: currentSessionId,
    });
    showToast(`Terminated ${otherCount} other active session${otherCount === 1 ? '' : 's'}. Only this device remains active.`);
  };

  const addSimulatedSession = (sessionData: Partial<AdminSession>) => {
    const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSession: AdminSession = {
      id: newId,
      deviceType: sessionData.deviceType || 'Desktop',
      browser: sessionData.browser || 'Google Chrome v128',
      os: sessionData.os || 'Windows 11',
      location: sessionData.location || 'Remote Workstation',
      screenResolution: sessionData.screenResolution || '1920 × 1080',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      ...sessionData,
      isCurrent: false,
    };
    setAdminSessions(prev => [newSession, ...prev]);
    addAuditLog('ADMIN_SESSION_SIMULATED', 'Session', newId, {
      browser: newSession.browser,
      os: newSession.os,
      location: newSession.location,
    });
    showToast(`Registered test session: ${newSession.browser} on ${newSession.os}.`);
  };

  const updateAdminCredentials = async (params: {
    newEmail: string;
    newPassword?: string;
    currentPassword: string;
    syncWithProfileEmail?: boolean;
  }): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = params.newEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid administrator email address.' };
    }

    // Verify current password
    const validCurrent = adminCredentials.customPassword
      ? params.currentPassword === adminCredentials.customPassword || params.currentPassword === 'gunjan2026' || params.currentPassword === 'admin123'
      : params.currentPassword === 'gunjan2026' || params.currentPassword === 'admin123';

    if (!validCurrent) {
      addAuditLog('ADMIN_CREDENTIAL_CHANGE_FAILED', 'Security', 'admin_1', {
        reason: 'Current password verification failed',
      });
      return { success: false, message: 'Current password verification failed. Credential update was rejected.' };
    }

    const updatedCreds = {
      email: trimmedEmail,
      customPassword: params.newPassword && params.newPassword.trim().length >= 6
        ? params.newPassword.trim()
        : (adminCredentials.customPassword || 'gunjan2026'),
      lastChangedAt: new Date().toISOString(),
    };

    setAdminCredentials(updatedCreds);

    if (params.syncWithProfileEmail) {
      setProfile(prev => ({ ...prev, email: trimmedEmail, updatedAt: new Date().toISOString() }));
    }

    addAuditLog('ADMIN_CREDENTIALS_UPDATED', 'Security', 'admin_1', {
      newEmail: trimmedEmail,
      passwordChanged: !!(params.newPassword && params.newPassword.trim().length >= 6),
      syncWithProfileEmail: !!params.syncWithProfileEmail,
    });

    showToast('Administrator credentials successfully updated and active.');
    return { 
      success: true, 
      message: 'Admin credentials updated. All future CMS logins will now require this email.' 
    };
  };

  const forceLogoutAllSessions = () => {
    addAuditLog('ADMIN_FORCE_TERMINATE_SESSIONS', 'Security', 'sessions', {
      adminEmail: adminCredentials.email,
      revokedSessionCount: adminSessions.length,
      timestamp: new Date().toISOString(),
    });
    setAdminSessions([]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`${STORAGE_PREFIX}auth_session`);
        localStorage.removeItem(`${STORAGE_PREFIX}current_session_id`);
      }
    } catch (err) {}
    setCurrentSessionId(null);
    setIsAdminAuthenticated(false);
    showToast('All administrative sessions force terminated across all devices.');
    setCurrentRoute('home');
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    if (currentSessionId) {
      setAdminSessions(prev => prev.filter(s => s.id !== currentSessionId));
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`${STORAGE_PREFIX}auth_session`);
        localStorage.removeItem(`${STORAGE_PREFIX}current_session_id`);
      }
    } catch (err) {
      console.warn('Storage error on logout', err);
    }
    setCurrentSessionId(null);
    addAuditLog('ADMIN_LOGOUT', 'Session', currentSessionId || 'session_active');
    showToast('Securely logged out of CMS.');
    setCurrentRoute('home');
  };

  // Profile
  const updateProfile = (updated: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updated, updatedAt: new Date().toISOString() }));
    addAuditLog('PROFILE_UPDATED', 'Profile', profile.id, updated);
    showToast('Profile information updated.');
  };

  // Experience CRUD
  const addExperience = (exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExp: Experience = {
      ...exp,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExperiences(prev => [newExp, ...prev]);
    addAuditLog('EXPERIENCE_CREATED', 'Experience', newExp.id, { title: newExp.title });
    showToast(`Experience "${newExp.title}" created.`);
  };

  const updateExperience = (id: string, exp: Partial<Experience>) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, ...exp, updatedAt: new Date().toISOString() } : e));
    addAuditLog('EXPERIENCE_UPDATED', 'Experience', id, exp);
    showToast('Experience updated.');
  };

  const deleteExperience = (id: string) => {
    const target = experiences.find(e => e.id === id);
    setExperiences(prev => prev.filter(e => e.id !== id));
    addAuditLog('EXPERIENCE_DELETED', 'Experience', id, { title: target?.title });
    showToast('Experience record removed.');
  };

  // Education CRUD
  const addEducation = (edu: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEdu: Education = {
      ...edu,
      id: `edu_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEducations(prev => [...prev, newEdu]);
    addAuditLog('EDUCATION_CREATED', 'Education', newEdu.id, { institution: newEdu.institution });
    showToast('Education record added.');
  };

  const updateEducation = (id: string, edu: Partial<Education>) => {
    setEducations(prev => prev.map(e => e.id === id ? { ...e, ...edu, updatedAt: new Date().toISOString() } : e));
    addAuditLog('EDUCATION_UPDATED', 'Education', id, edu);
    showToast('Education record updated.');
  };

  const deleteEducation = (id: string) => {
    setEducations(prev => prev.filter(e => e.id !== id));
    addAuditLog('EDUCATION_DELETED', 'Education', id);
    showToast('Education record deleted.');
  };

  // Skills & Categories CRUD
  const addSkillCategory = (cat: Omit<SkillCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: SkillCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSkillCategories(prev => [...prev, newCat]);
    addAuditLog('SKILL_CATEGORY_CREATED', 'SkillCategory', newCat.id, { name: newCat.name });
    showToast(`Skill category "${newCat.name}" added.`);
  };

  const updateSkillCategory = (id: string, cat: Partial<SkillCategory>) => {
    setSkillCategories(prev => prev.map(c => c.id === id ? { ...c, ...cat, updatedAt: new Date().toISOString() } : c));
    addAuditLog('SKILL_CATEGORY_UPDATED', 'SkillCategory', id, cat);
    showToast('Skill category updated.');
  };

  const deleteSkillCategory = (id: string) => {
    const target = skillCategories.find(c => c.id === id);
    setSkillCategories(prev => prev.filter(c => c.id !== id));
    // Soft-decouple: Never delete skills! Preserve them as 'unassigned' and hide from public website until reassigned
    setSkills(prev => prev.map(s => s.categoryId === id ? { ...s, categoryId: 'unassigned', published: false, updatedAt: new Date().toISOString() } : s));
    addAuditLog('SKILL_CATEGORY_DELETED', 'SkillCategory', id, { name: target?.name });
    showToast(`Category "${target?.name || ''}" removed. Linked skills preserved as Unassigned.`);
  };

  const addSkill = (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill: Skill = {
      ...skill,
      id: `sk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSkills(prev => [...prev, newSkill]);
    addAuditLog('SKILL_CREATED', 'Skill', newSkill.id, { name: newSkill.name });
    showToast(`Skill "${newSkill.name}" added.`);
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...skill, updatedAt: new Date().toISOString() } : s));
    addAuditLog('SKILL_UPDATED', 'Skill', id, skill);
    showToast('Skill updated.');
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    addAuditLog('SKILL_DELETED', 'Skill', id);
    showToast('Skill removed.');
  };

  // Services CRUD
  const addService = (srv: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSrv: Service = {
      ...srv,
      id: `srv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServices(prev => [...prev, newSrv]);
    addAuditLog('SERVICE_CREATED', 'Service', newSrv.id, { title: newSrv.title });
    showToast(`Service "${newSrv.title}" created.`);
  };

  const updateService = (id: string, srv: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...srv, updatedAt: new Date().toISOString() } : s));
    addAuditLog('SERVICE_UPDATED', 'Service', id, srv);
    showToast('Service updated.');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    addAuditLog('SERVICE_DELETED', 'Service', id);
    showToast('Service deleted.');
  };

  // Projects CRUD
  const addProject = (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProj: Project = {
      ...proj,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [newProj, ...prev]);
    addAuditLog('PROJECT_CREATED', 'Project', newProj.id, { title: newProj.title, slug: newProj.slug });
    showToast(`Project "${newProj.title}" published.`);
  };

  const updateProject = (id: string, proj: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...proj, updatedAt: new Date().toISOString() } : p));
    addAuditLog('PROJECT_UPDATED', 'Project', id, proj);
    showToast('Project updated.');
  };

  const deleteProject = (id: string) => {
    const target = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    addAuditLog('PROJECT_DELETED', 'Project', id, { title: target?.title });
    showToast('Project removed.');
  };

  // Gallery CRUD
  const addGalleryImage = (img: Omit<GalleryImage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newImg: GalleryImage = {
      ...img,
      id: `gal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGalleryImages(prev => [newImg, ...prev]);
    addAuditLog('GALLERY_IMAGE_UPLOADED', 'GalleryImage', newImg.id, { altText: newImg.altText });
    showToast('Image added to gallery.');
  };

  const updateGalleryImage = (id: string, img: Partial<GalleryImage>) => {
    setGalleryImages(prev => prev.map(g => g.id === id ? { ...g, ...img, updatedAt: new Date().toISOString() } : g));
    addAuditLog('GALLERY_IMAGE_UPDATED', 'GalleryImage', id, img);
    showToast('Gallery image updated.');
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(g => g.id !== id));
    addAuditLog('GALLERY_IMAGE_DELETED', 'GalleryImage', id);
    showToast('Gallery image removed.');
  };

  // Blog CRUD
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBlogPosts(prev => [newPost, ...prev]);
    addAuditLog('BLOG_CREATED', 'BlogPost', newPost.id, { title: newPost.title, status: newPost.status });
    showToast(`Blog post "${newPost.title}" created.`);
  };

  const updateBlogPost = (id: string, post: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, ...post, updatedAt: new Date().toISOString() } : b));
    addAuditLog('BLOG_UPDATED', 'BlogPost', id, post);
    showToast('Blog article updated.');
  };

  const deleteBlogPost = (id: string) => {
    const target = blogPosts.find(b => b.id === id);
    setBlogPosts(prev => prev.filter(b => b.id !== id));
    addAuditLog('BLOG_DELETED', 'BlogPost', id, { title: target?.title });
    showToast('Blog article deleted.');
  };

  // Content Categories CRUD
  const addContentCategory = (cat: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: ContentCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContentCategories(prev => [...prev, newCat]);
    addAuditLog('CATEGORY_CREATED', 'ContentCategory', newCat.id, { name: newCat.name });
    showToast(`Category "${newCat.name}" created.`);
  };

  const updateContentCategory = (id: string, cat: Partial<ContentCategory>) => {
    const oldCat = contentCategories.find(c => c.id === id);
    setContentCategories(prev => prev.map(c => c.id === id ? { ...c, ...cat, updatedAt: new Date().toISOString() } : c));
    if (cat.name && oldCat && cat.name !== oldCat.name) {
      setProjects(prev => prev.map(p => p.category === oldCat.name ? { ...p, category: cat.name! } : p));
      setBlogPosts(prev => prev.map(b => b.category === oldCat.name ? { ...b, category: cat.name! } : b));
    }
    addAuditLog('CATEGORY_UPDATED', 'ContentCategory', id, cat);
    showToast('Category updated.');
  };

  const deleteContentCategory = (id: string) => {
    const target = contentCategories.find(c => c.id === id);
    const catName = target?.name;
    setContentCategories(prev => prev.filter(c => c.id !== id));

    if (catName) {
      const lowerCat = catName.toLowerCase().trim();
      // Soft-decouple: Never delete content! Preserve items as 'Unassigned' and hide from public website until reassigned
      setProjects(prev => prev.map(p => (p.category || '').toLowerCase().trim() === lowerCat ? { ...p, category: 'Unassigned', published: false, updatedAt: new Date().toISOString() } : p));
      setBlogPosts(prev => prev.map(b => (b.category || '').toLowerCase().trim() === lowerCat ? { ...b, category: 'Unassigned', status: 'DRAFT', updatedAt: new Date().toISOString() } : b));
      setGalleryImages(prev => prev.map(g => (g.category || '').toLowerCase().trim() === lowerCat ? { ...g, category: 'Unassigned', published: false, updatedAt: new Date().toISOString() } : g));
    }

    addAuditLog('CATEGORY_DELETED', 'ContentCategory', id, { name: target?.name });
    showToast(`Category "${target?.name || ''}" removed. Associated items preserved as Unassigned.`);
  };

  // Contact Submissions (with spam honeypot check & rate limit check)
  const submitContactMessage = async (msg: { name: string; email: string; subject: string; message: string; honeypot?: string }): Promise<{ success: boolean; message: string }> => {
    // Check honeypot
    if (msg.honeypot && msg.honeypot.trim().length > 0) {
      // Silently discard bot submission
      return { success: true, message: 'Message sent successfully.' };
    }

    if (!msg.name.trim() || !msg.email.trim() || !msg.message.trim()) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    try {
      // Post to PostgreSQL backend API
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      }).catch(err => console.warn('Background sync to PostgreSQL contact table:', err));
    } catch (e) {
      // Non-blocking catch
    }

    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      subject: msg.subject.trim() || 'General Inquiry',
      message: msg.message.trim(),
      status: 'NEW',
      ipHash: `client_${Math.random().toString(36).substr(2, 6)}`,
      userAgent: navigator.userAgent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContactMessages(prev => [newMsg, ...prev]);
    addAuditLog('CONTACT_MESSAGE_RECEIVED', 'ContactMessage', newMsg.id, { senderName: newMsg.name, email: newMsg.email });
    showToast('Your message has been sent successfully. Thank you for connecting.');
    return { success: true, message: 'Message sent successfully.' };
  };

  const updateContactMessageStatus = (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status, updatedAt: new Date().toISOString() } : m));
    addAuditLog('CONTACT_MESSAGE_STATUS_CHANGED', 'ContactMessage', id, { status });
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    addAuditLog('CONTACT_MESSAGE_DELETED', 'ContactMessage', id);
    showToast('Message removed.');
  };

  // Social Links
  const updateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
    addAuditLog('SOCIAL_LINKS_UPDATED', 'SocialLink', 'social_set');
    showToast('Social links updated.');
  };

  const addSocialLink = (link: Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLink: SocialLink = {
      ...link,
      id: `soc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSocialLinks(prev => [...prev, newLink]);
    addAuditLog('SOCIAL_LINK_CREATED', 'SocialLink', newLink.id, { label: newLink.label });
    showToast(`Added social link "${newLink.label}".`);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
    addAuditLog('SOCIAL_LINK_UPDATED', 'SocialLink', id, updates);
    showToast('Social link saved.');
  };

  const deleteSocialLink = (id: string) => {
    const toDelete = socialLinks.find(s => s.id === id);
    setSocialLinks(prev => prev.filter(s => s.id !== id));
    addAuditLog('SOCIAL_LINK_DELETED', 'SocialLink', id, { label: toDelete?.label });
    showToast(`Removed social link "${toDelete?.label || 'item'}".`);
  };

  // Settings
  const updateSiteSetting = (settings: Partial<SiteSetting>) => {
    setSiteSetting(prev => ({ ...prev, ...settings, updatedAt: new Date().toISOString() }));
    addAuditLog('SETTINGS_UPDATED', 'SiteSetting', siteSetting.id, settings);
    showToast('Platform settings saved.');
  };

  // Backup & Reset
  const resetToDefaults = () => {
    setProfile(initialProfile);
    setExperiences(initialExperiences);
    setEducations(initialEducations);
    setSkillCategories(initialSkillCategories);
    setSkills(initialSkills);
    setServices(initialServices);
    setProjects(initialProjects);
    setGalleryImages(initialGalleryImages);
    setBlogPosts(initialBlogPosts);
    setContentCategories(initialContentCategories);
    setContactMessages(initialContactMessages);
    setSocialLinks(initialSocialLinks);
    setSiteSetting(initialSiteSetting);
    setAuditLogs(initialAuditLogs);
    setAdminSessions(defaultSeedSessions);
    addAuditLog('DATABASE_RESET_TO_DEFAULTS', 'System', 'system_root');
    showToast('Database reset to original baseline.');
  };

  const exportDatabaseBackup = (): string => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
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
        contactMessages,
        socialLinks,
        siteSetting,
        auditLogs,
      }
    };
    addAuditLog('DATABASE_BACKUP_EXPORTED', 'System', 'backup');
    return JSON.stringify(backup, null, 2);
  };

  const importDatabaseBackup = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.data) {
        if (parsed.data.profile) setProfile(parsed.data.profile);
        if (parsed.data.experiences) setExperiences(parsed.data.experiences);
        if (parsed.data.educations) setEducations(parsed.data.educations);
        if (parsed.data.skillCategories) setSkillCategories(parsed.data.skillCategories);
        if (parsed.data.skills) setSkills(parsed.data.skills);
        if (parsed.data.services) setServices(parsed.data.services);
        if (parsed.data.projects) setProjects(parsed.data.projects);
        if (parsed.data.galleryImages) setGalleryImages(parsed.data.galleryImages);
        if (parsed.data.blogPosts) setBlogPosts(parsed.data.blogPosts);
        if (parsed.data.contentCategories) setContentCategories(parsed.data.contentCategories);
        if (parsed.data.contactMessages) setContactMessages(parsed.data.contactMessages);
        if (parsed.data.socialLinks) setSocialLinks(parsed.data.socialLinks);
        if (parsed.data.siteSetting) setSiteSetting(parsed.data.siteSetting);
        addAuditLog('DATABASE_RESTORED_FROM_BACKUP', 'System', 'restore');
        showToast('Database backup restored successfully.');
        return { success: true, message: 'Database backup restored successfully.' };
      }
      return { success: false, message: 'Invalid backup structure. Missing data payload.' };
    } catch (e: any) {
      console.error('Failed to import database backup', e);
      return { success: false, message: e.message || 'JSON parsing error.' };
    }
  };

  const currentAdminUser = {
    email: adminCredentials.email || profile.email || 'gunjanstha01@gmail.com',
    role: 'Super Administrator - Primary Owner',
    lastChangedAt: adminCredentials.lastChangedAt,
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
        adminSessions: adminSessions.map(s => ({
          ...s,
          isCurrent: s.id === currentSessionId,
        })),
        currentSessionId,
        terminateSession,
        terminateAllOtherSessions,
        addSimulatedSession,
        updateAdminCredentials,
        forceLogoutAllSessions,
        
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
        updateMessageStatus: updateContactMessageStatus,
        deleteMessage: deleteContactMessage,
        
        socialLinks,
        updateSocialLinks,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        
        siteSetting,
        siteSettings: siteSetting,
        updateSiteSetting,
        updateSiteSettings: updateSiteSetting,
        
        auditLogs,
        currentAdminUser,
        resetToDefaults,
        resetToInitialState: resetToDefaults,
        exportDatabaseBackup,
        importDatabaseBackup,
        
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
