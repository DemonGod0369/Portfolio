import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const BlogView: React.FC = () => {
  const { blogPosts, setCurrentRoute, setSelectedBlogSlug } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const publishedPosts = blogPosts
    .filter(p => p.status === 'PUBLISHED' && p.category !== 'Unassigned')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

  const categories = ['ALL', ...Array.from(new Set(publishedPosts.map(p => p.category).filter(c => Boolean(c) && c !== 'Unassigned')))];

  const filteredPosts = selectedCategory === 'ALL'
    ? publishedPosts
    : publishedPosts.filter(p => p.category === selectedCategory);

  const featuredPost = publishedPosts.find(p => p.featured) || publishedPosts[0];

  const handleOpenPost = (slug: string) => {
    setSelectedBlogSlug(slug);
    setCurrentRoute('blog-detail');
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className="space-y-4 border-b border-[#1E293B] pb-10 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
            <span className="w-2 h-[1px] bg-[#00E5FF]" />
            Personal Journal & Essays
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] uppercase">
            Thoughts & Journal
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed">
            Reflections on software architecture, design principles, commercial trade operations, and systems thinking.
          </p>
        </div>

        {/* Featured Article Spotlight */}
        {featuredPost && (
          <div
            onClick={() => handleOpenPost(featuredPost.slug)}
            className="p-8 md:p-12 bg-[#0B132B] border border-[#1E293B] hover:border-[#00E5FF]/50 rounded-2xl cursor-pointer transition-all duration-300 space-y-6 group shadow-sm hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#00E5FF]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#050814] border border-[#1E3A5F] uppercase tracking-wider text-[10px] rounded-md text-[#00E5FF]">
                  Featured Entry
                </span>
                <span className="uppercase">{featuredPost.category}</span>
              </div>
              <span className="text-[#64748B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredPost.readingTime} min read
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F8FAFC] group-hover:text-[#00E5FF] transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-3xl leading-relaxed">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#131F37] text-xs font-mono text-[#00E5FF]">
              <span>Read complete journal entry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#050814] font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'bg-[#0B132B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] hover:border-[#1E3A5F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleOpenPost(post.slug)}
              className="p-6 md:p-8 bg-[#0B132B] border border-[#1E293B] hover:border-[#00E5FF]/40 rounded-xl cursor-pointer transition-all duration-200 space-y-4 group shadow-sm hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#64748B]">
                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <span className="uppercase tracking-wider font-semibold">{post.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#00E5FF] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 bg-[#050814] border border-[#1E293B] text-[10px] font-mono text-[#94A3B8] rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogPostDetailView: React.FC = () => {
  const { blogPosts, selectedBlogSlug, setCurrentRoute, profile } = useData();

  const post = blogPosts.find(p => p.slug === selectedBlogSlug) || blogPosts[0];

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm font-mono text-[#94A3B8]">Article not found.</p>
        <button
          onClick={() => setCurrentRoute('blog')}
          className="text-xs font-mono text-[#00E5FF] underline"
        >
          ← Return to Case Studies & Journal
        </button>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '2026';

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <article className="max-w-3xl mx-auto px-6 md:px-8 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => setCurrentRoute('blog')}
          className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Studies & Journal</span>
        </button>

        {/* Article Header */}
        <div className="space-y-5 border-b border-[#1E293B] pb-10">
          <div className="flex items-center gap-3 text-xs font-mono text-[#00E5FF]">
            <span className="uppercase tracking-widest">{post.category}</span>
            <span>•</span>
            <span className="text-[#94A3B8]">{post.readingTime} min read</span>
            <span>•</span>
            <span className="text-[#64748B]">{formattedDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F8FAFC] leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] font-normal leading-relaxed italic serif-accent">
            "{post.excerpt}"
          </p>
        </div>

        {/* Cover image if available */}
        {post.coverImageUrl && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#050814] border border-[#1E293B] shadow-xl">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body (rendered safely via react-markdown) */}
        <div className="prose prose-invert max-w-none text-[#CBD5E1] text-base leading-relaxed space-y-6 font-normal">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-[#F8FAFC] pt-6 pb-2 border-b border-[#1E293B] uppercase tracking-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-[#00E5FF] pt-4 pb-1">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[#00E5FF] pl-4 py-1 italic text-[#F8FAFC] bg-[#0B132B] rounded-r-md serif-accent text-lg">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-2 text-[#94A3B8]">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="text-sm leading-relaxed">{children}</li>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t border-[#1E293B] flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#0B132B] border border-[#1E293B] text-xs font-mono text-[#94A3B8] rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Footer in Article */}
        <div className="p-8 bg-[#0B132B] border border-[#1E293B] rounded-xl flex flex-col sm:flex-row items-center gap-6 mt-12 shadow-lg">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#050814] shrink-0 border border-[#00E5FF]">
            <img
              src={profile.profileImageUrl}
              alt="Gunjan Shrestha"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-tight">
              Gunjan Shrestha
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Operating across technology, design, and business in Nepal. Writing about system architectures and commercial principles.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};
