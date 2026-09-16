import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { generateQrCodeDataUrl, downloadDataUrl, generateVCard, downloadTextFile } from '../../utils/seoAndQrUtils';
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Contact,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
} from 'lucide-react';

interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTarget?: string; // e.g. 'portfolio' | 'vcard' | 'linkedin'
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  isOpen,
  onClose,
  defaultTarget = 'portfolio',
}) => {
  const { siteSettings, profile, socialLinks } = useData();
  const [selectedTarget, setSelectedTarget] = useState<string>(defaultTarget);
  const [qrTheme, setQrTheme] = useState<'gold' | 'classic'>('gold');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync default target when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedTarget(defaultTarget);
      setCopied(false);
    }
  }, [isOpen, defaultTarget]);

  // Target item options
  const targetOptions = [
    {
      id: 'portfolio',
      label: 'Portfolio Website',
      platform: 'Website',
      description: 'Official digital identity & archive',
      value: siteSettings.canonicalUrl || 'https://gunjan.dev',
      isVcard: false,
    },
    {
      id: 'vcard',
      label: 'Digital Contact (vCard)',
      platform: 'vCard',
      description: 'Saves Gunjan to phone address book',
      value: generateVCard(profile, siteSettings),
      isVcard: true,
    },
    ...socialLinks
      .filter(s => s.published && s.url)
      .map(s => ({
        id: s.id,
        label: s.label || s.platform,
        platform: s.platform,
        description: `${s.platform} channel profile`,
        value: s.url,
        isVcard: false,
      })),
  ];

  const currentIndex = targetOptions.findIndex(o => o.id === selectedTarget);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentOption = targetOptions[safeCurrentIndex] || targetOptions[0];

  const handlePrev = () => {
    const nextIdx = (safeCurrentIndex - 1 + targetOptions.length) % targetOptions.length;
    setSelectedTarget(targetOptions[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (safeCurrentIndex + 1) % targetOptions.length;
    setSelectedTarget(targetOptions[nextIdx].id);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, safeCurrentIndex, targetOptions.length]);

  // Generate QR when target or theme changes
  useEffect(() => {
    if (!isOpen || !currentOption) return;

    let isMounted = true;
    setIsGenerating(true);

    generateQrCodeDataUrl(currentOption.value, {
      theme: qrTheme,
      width: 600,
    })
      .then(url => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(err => {
        console.error('QR generation error:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedTarget, qrTheme, currentOption]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOption.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const slug = currentOption.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadDataUrl(qrDataUrl, `gunjan-shrestha-${slug}-qr.png`);
  };

  const handleDownloadVcard = () => {
    const vcardString = generateVCard(profile, siteSettings);
    downloadTextFile(vcardString, 'Gunjan-Shrestha.vcf', 'text/vcard');
  };

  const getPlatformIcon = (platform: string, isVcard?: boolean, iconClass = 'w-4 h-4') => {
    if (isVcard || platform.toLowerCase() === 'vcard') return <Contact className={iconClass} />;
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className={iconClass} />;
    if (p.includes('github')) return <Github className={iconClass} />;
    if (p.includes('instagram')) return <Instagram className={iconClass} />;
    if (p.includes('facebook')) return <Facebook className={iconClass} />;
    if (p.includes('twitter') || p.includes(' x')) return <Twitter className={iconClass} />;
    if (p.includes('youtube')) return <Youtube className={iconClass} />;
    if (p.includes('whatsapp')) return <MessageCircle className={iconClass} />;
    return <Globe className={iconClass} />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] border border-[#262626] rounded-sm w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#262626] bg-[#141414] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#c6a87d]/10 border border-[#c6a87d]/30 flex items-center justify-center text-[#c6a87d]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
                  Instant QR Connect
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e1e1e] text-[#c6a87d] border border-[#2e2e2e]">
                  {safeCurrentIndex + 1} of {targetOptions.length}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#969696]">
                Scan with smartphone camera to connect instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Horizontal Platform Scroll Rail */}
        <div className="md:hidden border-b border-[#1f1f1f] bg-[#0c0c0c] px-3 py-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {targetOptions.map((opt, idx) => {
              const isSelected = selectedTarget === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedTarget(opt.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-[#c6a87d] text-[#080808] font-bold shadow-sm'
                      : 'bg-[#141414] text-[#a0a0a0] hover:text-[#F5F5F5] border border-[#222222]'
                  }`}
                  title={opt.label}
                >
                  <span className={isSelected ? 'text-[#080808]' : 'text-[#c6a87d]'}>
                    {getPlatformIcon(opt.platform, opt.isVcard, 'w-3.5 h-3.5')}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body - Split Navigation Rail on Desktop */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Logo Navigation Rail (Desktop) */}
          <div className="hidden md:flex flex-col w-64 shrink-0 bg-[#0c0c0c] border-r border-[#222222]">
            <div className="px-4 py-2.5 border-b border-[#1a1a1a] flex items-center justify-between text-[11px] font-mono text-[#777777] uppercase tracking-wider">
              <span>QR Channels</span>
              <span className="text-[#c6a87d] font-bold">{targetOptions.length} available</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {targetOptions.map((opt, idx) => {
                const isSelected = selectedTarget === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedTarget(opt.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-sm transition-all flex items-center gap-3 group relative ${
                      isSelected
                        ? 'bg-[#1a1a1a] border border-[#c6a87d]/40 text-[#F5F5F5]'
                        : 'bg-transparent hover:bg-[#141414] border border-transparent text-[#969696] hover:text-[#e0e0e0]'
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#c6a87d] rounded-r-xs" />
                    )}

                    {/* Logo/Icon Container */}
                    <div
                      className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#c6a87d] text-[#080808]'
                          : 'bg-[#171717] text-[#c6a87d] border border-[#262626] group-hover:border-[#c6a87d]/40'
                      }`}
                    >
                      {getPlatformIcon(opt.platform, opt.isVcard, 'w-4 h-4')}
                    </div>

                    {/* Label & Description */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono font-medium truncate block ${
                            isSelected ? 'text-[#F5F5F5] font-bold' : 'text-[#d0d0d0]'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#666666]">
                          #{idx + 1}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#737373] truncate block">
                        {opt.platform}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-[#1a1a1a] text-[10px] font-mono text-[#666666] flex items-center justify-between bg-[#0a0a0a]">
              <span>Keys: ← / → to flip</span>
              <span className="text-[#c6a87d]">Esc to close</span>
            </div>
          </div>

          {/* Right Showcase & Actions Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between space-y-5 bg-[#111111]">
            {/* Top Carousel Navigation Bar */}
            <div className="flex items-center justify-between gap-3 bg-[#0a0a0a] border border-[#222222] px-3.5 py-2 rounded-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 bg-[#171717] hover:bg-[#262626] border border-[#2a2a2a] hover:border-[#c6a87d]/50 text-[#d0d0d0] hover:text-[#c6a87d] rounded-sm transition-colors"
                  title="Previous QR (← Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[#969696] px-1">
                  <span className="text-[#c6a87d] font-bold">{safeCurrentIndex + 1}</span>
                  <span>/</span>
                  <span>{targetOptions.length}</span>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 bg-[#171717] hover:bg-[#262626] border border-[#2a2a2a] hover:border-[#c6a87d]/50 text-[#d0d0d0] hover:text-[#c6a87d] rounded-sm transition-colors"
                  title="Next QR (→ Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Color Selector */}
              <div className="flex items-center gap-1 bg-[#141414] border border-[#262626] p-0.5 rounded-sm text-xs font-mono">
                <button
                  onClick={() => setQrTheme('gold')}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    qrTheme === 'gold' ? 'bg-[#c6a87d] text-[#080808] font-bold' : 'text-[#888888] hover:text-[#F5F5F5]'
                  }`}
                >
                  Gold
                </button>
                <button
                  onClick={() => setQrTheme('classic')}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    qrTheme === 'classic' ? 'bg-[#F5F5F5] text-[#080808] font-bold' : 'text-[#888888] hover:text-[#F5F5F5]'
                  }`}
                >
                  High-Contrast
                </button>
              </div>
            </div>

            {/* QR Center Stage with Side Navigation Controls */}
            <div className="relative flex items-center justify-center">
              {/* Floating Carousel Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="hidden sm:flex absolute -left-2 z-10 p-2 rounded-full bg-[#1a1a1a]/90 hover:bg-[#c6a87d] border border-[#333333] hover:border-[#c6a87d] text-[#c6a87d] hover:text-[#080808] transition-all shadow-lg hover:scale-105"
                title="Previous QR code"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="hidden sm:flex absolute -right-2 z-10 p-2 rounded-full bg-[#1a1a1a]/90 hover:bg-[#c6a87d] border border-[#333333] hover:border-[#c6a87d] text-[#c6a87d] hover:text-[#080808] transition-all shadow-lg hover:scale-105"
                title="Next QR code"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* QR Display Card */}
              <div className="p-4 sm:p-5 bg-[#080808] border border-[#262626] rounded-sm flex flex-col items-center w-full max-w-xs shadow-inner">
                {isGenerating ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center text-[#969696] text-xs font-mono space-y-2">
                    <Sparkles className="w-6 h-6 text-[#c6a87d] animate-spin" />
                    <span>Rendering QR...</span>
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`${currentOption.label} QR Code`}
                    className="w-52 h-52 object-contain rounded-xs bg-[#080808]"
                  />
                ) : null}

                {/* Target Label beneath QR with Logo Badge */}
                <div className="mt-3.5 text-center w-full">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#141414] border border-[#262626] text-xs font-mono text-[#c6a87d] font-bold uppercase tracking-wider mb-1">
                    {getPlatformIcon(currentOption.platform, currentOption.isVcard, 'w-3.5 h-3.5')}
                    <span>{currentOption.label}</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#808080] truncate w-full px-2" title={currentOption.value}>
                    {currentOption.isVcard ? 'Saves contact card (.vcf)' : currentOption.value}
                  </p>
                </div>

                {/* Dot Pagination Indicator */}
                <div className="flex items-center gap-1.5 mt-3">
                  {targetOptions.map((opt, idx) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedTarget(opt.id)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === safeCurrentIndex
                          ? 'w-5 bg-[#c6a87d]'
                          : 'w-1.5 bg-[#262626] hover:bg-[#444444]'
                      }`}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-3 py-2.5 bg-[#171717] hover:bg-[#202020] border border-[#2a2a2a] text-xs font-mono text-[#F5F5F5] rounded-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#c6a87d]" />
                <span>Save QR Image</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2.5 bg-[#171717] hover:bg-[#202020] border border-[#2a2a2a] text-xs font-mono text-[#F5F5F5] rounded-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#c6a87d]" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {currentOption.isVcard ? (
                <button
                  type="button"
                  onClick={handleDownloadVcard}
                  className="col-span-2 sm:col-span-1 px-3 py-2.5 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get .VCF</span>
                </button>
              ) : (
                <a
                  href={currentOption.value}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="col-span-2 sm:col-span-1 px-3 py-2.5 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Link</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Tip */}
        <div className="px-5 py-2.5 bg-[#0a0a0a] border-t border-[#222222] flex items-center justify-between text-[11px] font-mono text-[#666666] shrink-0">
          <span className="truncate">Tip: Scan with iOS Camera or Android Google Lens</span>
          <span className="text-[#c6a87d] hidden sm:inline">Gunjan Shrestha Identity</span>
        </div>
      </div>
    </div>
  );
};
