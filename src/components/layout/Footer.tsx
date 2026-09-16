import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ArrowUp, Github, Linkedin, Instagram, Facebook, Globe, QrCode } from 'lucide-react';
import { QrShareModal } from '../ui/QrShareModal';
import himalayanMountainBg from '../../assets/images/himalaya_footer_bg_1787827051517.jpg';

export const Footer: React.FC = () => {
  const { setCurrentRoute, socialLinks, currentRoute, siteSettings } = useData();
  const { isDark } = useTheme();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  if (currentRoute.startsWith('admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github className="w-4 h-4" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Mountain background image (local 2400x800 panoramic mountain asset with fallback)
  const mountainBgUrl = (siteSettings as any)?.footerBgUrl || himalayanMountainBg;

  return (
    <footer 
      className={`relative overflow-hidden border-t ${
        isDark 
          ? 'border-[#1E293B] bg-[#050814] text-[#94A3B8]' 
          : 'border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]'
      } pt-20 pb-12 mt-24 transition-colors duration-300`}
    >
      {/* Background Mountain Layer - Anchored to base and vividly showcased */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={mountainBgUrl}
          alt="Snow-capped Himalayan mountain panorama of Nepal rising above clouds at sunrise"
          className={`w-full h-full object-cover object-[center_60%] ${
            isDark 
              ? 'opacity-75 filter contrast-125 saturate-120 brightness-95' 
              : 'opacity-70 filter contrast-115 saturate-110 brightness-100'
          } transition-all duration-500`}
          loading="lazy"
        />

        {/* Vertical gradient feathering from top to dissolve into the page while leaving mountains clear */}
        <div 
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-b from-[#050814] via-[#050814]/70 to-[#050814]/40'
              : 'bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC]/75 to-[#F1F5F9]/35'
          }`} 
        />

        {/* Ambient bottom warm morning horizon tint */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t ${
            isDark 
              ? 'from-[#050814]/90 via-[#050814]/40 to-transparent' 
              : 'from-[#F1F5F9]/85 via-[#F1F5F9]/30 to-transparent'
          }`} 
        />
      </div>

      {/* Footer Content with Subtle Frosted Backdrop for Legibility */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b ${
          isDark 
            ? 'border-[#1E293B]/80 bg-[#050814]/50' 
            : 'border-[#E2E8F0]/80 bg-white/45'
        } p-8 rounded-2xl backdrop-blur-md shadow-sm`}>
          {/* Column 1: Identity & Proposition */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName || "Gunjan Shrestha"}
                  className="h-14 w-auto max-w-[240px] object-contain"
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg ${
                  isDark 
                    ? 'bg-[#0B132B] border border-[#1E3A5F] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                    : 'bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] shadow-sm'
                } flex items-center justify-center font-bold text-base font-mono`}>
                  G
                </div>
              )}
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
              } uppercase tracking-tight font-sans`}>
                {siteSettings.siteName || 'Gunjan Shrestha'}
              </h3>
            </div>
            <p className={`text-sm ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            } max-w-md leading-relaxed`}>
              {siteSettings.siteDescription || 'Technology × Design × Business — different experiences, one perspective. Exploring digital systems, software architecture, visual communication, and commerce.'}
            </p>
            <div className={`text-xs font-mono ${
              isDark ? 'text-[#64748B]' : 'text-[#64748B]'
            } flex items-center gap-2 pt-1`}>
              <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Kathmandu, Nepal
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Pathways */}
          <div className="space-y-3">
            <p className={`text-xs font-mono uppercase tracking-widest ${
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            }`}>
              Navigation
            </p>
            <ul className="space-y-2 text-sm font-mono uppercase tracking-wider text-xs">
              <li>
                <button
                  onClick={() => setCurrentRoute('about')}
                  className={`hover:text-[#00E5FF] ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
                >
                  ABOUT ME
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('skills')}
                  className={`hover:text-[#00E5FF] ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
                >
                  SKILL SET
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('services')}
                  className={`hover:text-[#00E5FF] ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
                >
                  SERVICES OFFERED
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('work')}
                  className={`hover:text-[#00E5FF] ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
                >
                  RESEARCH
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('gallery')}
                  className={`hover:text-[#00E5FF] ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
                >
                  GALLERY
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Connect & Social */}
          <div className="space-y-3">
            <p className={`text-xs font-mono uppercase tracking-widest ${
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            }`}>
              Connect
            </p>
            <div className="space-y-2 text-sm">
              <button
                onClick={() => setCurrentRoute('contact')}
                className={`block ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
              >
                Send Message →
              </button>
              <button
                onClick={() => setCurrentRoute('resume')}
                className={`block ${isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'} transition-colors`}
              >
                View Structured Resume
              </button>
            </div>

            <div className="pt-3">
              <p className="text-xs font-mono uppercase tracking-widest text-[#64748B] mb-2">
                Social Presence
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.filter(s => s.published).map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`p-2.5 ${
                      isDark 
                        ? 'bg-[#0B132B]/80 hover:bg-[#0F1B38] border-[#1E293B] hover:border-[#00E5FF]/50 text-[#94A3B8] hover:text-[#00E5FF] hover:shadow-[0_0_12px_rgba(0,229,255,0.2)]' 
                        : 'bg-white/80 hover:bg-white border-[#E2E8F0] hover:border-[#0284C7]/50 text-[#475569] hover:text-[#0284C7] shadow-sm'
                    } border transition-all rounded-md backdrop-blur-sm`}
                    title={item.label}
                    aria-label={item.label}
                  >
                    {getSocialIcon(item.platform)}
                  </a>
                ))}

                {/* Instant QR Connect Button */}
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className={`p-2.5 ${
                    isDark
                      ? 'bg-[#c6a87d]/15 hover:bg-[#c6a87d]/25 border-[#c6a87d]/40 text-[#c6a87d] hover:shadow-[0_0_15px_rgba(198,168,125,0.25)]'
                      : 'bg-[#c6a87d]/10 hover:bg-[#c6a87d]/20 border-[#c6a87d]/50 text-[#8b6f48] shadow-sm'
                  } border transition-all rounded-md backdrop-blur-sm flex items-center gap-1.5`}
                  title="Scan & Connect via QR Code"
                  aria-label="Scan & Connect via QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Share Modal */}
        <QrShareModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
          <p>© 2026 Gunjan Shrestha. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className={`flex items-center gap-1.5 ${
                isDark ? 'hover:text-[#00E5FF]' : 'hover:text-[#0284C7]'
              } transition-colors`}
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
