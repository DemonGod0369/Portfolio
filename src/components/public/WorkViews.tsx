import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, ArrowUpRight, ExternalLink, Eye, ArrowRight } from 'lucide-react';
import { Lightbox } from '../ui/Lightbox';

export const WorkView: React.FC = () => {
  const { projects, setCurrentRoute, setSelectedProjectSlug } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const publishedProjects = projects
    .filter(p => p.published && p.category !== 'Unassigned')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Extract unique categories (excluding any Unassigned)
  const categories = ['ALL', ...Array.from(new Set(publishedProjects.map(p => p.category).filter(c => Boolean(c) && c !== 'Unassigned')))];

  const filteredProjects = selectedCategory === 'ALL'
    ? publishedProjects
    : publishedProjects.filter(p => p.category === selectedCategory);

  const handleOpenProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    setCurrentRoute('work-detail');
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className="space-y-4 border-b border-[#1E293B] pb-10 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
            <span className="w-2 h-[1px] bg-[#00E5FF]" />
            Portfolio / Case Studies
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] uppercase">
            Selected Work
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed">
            Case studies across software architectures, trade ledgers, identity design, and web platforms.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => handleOpenProject(proj.slug)}
              className="group cursor-pointer bg-[#0B132B] border border-[#1E293B] hover:border-[#00E5FF]/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm hover:shadow-[0_0_25px_rgba(0,229,255,0.12)]"
            >
              {/* Project Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#050814]">
                <img
                  src={proj.heroImage}
                  alt={proj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 p-2 bg-[#050814]/80 backdrop-blur-sm rounded-full text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity border border-cyan-500/30">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Content Block */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#00E5FF]">
                      {proj.category}
                    </span>
                    {proj.featured && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] bg-[#050814] px-2.5 py-0.5 border border-[#1E3A5F] rounded-md">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#00E5FF] transition-colors leading-snug">
                    {proj.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                    {proj.shortSummary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#131F37] flex items-center justify-between text-xs font-mono text-[#00E5FF]">
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProjectDetailView: React.FC = () => {
  const { projects, selectedProjectSlug, setCurrentRoute } = useData();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const project = projects.find(p => p.slug === selectedProjectSlug) || projects[0];

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm font-mono text-[#94A3B8]">Project not found.</p>
        <button
          onClick={() => setCurrentRoute('work')}
          className="text-xs font-mono text-[#00E5FF] underline"
        >
          ← Return to Case Studies & Journal
        </button>
      </div>
    );
  }

  const galleryImages = [
    { url: project.heroImage, altText: project.title, caption: project.title },
    ...(project.images || []).map(img => ({
      url: img.url,
      altText: img.altText || project.title,
      caption: img.caption,
    }))
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-16">
        {/* Back navigation */}
        <button
          onClick={() => setCurrentRoute('work')}
          className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Studies & Journal</span>
        </button>

        {/* Project Header */}
        <div className="space-y-4 border-b border-[#1E293B] pb-10">
          <div className="flex items-center gap-3 text-xs font-mono text-[#00E5FF]">
            <span className="uppercase tracking-widest">{project.category}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8FAFC] uppercase leading-tight">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed">
            {project.shortSummary}
          </p>
        </div>

        {/* Main Hero Image */}
        <div
          onClick={() => handleOpenLightbox(0)}
          className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#050814] border border-[#1E293B] cursor-pointer group shadow-xl"
        >
          <img
            src={project.heroImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#050814]/80 backdrop-blur-md rounded-md text-xs font-mono text-[#F8FAFC] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-cyan-500/30">
            <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Click to expand</span>
          </div>
        </div>

        {/* Case Study Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-6">
          {/* Main Case Study Column */}
          <div className="md:col-span-8 space-y-12">
            {project.overview && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  01 / Overview
                </h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {project.overview}
                </p>
              </section>
            )}

            {project.problem && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  02 / The Problem
                </h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {project.problem}
                </p>
              </section>
            )}

            {project.approach && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  03 / Approach & Strategy
                </h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {project.approach}
                </p>
              </section>
            )}

            {project.design && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  04 / Design Execution
                </h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {project.design}
                </p>
              </section>
            )}

            {project.technology && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  05 / Technical Architecture
                </h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {project.technology}
                </p>
              </section>
            )}

            {project.result && (
              <section className="p-6 bg-[#0B132B] border border-[#1E293B] rounded-xl space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  06 / Result & Impact
                </h3>
                <p className="text-sm text-[#F8FAFC] font-medium leading-relaxed">
                  {project.result}
                </p>
              </section>
            )}

            {/* Supplementary Image Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[#131F37]">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                  Project Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((img, i) => (
                    <div
                      key={img.id}
                      onClick={() => handleOpenLightbox(i + 1)}
                      className="group cursor-pointer space-y-1.5"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#050814] border border-[#1E293B]">
                        <img
                          src={img.url}
                          alt={img.altText}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {img.caption && (
                        <p className="text-[11px] font-mono text-[#94A3B8]">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Details Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 bg-[#0B132B] border border-[#1E293B] rounded-xl space-y-5 font-mono text-xs shadow-md">
              <h3 className="text-sm font-bold text-[#F8FAFC] tracking-tight border-b border-[#131F37] pb-3">
                Project Metadata
              </h3>

              <div>
                <span className="text-[#64748B] block">Category:</span>
                <span className="text-[#F8FAFC] font-medium">{project.category}</span>
              </div>

              <div>
                <span className="text-[#64748B] block">Role / Scope:</span>
                <span className="text-[#F8FAFC] font-medium">Architecture, UI/UX & Code</span>
              </div>

              <div>
                <span className="text-[#64748B] block">Status:</span>
                <span className="text-[#10B981] font-medium">Completed & Documented</span>
              </div>

              {project.liveUrl && project.liveUrl !== '#' && (
                <div className="pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#050814] font-bold text-center flex items-center justify-center gap-1.5 rounded-md hover:from-[#38BDF8] hover:to-[#00E5FF] transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                  >
                    <span>View Live Deployment</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#0B132B]/60 border border-[#1E293B] rounded-xl space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
                Have a similar challenge?
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Let's discuss how structured software design and commercial insight can help your project.
              </p>
              <button
                onClick={() => setCurrentRoute('contact')}
                className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1"
              >
                <span>Send a project note →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={galleryImages}
        currentIndex={lightboxIndex}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
