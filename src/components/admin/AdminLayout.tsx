import React from 'react';
import { useData } from '../../context/DataContext';
import { AdminTab } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminCaseStudiesAndJournalManager } from './AdminCaseStudiesAndJournalManager';
import { AdminProfileMasterManager } from './AdminProfileMasterManager';
import { AdminServicesManager } from './AdminServicesManager';
import { AdminCategoryManagerTab } from './AdminCategoryManagerTab';
import { 
  AdminMessagesManager, 
  AdminSettingsManager, 
  AdminSecurityManager, 
  AdminAuditLogManager, 
  AdminBackupManager 
} from './AdminSystemManagers';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Image as ImageIcon, 
  Layers,
  FolderTree,
  MessageSquare, 
  Search,
  Settings, 
  ShieldCheck, 
  Activity, 
  Database, 
  LogOut, 
  Eye,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { 
    adminActiveTab, 
    setAdminActiveTab, 
    adminLogout, 
    setCurrentRoute, 
    contactMessages,
    siteSettings,
    projects,
    blogPosts
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const unreadMessagesCount = contactMessages.filter(m => m.status === 'NEW').length;
  const totalArchiveCount = projects.length + blogPosts.length;

  // Streamlined CMS Navigation matching requested specifications:
  // 1. Dashboard
  // 2. Profile (Merged Profile & Education, Experience Timeline, Skills, Contact & Alternate Email)
  // 3. Services (Dedicated Menu)
  // 4. Case Studies & Journal (Unified archive)
  // 5. Categories (Dedicated Taxonomy Engine Menu)
  // 6. Gallery & Media
  // 7. Inquiries Inbox
  // 8. SEO (Search engine metadata, Social Cards, QR & Branding)
  // 9. Security Center
  // 10. Audit Stream
  // 11. Database Backup
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'case-studies-journal', label: 'Case Studies & Journal', icon: <Layers className="w-4 h-4" />, badge: totalArchiveCount },
    { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'messages', label: 'Inquiries Inbox', icon: <MessageSquare className="w-4 h-4" />, badge: unreadMessagesCount },
    { id: 'seo', label: 'SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'security', label: 'Security Center', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'audit-log', label: 'Audit Stream', icon: <Activity className="w-4 h-4" /> },
    { id: 'backup', label: 'Database Backup', icon: <Database className="w-4 h-4" /> },
  ];

  const renderActiveView = () => {
    switch (adminActiveTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'profile':
      case 'experience':
      case 'education':
      case 'skills':
        return <AdminProfileMasterManager />;
      case 'services':
      case 'skills-services':
        return <AdminServicesManager />;
      case 'case-studies-journal':
        return <AdminCaseStudiesAndJournalManager initialSubTab="unified" />;
      case 'projects':
        return <AdminCaseStudiesAndJournalManager initialSubTab="case-studies" />;
      case 'blog':
        return <AdminCaseStudiesAndJournalManager initialSubTab="journal" />;
      case 'categories':
        return <AdminCategoryManagerTab />;
      case 'gallery':
        return <AdminGalleryManager />;
      case 'messages':
        return <AdminMessagesManager />;
      case 'seo-settings':
      case 'seo':
      case 'settings':
        return <AdminSettingsManager />;
      case 'security':
        return <AdminSecurityManager />;
      case 'audit-log':
        return <AdminAuditLogManager />;
      case 'backup':
        return <AdminBackupManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[#262626] bg-[#111111]">
        <div className="flex items-center gap-3">
          {siteSettings.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt="Brand Logo"
              className="h-9 w-auto max-w-[120px] object-contain rounded-sm"
            />
          ) : (
            <div className="w-9 h-9 bg-[#c6a87d] rounded-sm flex items-center justify-center text-[#080808] font-bold text-sm">
              G
            </div>
          )}
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#F5F5F5]">
            Admin CMS
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#969696] hover:text-[#F5F5F5]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-[#0c0c0c] border-r border-[#262626] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Platform Identity */}
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div className="flex items-center gap-3.5">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Brand Logo"
                  className="h-12 w-auto max-w-[130px] object-contain rounded-sm"
                />
              ) : (
                <div className="w-11 h-11 bg-[#171717] border border-[#262626] rounded-sm flex items-center justify-center text-[#c6a87d] font-bold text-sm font-mono">
                  G
                </div>
              )}
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6a87d]">
                  Private CMS
                </span>
                <h2 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-tight truncate max-w-[120px]">
                  {siteSettings.siteName || 'Gunjan Shrestha'}
                </h2>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Live" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setAdminActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-sm text-xs font-mono flex items-center justify-between transition-all duration-150 ${
                  adminActiveTab === item.id || 
                  (item.id === 'profile' && ['experience', 'education', 'skills'].includes(adminActiveTab)) ||
                  (item.id === 'services' && adminActiveTab === 'skills-services') ||
                  (item.id === 'case-studies-journal' && ['projects', 'blog'].includes(adminActiveTab))
                    ? 'bg-[#171717] text-[#c6a87d] font-bold border-l-2 border-[#c6a87d]'
                    : 'text-[#969696] hover:text-[#F5F5F5] hover:bg-[#111111]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#c6a87d] text-[#080808] font-bold text-[10px] rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-[#262626] space-y-2 bg-[#0a0a0a]">
          <button
            onClick={() => setCurrentRoute('home')}
            className="w-full py-2 px-3 bg-[#111111] hover:bg-[#171717] border border-[#262626] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#c6a87d]" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              setCurrentRoute('home');
            }}
            className="w-full py-2 px-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-xs font-mono text-red-400 rounded-sm flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl">
        {renderActiveView()}
      </main>
    </div>
  );
};
