import React, { useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { ConfirmationModal } from './components/ui/ConfirmationModal';
import { HomeSections } from './components/home/HomeSections';
import { AboutView, AcademicView } from './components/public/AboutView';
import { ExperienceView } from './components/public/ExperienceView';
import { SkillsView, ServicesView } from './components/public/SkillsView';
import { ProjectDetailView } from './components/public/WorkViews';
import { GalleryView } from './components/public/GalleryView';
import { BlogPostDetailView } from './components/public/BlogViews';
import { CaseStudiesAndJournalView } from './components/public/CaseStudiesAndJournalView';
import { ContactView, ResumeView } from './components/public/ContactAndResumeViews';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { DynamicSEO } from './components/common/DynamicSEO';
import { AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, isAdminAuthenticated, siteSettings, setCurrentRoute } = useData();
  const { isDark } = useTheme();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  // If in Admin route
  if (currentRoute === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <>
          <DynamicSEO />
          <AdminLogin />
        </>
      );
    }
    return (
      <>
        <DynamicSEO />
        <AdminLayout />
        <Toast />
        <ConfirmationModal />
      </>
    );
  }

  if (currentRoute === 'admin-login') {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#050814] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'} flex flex-col justify-between transition-colors duration-250`}>
        <DynamicSEO />
        <Header />
        <main className="flex-1">
          <AdminLogin />
        </main>
        <Footer />
        <Toast />
        <ConfirmationModal />
      </div>
    );
  }

  // Public View Routing
  const renderPublicView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeSections />;
      case 'about':
        return <AboutView />;
      case 'academic':
        return <AcademicView />;
      case 'experience':
        return <ExperienceView />;
      case 'skills':
        return <SkillsView />;
      case 'services':
        return <ServicesView />;
      case 'work':
        return <CaseStudiesAndJournalView />;
      case 'work-detail':
        return <ProjectDetailView />;
      case 'gallery':
        return <GalleryView />;
      case 'blog':
        return <CaseStudiesAndJournalView />;
      case 'blog-detail':
        return <BlogPostDetailView />;
      case 'contact':
        return <ContactView />;
      case 'resume':
        return <ResumeView />;
      default:
        return <HomeSections />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050814] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'} flex flex-col justify-between selection:bg-[#00E5FF] selection:text-[#050814] transition-colors duration-250`}>
      <DynamicSEO />
      {/* Maintenance Mode Notice (if active) */}
      {siteSettings.maintenanceMode && (
        <div className="bg-amber-950/80 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Site is currently in Maintenance Mode (Active in CMS settings)</span>
          </div>
          <button
            onClick={() => setCurrentRoute('admin-login')}
            className="underline hover:text-white"
          >
            Admin Access →
          </button>
        </div>
      )}

      <Header />

      <main className="flex-1">
        {renderPublicView()}
      </main>

      <Footer />
      <Toast />
      <ConfirmationModal />
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('App Error Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-[#111111] border border-[#262626] p-6 rounded-sm space-y-4">
            <h2 className="text-base font-bold text-[#c6a87d] uppercase">Application Restored</h2>
            <p className="text-xs text-[#969696] leading-relaxed">
              An unexpected issue occurred while rendering. You can refresh or reset cache to resume browsing.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase rounded-sm"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  try {
                    Object.keys(localStorage).forEach(k => {
                      if (k.startsWith('gunjan_platform_')) localStorage.removeItem(k);
                    });
                  } catch (e) {
                    console.error(e);
                  }
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#171717] border border-[#262626] text-xs text-[#969696] hover:text-[#F5F5F5] rounded-sm"
              >
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
