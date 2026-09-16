import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Clock, 
  Search, 
  SlidersHorizontal, 
  FolderKanban, 
  FileText, 
  ArrowUpDown, 
  X,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { FeaturedCarousel } from './FeaturedCarousel';

type ContentTypeFilter = 'ALL' | 'CASE_STUDY' | 'JOURNAL';
type SortField = 'date' | 'title' | 'readingTime';
type SortOrder = 'desc' | 'asc';

export interface UnifiedItem {
  id: string;
  type: 'CASE_STUDY' | 'JOURNAL';
  title: string;
  slug: string;
  category: string;
  summary: string;
  heroImage?: string;
  featured: boolean;
  date: string;
  readingTime?: number;
  tags: string[];
  originalProject?: any;
  originalBlog?: any;
}

const ITEMS_PER_PAGE = 9;

export const CaseStudiesAndJournalView: React.FC = () => {
  const { projects, blogPosts, setCurrentRoute, setSelectedProjectSlug, setSelectedBlogSlug } = useData();
  const { isDark } = useTheme();

  // State filters
  const [contentType, setContentType] = useState<ContentTypeFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Normalize all published projects and blog posts into unified items
  const unifiedItems: UnifiedItem[] = useMemo(() => {
    const projectItems: UnifiedItem[] = projects
      .filter(p => p.published && p.category !== 'Unassigned')
      .map(p => {
        const extractedTags = p.technology 
          ? p.technology.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        return {
          id: `proj_${p.id}`,
          type: 'CASE_STUDY',
          title: p.title,
          slug: p.slug,
          category: p.category || 'Software & Business Solutions',
          summary: p.shortSummary || p.overview || '',
          heroImage: p.heroImage,
          featured: !!p.featured,
          date: p.createdAt || '2025-01-01',
          readingTime: 6, // Average case study reading length
          tags: extractedTags,
          originalProject: p,
        };
      });

    const blogItems: UnifiedItem[] = blogPosts
      .filter(b => b.status === 'PUBLISHED' && b.category !== 'Unassigned')
      .map(b => ({
        id: `blog_${b.id}`,
        type: 'JOURNAL',
        title: b.title,
        slug: b.slug,
        category: b.category || 'Technology & Systems',
        summary: b.excerpt || b.content.slice(0, 160) + '...',
        heroImage: b.coverImageUrl,
        featured: !!b.featured,
        date: b.publishedAt || b.createdAt || '2025-01-01',
        readingTime: b.readingTime || 5,
        tags: b.tags || [],
        originalBlog: b,
      }));

    return [...projectItems, ...blogItems];
  }, [projects, blogPosts]);

  // Extract most recent 5 featured items for the top carousel
  const recentFeaturedItems = useMemo(() => {
    return unifiedItems
      .filter(item => item.featured)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [unifiedItems]);

  // If no explicit featured items found, fallback to most recent items
  const featuredSlides = useMemo(() => {
    if (recentFeaturedItems.length > 0) return recentFeaturedItems;
    return [...unifiedItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [recentFeaturedItems, unifiedItems]);

  // Filter items based on format filter and search query (Category filter is removed)
  const filteredItems = useMemo(() => {
    return unifiedItems.filter(item => {
      // Content type filter
      if (contentType === 'CASE_STUDY' && item.type !== 'CASE_STUDY') return false;
      if (contentType === 'JOURNAL' && item.type !== 'JOURNAL') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (item.title || '').toLowerCase().includes(query);
        const matchesSummary = (item.summary || '').toLowerCase().includes(query);
        const matchesCategory = (item.category || '').toLowerCase().includes(query);
        const matchesTags = (item.tags || []).some(t => (t || '').toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedItems, contentType, searchQuery]);

  // Sort filtered items (Default: most recent date descending)
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'readingTime') {
        comparison = (b.readingTime || 0) - (a.readingTime || 0);
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [filteredItems, sortField, sortOrder]);

  // Pagination calculation (9 items per page)
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return sortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedItems, safeCurrentPage]);

  const handleOpenItem = (item: UnifiedItem) => {
    if (item.type === 'CASE_STUDY') {
      setSelectedProjectSlug(item.slug);
      setCurrentRoute('work-detail');
    } else {
      setSelectedBlogSlug(item.slug);
      setCurrentRoute('blog-detail');
    }
  };

  const handleContentTypeChange = (type: ContentTypeFilter) => {
    setContentType(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const caseStudyCount = unifiedItems.filter(i => i.type === 'CASE_STUDY').length;
  const journalCount = unifiedItems.filter(i => i.type === 'JOURNAL').length;

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 md:space-y-16">
        
        {/* Page Header */}
        <div className="space-y-4 border-b pb-10 max-w-4xl border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
            <span className="w-2 h-[1px] bg-[#00E5FF]" />
            <span>Integrated Archive • Research & Case Studies</span>
          </div>
          
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
          }`}>
            Case Studies & Journal
          </h1>
          
          <p className={`text-sm md:text-base leading-relaxed ${
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          }`}>
            An integrated archive of operational case studies, technical system architectures, and reflective writings on software craft, business, and technology.
          </p>
        </div>

        {/* Featured Entry Carousel Slider (Most Recent 5 Featured Entries, 2-sec auto slide) */}
        {featuredSlides.length > 0 && (
          <FeaturedCarousel 
            items={featuredSlides} 
            onOpenItem={handleOpenItem} 
          />
        )}

        {/* Single-Column Content Controls Toolbar: 3 Tab Filter, Search Archive, and Sort */}
        <div className={`p-3.5 sm:p-4 rounded-xl border transition-colors shadow-sm ${
          isDark 
            ? 'bg-[#0B132B] border-[#1E293B]' 
            : 'bg-white border-[#CBD5E1]'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* 1. Three Tab Filter: All Formats / Case Studies / Journal & Thoughts */}
            <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-lg border shrink-0 ${
              isDark ? 'bg-[#050814] border-[#1E293B]' : 'bg-slate-100 border-[#E2E8F0]'
            }`}>
              <button
                onClick={() => handleContentTypeChange('ALL')}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
                  contentType === 'ALL'
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#050814] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : isDark 
                      ? 'text-[#94A3B8] hover:text-[#F8FAFC]' 
                      : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Formats</span>
              </button>

              <button
                onClick={() => handleContentTypeChange('CASE_STUDY')}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
                  contentType === 'CASE_STUDY'
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#050814] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : isDark 
                      ? 'text-[#94A3B8] hover:text-[#F8FAFC]' 
                      : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Case Studies</span>
              </button>

              <button
                onClick={() => handleContentTypeChange('JOURNAL')}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
                  contentType === 'JOURNAL'
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#050814] font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : isDark 
                      ? 'text-[#94A3B8] hover:text-[#F8FAFC]' 
                      : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Journal & Thoughts</span>
              </button>
            </div>

            {/* 2. Live Search Archive Field */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search archive, topics, or technologies..."
                className={`w-full pl-9 pr-8 py-2 text-xs font-mono rounded-lg border focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-[#050814] border-[#1E293B] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#00E5FF]' 
                    : 'bg-white border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#00838F]'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-[#94A3B8] hover:text-white' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 3. Sort Filter Selector & Asc/Desc Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                isDark 
                  ? 'bg-[#050814] border-[#1E293B] text-[#94A3B8]' 
                  : 'bg-white border-[#CBD5E1] text-[#334155]'
              }`}>
                <SlidersHorizontal className={`w-3.5 h-3.5 ${
                  isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
                }`} />
                <span className="hidden sm:inline">Sort:</span>
                
                {/* Theme-Adaptive Sort Select & Options */}
                <select
                  value={sortField}
                  onChange={(e) => {
                    setSortField(e.target.value as SortField);
                    setCurrentPage(1);
                  }}
                  className={`bg-transparent text-xs font-mono font-medium focus:outline-none cursor-pointer ${
                    isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                  }`}
                >
                  <option 
                    value="date" 
                    className={isDark ? 'bg-[#0B132B] text-[#F8FAFC]' : 'bg-white text-[#0F172A]'}
                  >
                    Date / Timeline
                  </option>
                  <option 
                    value="title" 
                    className={isDark ? 'bg-[#0B132B] text-[#F8FAFC]' : 'bg-white text-[#0F172A]'}
                  >
                    Title (A–Z)
                  </option>
                  <option 
                    value="readingTime" 
                    className={isDark ? 'bg-[#0B132B] text-[#F8FAFC]' : 'bg-white text-[#0F172A]'}
                  >
                    Length / Scale
                  </option>
                </select>
              </div>

              {/* Order Direction Toggle */}
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-[#050814] border-[#1E293B] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/40'
                    : 'bg-white border-[#CBD5E1] text-[#475569] hover:text-[#00838F] hover:border-[#00838F]/40'
                }`}
                title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
                aria-label="Toggle sort order"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Results Counter & Active Filter Reset */}
        {(contentType !== 'ALL' || searchQuery) && (
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pt-1">
            <span>
              Showing {sortedItems.length} matching {sortedItems.length === 1 ? 'entry' : 'entries'}
            </span>
            <button
              onClick={() => {
                setContentType('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className={`hover:underline flex items-center gap-1 font-semibold ${
                isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
              }`}
            >
              <X className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>
        )}

        {/* Unified 9-Item Grid */}
        {sortedItems.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-dashed border-[#1E293B] space-y-4">
            <p className={`text-sm font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              No case studies or journal entries found matching current filters.
            </p>
            <button
              onClick={() => {
                setContentType('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className={`text-xs font-mono uppercase tracking-wider underline ${
                isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
              }`}
            >
              View All Content ({unifiedItems.length} total)
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedItems.map((item) => (
                <motion.div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between border shadow-sm ${
                    isDark
                      ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.14)]'
                      : 'bg-white border-[#CBD5E1] hover:border-[#00838F]/50 hover:shadow-xl'
                  }`}
                >
                  <div>
                    {/* Hero / Cover Image if exists */}
                    {item.heroImage ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#050814]">
                        <img
                          src={item.heroImage}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        {/* Top Badges Overlay */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold backdrop-blur-md border ${
                            item.type === 'CASE_STUDY'
                              ? 'bg-[#050814]/90 border-cyan-500/40 text-[#00E5FF]'
                              : 'bg-[#050814]/90 border-purple-500/40 text-purple-300'
                          }`}>
                            {item.type === 'CASE_STUDY' ? 'Case Study' : 'Journal'}
                          </span>
                          {item.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/90 text-black font-bold border border-amber-400">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 p-1.5 bg-[#050814]/80 backdrop-blur-sm rounded-full text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity border border-cyan-500/30">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ) : (
                      /* Minimalist Header for Text-First Journal Entries */
                      <div className="p-6 pb-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold border ${
                            item.type === 'CASE_STUDY'
                              ? isDark ? 'bg-[#050814] border-cyan-500/40 text-[#00E5FF]' : 'bg-cyan-50 border-cyan-200 text-[#00838F]'
                              : isDark ? 'bg-[#050814] border-purple-500/40 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
                          }`}>
                            {item.type === 'CASE_STUDY' ? 'Case Study' : 'Journal'}
                          </span>
                          {item.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Content Container */}
                    <div className="p-6 sm:p-7 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`uppercase tracking-widest text-[11px] font-semibold ${
                            isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
                          }`}>
                            {item.category}
                          </span>
                        </div>

                        <h3 className={`text-xl font-bold leading-snug transition-colors ${
                          isDark 
                            ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' 
                            : 'text-[#0F172A] group-hover:text-[#00838F]'
                        }`}>
                          {item.title}
                        </h3>

                        <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                          isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                        }`}>
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Trigger */}
                  <div className={`px-6 sm:px-7 py-4 border-t flex items-center justify-between text-xs font-mono font-medium transition-colors ${
                    isDark 
                      ? 'border-[#131F37] text-[#00E5FF] group-hover:text-[#38BDF8]' 
                      : 'border-slate-100 text-[#00838F] group-hover:text-[#0284C7]'
                  }`}>
                    <span>{item.type === 'CASE_STUDY' ? 'Explore Case Study' : 'Read Journal Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={`pt-6 border-t flex items-center justify-center sm:justify-end gap-4 ${
                isDark ? 'border-[#1E293B]' : 'border-slate-200'
              }`}>
                {/* Page Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    disabled={safeCurrentPage === 1}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1 transition-all ${
                      safeCurrentPage === 1
                        ? 'opacity-40 cursor-not-allowed border-transparent'
                        : isDark
                          ? 'bg-[#0B132B] border-[#1E293B] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/40'
                          : 'bg-white border-[#CBD5E1] text-[#475569] hover:text-[#00838F]'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = pageNum === safeCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-md text-xs font-mono font-bold transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#050814] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                              : isDark
                                ? 'bg-[#0B132B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B]'
                                : 'bg-white text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    disabled={safeCurrentPage === totalPages}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1 transition-all ${
                      safeCurrentPage === totalPages
                        ? 'opacity-40 cursor-not-allowed border-transparent'
                        : isDark
                          ? 'bg-[#0B132B] border-[#1E293B] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/40'
                          : 'bg-white border-[#CBD5E1] text-[#475569] hover:text-[#00838F]'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
