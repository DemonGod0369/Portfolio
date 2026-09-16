import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Project, 
  BlogPost, 
  BlogPostStatus, 
  ContentCategory 
} from '../../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Layers, 
  FileText, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ExternalLink,
  Tag,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { AdminCaseStudyEditorPanel } from './AdminCaseStudyEditorPanel';
import { AdminJournalEditorPanel } from './AdminJournalEditorPanel';

type SubTab = 'unified' | 'case-studies' | 'journal';
type ContentTypeFilter = 'ALL' | 'CASE_STUDY' | 'JOURNAL';

export const AdminCaseStudiesAndJournalManager: React.FC<{ initialSubTab?: SubTab }> = ({ 
  initialSubTab = 'unified' 
}) => {
  const { 
    projects, 
    blogPosts, 
    contentCategories, 
    updateProject, 
    deleteProject, 
    updateBlogPost, 
    deleteBlogPost,
    setCurrentRoute,
    setSelectedProjectSlug,
    setSelectedBlogSlug,
    setAdminActiveTab,
    openConfirmModal,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>(initialSubTab);
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'FEATURED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dedicated Editor Panel Drawer states
  const [caseStudyDrawer, setCaseStudyDrawer] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const [journalDrawer, setJournalDrawer] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const [draftToast, setDraftToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setDraftToast(msg);
    setTimeout(() => setDraftToast(null), 3500);
  };

  // Unified items list
  const unifiedItems = useMemo(() => {
    const pItems = projects.map(p => ({
      id: p.id,
      type: 'CASE_STUDY' as const,
      title: p.title,
      slug: p.slug,
      category: p.category || 'Unassigned',
      summary: p.shortSummary || p.overview || '',
      heroImage: p.heroImage,
      featured: !!p.featured,
      published: !!p.published,
      date: p.createdAt || '2025-01-01',
      tags: p.technology ? p.technology.split(',').map(s => s.trim()).filter(Boolean) : [],
      raw: p,
    }));

    const bItems = blogPosts.map(b => ({
      id: b.id,
      type: 'JOURNAL' as const,
      title: b.title,
      slug: b.slug,
      category: b.category || 'Unassigned',
      summary: b.excerpt || b.content.slice(0, 160) + '...',
      heroImage: b.coverImageUrl,
      featured: !!b.featured,
      published: b.status === 'PUBLISHED',
      date: b.publishedAt || b.createdAt || '2025-01-01',
      readingTime: b.readingTime || 5,
      tags: b.tags || [],
      raw: b,
    }));

    return [...pItems, ...bItems];
  }, [projects, blogPosts]);

  // Categories list for filter
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    unifiedItems.forEach(i => {
      if (i.category) set.add(i.category.trim());
    });
    contentCategories.forEach(c => {
      if (c.name) set.add(c.name.trim());
    });
    return ['ALL', ...Array.from(set)];
  }, [unifiedItems, contentCategories]);

  // Filtered Unified Stream
  const filteredUnifiedItems = useMemo(() => {
    return unifiedItems.filter(item => {
      if (contentTypeFilter === 'CASE_STUDY' && item.type !== 'CASE_STUDY') return false;
      if (contentTypeFilter === 'JOURNAL' && item.type !== 'JOURNAL') return false;

      if (categoryFilter !== 'ALL' && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      if (statusFilter === 'PUBLISHED' && !item.published) return false;
      if (statusFilter === 'DRAFT' && item.published) return false;
      if (statusFilter === 'FEATURED' && !item.featured) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedItems, contentTypeFilter, categoryFilter, statusFilter, searchQuery]);

  const handleTogglePublished = (item: typeof unifiedItems[0]) => {
    if (item.type === 'CASE_STUDY') {
      updateProject(item.id, { published: !item.published });
    } else {
      updateBlogPost(item.id, { 
        status: item.published ? 'DRAFT' : 'PUBLISHED',
        publishedAt: !item.published ? new Date().toISOString() : undefined 
      });
    }
  };

  const handleToggleFeatured = (item: typeof unifiedItems[0]) => {
    if (item.type === 'CASE_STUDY') {
      updateProject(item.id, { featured: !item.featured });
    } else {
      updateBlogPost(item.id, { featured: !item.featured });
    }
  };

  const handleViewLive = (item: typeof unifiedItems[0]) => {
    if (item.type === 'CASE_STUDY') {
      setSelectedProjectSlug(item.slug);
      setCurrentRoute('work-detail');
    } else {
      setSelectedBlogSlug(item.slug);
      setCurrentRoute('blog-detail');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Toast feedback for draft autosave */}
      {draftToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] border border-[#c6a87d] text-xs font-mono text-[#F5F5F5] rounded-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#c6a87d]" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* Header Banner - Top right buttons removed per requirement #1 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c6a87d]">
            <Layers className="w-4 h-4 text-[#c6a87d]" />
            <span>Integrated Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] uppercase mt-1">
            Case Studies & Journal CMS
          </h1>
          <p className="text-xs font-mono text-[#969696] mt-1">
            Manage operational case studies, technical system architectures, reflective writings, and domain categories.
          </p>
        </div>

        {/* Global Public Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('work')}
            className="px-3 py-2 bg-[#111111] hover:bg-[#171717] border border-[#262626] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#c6a87d]" />
            <span>View Public Archive</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs with Dedicated New Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('unified')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'unified'
                ? 'bg-[#c6a87d] text-[#080808] font-bold shadow-sm'
                : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unified Archive Stream</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              activeSubTab === 'unified' ? 'bg-black/20 text-[#080808]' : 'bg-[#171717] text-[#c6a87d]'
            }`}>
              {unifiedItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('case-studies')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'case-studies'
                ? 'bg-[#c6a87d] text-[#080808] font-bold shadow-sm'
                : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Case Studies</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              activeSubTab === 'case-studies' ? 'bg-black/20 text-[#080808]' : 'bg-[#171717] text-[#c6a87d]'
            }`}>
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('journal')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'journal'
                ? 'bg-[#c6a87d] text-[#080808] font-bold shadow-sm'
                : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Journal & Essays</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              activeSubTab === 'journal' ? 'bg-black/20 text-[#080808]' : 'bg-[#171717] text-[#c6a87d]'
            }`}>
              {blogPosts.length}
            </span>
          </button>
        </div>

        {/* Action Button depending on view */}
        <div>
          {activeSubTab === 'case-studies' && (
            <button
              onClick={() => setCaseStudyDrawer({ isOpen: true, id: null })}
              className="px-4 py-2 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Case Study</span>
            </button>
          )}

          {activeSubTab === 'journal' && (
            <button
              onClick={() => setJournalDrawer({ isOpen: true, id: null })}
              className="px-4 py-2 bg-[#c6a87d] hover:bg-[#b5956a] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Journal Entry</span>
            </button>
          )}

          {activeSubTab === 'unified' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCaseStudyDrawer({ isOpen: true, id: null })}
                className="px-3 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#c6a87d]" />
                <span>+ Case Study</span>
              </button>
              <button
                onClick={() => setJournalDrawer({ isOpen: true, id: null })}
                className="px-3 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#c6a87d]" />
                <span>+ Journal Entry</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO SUB-TAB */}
      {activeSubTab === 'case-studies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4 hover:border-[#c6a87d]/50 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${
                          proj.category === 'Unassigned' ? 'text-amber-400 font-bold' : 'text-[#c6a87d]'
                        }`}>
                          {proj.category || 'Unassigned'}
                        </span>
                        {proj.category === 'Unassigned' && (
                          <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono rounded">
                            ⚠️ Unassigned Category
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#F5F5F5]">{proj.title}</h3>
                    </div>
                    <button
                      onClick={() => updateProject(proj.id, { published: !proj.published })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        proj.published
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {proj.published ? 'Published' : 'Hidden'}
                    </button>
                  </div>

                  <p className="text-xs text-[#969696] line-clamp-3 leading-relaxed">
                    {proj.shortSummary || proj.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1c1c1c] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#666666]">
                    /{proj.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProjectSlug(proj.slug);
                        setCurrentRoute('work-detail');
                      }}
                      className="p-1.5 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded text-xs"
                      title="View live"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCaseStudyDrawer({ isOpen: true, id: proj.id })}
                      className="px-3 py-1 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] text-xs font-mono rounded flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: 'Delete Case Study?',
                          message: `Are you sure you want to delete case study "${proj.title}"? This action cannot be undone.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => deleteProject(proj.id),
                        });
                      }}
                      className="p-1.5 bg-[#171717] hover:text-red-400 border border-[#262626] rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'journal' && (
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#262626] rounded-sm divide-y divide-[#1c1c1c]">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      post.status === 'PUBLISHED'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        : post.status === 'DRAFT'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {post.status}
                    </span>
                    {post.category === 'Unassigned' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                        ⚠️ Unassigned Category
                      </span>
                    ) : (
                      <span className="text-[#c6a87d]">{post.category}</span>
                    )}
                    <span className="text-[#666666]">• {post.readingTime}m read</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F5F5F5]">{post.title}</h3>
                  <p className="text-xs text-[#969696] line-clamp-1">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setSelectedBlogSlug(post.slug);
                      setCurrentRoute('blog-detail');
                    }}
                    className="p-2 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] rounded-sm"
                    title="View live"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setJournalDrawer({ isOpen: true, id: post.id })}
                    className="px-3 py-1.5 bg-[#171717] hover:text-[#c6a87d] border border-[#262626] text-xs font-mono rounded-sm flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: 'Delete Journal Post?',
                        message: `Are you sure you want to delete article "${post.title}"? This action cannot be undone.`,
                        confirmLabel: 'Delete',
                        destructive: true,
                        onConfirm: () => deleteBlogPost(post.id),
                      });
                    }}
                    className="p-2 bg-[#171717] hover:text-red-400 border border-[#262626] rounded-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'unified' && (
        <div className="space-y-6">
          {/* Filtering controls */}
          <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Search Bar */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, architecture records, tags..."
                  className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>

              {/* Content Type Filter */}
              <div>
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value as ContentTypeFilter)}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                >
                  <option value="ALL">All Types (All Formats)</option>
                  <option value="CASE_STUDY">Case Studies & Projects Only</option>
                  <option value="JOURNAL">Journal & Essays Only</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                >
                  <option value="ALL">All Categories</option>
                  {categoryOptions.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>
                      {c === 'Unassigned' ? '⚠️ Unassigned Category' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                >
                  <option value="ALL">All Publishing States</option>
                  <option value="PUBLISHED">Published Live</option>
                  <option value="DRAFT">Drafts / In Progress</option>
                  <option value="FEATURED">Featured Highlights</option>
                </select>
              </div>
            </div>
          </div>

          {/* Unified Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnifiedItems.map((item) => (
              <div 
                key={`${item.type}-${item.id}`}
                className="bg-[#111111] border border-[#262626] hover:border-[#c6a87d]/40 rounded-sm overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="aspect-[16/9] w-full bg-[#0a0a0a] relative overflow-hidden">
                    <img 
                      src={item.heroImage} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold shadow-md ${
                        item.type === 'CASE_STUDY'
                          ? 'bg-[#c6a87d] text-[#080808]'
                          : 'bg-[#00E5FF] text-[#080808]'
                      }`}>
                        {item.type === 'CASE_STUDY' ? 'Case Study' : 'Journal'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleTogglePublished(item)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase shadow-md ${
                          item.published 
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-700' 
                            : 'bg-zinc-900/90 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {item.published ? 'Live' : 'Draft'}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#969696]">
                      <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                        <span className={item.category === 'Unassigned' ? 'text-amber-400 font-bold' : 'text-[#c6a87d]'}>
                          {item.category}
                        </span>
                        {item.category === 'Unassigned' && (
                          <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono rounded shrink-0">
                            ⚠️ Needs Category
                          </span>
                        )}
                      </div>
                      <span>{item.date.slice(0, 10)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#c6a87d] transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#969696] line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#1c1c1c] flex items-center justify-between mt-3">
                  <button
                    onClick={() => handleViewLive(item)}
                    className="text-[11px] font-mono text-[#666666] hover:text-[#F5F5F5] flex items-center gap-1 transition-colors"
                  >
                    <span>View Public</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.type === 'CASE_STUDY') {
                          setCaseStudyDrawer({ isOpen: true, id: item.id });
                        } else {
                          setJournalDrawer({ isOpen: true, id: item.id });
                        }
                      }}
                      className="px-2.5 py-1 bg-[#171717] hover:bg-[#222222] text-xs font-mono text-[#c6a87d] rounded border border-[#262626] flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: `Delete ${item.type === 'CASE_STUDY' ? 'Case Study' : 'Journal Entry'}?`,
                          message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => {
                            if (item.type === 'CASE_STUDY') {
                              deleteProject(item.id);
                            } else {
                              deleteBlogPost(item.id);
                            }
                          },
                        });
                      }}
                      className="p-1 text-[#666666] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-Over Drawers for Editing/Creating */}
      <AdminCaseStudyEditorPanel
        isOpen={caseStudyDrawer.isOpen}
        projectId={caseStudyDrawer.id}
        onClose={(savedAsDraft) => {
          setCaseStudyDrawer({ isOpen: false, id: null });
          if (savedAsDraft) {
            triggerToast('Case study changes saved as Draft');
          }
        }}
      />

      <AdminJournalEditorPanel
        isOpen={journalDrawer.isOpen}
        postId={journalDrawer.id}
        onClose={(savedAsDraft) => {
          setJournalDrawer({ isOpen: false, id: null });
          if (savedAsDraft) {
            triggerToast('Journal entry saved to Drafts');
          }
        }}
      />
    </div>
  );
};
