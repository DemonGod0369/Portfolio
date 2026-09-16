import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ImageUploadField } from '../ui/ImageUploadField';
import {
  calculateSeoHealth,
  generateQrCodeDataUrl,
  downloadDataUrl,
  generateVCard,
} from '../../utils/seoAndQrUtils';
import {
  Globe,
  Search,
  Share2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  Sliders,
  CheckSquare,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { SocialLink } from '../../types';

export const AdminSeoAndSettingsManager: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    profile,
    projects,
    blogPosts,
    socialLinks,
    updateSocialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    showToast,
  } = useData();

  // Sub-tabs: 'seo' | 'social-qr' | 'branding'
  const [activeTab, setActiveTab] = useState<'seo' | 'social-qr' | 'branding'>('seo');

  // Form state
  const [form, setForm] = useState({
    siteName: siteSettings.siteName || '',
    siteDescription: siteSettings.siteDescription || '',
    canonicalUrl: siteSettings.canonicalUrl || 'https://gunjan.dev',
    logoUrl: siteSettings.logoUrl || '',
    defaultSeoTitle: siteSettings.defaultSeoTitle || '',
    defaultSeoDescription: siteSettings.defaultSeoDescription || '',
    defaultOgImageUrl: siteSettings.defaultOgImageUrl || '',
    seoKeywords: siteSettings.seoKeywords || '',
    allowIndexing: siteSettings.allowIndexing !== false,
    googleSiteVerification: siteSettings.googleSiteVerification || '',
    googleAnalyticsId: siteSettings.googleAnalyticsId || '',
    maintenanceMode: siteSettings.maintenanceMode || false,
  });

  // Sync form when siteSettings change
  useEffect(() => {
    setForm({
      siteName: siteSettings.siteName || '',
      siteDescription: siteSettings.siteDescription || '',
      canonicalUrl: siteSettings.canonicalUrl || 'https://gunjan.dev',
      logoUrl: siteSettings.logoUrl || '',
      defaultSeoTitle: siteSettings.defaultSeoTitle || '',
      defaultSeoDescription: siteSettings.defaultSeoDescription || '',
      defaultOgImageUrl: siteSettings.defaultOgImageUrl || '',
      seoKeywords: siteSettings.seoKeywords || '',
      allowIndexing: siteSettings.allowIndexing !== false,
      googleSiteVerification: siteSettings.googleSiteVerification || '',
      googleAnalyticsId: siteSettings.googleAnalyticsId || '',
      maintenanceMode: siteSettings.maintenanceMode || false,
    });
  }, [siteSettings]);

  // Social Preview Switcher (Google SERP vs Twitter/X vs LinkedIn)
  const [previewCardType, setPreviewCardType] = useState<'google' | 'twitter' | 'linkedin'>('google');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Social Link Form Modal State
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialForm, setSocialForm] = useState({
    platform: 'LinkedIn',
    label: '',
    url: '',
    published: true,
  });

  // QR Studio State
  const [qrSelectedTarget, setQrSelectedTarget] = useState<string>('portfolio');
  const [qrTheme, setQrTheme] = useState<'gold' | 'classic' | 'whiteOnDark'>('gold');
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);

  // Check if Meta Title & Search Snippet Config has unsaved modifications
  const hasMetaConfigChanges = useMemo(() => {
    return (
      form.defaultSeoTitle !== (siteSettings.defaultSeoTitle || '') ||
      form.canonicalUrl !== (siteSettings.canonicalUrl || 'https://gunjan.dev') ||
      form.siteDescription !== (siteSettings.siteDescription || '') ||
      form.seoKeywords !== (siteSettings.seoKeywords || '') ||
      form.defaultOgImageUrl !== (siteSettings.defaultOgImageUrl || '') ||
      form.allowIndexing !== (siteSettings.allowIndexing !== false)
    );
  }, [form, siteSettings]);

  // Check if Webmaster Verification has unsaved modifications
  const hasWebmasterChanges = useMemo(() => {
    return (
      form.googleSiteVerification !== (siteSettings.googleSiteVerification || '') ||
      form.googleAnalyticsId !== (siteSettings.googleAnalyticsId || '')
    );
  }, [form, siteSettings]);

  // Computed SEO Health Report
  const seoReport = useMemo(() => {
    const currentVirtualSettings = { ...siteSettings, ...form };
    return calculateSeoHealth(currentVirtualSettings, profile, socialLinks);
  }, [siteSettings, form, profile, socialLinks]);

  // Dedicated Save for Meta Title & Search Snippet Config
  const handleSaveMetaSnippetConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings({
      defaultSeoTitle: form.defaultSeoTitle,
      canonicalUrl: form.canonicalUrl,
      siteDescription: form.siteDescription,
      defaultSeoDescription: form.siteDescription,
      seoKeywords: form.seoKeywords,
      defaultOgImageUrl: form.defaultOgImageUrl,
      allowIndexing: form.allowIndexing,
    });
    showToast('Meta Title & Search Snippet configuration saved and applied to system.');
  };

  // Dedicated Save for Webmaster & Analytics
  const handleSaveWebmasterConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings({
      googleSiteVerification: form.googleSiteVerification,
      googleAnalyticsId: form.googleAnalyticsId,
    });
    showToast('Webmaster & Analytics verification settings saved.');
  };

  // Global Save All Settings
  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings(form);
    showToast('All system & branding settings saved and applied.');
  };

  // Copy helper
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // QR Generation Effect
  const qrTargetValue = useMemo(() => {
    if (qrSelectedTarget === 'portfolio') {
      return form.canonicalUrl || 'https://gunjan.dev';
    }
    if (qrSelectedTarget === 'vcard') {
      return generateVCard(profile, { ...siteSettings, ...form });
    }
    const targetSocial = socialLinks.find(s => s.id === qrSelectedTarget);
    return targetSocial?.url || form.canonicalUrl || 'https://gunjan.dev';
  }, [qrSelectedTarget, form.canonicalUrl, profile, siteSettings, form, socialLinks]);

  useEffect(() => {
    let isMounted = true;
    setIsGeneratingQr(true);

    generateQrCodeDataUrl(qrTargetValue, {
      theme: qrTheme,
      width: 600,
    })
      .then(url => {
        if (isMounted) {
          setQrPreviewUrl(url);
          setIsGeneratingQr(false);
        }
      })
      .catch(err => {
        console.error('Failed to generate studio QR:', err);
        if (isMounted) setIsGeneratingQr(false);
      });

    return () => {
      isMounted = false;
    };
  }, [qrTargetValue, qrTheme]);

  // Social link actions
  const handleOpenAddSocial = () => {
    setEditingSocialId(null);
    setSocialForm({
      platform: 'LinkedIn',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/',
      published: true,
    });
    setIsSocialModalOpen(true);
  };

  const handleOpenEditSocial = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setSocialForm({
      platform: link.platform,
      label: link.label,
      url: link.url,
      published: link.published,
    });
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialForm.label.trim() || !socialForm.url.trim()) return;

    if (editingSocialId) {
      updateSocialLink(editingSocialId, {
        platform: socialForm.platform,
        label: socialForm.label,
        url: socialForm.url,
        published: socialForm.published,
      });
    } else {
      addSocialLink({
        platform: socialForm.platform,
        label: socialForm.label,
        url: socialForm.url,
        displayOrder: socialLinks.length + 1,
        published: socialForm.published,
      });
    }
    setIsSocialModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="border-b border-[#262626] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase">
            SEO & Digital Distribution Engine
          </h2>
          <p className="text-xs font-mono text-[#969696]">
            Search engine metadata, real-time social card simulators, QR sharing suite, and global brand presentation.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSaveSettings}
          className="self-start sm:self-auto px-5 py-2 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Primary Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#262626] pb-3">
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-xs font-mono rounded-sm transition-colors flex items-center gap-2 ${
            activeTab === 'seo'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>SEO & Search Simulators</span>
        </button>

        <button
          onClick={() => setActiveTab('social-qr')}
          className={`px-4 py-2 text-xs font-mono rounded-sm transition-colors flex items-center gap-2 ${
            activeTab === 'social-qr'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Social Links & QR Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 text-xs font-mono rounded-sm transition-colors flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Global Branding & Identity</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SEO & SEARCH SIMULATORS TAB */}
      {/* ======================================================== */}
      {activeTab === 'seo' && (
        <div className="space-y-8">
          {/* SEO Health Audit Card */}
          <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#212121]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#969696]">Automated Health Audit</span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs ${
                    seoReport.score >= 90 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    seoReport.score >= 70 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    Grade: {seoReport.grade}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#F5F5F5]">
                  Search & Discoverability Health Score
                </h3>
                <p className="text-xs text-[#969696] max-w-xl leading-relaxed">
                  {seoReport.summary}
                </p>
              </div>

              {/* Score Meter */}
              <div className="flex items-center gap-4 bg-[#080808] border border-[#262626] px-6 py-4 rounded-sm">
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#c6a87d] font-mono">
                    {seoReport.score}<span className="text-sm text-[#666666]">/100</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#808080] uppercase">
                    Health Rating
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#262626] flex items-center justify-center relative">
                  <Sparkles className="w-6 h-6 text-[#c6a87d]" />
                </div>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-6">
              {seoReport.checklist.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#F5F5F5] leading-snug">
                      {item.label}
                    </span>
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[#808080] leading-relaxed">
                    {item.tip}
                  </p>
                  {item.currentValue && (
                    <div className="text-[10px] font-mono text-[#c6a87d] pt-0.5">
                      Status: {item.currentValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Core Metadata Form + Live Card Simulators (Two-Column Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Metadata Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-6">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2 border-b border-[#212121] pb-3">
                  <Globe className="w-4 h-4 text-[#c6a87d]" />
                  <span>Meta Title & Search Snippet Config</span>
                </h3>

                {/* Default SEO Title with Character Counter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-[#969696]">
                      Default SEO Meta Title
                    </label>
                    <span className={`text-[11px] font-mono ${
                      form.defaultSeoTitle.length >= 40 && form.defaultSeoTitle.length <= 60
                        ? 'text-emerald-400'
                        : form.defaultSeoTitle.length > 60
                        ? 'text-rose-400 font-bold'
                        : 'text-amber-400'
                    }`}>
                      {form.defaultSeoTitle.length}/60 chars {form.defaultSeoTitle.length > 60 ? '(Will truncate)' : '(Optimal: 40-60)'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.defaultSeoTitle}
                    onChange={(e) => setForm({ ...form, defaultSeoTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    placeholder="Gunjan Shrestha — Technology, Design & Business"
                  />
                </div>

                {/* Canonical Site URL */}
                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1.5">
                    Canonical Website URL (Base Domain)
                  </label>
                  <input
                    type="url"
                    required
                    value={form.canonicalUrl}
                    onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    placeholder="https://gunjan.dev"
                  />
                  <p className="text-[11px] font-mono text-[#666666] mt-1">
                    Search engines use this definitive URL to avoid duplicate content penalties.
                  </p>
                </div>

                {/* Meta Description with Character Counter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono text-[#969696]">
                      Search Meta Description (SERP & Social Snippet)
                    </label>
                    <span className={`text-[11px] font-mono ${
                      form.siteDescription.length >= 120 && form.siteDescription.length <= 160
                        ? 'text-emerald-400'
                        : form.siteDescription.length > 160
                        ? 'text-rose-400 font-bold'
                        : 'text-amber-400'
                    }`}>
                      {form.siteDescription.length}/160 chars {form.siteDescription.length > 160 ? '(Will truncate)' : '(Optimal: 120-160)'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={form.siteDescription}
                    onChange={(e) => setForm({ ...form, siteDescription: e.target.value, defaultSeoDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d] leading-relaxed"
                    placeholder="Personal digital identity platform and professional profile of Gunjan Shrestha..."
                  />
                </div>

                {/* Keywords / Taxonomy Tags */}
                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1.5">
                    Meta Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.seoKeywords}
                    onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    placeholder="Gunjan Shrestha, Technology, Systems Architecture, Design Systems, Nepal"
                  />
                </div>

                {/* OpenGraph Card Image Upload */}
                <ImageUploadField
                  label="Social Share & OpenGraph Preview Card Image"
                  value={form.defaultOgImageUrl}
                  onChange={(val) => setForm({ ...form, defaultOgImageUrl: val })}
                  aspectRatio="video"
                  previewLabel="OG 1200x630 Banner"
                  helperText="Displayed across Twitter/X, LinkedIn, WhatsApp, and Discord when links are shared."
                />

                {/* Indexing Toggle */}
                <div className="pt-4 border-t border-[#1f1f1f]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.allowIndexing}
                      onChange={(e) => setForm({ ...form, allowIndexing: e.target.checked })}
                      className="accent-[#c6a87d] w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#F5F5F5] uppercase">
                        Allow Search Engine Indexing (Google / Bing)
                      </span>
                      <p className="text-[11px] font-mono text-[#666666]">
                        {form.allowIndexing
                          ? 'Active: robots.txt emits "Allow: /" and pages specify "index, follow".'
                          : 'Private / Staging: robots.txt emits "Disallow: /" and pages specify "noindex, nofollow".'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Dedicated Save Action & Status for Meta Title & Search Snippet Config */}
                <div className="pt-4 border-t border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {hasMetaConfigChanges ? (
                      <span className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2.5 py-1 rounded-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        Unsaved changes — Click Save to apply to site
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-xs">
                        <Check className="w-3.5 h-3.5" />
                        Settings saved & applied to system
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveMetaSnippetConfig}
                    className={`px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all ${
                      hasMetaConfigChanges
                        ? 'bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] shadow-md shadow-[#c6a87d]/20 ring-1 ring-[#c6a87d]'
                        : 'bg-[#171717] hover:bg-[#212121] text-[#F5F5F5] border border-[#262626]'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Meta Title & Snippet Config</span>
                  </button>
                </div>
              </div>

              {/* Webmaster & Analytics Verification Codes */}
              <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2 border-b border-[#212121] pb-3">
                  <ShieldCheck className="w-4 h-4 text-[#c6a87d]" />
                  <span>Webmaster & Analytics Verification</span>
                </h3>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">
                    Google Search Console Verification Tag
                  </label>
                  <input
                    type="text"
                    value={form.googleSiteVerification}
                    onChange={(e) => setForm({ ...form, googleSiteVerification: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d] font-mono"
                    placeholder="e.g. google-site-verification=abcdef12345..."
                  />
                  <p className="text-[11px] font-mono text-[#666666] mt-1">
                    Automatically injects the verification &lt;meta&gt; tag into the site header.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">
                    Google Analytics (GA4) Measurement ID
                  </label>
                  <input
                    type="text"
                    value={form.googleAnalyticsId}
                    onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d] font-mono"
                    placeholder="e.g. G-XXXXXXXXXX"
                  />
                </div>

                {/* Webmaster Save Action */}
                <div className="pt-3 border-t border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-[#808080]">
                    {hasWebmasterChanges ? 'Unsaved verification keys' : 'Verification codes saved'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveWebmasterConfig}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all ${
                      hasWebmasterChanges
                        ? 'bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808]'
                        : 'bg-[#171717] hover:bg-[#212121] text-[#F5F5F5] border border-[#262626]'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Verification Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Simulators (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Simulator Card Box */}
              <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-5 sticky top-6">
                <div className="flex items-center justify-between border-b border-[#212121] pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#c6a87d]" />
                    <h3 className="text-xs font-mono font-bold text-[#F5F5F5] uppercase tracking-wider">
                      Live Share Simulator
                    </h3>
                  </div>

                  {/* Simulator Mode Switcher */}
                  <div className="flex gap-1 bg-[#080808] border border-[#262626] p-0.5 rounded-sm text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewCardType('google')}
                      className={`px-2 py-1 rounded-xs transition-colors ${
                        previewCardType === 'google' ? 'bg-[#c6a87d] text-[#080808] font-bold' : 'text-[#969696] hover:text-[#F5F5F5]'
                      }`}
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewCardType('twitter')}
                      className={`px-2 py-1 rounded-xs transition-colors ${
                        previewCardType === 'twitter' ? 'bg-[#c6a87d] text-[#080808] font-bold' : 'text-[#969696] hover:text-[#F5F5F5]'
                      }`}
                    >
                      Twitter/X
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewCardType('linkedin')}
                      className={`px-2 py-1 rounded-xs transition-colors ${
                        previewCardType === 'linkedin' ? 'bg-[#c6a87d] text-[#080808] font-bold' : 'text-[#969696] hover:text-[#F5F5F5]'
                      }`}
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>

                {/* 1. GOOGLE SERP PREVIEW */}
                {previewCardType === 'google' && (
                  <div className="bg-[#202124] border border-[#3c4043] p-4 rounded-md space-y-2 font-sans text-left">
                    <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                      <div className="w-5 h-5 rounded-full bg-[#303134] flex items-center justify-center text-[10px] font-bold text-[#c6a87d]">
                        G
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[12px] text-[#dadce0] font-medium truncate max-w-[240px]">
                          {form.siteName || 'Gunjan Shrestha'}
                        </span>
                        <span className="text-[11px] text-[#9aa0a6] truncate max-w-[240px]">
                          {form.canonicalUrl || 'https://gunjan.dev'}
                        </span>
                      </div>
                    </div>

                    {/* Google Blue Link Title */}
                    <div className="text-[#8ab4f8] hover:underline text-[16px] leading-snug cursor-pointer font-medium pt-1 line-clamp-2">
                      {form.defaultSeoTitle || 'Gunjan Shrestha — Technology, Design & Business'}
                    </div>

                    {/* Snippet Description */}
                    <p className="text-[#bdc1c6] text-[13px] leading-relaxed line-clamp-3">
                      {form.siteDescription || 'Personal digital identity platform and professional profile of Gunjan Shrestha.'}
                    </p>
                  </div>
                )}

                {/* 2. TWITTER/X SUMMARY LARGE CARD */}
                {previewCardType === 'twitter' && (
                  <div className="bg-[#000000] border border-[#2f3336] rounded-xl overflow-hidden text-left font-sans">
                    {/* Image Banner */}
                    <div className="aspect-[1.91/1] w-full bg-[#16181c] overflow-hidden relative">
                      {form.defaultOgImageUrl ? (
                        <img
                          src={form.defaultOgImageUrl}
                          alt="Twitter Card Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#71767b] text-xs font-mono">
                          No OG Image Selected
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-[#e7e9ea]">
                        1200 × 630
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 bg-[#000000] space-y-1">
                      <span className="text-[12px] text-[#71767b] block truncate">
                        {(form.canonicalUrl || 'gunjan.dev').replace(/^https?:\/\//, '')}
                      </span>
                      <h4 className="text-[14px] font-bold text-[#e7e9ea] line-clamp-1 leading-snug">
                        {form.defaultSeoTitle || 'Gunjan Shrestha — Technology, Design & Business'}
                      </h4>
                      <p className="text-[12px] text-[#71767b] line-clamp-2 leading-relaxed">
                        {form.siteDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. LINKEDIN PREVIEW */}
                {previewCardType === 'linkedin' && (
                  <div className="bg-[#1b1f23] border border-[#2d3238] rounded-md overflow-hidden text-left font-sans shadow-md">
                    {/* Banner */}
                    <div className="aspect-[1.91/1] w-full bg-[#282d34] overflow-hidden">
                      {form.defaultOgImageUrl ? (
                        <img
                          src={form.defaultOgImageUrl}
                          alt="LinkedIn OG Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8c929c] text-xs font-mono">
                          No OG Image Selected
                        </div>
                      )}
                    </div>

                    {/* Meta Body */}
                    <div className="p-3 bg-[#1e2329] border-t border-[#2d3238] space-y-1">
                      <h4 className="text-[13px] font-bold text-[#f3f6f8] line-clamp-1">
                        {form.defaultSeoTitle || 'Gunjan Shrestha — Technology, Design & Business'}
                      </h4>
                      <span className="text-[11px] text-[#959aa2] block truncate">
                        {(form.canonicalUrl || 'gunjan.dev').replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Real-time Draft & Save Status Note */}
                <div className="pt-4 border-t border-[#212121] space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#969696]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c6a87d]" />
                    <span className="font-bold text-[#F5F5F5] uppercase text-[11px] tracking-wider">
                      Draft Simulator Preview
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666] leading-relaxed">
                    The simulator shows how your metadata looks in Google and social cards as you type. Changes apply to the public website when you click <span className="text-[#c6a87d]">"Save Meta Title & Snippet Config"</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SOCIAL LINKS & QR GENERATOR SUITE */}
      {/* ======================================================== */}
      {activeTab === 'social-qr' && (
        <div className="space-y-8">
          {/* Top Banner */}
          <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#c6a87d]" />
                <span>Social & Professional Distribution Network</span>
              </h3>
              <p className="text-xs font-mono text-[#969696] mt-1">
                Manage your LinkedIn, GitHub, social links, and generate high-resolution QR codes for print, presentations, and digital business cards.
              </p>
            </div>

            <button
              onClick={handleOpenAddSocial}
              className="px-4 py-2 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold uppercase rounded-sm flex items-center gap-2 transition-colors self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Social Links CRUD (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
                <h4 className="text-xs font-mono font-bold text-[#F5F5F5] uppercase tracking-wider border-b border-[#212121] pb-3">
                  Configured Social Links ({socialLinks.length})
                </h4>

                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-4 bg-[#080808] border border-[#262626] rounded-sm flex items-center justify-between gap-4 hover:border-[#383838] transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F5F5F5] uppercase">
                            {link.label}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#171717] text-[#c6a87d] border border-[#262626] rounded-xs">
                            {link.platform}
                          </span>
                          {link.published ? (
                            <span className="text-[10px] font-mono text-emerald-400">Published</span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#666666]">Draft</span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-[#808080] truncate">
                          {link.url}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Select in QR studio */}
                        <button
                          onClick={() => setQrSelectedTarget(link.id)}
                          className={`p-2 text-xs font-mono rounded-sm transition-colors ${
                            qrSelectedTarget === link.id
                              ? 'bg-[#c6a87d] text-[#080808]'
                              : 'bg-[#171717] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
                          }`}
                          title="Generate QR code for this link"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditSocial(link)}
                          className="p-2 bg-[#171717] hover:bg-[#212121] border border-[#262626] text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
                          title="Edit social link"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteSocialLink(link.id)}
                          className="p-2 bg-[#171717] hover:bg-rose-950/40 border border-[#262626] hover:border-rose-800 text-[#969696] hover:text-rose-400 rounded-sm transition-colors"
                          title="Delete social link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {socialLinks.length === 0 && (
                    <div className="text-center py-8 text-xs font-mono text-[#666666]">
                      No social links added yet. Click &quot;Add Social Profile&quot; to begin.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Dedicated QR Code Generation Studio (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-5 sticky top-6">
                <div className="flex items-center justify-between border-b border-[#212121] pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#c6a87d]" />
                    <h4 className="text-xs font-mono font-bold text-[#F5F5F5] uppercase tracking-wider">
                      QR Code Generator Studio
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#c6a87d]">High-Res 1024px</span>
                </div>

                {/* Target Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-[#808080] uppercase mb-1.5">
                    Select Distribution Target
                  </label>
                  <select
                    value={qrSelectedTarget}
                    onChange={(e) => setQrSelectedTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                  >
                    <option value="portfolio">Main Portfolio URL ({form.canonicalUrl || 'https://gunjan.dev'})</option>
                    <option value="vcard">Digital Contact Card (.VCF Address Book)</option>
                    {socialLinks.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.platform})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style Selector */}
                <div className="flex items-center justify-between bg-[#080808] border border-[#262626] p-1 rounded-sm text-xs font-mono">
                  <button
                    onClick={() => setQrTheme('gold')}
                    className={`flex-1 py-1.5 text-center rounded-xs transition-colors ${
                      qrTheme === 'gold' ? 'bg-[#c6a87d] text-[#080808] font-bold' : 'text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    Signature Gold
                  </button>
                  <button
                    onClick={() => setQrTheme('classic')}
                    className={`flex-1 py-1.5 text-center rounded-xs transition-colors ${
                      qrTheme === 'classic' ? 'bg-[#F5F5F5] text-[#080808] font-bold' : 'text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    Monochrome
                  </button>
                  <button
                    onClick={() => setQrTheme('whiteOnDark')}
                    className={`flex-1 py-1.5 text-center rounded-xs transition-colors ${
                      qrTheme === 'whiteOnDark' ? 'bg-[#262626] text-[#F5F5F5] font-bold' : 'text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    Dark Slate
                  </button>
                </div>

                {/* QR Preview Canvas Display */}
                <div className="p-5 bg-[#080808] border border-[#262626] rounded-sm flex flex-col items-center justify-center space-y-3">
                  {isGeneratingQr ? (
                    <div className="w-52 h-52 flex flex-col items-center justify-center text-[#969696] text-xs font-mono gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#c6a87d]" />
                      <span>Generating QR Code...</span>
                    </div>
                  ) : qrPreviewUrl ? (
                    <img
                      src={qrPreviewUrl}
                      alt="Generated QR Code"
                      className="w-52 h-52 object-contain rounded-xs"
                    />
                  ) : null}

                  <div className="text-center">
                    <span className="text-[11px] font-mono text-[#808080] max-w-[260px] truncate block">
                      Target: {qrSelectedTarget === 'vcard' ? 'Phone Contact Card (vCard)' : qrTargetValue}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => downloadDataUrl(qrPreviewUrl, `gunjan-shrestha-qr-${qrSelectedTarget}.png`)}
                    className="px-3 py-2.5 bg-[#c6a87d] hover:bg-[#d5b88d] text-[#080808] text-xs font-mono font-bold uppercase rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG</span>
                  </button>

                  <button
                    onClick={() => handleCopyText(qrTargetValue, 'qr-val')}
                    className="px-3 py-2.5 bg-[#171717] hover:bg-[#212121] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'qr-val' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'qr-val' ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. GLOBAL BRANDING & IDENTITY */}
      {/* ======================================================== */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveSettings} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-6 max-w-4xl">
          <div className="border-b border-[#212121] pb-3">
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Visual Identity & Global Brand Controls
            </h3>
            <p className="text-xs font-mono text-[#969696] mt-1">
              Universal brand typography, header/footer signature marks, and site status.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#969696] mb-1">
              Global Brand & Site Name
            </label>
            <input
              type="text"
              required
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          <ImageUploadField
            label="Personal Brand Logo Mark (Showcased at Header and Footer)"
            value={form.logoUrl}
            onChange={(val) => setForm({ ...form, logoUrl: val })}
            aspectRatio="square"
            previewLabel="Header & Footer Logo Preview"
            helperText="Upload your custom signature or vector/raster logo to be rendered in the top header and footer."
          />

          <div className="pt-4 border-t border-[#1c1c1c]">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-[#F5F5F5]">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="accent-[#c6a87d] w-4 h-4"
              />
              <div>
                <span className="font-bold uppercase">Maintenance Mode</span>
                <p className="text-[11px] text-[#666666]">
                  When enabled, public visitors see a minimal maintenance notice while admin login remains accessible.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#262626]">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#d5b88d] transition-colors"
            >
              Save Branding Settings
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SOCIAL LINK */}
      {/* ======================================================== */}
      {isSocialModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsSocialModalOpen(false)}
        >
          <form
            onSubmit={handleSaveSocial}
            className="bg-[#111111] border border-[#262626] rounded-sm w-full max-w-md p-6 space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#212121] pb-3">
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase">
                {editingSocialId ? 'Edit Social Profile' : 'Add Social Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSocialModalOpen(false)}
                className="p-1 text-[#969696] hover:text-[#F5F5F5]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">
                Platform
              </label>
              <select
                value={socialForm.platform}
                onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value, label: socialForm.label || e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="GitHub">GitHub</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Email">Email (mailto:)</option>
                <option value="Website">Custom Website</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">
                Display Label
              </label>
              <input
                type="text"
                required
                value={socialForm.label}
                onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                placeholder="e.g. LinkedIn"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#969696] mb-1">
                Full Profile URL
              </label>
              <input
                type="url"
                required
                value={socialForm.url}
                onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                placeholder="https://..."
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#F5F5F5]">
                <input
                  type="checkbox"
                  checked={socialForm.published}
                  onChange={(e) => setSocialForm({ ...socialForm, published: e.target.checked })}
                  className="accent-[#c6a87d] w-4 h-4"
                />
                <span>Published across public site & QR matrix</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#212121]">
              <button
                type="button"
                onClick={() => setIsSocialModalOpen(false)}
                className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c6a87d] text-[#080808] text-xs font-mono font-bold uppercase rounded-sm hover:bg-[#d5b88d]"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
