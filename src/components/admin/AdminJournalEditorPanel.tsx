import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost, BlogPostStatus } from '../../types';
import { ImageUploadField } from '../ui/ImageUploadField';
import { X, Check, ArrowLeft, BookOpen, Clock, FileText, Sparkles } from 'lucide-react';

interface JournalEditorProps {
  postId?: string | null;
  isOpen: boolean;
  onClose: (savedAsDraft?: boolean) => void;
}

export const AdminJournalEditorPanel: React.FC<JournalEditorProps> = ({
  postId,
  isOpen,
  onClose
}) => {
  const { blogPosts, contentCategories, addBlogPost, updateBlogPost, setAdminActiveTab } = useData();

  const existingPost = useMemo(() => {
    return postId ? blogPosts.find(b => b.id === postId) : null;
  }, [postId, blogPosts]);

  // Filter ONLY Journal categories
  const journalCategories = useMemo(() => {
    return contentCategories.filter(c => c.type === 'JOURNAL');
  }, [contentCategories]);

  // Form state
  const [form, setForm] = useState<{
    title: string;
    excerpt: string;
    coverImageUrl: string;
    content: string;
    category: string;
    tags: string;
    status: BlogPostStatus;
    featured: boolean;
  }>({
    title: '',
    excerpt: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
    content: `Write your thoughts here in Markdown...\n\n### Architectural Synthesis\n\nExplain your design principles and execution philosophy in detail.`,
    category: '',
    tags: 'Architecture, Systems, Operations',
    status: 'PUBLISHED',
    featured: false,
  });

  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title || '',
        excerpt: existingPost.excerpt || '',
        coverImageUrl: existingPost.coverImageUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
        content: existingPost.content || '',
        category: existingPost.category || (journalCategories[0]?.name || 'Systems & Engineering'),
        tags: existingPost.tags?.join(', ') || '',
        status: existingPost.status || 'PUBLISHED',
        featured: existingPost.featured || false,
      });
    } else {
      setForm({
        title: '',
        excerpt: '',
        coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
        content: `### Foundational Philosophy\n\nDescribe the structural methodology and real-world system patterns observed in practice.\n\n- Key Lesson 1: Keep state explicit and atomic.\n- Key Lesson 2: Prioritize operational ergonomics.\n- Key Lesson 3: Maintain single sources of truth.`,
        category: journalCategories[0]?.name || 'Systems & Engineering',
        tags: 'Systems, Nepal, Operations',
        status: 'PUBLISHED',
        featured: false,
      });
    }
    isDirtyRef.current = false;
  }, [existingPost, isOpen, journalCategories]);

  if (!isOpen) return null;

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'journal-entry-' + Date.now();
  };

  // Auto-compute reading time from content
  const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleFieldChange = (field: string, value: any) => {
    isDirtyRef.current = true;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isDirtyRef.current && form.title.trim()) {
        saveAsDraft();
        onClose(true);
      } else {
        onClose(false);
      }
    }
  };

  const saveAsDraft = () => {
    const slug = generateSlug(form.title || 'Untitled Journal Draft');
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const readingTime = calculateReadingTime(form.content);

    if (existingPost) {
      updateBlogPost(existingPost.id, {
        ...form,
        slug: existingPost.slug || slug,
        tags: tagsArray,
        readingTime,
        status: 'DRAFT',
      });
    } else if (form.title.trim()) {
      addBlogPost({
        ...form,
        title: form.title || 'Untitled Journal Draft',
        slug,
        tags: tagsArray,
        readingTime,
        status: 'DRAFT',
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please provide a Journal Entry Title.');
      return;
    }

    const slug = generateSlug(form.title);
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const readingTime = calculateReadingTime(form.content);

    if (existingPost) {
      updateBlogPost(existingPost.id, {
        ...form,
        slug: existingPost.slug || slug,
        tags: tagsArray,
        readingTime,
        publishedAt: form.status === 'PUBLISHED' ? (existingPost.publishedAt || new Date().toISOString()) : undefined,
      });
    } else {
      addBlogPost({
        ...form,
        slug,
        tags: tagsArray,
        readingTime,
        publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      });
    }

    isDirtyRef.current = false;
    onClose(false);
  };

  const computedReadingTime = calculateReadingTime(form.content);

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in"
    >
      <div 
        className="w-full max-w-4xl bg-[#0c0c0c] border-l border-[#262626] h-full overflow-y-auto flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
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
                  Journal & Essay Editor
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#171717] text-[#666666] font-mono rounded">
                  ~{computedReadingTime} min read (auto-calculated)
                </span>
              </div>
              <h2 className="text-base font-bold text-[#F5F5F5] uppercase tracking-tight truncate max-w-md">
                {form.title ? form.title : (existingPost ? 'Edit Journal Entry' : 'Create New Journal Entry')}
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
              onClick={handleSave}
              className="px-5 py-1.5 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{form.status === 'PUBLISHED' ? 'Publish Article' : 'Save Article'}</span>
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-mono text-[#969696]">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Why I Prefer Building Systems Over Disposable Interfaces"
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-sm text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
              <p className="text-[11px] font-mono text-[#666666]">
                Auto-generated URL identifier: <span className="text-[#c6a87d]">/{generateSlug(form.title)}</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-[#969696]">
                  Journal Category <span className="text-red-400">*</span>
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
                {(form.category === 'Unassigned' || (!journalCategories.some(c => c.name === form.category) && form.category)) && (
                  <option value={form.category} className="text-amber-400">
                    ⚠️ {form.category} (Select category below to reassign)
                  </option>
                )}
                {journalCategories.length > 0 ? (
                  journalCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Systems & Engineering">Systems & Engineering</option>
                    <option value="Operational Strategy">Operational Strategy</option>
                    <option value="Philosophy & Design">Philosophy & Design</option>
                  </>
                )}
              </select>
              <p className="text-[10px] font-mono text-[#666666]">
                Strictly displaying categories configured for Journal Entries.
              </p>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <ImageUploadField
              label="Article Cover Header Image"
              value={form.coverImageUrl}
              onChange={(val) => handleFieldChange('coverImageUrl', val)}
              aspectRatio="video"
              previewLabel="Journal Cover Preview"
              helperText="Upload an editorial photograph, conceptual architectural render, or banner."
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#969696]">
              Article Short Excerpt (Preview Synopsis) <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={form.excerpt}
              onChange={(e) => handleFieldChange('excerpt', e.target.value)}
              placeholder="A reflective essay examining why durable operational pipelines outlast transient trend cycles..."
              className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          {/* Spacious Markdown Body Content Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-[#F5F5F5] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c6a87d]" />
                <span>Markdown Body Content</span>
              </label>
              <span className="text-[11px] font-mono text-[#969696]">
                ~{computedReadingTime} min read • {form.content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            
            <textarea
              rows={16}
              required
              value={form.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              placeholder="Write your article in Markdown syntax (headings, bold, lists, quotes, code blocks)..."
              className="w-full p-4 bg-[#080808] border border-[#262626] text-xs font-mono leading-relaxed text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
            />
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1c1c1c]">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#969696]">
                Thematic Tags (Comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleFieldChange('tags', e.target.value)}
                placeholder="Systems, Architecture, Nepal, Strategy"
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#969696]">
                Publication State
              </label>
              <select
                value={form.status}
                onChange={(e) => handleFieldChange('status', e.target.value as BlogPostStatus)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
              >
                <option value="PUBLISHED">PUBLISHED (Publicly visible on Journal feed)</option>
                <option value="DRAFT">DRAFT (Hidden from public site)</option>
                <option value="ARCHIVED">ARCHIVED (Archived internal record)</option>
              </select>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm">
            <label className="flex items-center gap-2.5 text-xs font-mono text-[#F5F5F5] cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleFieldChange('featured', e.target.checked)}
                className="accent-[#c6a87d] w-4 h-4 rounded"
              />
              <span>Feature as Spotlight Article on Homepage</span>
            </label>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-[#0e0e0e]/95 backdrop-blur border-t border-[#262626] px-6 py-4 flex items-center justify-between">
          <p className="text-[11px] font-mono text-[#666666]">
            Clicking outside or canceling auto-saves this article to your Drafts.
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
              onClick={handleSave}
              className="px-6 py-2 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
            >
              {existingPost ? 'Update Article' : 'Save & Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
