import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Bot, 
  Palette, 
  Briefcase, 
  MapPin, 
  Mail, 
  Globe, 
  Calendar, 
  Tag, 
  GraduationCap, 
  Building2, 
  BookOpen,
  ArrowRight,
  Download,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { downloadVisitingCardImage } from '../../utils/seoAndQrUtils';

export const AboutView: React.FC = () => {
  const { profile, experiences, educations, currentRoute, setCurrentRoute } = useData();

  // Tab state: 'experience' | 'academic'
  const [activeTab, setActiveTab] = useState<'experience' | 'academic'>('experience');
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Sync tab with route if accessed via direct route
  useEffect(() => {
    if (currentRoute === 'academic') {
      setActiveTab('academic');
    } else if (currentRoute === 'experience') {
      setActiveTab('experience');
    }
  }, [currentRoute]);

  const showPrimaryPhone = (profile.phoneDisplayOption === 'both' || profile.phoneDisplayOption === 'primary' || !profile.phoneDisplayOption) && Boolean(profile.phone);
  const showSecondaryPhone = (profile.phoneDisplayOption === 'both' || profile.phoneDisplayOption === 'secondary') && Boolean(profile.secondaryPhone);

  const publishedExperiences = experiences
    .filter(e => e.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const publishedEdu = educations
    .filter(e => e.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="pt-12 md:pt-20 pb-4 md:pb-6 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-14 md:space-y-16">
        {/* Page Hero Header */}
        <div className="space-y-3 border-b border-[#1E293B] pb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] uppercase">
            More than one discipline.
            <br />
            <span className="bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent">One perspective.</span>
          </h1>
        </div>

        {/* Profile Card & Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Direct Coordinates */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0B132B] border border-[#1E3A5F] shadow-lg group">
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-bold text-[#F8FAFC] uppercase">{profile.name}</p>
                <p className="text-xs font-mono text-[#00E5FF]">{profile.headline}</p>
              </div>
            </div>

            <div className="p-6 bg-[#0B132B] border border-[#1E293B] rounded-xl space-y-3.5 font-mono text-xs text-[#94A3B8] shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                <span>{profile.address || profile.location || 'Kathmandu, Nepal'}</span>
              </div>
              {profile.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                  <span>
                    Born: {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                <div className="min-w-0">
                  <a href={`mailto:${profile.email}`} className="hover:text-[#00E5FF] transition-colors truncate block">
                    {profile.email}
                  </a>
                  {profile.primaryEmailLabel && (
                    <span className="text-[10px] text-[#64748B] block">({profile.primaryEmailLabel})</span>
                  )}
                </div>
              </div>
              {profile.alternateEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <div className="min-w-0">
                    <a href={`mailto:${profile.alternateEmail}`} className="hover:text-[#38BDF8] transition-colors truncate block">
                      {profile.alternateEmail}
                    </a>
                    <span className="text-[10px] text-[#64748B] block">
                      ({profile.alternateEmailLabel || 'Alternate / Bio'})
                    </span>
                  </div>
                </div>
              )}
              {showPrimaryPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                  <div className="min-w-0">
                    <a href={`tel:${profile.phone!.replace(/\s+/g, '')}`} className="hover:text-[#00E5FF] transition-colors truncate block">
                      {profile.phone}
                    </a>
                    <span className="text-[10px] text-[#64748B] block">(Primary Contact)</span>
                  </div>
                </div>
              )}
              {showSecondaryPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <div className="min-w-0">
                    <a href={`tel:${profile.secondaryPhone!.replace(/\s+/g, '')}`} className="hover:text-[#00E5FF] transition-colors truncate block">
                      {profile.secondaryPhone}
                    </a>
                    <span className="text-[10px] text-[#64748B] block">(Secondary Line)</span>
                  </div>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                  <span className="truncate">{profile.website}</span>
                </div>
              )}
            </div>

            {/* Visiting Card Option */}
            {profile.visitingCardImageUrl && (
              <button
                type="button"
                onClick={() => downloadVisitingCardImage(profile.visitingCardImageUrl!, profile.name)}
                className="w-full py-3 px-4 bg-[#0B132B] hover:bg-[#00E5FF] text-[#00E5FF] hover:text-[#050814] border border-[#1E293B] hover:border-[#00E5FF] text-xs font-mono font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm group"
              >
                <Download className="w-4 h-4 text-[#00E5FF] group-hover:text-[#050814] transition-colors" />
                <span>Download Visiting Card</span>
              </button>
            )}
          </div>

          {/* Right Column: Bio & Core Disciplines */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                Introduction
              </span>
              <p className="text-xl md:text-2xl text-[#F8FAFC] font-light leading-relaxed serif-accent italic">
                "{profile.shortBio}"
              </p>
            </div>

            <div className="space-y-4 text-base text-[#94A3B8] leading-relaxed">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                Professional Background
              </span>
              <p>{profile.longBio}</p>
            </div>

            {/* Disciplines breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 bg-[#0B132B] border border-[#1E293B] hover:border-[#00E5FF]/40 rounded-xl space-y-2 transition-all">
                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#F8FAFC]">Operations & Governance</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Office operations, logistics, accounting, compliance reporting, and audit frameworks.
                </p>
              </div>

              <div className="p-6 bg-[#0B132B] border border-[#1E293B] hover:border-[#38BDF8]/40 rounded-xl space-y-2 transition-all">
                <Palette className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="text-base font-semibold text-[#F8FAFC]">Design & Brand Strategy</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Brand visuals, social media management, product photography, and UI/UX design.
                </p>
              </div>

              <div className="p-6 bg-[#0B132B] border border-[#1E293B] hover:border-[#10B981]/40 rounded-xl space-y-2 transition-all">
                <Briefcase className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base font-semibold text-[#F8FAFC]">Venture Scaling</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Multidisciplinary venture building, tech stack management, custom precious metal craft, and international expansion.
                </p>
              </div>
            </div>

            {/* Philosophy statement */}
            <div className="p-8 bg-[#0B132B]/80 border-l-2 border-[#00E5FF] rounded-r-xl space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
                Core Conviction
              </p>
              <p className="text-sm md:text-base text-[#F8FAFC] leading-relaxed serif-accent italic">
                "I believe people are defined by their work and their commitment to continuous improvement—learning from mistakes, taking responsibility, and consistently raising the bar."
              </p>
            </div>

            {/* Looking to Connect statement */}
            <div className="p-6 bg-[#0B132B] border border-[#1E3A5F] rounded-xl space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
                Collaboration & Scaling Focus
              </p>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                I'm interested in connecting with founders, investors, and operators who are working on cross‑border businesses, scalable brands, or ventures where operations, finance, and compliance are core advantages.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MERGED TIMELINE SECTION WITH DUAL TABS (EXPERIENCE & ACADEMIC BACKGROUND) */}
        {/* ========================================================================= */}
        <div className="pt-10 border-t border-[#1E293B] space-y-12">
          {/* Section Header & Tab Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B]">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                <span className="w-2 h-[1px] bg-[#00E5FF]" />
                Journey & Foundations
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F8FAFC] uppercase">
                Milestones & Background
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center p-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl self-start md:self-auto">
              <button
                onClick={() => setActiveTab('experience')}
                className={`relative px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
                  activeTab === 'experience'
                    ? 'text-[#050814] font-bold shadow-[0_0_20px_rgba(0,229,255,0.35)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {activeTab === 'experience' && (
                  <motion.div
                    layoutId="aboutTimelineTabActive"
                    className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Experience Timeline</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded ${
                    activeTab === 'experience' ? 'bg-[#050814]/20 text-[#050814]' : 'bg-[#1E293B] text-[#94A3B8]'
                  }`}>
                    {publishedExperiences.length}
                  </span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('academic')}
                className={`relative px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
                  activeTab === 'academic'
                    ? 'text-[#050814] font-bold shadow-[0_0_20px_rgba(0,229,255,0.35)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {activeTab === 'academic' && (
                  <motion.div
                    layoutId="aboutTimelineTabActive"
                    className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Academic Background</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded ${
                    activeTab === 'academic' ? 'bg-[#050814]/20 text-[#050814]' : 'bg-[#1E293B] text-[#94A3B8]'
                  }`}>
                    {publishedEdu.length}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content Display in Timeline Style */}
          <div className="relative pt-6 pb-12">
            {/* Central Vertical Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1E293B] via-[#00E5FF]/50 to-[#1E293B] -translate-x-1/2" />
            
            {/* Left Vertical Line for Mobile */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-[#1E293B]" />

            <AnimatePresence mode="wait">
              {activeTab === 'experience' ? (
                /* ========================================= */
                /* TAB 1: EXPERIENCE TIMELINE                */
                /* ========================================= */
                <motion.div
                  key="experience-timeline"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-12 md:space-y-16"
                >
                  {publishedExperiences.map((exp, index) => {
                    const isEven = index % 2 === 0;
                    const isHovered = activeHoverId === exp.id;

                    return (
                      <div
                        key={exp.id}
                        onMouseEnter={() => setActiveHoverId(exp.id)}
                        onMouseLeave={() => setActiveHoverId(null)}
                        className={`relative flex flex-col md:flex-row items-start ${
                          isEven ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Dot Marker */}
                        <div
                          className={`absolute z-10 flex items-center justify-center transition-all duration-300 ${
                            'left-4 -translate-x-1/2 top-4 md:left-1/2'
                          } ${
                            isHovered
                              ? 'w-6 h-6 bg-[#00E5FF] ring-4 ring-[#00E5FF]/25 shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                              : 'w-4 h-4 bg-[#0B132B] border-2 border-[#00E5FF]'
                          } rounded-full`}
                        >
                          {isHovered && <span className="w-2 h-2 bg-[#050814] rounded-full" />}
                        </div>

                        {/* Content Container (Split 50% left / right on desktop, indented on mobile) */}
                        <div
                          className={`w-full md:w-[calc(50%-40px)] pl-10 md:pl-0 ${
                            isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                          }`}
                        >
                          <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className={`p-6 sm:p-8 bg-[#0B132B] border transition-all duration-300 rounded-xl space-y-4 shadow-sm ${
                              isHovered
                                ? 'border-[#00E5FF]/60 shadow-[0_0_25px_rgba(0,229,255,0.12)]'
                                : 'border-[#1E293B]'
                            }`}
                          >
                            {/* Meta Header */}
                            <div
                              className={`flex flex-wrap items-center gap-2 text-xs font-mono text-[#00E5FF] ${
                                isEven ? 'md:justify-end' : 'md:justify-start'
                              }`}
                            >
                              <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#050814] border border-[#1E3A5F]">
                                {exp.category}
                              </span>
                              <span>•</span>
                              <span className="text-[#94A3B8] flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#64748B]" />
                                {exp.startDate} {exp.isCurrent ? '— Present' : exp.endDate ? `— ${exp.endDate}` : ''}
                              </span>
                            </div>

                            {/* Main Title & Role */}
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                                {exp.title}
                              </h3>
                              {exp.roleTitle && (
                                <p className="text-xs sm:text-sm font-mono text-[#94A3B8] mt-1">
                                  {exp.roleTitle} {exp.organization ? `· ${exp.organization}` : ''}
                                </p>
                              )}
                              {exp.location && (
                                <p className={`text-xs text-[#64748B] font-mono mt-0.5 flex items-center gap-1 ${
                                  isEven ? 'md:justify-end' : 'md:justify-start'
                                }`}>
                                  <MapPin className="w-3 h-3" />
                                  {exp.location}
                                </p>
                              )}
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-2 text-sm text-[#94A3B8] leading-relaxed">
                              <p className="font-medium text-[#CBD5E1]">
                                {exp.shortDescription}
                              </p>
                              <p className="text-xs sm:text-sm text-[#94A3B8]/90">
                                {exp.description}
                              </p>
                            </div>

                            {/* Tags */}
                            {exp.tags && exp.tags.length > 0 && (
                              <div
                                className={`flex flex-wrap gap-1.5 pt-3 border-t border-[#131F37] ${
                                  isEven ? 'md:justify-end' : 'md:justify-start'
                                }`}
                              >
                                {exp.tags.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2.5 py-1 bg-[#050814] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8] rounded-md flex items-center gap-1"
                                  >
                                    <Tag className="w-2.5 h-2.5 text-[#00E5FF]" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>

                        {/* Empty Spacer Column for Desktop */}
                        <div className="hidden md:block md:w-[calc(50%-40px)]" />
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                /* ========================================= */
                /* TAB 2: ACADEMIC BACKGROUND TIMELINE       */
                /* ========================================= */
                <motion.div
                  key="academic-timeline"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-12 md:space-y-16"
                >
                  {publishedEdu.map((edu, index) => {
                    const isEven = index % 2 === 0;
                    const isHovered = activeHoverId === edu.id;

                    return (
                      <div
                        key={edu.id}
                        onMouseEnter={() => setActiveHoverId(edu.id)}
                        onMouseLeave={() => setActiveHoverId(null)}
                        className={`relative flex flex-col md:flex-row items-start ${
                          isEven ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Dot Marker */}
                        <div
                          className={`absolute z-10 flex items-center justify-center transition-all duration-300 ${
                            'left-4 -translate-x-1/2 top-4 md:left-1/2'
                          } ${
                            isHovered
                              ? 'w-6 h-6 bg-[#00E5FF] ring-4 ring-[#00E5FF]/25 shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                              : 'w-4 h-4 bg-[#0B132B] border-2 border-[#00E5FF]'
                          } rounded-full`}
                        >
                          {isHovered && <span className="w-2 h-2 bg-[#050814] rounded-full" />}
                        </div>

                        {/* Content Container */}
                        <div
                          className={`w-full md:w-[calc(50%-40px)] pl-10 md:pl-0 ${
                            isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                          }`}
                        >
                          <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className={`p-6 sm:p-8 bg-[#0B132B] border transition-all duration-300 rounded-xl space-y-4 shadow-sm ${
                              isHovered
                                ? 'border-[#00E5FF]/60 shadow-[0_0_25px_rgba(0,229,255,0.12)]'
                                : 'border-[#1E293B]'
                            }`}
                          >
                            {/* Meta Header */}
                            <div
                              className={`flex flex-wrap items-center gap-2 text-xs font-mono text-[#00E5FF] ${
                                isEven ? 'md:justify-end' : 'md:justify-start'
                              }`}
                            >
                              <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#050814] border border-[#1E3A5F] flex items-center gap-1.5">
                                <GraduationCap className="w-3 h-3 text-[#00E5FF]" />
                                Formal Degree
                              </span>
                              <span>•</span>
                              <span className="text-[#94A3B8] flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#64748B]" />
                                {edu.startDate} — {edu.endDate || 'Present'}
                              </span>
                            </div>

                            {/* Degree & Field */}
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                                {edu.qualification}
                              </h3>
                              {edu.field && (
                                <p className="text-xs sm:text-sm font-mono text-[#00E5FF] mt-1">
                                  {edu.field}
                                </p>
                              )}
                              <div className={`text-xs text-[#94A3B8] font-mono mt-1 flex flex-wrap items-center gap-2 ${
                                isEven ? 'md:justify-end' : 'md:justify-start'
                              }`}>
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-[#64748B]" />
                                  {edu.institution}
                                </span>
                                {edu.location && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-[#64748B]">
                                      <MapPin className="w-3 h-3" />
                                      {edu.location}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2 text-sm text-[#94A3B8] leading-relaxed">
                              <p className="text-xs sm:text-sm text-[#CBD5E1]/90">
                                {edu.description}
                              </p>
                            </div>

                            {/* Core Topics Badge */}
                            <div
                              className={`flex flex-wrap gap-1.5 pt-3 border-t border-[#131F37] ${
                                isEven ? 'md:justify-end' : 'md:justify-start'
                              }`}
                            >
                              <span className="px-2.5 py-1 bg-[#050814] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8] rounded-md flex items-center gap-1">
                                <BookOpen className="w-2.5 h-2.5 text-[#00E5FF]" />
                                Higher Education
                              </span>
                              <span className="px-2.5 py-1 bg-[#050814] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8] rounded-md">
                                Academic Curriculum
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Empty Spacer Column for Desktop */}
                        <div className="hidden md:block md:w-[calc(50%-40px)]" />
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Quick Call-to-Action Bar */}
        <div className="pt-8 pb-0 border-t border-[#1E293B] flex flex-col items-center justify-center text-center gap-4">
          <p className="text-sm md:text-base font-medium text-[#F8FAFC] tracking-wide max-w-xl">
            Want to review the complete printable curriculum vitae?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setCurrentRoute('resume')}
              className="px-6 py-3 text-xs font-mono uppercase tracking-wider text-[#F8FAFC] bg-[#0B132B] hover:bg-[#0F1B38] border border-[#1E3A5F] hover:border-[#00E5FF]/60 rounded-md transition-all flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            >
              <Download className="w-4 h-4 text-[#00E5FF]" />
              <span>Printable Resume</span>
            </button>
            <button
              onClick={() => setCurrentRoute('skills')}
              className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] rounded-md transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.02]"
            >
              <span>Explore Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AcademicView: React.FC = () => {
  // Direct route alias to About with academic tab preselected
  return <AboutView />;
};
