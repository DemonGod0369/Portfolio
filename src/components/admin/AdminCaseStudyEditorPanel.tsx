import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { ImageUploadField } from '../ui/ImageUploadField';
import { X, Check, Save, ExternalLink, ArrowLeft, Eye, HelpCircle, Globe } from 'lucide-react';

interface CaseStudyEditorProps {
  projectId?: string | null;
  isOpen: boolean;
  onClose: (savedAsDraft?: boolean) => void;
}

export const AdminCaseStudyEditorPanel: React.FC<CaseStudyEditorProps> = ({
  projectId,
  isOpen,
  onClose
}) => {
  const { projects, contentCategories, addProject, updateProject, setAdminActiveTab } = useData();

  // Find existing project or default state
  const existingProject = useMemo(() => {
    return projectId ? projects.find(p => p.id === projectId) : null;
  }, [projectId, projects]);

  // Filter ONLY case study categories
  const caseStudyCategories = useMemo(() => {
    return contentCategories.filter(c => c.type === 'CASE_STUDY');
  }, [contentCategories]);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: '',
    shortSummary: '',
    overview: '',
    problem: '',
    approach: '',
    design: '',
    technology: '',
    result: '',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    liveUrl: '',
    githubUrl: '',
    seoTitle: '',
    seoDescription: '',
    featured: true,
    published: true,
    displayOrder: projects.length + 1,
  });

  // Track if user modified something to auto-save draft
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (existingProject) {
      setForm({
        title: existingProject.title || '',
        category: existingProject.category || (caseStudyCategories[0]?.name || 'Software & Systems'),
        shortSummary: existingProject.shortSummary || '',
        overview: existingProject.overview || '',
        problem: existingProject.problem || '',
        approach: existingProject.approach || '',
        design: existingProject.design || '',
        technology: existingProject.technology || '',
        result: existingProject.result || '',
        heroImage: existingProject.heroImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
        liveUrl: existingProject.liveUrl || '',
        githubUrl: existingProject.githubUrl || '',
        seoTitle: existingProject.seoTitle || '',
        seoDescription: existingProject.seoDescription || '',
        featured: existingProject.featured ?? true,
        published: existingProject.published ?? true,
        displayOrder: existingProject.displayOrder || projects.length + 1,
      });
    } else {
      setForm({
        title: '',
        category: caseStudyCategories[0]?.name || 'Software & Business Solutions',
        shortSummary: '',
        overview: '',
        problem: '',
        approach: '',
        design: '',
        technology: '',
        result: '',
        heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
        liveUrl: '',
        githubUrl: '',
        seoTitle: '',
        seoDescription: '',
        featured: true,
        published: true,
        displayOrder: projects.length + 1,
      });
    }
    isDirtyRef.current = false;
  }, [existingProject, isOpen, caseStudyCategories, projects.length]);

  if (!isOpen) return null;

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'case-study-' + Date.now();
  };

  const handleFieldChange = (field: string, value: any) => {
    isDirtyRef.current = true;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Close with draft save if user made edits
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isDirtyRef.current && form.title.trim()) {
        // Save as draft
        saveAsDraft();
        onClose(true);
      } else {
        onClose(false);
      }
    }
  };

  const saveAsDraft = () => {
    const slug = generateSlug(form.title || 'Untitled Draft Case Study');
    if (existingProject) {
      updateProject(existingProject.id, {
        ...form,
        slug: existingProject.slug || slug,
        published: false,
      });
    } else if (form.title.trim()) {
      addProject({
        ...form,
        title: form.title || 'Draft Case Study',
        slug,
        published: false,
        images: [],
      });
    }
  };

  const handleSavePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please provide a Case Study Title.');
      return;
    }

    const slug = generateSlug(form.title);
    if (existingProject) {
      updateProject(existingProject.id, {
        ...form,
        slug: existingProject.slug || slug,
      });
    } else {
      addProject({
        ...form,
        slug,
        images: [],
      });
    }

    isDirtyRef.current = false;
    onClose(false);
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in"
    >
      <div 
        className="w-full max-w-4xl bg-[#0c0c0c] border-l border-[#262626] h-full overflow-y-auto flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#0e0e0e]/95 backdrop-blur border-b border-[#262626] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (isDirtyRef.current && form.title.trim()) {
                  saveAsDraft();
                  onClose(true);
                } else {
                  onClose(false);
                }
              }}
              className="p-1.5 bg-[#171717] hover:bg-[#222222] text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
              title="Return and save draft"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c6a87d]">
                  Case Study Editor
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#171717] text-[#666666] font-mono rounded">
                  Slug auto-generated
                </span>
              </div>
              <h2 className="text-base font-bold text-[#F5F5F5] uppercase tracking-tight truncate max-w-md">
                {form.title ? form.title : (existingProject ? 'Edit Case Study' : 'Create New Case Study')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (form.title.trim()) {
                  saveAsDraft();
                  onClose(true);
                } else {
                  onClose(false);
                }
              }}
              className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={handleSavePublish}
              className="px-5 py-1.5 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{form.published ? 'Publish Case Study' : 'Save Case Study'}</span>
            </button>

            <button
              type="button"
              onClick={() => onClose(false)}
              className="p-1.5 text-[#666666] hover:text-[#F5F5F5] rounded-sm transition-colors ml-2"
              title="Close without saving"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Form Body */}
        <form onSubmit={handleSavePublish} className="p-6 md:p-8 space-y-8 flex-1">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-mono text-[#969696]">
                Case Study Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Enterprise Bullion Vault Engine"
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-sm text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
              <p className="text-[11px] font-mono text-[#666666]">
                Auto-generated URL identifier: <span className="text-[#c6a87d]">/{generateSlug(form.title)}</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-[#969696]">
                  Case Study Category <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onClose(false);
                    setAdminActiveTab('seo-settings');
                  }}
                  className="text-[10px] font-mono text-[#c6a87d] hover:underline"
                >
                  Manage in Settings &rarr;
                </button>
              </div>

              <select
                required
                value={form.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              >
                {(form.category === 'Unassigned' || (!caseStudyCategories.some(c => c.name === form.category) && form.category)) && (
                  <option value={form.category} className="text-amber-400">
                    ⚠️ {form.category} (Select category below to reassign)
                  </option>
                )}
                {caseStudyCategories.length > 0 ? (
                  caseStudyCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Software & Systems">Software & Systems</option>
                    <option value="Enterprise Architecture">Enterprise Architecture</option>
                    <option value="Operations & Strategy">Operations & Strategy</option>
                  </>
                )}
              </select>
              <p className="text-[10px] font-mono text-[#666666]">
                Strictly displaying categories configured for Case Studies.
              </p>
            </div>
          </div>

          {/* Hero Cover Image */}
          <div className="space-y-2">
            <ImageUploadField
              label="Primary Hero & Case Study Cover Image"
              value={form.heroImage}
              onChange={(val) => handleFieldChange('heroImage', val)}
              aspectRatio="video"
              previewLabel="Case Study Hero Preview"
              helperText="Upload a high-resolution cover photo, architectural schematic, or UI banner."
            />
          </div>

          {/* Short Summary */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#969696]">
              Executive Summary (Appears on Portfolio cards) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.shortSummary}
              onChange={(e) => handleFieldChange('shortSummary', e.target.value)}
              placeholder="High-frequency bullion ledger engineered for high-concurrency valuation and inventory controls."
              className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          {/* Spacious Detailed Narrative Blocks */}
          <div className="space-y-6 pt-4 border-t border-[#1c1c1c]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#c6a87d]">
                Architectural Breakdown & Case Narrative
              </h3>
              <span className="text-[10px] font-mono text-[#666666]">
                Spacious editorial containers
              </span>
            </div>

            {/* 01. Overview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#F5F5F5]">
                  01 / System Overview & Background
                </label>
                <span className="text-[10px] font-mono text-[#666666]">High-level institutional landscape</span>
              </div>
              <textarea
                rows={6}
                value={form.overview}
                onChange={(e) => handleFieldChange('overview', e.target.value)}
                placeholder="Detail the institutional ecosystem, organizational motivations, initial operational audit, and core stakeholder requirements..."
                className="w-full p-4 bg-[#080808] border border-[#262626] text-xs leading-relaxed text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            {/* 02. Problem */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#F5F5F5]">
                  02 / The Challenge & Problem Space
                </label>
                <span className="text-[10px] font-mono text-[#666666]">Bottlenecks, legacy fragilities, data fragmentation</span>
              </div>
              <textarea
                rows={6}
                value={form.problem}
                onChange={(e) => handleFieldChange('problem', e.target.value)}
                placeholder="Describe legacy manual bottlenecks, double-entry discrepancies, currency volatility risks, or architectural ceilings..."
                className="w-full p-4 bg-[#080808] border border-[#262626] text-xs leading-relaxed text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            {/* 03. Approach */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#F5F5F5]">
                  03 / Architectural Approach & Engineering Strategy
                </label>
                <span className="text-[10px] font-mono text-[#666666]">Frameworks, state pipelines, database design</span>
              </div>
              <textarea
                rows={6}
                value={form.approach}
                onChange={(e) => handleFieldChange('approach', e.target.value)}
                placeholder="Walk through the technical methodology: ACID compliance, transactional verification routines, atomic state mutations, and UI/UX ergonomic workflows..."
                className="w-full p-4 bg-[#080808] border border-[#262626] text-xs leading-relaxed text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            {/* 04. Result & Impact */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-[#F5F5F5]">
                  04 / Tangible Results, Business Impact & Metrics
                </label>
                <span className="text-[10px] font-mono text-[#666666]">Quantitative and qualitative outcomes</span>
              </div>
              <textarea
                rows={6}
                value={form.result}
                onChange={(e) => handleFieldChange('result', e.target.value)}
                placeholder="Highlight 99.9% reconciliation precision, $0 reporting latency, accelerated inventory turnarounds, and long-term organizational stability..."
                className="w-full p-4 bg-[#080808] border border-[#262626] text-xs leading-relaxed text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          {/* Links & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1c1c1c]">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#969696]">
                Technology Stack / Tags (Comma separated)
              </label>
              <input
                type="text"
                value={form.technology}
                onChange={(e) => handleFieldChange('technology', e.target.value)}
                placeholder="TypeScript, React, PostgreSQL, Tailwind, Node.js"
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#969696]">
                Live Product URL (Optional)
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => handleFieldChange('liveUrl', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>
          </div>

          {/* SEO & Search Optimization (Optional overrides) */}
          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#c6a87d]" />
                <span className="text-xs font-mono font-bold text-[#F5F5F5] uppercase">
                  SEO & Social Sharing Metadata (Optional)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#666666]">
                Leave empty to automatically derive from title & summary
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-[#969696]">Custom Meta Title</label>
                  <span className="text-[10px] font-mono text-[#666666]">{form.seoTitle.length}/60 chars</span>
                </div>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                  placeholder={`${form.title || 'Case Study Title'} | Gunjan Shrestha`}
                  className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-[#969696]">Custom Meta Description</label>
                  <span className="text-[10px] font-mono text-[#666666]">{form.seoDescription.length}/160 chars</span>
                </div>
                <textarea
                  rows={2}
                  value={form.seoDescription}
                  onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                  placeholder={form.shortSummary || 'Comprehensive architectural breakdown, technical implementation details, and impact metrics...'}
                  className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-[#111111] border border-[#262626] rounded-sm">
            <label className="flex items-center gap-2.5 text-xs font-mono text-[#F5F5F5] cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleFieldChange('featured', e.target.checked)}
                className="accent-[#c6a87d] w-4 h-4 rounded"
              />
              <span>Feature on Public Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-mono text-[#F5F5F5] cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => handleFieldChange('published', e.target.checked)}
                className="accent-[#c6a87d] w-4 h-4 rounded"
              />
              <span>Published (Immediately Visible to Public)</span>
            </label>
          </div>
        </form>

        {/* Bottom Bar */}
        <div className="sticky bottom-0 bg-[#0e0e0e]/95 backdrop-blur border-t border-[#262626] px-6 py-4 flex items-center justify-between">
          <p className="text-[11px] font-mono text-[#666666]">
            Clicking outside or canceling preserves this record in draft mode.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (isDirtyRef.current && form.title.trim()) {
                  saveAsDraft();
                  onClose(true);
                } else {
                  onClose(false);
                }
              }}
              className="px-4 py-2 bg-[#171717] hover:bg-[#222222] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePublish}
              className="px-6 py-2 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
            >
              {existingProject ? 'Update Case Study' : 'Save & Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
