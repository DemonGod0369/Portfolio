import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ActiveRoute } from '../../types';
import { Menu, X, Shield, ArrowUpRight, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { QrShareModal } from '../ui/QrShareModal';

export const Header: React.FC = () => {
  const { currentRoute, setCurrentRoute, isAdminAuthenticated, siteSettings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navItems: { label: string; route: ActiveRoute; matchRoutes?: ActiveRoute[] }[] = [
    { label: 'Home', route: 'home' },
    { label: 'About', route: 'about' },
    { label: 'Skills & Services', route: 'skills' },
    { label: 'Research', route: 'work', matchRoutes: ['work', 'blog', 'work-detail', 'blog-detail'] },
    { label: 'Gallery', route: 'gallery' },
    { label: 'Contact', route: 'contact' },
  ];

  const secondaryNavItems: { label: string; route: ActiveRoute }[] = [
    { label: 'Academic / Education', route: 'academic' },
    { label: 'Services Offered', route: 'services' },
    { label: 'Printable Resume', route: 'resume' },
  ];

  const handleNavClick = (route: ActiveRoute) => {
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
  };

  const isPublicRoute = !currentRoute.startsWith('admin');

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050814]/90 backdrop-blur-xl border-b border-[#1E293B] py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo / Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3.5 text-left focus:outline-none"
            aria-label="Gunjan Shrestha Home"
          >
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName || "Gunjan Shrestha"}
                className="h-11 md:h-13 w-auto max-w-[200px] object-contain transition-all"
              />
            ) : (
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-lg bg-[#0B132B] border border-[#1E3A5F] flex items-center justify-center text-[#00E5FF] font-bold text-sm md:text-base font-mono group-hover:border-[#00E5FF] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all">
                G
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold tracking-tight text-[#F8FAFC] group-hover:text-[#00E5FF] transition-colors duration-200 uppercase font-sans leading-tight">
                {siteSettings.siteName || 'Gunjan Shrestha'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                Identity Platform
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          {isPublicRoute && (
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = currentRoute === item.route || (item.matchRoutes && item.matchRoutes.includes(currentRoute));
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`transition-colors duration-200 relative py-1.5 text-xs font-mono uppercase tracking-wider ${
                      isActive
                        ? 'text-[#00E5FF] font-semibold'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center space-x-3">
            {isPublicRoute ? (
              <>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] transition-all duration-300 rounded-md shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transform hover:-translate-y-0.5"
                >
                  Let's Talk
                </button>
                {/* QR Code Quick Share */}
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="p-2 text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#0B132B] border border-transparent hover:border-[#1E3A5F] rounded-md transition-all"
                  title="Scan & Share QR Codes (vCard, Social Links)"
                  aria-label="Scan & Share QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <ThemeToggle />
                <button
                  onClick={() => handleNavClick(isAdminAuthenticated ? 'admin' : 'admin-login')}
                  className="p-2 text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#0B132B] border border-transparent hover:border-[#1E3A5F] rounded-md transition-all"
                  title={isAdminAuthenticated ? 'Go to Admin CMS' : 'Private CMS Login'}
                  aria-label="Private Admin Access"
                >
                  <Shield className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => handleNavClick('home')}
                  className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#00E5FF] flex items-center gap-1.5 py-2 px-3.5 rounded-md border border-[#1E3A5F] bg-[#0B132B] hover:border-[#00E5FF]/50 transition-all"
                >
                  ← View Public Site
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {isPublicRoute && (
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="p-2 text-[#94A3B8] hover:text-[#00E5FF]"
                title="Scan QR Code"
                aria-label="Scan QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
            <ThemeToggle />
            {isPublicRoute && (
              <button
                onClick={() => handleNavClick(isAdminAuthenticated ? 'admin' : 'admin-login')}
                className="p-2 text-[#94A3B8] hover:text-[#00E5FF]"
                aria-label="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#F8FAFC] hover:text-[#00E5FF] focus:outline-none rounded-md bg-[#0B132B] border border-[#1E293B]"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#050814]/98 backdrop-blur-2xl flex flex-col justify-between p-8 overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-6">
              <div className="flex items-center gap-3.5">
                {siteSettings.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings.siteName || "Gunjan Shrestha"}
                    className="h-11 w-auto max-w-[150px] object-contain rounded-md"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-[#0B132B] border border-[#1E3A5F] flex items-center justify-center text-[#00E5FF] font-bold text-sm font-mono">
                    G
                  </div>
                )}
                <div>
                  <span className="text-lg font-bold text-[#F8FAFC] uppercase tracking-tight font-sans">
                    {siteSettings.siteName || 'Gunjan Shrestha'}
                  </span>
                  <p className="text-xs text-[#00E5FF] font-mono mt-0.5">
                    Navigation Directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0B132B] border border-[#1E293B] rounded-full"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Mobile Links */}
            <div className="py-8 space-y-4">
              <p className="text-[11px] uppercase font-mono tracking-widest text-[#64748B]">
                Main Explorations
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-2xl font-medium tracking-tight text-left flex items-center justify-between py-1 transition-colors ${
                    currentRoute === 'home' ? 'text-[#00E5FF]' : 'text-[#F8FAFC] hover:text-[#00E5FF]'
                  }`}
                >
                  <span>Home</span>
                  <span className="text-xs font-mono text-[#64748B]">00</span>
                </button>
                {navItems.map((item, idx) => {
                  const isActive = currentRoute === item.route || (item.matchRoutes && item.matchRoutes.includes(currentRoute));
                  return (
                    <button
                      key={item.route}
                      onClick={() => handleNavClick(item.route)}
                      className={`text-2xl font-medium tracking-tight text-left flex items-center justify-between py-1 transition-colors ${
                        isActive ? 'text-[#00E5FF]' : 'text-[#F8FAFC] hover:text-[#00E5FF]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs font-mono text-[#64748B]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Destinations & Action */}
            <div className="border-t border-[#1E293B] pt-6 space-y-6">
              <div>
                <p className="text-[11px] uppercase font-mono tracking-widest text-[#64748B] mb-3">
                  Extended Context
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.route}
                      onClick={() => handleNavClick(item.route)}
                      className="text-left text-[#94A3B8] hover:text-[#00E5FF] py-2 flex items-center justify-between border-b border-[#131F37]"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] transition-all rounded-md shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  Let's Connect
                </button>
                <button
                  onClick={() => handleNavClick(isAdminAuthenticated ? 'admin' : 'admin-login')}
                  className="w-full py-3.5 text-center text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0B132B] border border-[#1E293B] rounded-md"
                >
                  {isAdminAuthenticated ? 'Admin CMS' : 'Admin Login'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Share Modal */}
      <QrShareModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </>
  );
};
