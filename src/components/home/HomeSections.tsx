import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Sparkles, 
  Bot,
  Terminal, 
  Briefcase, 
  Landmark, 
  Palette, 
  ShieldCheck, 
  CheckCircle2,
  Cpu,
  TrendingUp,
  Layers,
  Calendar,
  Clock,
  Compass,
  Code2,
  Boxes,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

/* ========================================================================= */
/* 1. HERO SECTION (MULTI-PLANE PARALLAX & 3D INTERACTIVE TILT)              */
/* ========================================================================= */
export const HeroSection: React.FC = () => {
  const { profile, setCurrentRoute } = useData();
  const { isDark } = useTheme();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax layers
  const bgGridY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const badgeFloat = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

  // Mouse 3D tilt calculations for the profile card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={heroRef}
      className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className={`absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] ${isDark ? 'bg-[#00E5FF]/10' : 'bg-cyan-500/10'} blur-[140px] pointer-events-none rounded-full`} />
      <div className={`absolute bottom-10 right-1/4 w-[450px] h-[300px] ${isDark ? 'bg-[#3B82F6]/10' : 'bg-blue-400/10'} blur-[130px] pointer-events-none rounded-full`} />

      {/* Grid lines effect with Parallax Scroll Drift */}
      <motion.div 
        style={{ y: bgGridY }}
        className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_right,#1E293B15_1px,transparent_1px),linear-gradient(to_bottom,#1E293B15_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#CBD5E150_1px,transparent_1px),linear-gradient(to_bottom,#CBD5E150_1px,transparent_1px)]'} bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none`} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Narrative with Parallax */}
          <motion.div style={{ y: textY }} className="lg:col-span-7 space-y-8">
            {/* Live Trust & Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full ${
                isDark 
                  ? 'bg-[#0B132B]/90 border border-cyan-500/30 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                  : 'bg-white border border-cyan-600/30 text-[#00838F] shadow-sm'
              } text-xs font-mono tracking-wide backdrop-blur-md`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              </span>
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Verified Identity • Technology × Design × Business
              </span>
            </motion.div>

            {/* Display Typography Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className={`text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} uppercase leading-[1.05]`}>
                Gunjan
                <br />
                <span className={isDark ? 'bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#60A5FA] bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#2563EB] bg-clip-text text-transparent'}>
                  Shrestha
                </span>
              </h1>
            </motion.div>

            {/* Core Brand Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className={`text-lg sm:text-xl ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} max-w-2xl font-normal leading-relaxed`}
            >
              {profile.headline || 'A multidisciplinary professional combining technology, design and real-world business experience.'}
            </motion.p>

            {/* Key Trust Signals Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className={`flex flex-wrap items-center gap-3 text-xs font-mono ${isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'}`}
            >
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isDark ? 'bg-[#0B132B] border-[#1E293B]' : 'bg-white border-[#E2E8F0] shadow-sm'} border`}>
                <Cpu className={`w-3.5 h-3.5 ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'}`} />
                Software Engineering
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isDark ? 'bg-[#0B132B] border-[#1E293B]' : 'bg-white border-[#E2E8F0] shadow-sm'} border`}>
                <Palette className="w-3.5 h-3.5 text-[#0284C7]" />
                Visual & UI/UX Systems
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isDark ? 'bg-[#0B132B] border-[#1E293B]' : 'bg-white border-[#E2E8F0] shadow-sm'} border`}>
                <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
                Commercial Trade & Ledgers
              </span>
            </motion.div>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => setCurrentRoute('about')}
                className={`px-7 py-3.5 text-xs font-bold uppercase tracking-wider ${
                  isDark
                    ? 'text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.3)]'
                    : 'text-white bg-gradient-to-r from-[#00838F] to-[#0284C7] hover:from-[#0284C7] hover:to-[#00838F] shadow-[0_4px_14px_rgba(0,131,143,0.35)]'
                } transition-all duration-300 rounded-md flex items-center gap-2 group transform hover:-translate-y-0.5`}
              >
                <span>Explore My Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentRoute('work')}
                className={`px-7 py-3.5 text-xs font-mono uppercase tracking-wider ${
                  isDark
                    ? 'text-[#F8FAFC] hover:text-[#00E5FF] bg-[#0B132B] hover:bg-[#0F1B38] border-[#1E293B] hover:border-[#00E5FF]/50'
                    : 'text-[#0F172A] hover:text-[#00838F] bg-white hover:bg-slate-50 border-[#CBD5E1] hover:border-[#00838F]/50 shadow-sm'
                } border transition-all duration-200 rounded-md flex items-center gap-2`}
              >
                <span>View Selected Work</span>
                <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} opacity-80`} />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Profile Presentation Card with 3D Tilt Interaction */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end perspective-[1000px]"
          >
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative group max-w-md w-full cursor-pointer"
            >
              {/* Subtle Glowing Aura Frame */}
              <div className={`absolute -inset-1.5 ${isDark ? 'bg-gradient-to-r from-[#00E5FF]/30 to-[#3B82F6]/30' : 'bg-gradient-to-r from-cyan-400/25 to-blue-500/25'} rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-[#0B132B] border-[#1E3A5F]' : 'bg-white border-[#CBD5E1] shadow-2xl'} border p-3.5`}>
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xl bg-[#050814]">
                  <img
                    src={profile.profileImageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center transition-all duration-700 transform group-hover:scale-105"
                    loading="eager"
                  />
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#050814] via-[#050814]/30 to-transparent opacity-85' : 'bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent'}`} />
                  
                  {/* Floating Security Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#050814]/85 backdrop-blur-md border border-cyan-500/30 flex items-center gap-1.5 text-[11px] font-mono text-[#00E5FF]">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Safe & Verified</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-left space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                      Kathmandu, Nepal
                    </span>
                    <p className="text-xl sm:text-2xl text-[#F8FAFC] font-bold">
                      Gunjan Shrestha
                    </p>
                    <p className="text-xs sm:text-sm text-[#94A3B8] font-mono">
                      Technology • Design • Commerce
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 2. SYNTHESIS FRAMEWORK (PARALLAX ARCHITECTURAL CANVAS)                   */
/* ========================================================================= */
export const IntroductionSection: React.FC = () => {
  const { profile } = useData();
  const { isDark } = useTheme();
  const [activeHover, setActiveHover] = useState<'tech' | 'design' | 'business' | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  const disciplines = [
    {
      id: 'tech' as const,
      title: 'Operations & Governance',
      subtitle: 'Office operations, logistics systems, financial accounting, statutory compliance, and audit frameworks.',
      icon: <TrendingUp className="w-5 h-5" />,
      accentColor: isDark ? 'text-[#00E5FF]' : 'text-[#00838F]',
      badgeColor: isDark ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30' : 'bg-cyan-50 text-[#00838F] border-cyan-200',
      activeRing: isDark ? 'border-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.18)]' : 'border-[#00838F] shadow-[0_8px_25px_rgba(0,131,143,0.18)]',
      gradient: isDark ? 'from-[#00E5FF]/15 to-transparent' : 'from-cyan-500/10 to-transparent',
    },
    {
      id: 'design' as const,
      title: 'Brand Design & Creative',
      subtitle: 'Brand visuals, 4+ years of social media strategy, custom fine jewellery design, and product photography.',
      icon: <Palette className="w-5 h-5" />,
      accentColor: isDark ? 'text-[#38BDF8]' : 'text-[#0284C7]',
      badgeColor: isDark ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30' : 'bg-sky-50 text-[#0284C7] border-sky-200',
      activeRing: isDark ? 'border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.18)]' : 'border-[#0284C7] shadow-[0_8px_25px_rgba(2,132,199,0.18)]',
      gradient: isDark ? 'from-[#38BDF8]/15 to-transparent' : 'from-sky-500/10 to-transparent',
    },
    {
      id: 'business' as const,
      title: 'Venture Scaling & Tech',
      subtitle: 'Managing tech stacks, software/UI initiatives, and architecting cross-border scalable enterprises.',
      icon: <Cpu className="w-5 h-5" />,
      accentColor: isDark ? 'text-[#10B981]' : 'text-[#059669]',
      badgeColor: isDark ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-emerald-50 text-[#059669] border-emerald-200',
      activeRing: isDark ? 'border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.18)]' : 'border-[#059669] shadow-[0_8px_25px_rgba(5,150,105,0.18)]',
      gradient: isDark ? 'from-[#10B981]/15 to-transparent' : 'from-emerald-500/10 to-transparent',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-24 md:py-32 border-t ${
        isDark 
          ? 'border-[#1E293B] bg-[#050814]' 
          : 'border-[#E2E8F0] bg-[#F8FAFC]'
      } relative overflow-hidden`}
    >
      {/* Parallax Background Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          style={{ y: parallaxY, scale: parallaxScale }}
          className="absolute -top-[25%] -bottom-[25%] -left-[10%] -right-[10%] w-[120%] h-[150%]"
        >
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Synthesis Architecture"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center ${
              isDark
                ? 'opacity-20 filter grayscale brightness-75 contrast-125 mix-blend-luminosity'
                : 'opacity-15 filter grayscale contrast-110 brightness-95'
            }`}
          />
        </motion.div>

        {/* Dynamic Dark & Light Blending Gradient Overlays */}
        <div 
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-b from-[#050814] via-[#050814]/85 to-[#050814]'
              : 'bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC]/85 to-[#F8FAFC]'
          }`} 
        />

        {/* Ambient colored lighting glows */}
        <div className={`absolute top-1/4 -right-12 w-[450px] h-[450px] ${isDark ? 'bg-[#00E5FF]/10' : 'bg-cyan-500/10'} blur-[140px] rounded-full`} />
        <div className={`absolute bottom-1/4 -left-12 w-[450px] h-[450px] ${isDark ? 'bg-[#3B82F6]/10' : 'bg-blue-500/10'} blur-[140px] rounded-full`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Title & Perspective Statement */}
          <div className="lg:col-span-4 space-y-4">
            <span className={`text-xs font-mono uppercase tracking-[0.2em] ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} flex items-center gap-2`}>
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              Synthesis Framework
            </span>
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} uppercase leading-tight`}>
              Three Disciplines.
              <br />
              <span className={isDark ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#00838F] to-[#0284C7] bg-clip-text text-transparent'}>
                One Perspective.
              </span>
            </h2>
            <p className={`text-xs font-mono ${isDark ? 'text-[#64748B]' : 'text-[#64748B]'} pt-2`}>
              Hover cards to observe cross-discipline synthesis.
            </p>
          </div>

          {/* Right Narrative & Interactive 3D Cards */}
          <div className="lg:col-span-8 space-y-8">
            <div className={`p-6 sm:p-8 rounded-2xl ${
              isDark 
                ? 'bg-[#0B132B]/80 border border-[#1E293B] shadow-lg backdrop-blur-md' 
                : 'bg-white border border-[#E2E8F0] shadow-md'
            } relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${isDark ? 'from-[#00E5FF] via-[#38BDF8] to-[#10B981]' : 'from-[#00838F] via-[#0284C7] to-[#059669]'}`} />
              
              <p className={`text-xl md:text-2xl ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} font-light leading-relaxed serif-accent italic`}>
                "{profile.shortBio}"
              </p>
              
              <p className={`text-sm sm:text-base ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed mt-4`}>
                Rather than treating technical architecture, visual communication, and commerce as separated silos, I operate at their intersection. Practical business realities clarify what technology should prioritize; elegant interface design makes complex capability accessible and trusted.
              </p>
            </div>

            {/* 3 Interactive Cards with Micro-Parallax Elevation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {disciplines.map((d) => {
                const isActive = activeHover === d.id;

                return (
                  <motion.div
                    key={d.id}
                    onMouseEnter={() => setActiveHover(d.id)}
                    onMouseLeave={() => setActiveHover(null)}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`p-6 rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border cursor-pointer ${
                      isDark
                        ? `bg-[#0B132B] ${isActive ? d.activeRing : 'border-[#1E293B]'}`
                        : `bg-white ${isActive ? d.activeRing : 'border-[#E2E8F0] shadow-sm hover:shadow-lg'}`
                    }`}
                  >
                    {/* Subtle top gradient glow when hovered */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${d.gradient} opacity-0 ${isActive ? 'opacity-100' : ''} transition-opacity duration-300 pointer-events-none`} />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-lg ${d.badgeColor} border flex items-center justify-center`}>
                          {d.icon}
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${d.badgeColor} border`}>
                          Active
                        </span>
                      </div>

                      <h3 className={`text-base font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} tracking-tight`}>
                        {d.title}
                      </h3>

                      <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed`}>
                        {d.subtitle}
                      </p>
                    </div>

                    <div className={`pt-4 mt-4 border-t ${isDark ? 'border-[#131F37]' : 'border-slate-100'} flex items-center justify-between text-[11px] font-mono ${d.accentColor} relative z-10`}>
                      <span>Explore Pillar</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 3. AREAS OF FOCUS (INTERACTIVE IMAGE PEEK & HOVER PARALLAX)              */
/* ========================================================================= */
export const CoreAreasSection: React.FC = () => {
  const { setCurrentRoute } = useData();
  const { isDark } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const coreAreas = [
    {
      num: '01',
      title: 'Technology & Systems',
      subtitle: 'Information Technology, software design, web technologies, and systems understanding.',
      icon: <Bot className={`w-5 h-5 ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'}`} />,
      actionRoute: 'skills' as const,
      tag: 'Engineering',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    },
    {
      num: '02',
      title: 'Design & Visual Hierarchy',
      subtitle: 'Graphic, UI/UX, typography, balance, and intentional visual communication.',
      icon: <Palette className={`w-5 h-5 ${isDark ? 'text-[#38BDF8]' : 'text-[#0284C7]'}`} />,
      actionRoute: 'skills' as const,
      tag: 'UI / UX',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    },
    {
      num: '03',
      title: 'Business & Operations',
      subtitle: 'Commercial trade, precious metals operations, planning, and real-world transactions.',
      icon: <Briefcase className="w-5 h-5 text-[#059669]" />,
      actionRoute: 'about' as const,
      tag: 'Commerce',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      num: '04',
      title: 'Finance & Ledgers',
      subtitle: 'Financial calculations, accounting records, cashflow realities, and business prudence.',
      icon: <Landmark className="w-5 h-5 text-[#D97706]" />,
      actionRoute: 'about' as const,
      tag: 'Finance',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
    },
    {
      num: '05',
      title: 'Creative Problem Solving',
      subtitle: 'Synthesizing software, design, and practical market experience to solve meaningful problems.',
      icon: <Sparkles className="w-5 h-5 text-[#9333EA]" />,
      actionRoute: 'work' as const,
      tag: 'Strategy',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <section className={`py-20 md:py-28 border-t ${isDark ? 'border-[#1E293B] bg-[#050814]' : 'border-[#E2E8F0] bg-white'} relative`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} flex items-center gap-2`}>
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              Core Capabilities
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} mt-1`}>
              Areas of Focus
            </h2>
          </div>
        </div>

        {/* Interactive Domain List with Visual Backdrop Peek */}
        <div className={`divide-y ${isDark ? 'divide-[#1E293B] border-[#1E293B]' : 'divide-[#E2E8F0] border-[#E2E8F0]'} border-y`}>
          {coreAreas.map((area, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={area.num}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setCurrentRoute(area.actionRoute)}
                className={`group py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
                  isDark 
                    ? 'hover:bg-[#0B132B]/90 hover:border-[#1E3A5F]' 
                    : 'hover:bg-slate-50 hover:border-[#CBD5E1] hover:shadow-lg'
                } px-6 -mx-6 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent relative overflow-hidden`}
              >
                {/* Visual Image Peek Background on Hover with Smooth Opacity */}
                <div 
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 overflow-hidden ${
                    isHovered ? 'opacity-20 md:opacity-25' : 'opacity-0'
                  }`}
                >
                  <img
                    src={area.image}
                    alt={area.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter grayscale contrast-125"
                  />
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-[#0B132B] via-[#0B132B]/80 to-transparent' : 'bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent'}`} />
                </div>

                <div className={`md:col-span-1 text-xs font-mono text-[#64748B] ${isDark ? 'group-hover:text-[#00E5FF]' : 'group-hover:text-[#00838F]'} transition-colors flex items-center gap-2 relative z-10`}>
                  <span className="font-bold">{area.num}</span>
                </div>

                <div className="md:col-span-4 flex items-center gap-3.5 relative z-10">
                  <div className={`p-2.5 rounded-lg border transition-all ${
                    isDark 
                      ? 'bg-[#0B132B] border-[#1E293B] group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                      : 'bg-white border-[#E2E8F0] group-hover:border-[#00838F]/50 group-hover:shadow-sm'
                  }`}>
                    {area.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg md:text-xl font-semibold ${isDark ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' : 'text-[#0F172A] group-hover:text-[#00838F]'} transition-colors`}>
                      {area.title}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] md:hidden">
                      {area.tag}
                    </span>
                  </div>
                </div>

                <div className={`md:col-span-6 text-sm ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed relative z-10`}>
                  {area.subtitle}
                </div>

                <div className="md:col-span-1 flex justify-end items-center gap-2 relative z-10">
                  <span className="hidden lg:inline text-[10px] font-mono uppercase tracking-widest text-[#64748B] group-hover:text-[#94A3B8]">
                    {area.tag}
                  </span>
                  <ArrowRight className={`w-4 h-4 text-[#64748B] ${isDark ? 'group-hover:text-[#00E5FF]' : 'group-hover:text-[#00838F]'} group-hover:translate-x-1.5 transition-all`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 4. EXPERIENCE HIGHLIGHTS                                                  */
/* ========================================================================= */
export const SelectedJourneySection: React.FC = () => {
  const { experiences, setCurrentRoute } = useData();
  const { isDark } = useTheme();

  const featured = experiences.filter(e => e.published && e.featured).slice(0, 4);

  return (
    <section className={`py-20 md:py-28 border-t ${
      isDark 
        ? 'border-[#1E293B] bg-gradient-to-b from-[#070C1E]/60 via-[#050814] to-[#070C1E]/60' 
        : 'border-[#E2E8F0] bg-gradient-to-b from-[#F1F5F9]/70 via-[#FFFFFF] to-[#F1F5F9]/60'
    } relative overflow-hidden`}>
      {/* Background architectural mesh */}
      <div className={`absolute top-1/2 left-0 w-80 h-80 ${isDark ? 'bg-[#00E5FF]/5' : 'bg-cyan-500/5'} blur-[100px] pointer-events-none rounded-full`} />
      <div className={`absolute bottom-0 right-0 w-80 h-80 ${isDark ? 'bg-[#10B981]/5' : 'bg-emerald-500/5'} blur-[100px] pointer-events-none rounded-full`} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} flex items-center gap-2`}>
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              Proven Milestones
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              Experience Highlights
            </h2>
          </div>
          <button
            onClick={() => setCurrentRoute('about')}
            className={`text-xs font-mono uppercase tracking-wider ${
              isDark 
                ? 'text-[#00E5FF] hover:text-[#38BDF8] bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/40 shadow-sm' 
                : 'text-[#00838F] hover:text-[#0284C7] bg-white border-[#CBD5E1] hover:border-[#00838F]/50 shadow-sm'
            } border flex items-center gap-1.5 group px-4 py-2.5 rounded-md transition-all`}
          >
            <span>Explore Full Timeline ({experiences.length} milestones)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setCurrentRoute('about')}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`p-7 rounded-2xl transition-all duration-300 cursor-pointer space-y-4 group border ${
                isDark
                  ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#00838F]/50 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider border ${
                  isDark
                    ? 'bg-[#050814] border-[#1E3A5F] text-[#00E5FF]'
                    : 'bg-cyan-50 border-cyan-200 text-[#00838F] font-semibold'
                }`}>
                  {item.category}
                </span>
                <span className={`text-xs font-mono ${isDark ? 'text-[#64748B]' : 'text-[#64748B]'} flex items-center gap-1`}>
                  <Calendar className="w-3 h-3" />
                  {item.startDate} {item.isCurrent ? '— Present' : item.endDate ? `— ${item.endDate}` : ''}
                </span>
              </div>

              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' : 'text-[#0F172A] group-hover:text-[#00838F]'} transition-colors`}>
                  {item.title}
                </h3>
                {item.roleTitle && (
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} font-mono mt-1`}>
                    {item.roleTitle} {item.organization ? `• ${item.organization}` : ''}
                  </p>
                )}
              </div>

              <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed line-clamp-3`}>
                {item.shortDescription}
              </p>

              <div className={`flex flex-wrap gap-1.5 pt-3 border-t ${isDark ? 'border-[#131F37]' : 'border-slate-100'}`}>
                {item.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md border ${
                      isDark
                        ? 'bg-[#050814] border-[#1E293B] text-[#94A3B8]'
                        : 'bg-slate-50 border-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 5. SELECTED WORK                                                          */
/* ========================================================================= */
export const SelectedWorkSection: React.FC = () => {
  const { projects, setCurrentRoute, setSelectedProjectSlug } = useData();
  const { isDark } = useTheme();

  const allPublished = projects.filter(p => p.published && p.category !== 'Unassigned');
  
  const marqueeProjects = React.useMemo(() => {
    if (allPublished.length === 0) return [];
    let base = [...allPublished];
    while (base.length < 6) {
      base = [...base, ...allPublished];
    }
    return [...base, ...base];
  }, [allPublished]);

  const handleProjectClick = (slug: string) => {
    setSelectedProjectSlug(slug);
    setCurrentRoute('work-detail');
  };

  return (
    <section className={`py-20 md:py-28 border-t ${
      isDark 
        ? 'border-[#1E293B] bg-[#050814]' 
        : 'border-[#E2E8F0] bg-[#F8FAFC]'
    } relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} flex items-center gap-2`}>
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              Engineered Creations
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              Selected Work
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentRoute('work')}
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark
                  ? 'text-[#00E5FF] hover:text-[#38BDF8] bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/40'
                  : 'text-[#00838F] hover:text-[#0284C7] bg-white border-[#CBD5E1] hover:border-[#00838F]/50 shadow-sm'
              } border flex items-center gap-1.5 group px-4 py-2.5 rounded-md transition-all shrink-0`}
            >
              <span>View All Projects ({allPublished.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Continuous Slider with THEME-ADAPTIVE Gradient Masks */}
      <div className="relative w-full overflow-hidden pause-on-hover">
        <div className={`absolute left-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-r ${
          isDark ? 'from-[#050814]' : 'from-[#F8FAFC]'
        } to-transparent z-10 pointer-events-none`} />
        
        <div className={`absolute right-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-l ${
          isDark ? 'from-[#050814]' : 'from-[#F8FAFC]'
        } to-transparent z-10 pointer-events-none`} />

        <div className="animate-marquee-left flex gap-6 px-4 py-4">
          {marqueeProjects.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              onClick={() => handleProjectClick(project.slug)}
              className={`w-[340px] sm:w-[380px] md:w-[420px] shrink-0 p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group border select-none ${
                isDark
                  ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#00838F]/60 shadow-md hover:shadow-2xl'
              }`}
            >
              <div className="space-y-4">
                {/* Thumbnail Image */}
                <div className={`relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-900 border ${isDark ? 'border-[#131F37]' : 'border-slate-200'}`}>
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">
                      {project.category}
                    </span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded bg-[#00E5FF]/20 backdrop-blur-md border border-[#00E5FF]/40 text-[9px] font-mono uppercase tracking-wider text-[#00E5FF]">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className={`text-lg md:text-xl font-bold ${isDark ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' : 'text-[#0F172A] group-hover:text-[#00838F]'} transition-colors leading-snug line-clamp-1`}>
                    {project.title}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed line-clamp-2`}>
                    {project.shortSummary}
                  </p>
                </div>

                {/* Technology Pills */}
                {project.technology && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technology.split(',').slice(0, 3).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${
                          isDark
                            ? 'bg-[#050814] text-[#94A3B8] border-[#1E293B]'
                            : 'bg-slate-50 text-[#475569] border-slate-200'
                        }`}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className={`pt-4 mt-4 border-t ${isDark ? 'border-[#131F37]' : 'border-slate-100'} flex items-center justify-between text-xs font-mono ${isDark ? 'text-[#00E5FF] group-hover:text-[#38BDF8]' : 'text-[#00838F] group-hover:text-[#0284C7]'}`}>
                <span className="font-semibold">Explore Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 6. LATEST WRITING & INSIGHTS                                             */
/* ========================================================================= */
export const LatestArticlesSection: React.FC = () => {
  const { blogPosts, setCurrentRoute, setSelectedBlogSlug } = useData();
  const { isDark } = useTheme();

  const publishedArticles = blogPosts.filter(p => p.status === 'PUBLISHED' && p.category !== 'Unassigned');

  const marqueeArticles = React.useMemo(() => {
    if (publishedArticles.length === 0) return [];
    let base = [...publishedArticles];
    while (base.length < 6) {
      base = [...base, ...publishedArticles];
    }
    return [...base, ...base];
  }, [publishedArticles]);

  const handleArticleClick = (slug: string) => {
    setSelectedBlogSlug(slug);
    setCurrentRoute('blog-detail');
  };

  return (
    <section className={`py-20 md:py-28 border-t ${
      isDark 
        ? 'border-[#1E293B] bg-gradient-to-b from-[#070C1E]/80 via-[#050814] to-[#070C1E]/80' 
        : 'border-[#E2E8F0] bg-gradient-to-b from-[#F1F5F9]/80 via-[#FFFFFF] to-[#F1F5F9]/80'
    } relative overflow-hidden`}>
      {/* Ambient background light orbs */}
      <div className={`absolute top-0 right-1/4 w-80 h-80 ${isDark ? 'bg-[#38BDF8]/5' : 'bg-sky-500/5'} blur-[100px] pointer-events-none rounded-full`} />
      <div className={`absolute bottom-0 left-1/4 w-80 h-80 ${isDark ? 'bg-[#00E5FF]/5' : 'bg-cyan-500/5'} blur-[100px] pointer-events-none rounded-full`} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} flex items-center gap-2`}>
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              Knowledge & Publications
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              Latest Writing & Insights
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentRoute('blog')}
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark
                  ? 'text-[#00E5FF] hover:text-[#38BDF8] bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/40'
                  : 'text-[#00838F] hover:text-[#0284C7] bg-white border-[#CBD5E1] hover:border-[#00838F]/50 shadow-sm'
              } border flex items-center gap-1.5 group px-4 py-2.5 rounded-md transition-all shrink-0`}
            >
              <span>All Articles ({publishedArticles.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Continuous Slider with THEME-ADAPTIVE Gradient Masks */}
      <div className="relative w-full overflow-hidden pause-on-hover">
        <div className={`absolute left-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-r ${
          isDark ? 'from-[#070C1E]' : 'from-[#F1F5F9]'
        } to-transparent z-10 pointer-events-none`} />
        
        <div className={`absolute right-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-l ${
          isDark ? 'from-[#070C1E]' : 'from-[#F1F5F9]'
        } to-transparent z-10 pointer-events-none`} />

        <div className="animate-marquee-right flex gap-6 px-4 py-4">
          {marqueeArticles.map((article, idx) => (
            <article
              key={`${article.id}-${idx}`}
              onClick={() => handleArticleClick(article.slug)}
              className={`w-[320px] sm:w-[360px] md:w-[390px] shrink-0 p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group border select-none ${
                isDark
                  ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#00838F]/60 shadow-md hover:shadow-2xl'
              }`}
            >
              <div className="space-y-4">
                {article.coverImageUrl && (
                  <div className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-900 border ${isDark ? 'border-[#131F37]' : 'border-slate-200'}`}>
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-[#00E5FF] uppercase">
                      {article.category}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                  <span className={`text-[11px] ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} uppercase tracking-wider font-semibold`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readingTime} min read
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className={`text-lg md:text-xl font-bold ${isDark ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' : 'text-[#0F172A] group-hover:text-[#00838F]'} transition-colors leading-snug line-clamp-1`}>
                    {article.title}
                  </h3>

                  <p className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed line-clamp-2`}>
                    {article.excerpt}
                  </p>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {article.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${
                          isDark
                            ? 'bg-[#050814] text-[#94A3B8] border-[#1E293B]'
                            : 'bg-slate-50 text-[#475569] border-slate-200'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={`pt-4 mt-4 border-t ${isDark ? 'border-[#131F37]' : 'border-slate-100'} flex items-center justify-between text-xs font-mono text-[#64748B] ${isDark ? 'group-hover:text-[#00E5FF]' : 'group-hover:text-[#00838F]'} transition-colors`}>
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <div className={`flex items-center gap-1 font-semibold ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'}`}>
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 7. PERSONAL CONVICTION (CINEMATIC LAYERED PARALLAX BACKGROUND)           */
/* ========================================================================= */
export const PersonalStatementSection: React.FC = () => {
  const { isDark } = useTheme();
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Multi-layer speed difference
  const bgLayerY = useTransform(scrollYProgress, [0, 1], ['-22%', '22%']);
  const quoteY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);

  return (
    <section 
      ref={sectionRef}
      className={`py-32 md:py-48 border-t ${
        isDark 
          ? 'border-[#1E293B] bg-[#050814]' 
          : 'border-[#E2E8F0] bg-[#F8FAFC]'
      } relative overflow-hidden`}
    >
      {/* Background Deep Mountain/Atmospheric Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          style={{ y: bgLayerY }}
          className="absolute -top-[30%] -bottom-[30%] -left-[10%] -right-[10%] w-[120%] h-[160%]"
        >
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
            alt="Atmospheric Landscape"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center ${
              isDark
                ? 'opacity-25 filter grayscale contrast-125 brightness-75 mix-blend-luminosity'
                : 'opacity-20 filter grayscale contrast-110 brightness-95'
            }`}
          />
        </motion.div>

        {/* Dynamic Gradient Blending Overlay */}
        <div 
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-b from-[#050814] via-[#050814]/80 to-[#050814]'
              : 'bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC]/80 to-[#F8FAFC]'
          }`} 
        />

        {/* Ambient colored lighting glows */}
        <div className={`absolute bottom-0 right-0 w-96 h-96 ${isDark ? 'bg-[#00E5FF]/15' : 'bg-cyan-500/10'} blur-[140px] rounded-full`} />
        <div className={`absolute top-0 left-0 w-96 h-96 ${isDark ? 'bg-[#3B82F6]/15' : 'bg-blue-500/10'} blur-[140px] rounded-full`} />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-left md:text-center relative z-10">
        <motion.div style={{ y: quoteY }} className="space-y-8">
          <span className={`text-xs font-mono uppercase tracking-[0.3em] ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} px-4 py-1.5 rounded-full ${isDark ? 'bg-[#0B132B]/80 border border-cyan-500/30' : 'bg-white border border-cyan-600/30'} backdrop-blur-md inline-block shadow-sm`}>
            Core Philosophy
          </span>

          <div className="space-y-6">
            <blockquote className={`text-3xl sm:text-4xl md:text-5xl ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} font-light leading-snug serif-accent`}>
              Technology taught me how to <span className={`${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} font-normal underline decoration-cyan-500/30 underline-offset-8`}>build</span>.
              <br />
              Design taught me how to <span className="text-[#0284C7] font-normal underline decoration-sky-500/30 underline-offset-8">communicate</span>.
              <br />
              Business taught me how to <span className="text-[#059669] font-normal underline decoration-emerald-500/30 underline-offset-8">think practically</span>.
            </blockquote>

            <p className={`text-base sm:text-lg ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} font-normal max-w-xl mx-auto pt-4 leading-relaxed`}>
              Together, these experiences shape how I engineer systems and solve complex challenges.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 8. CONTACT CTA (TEXTURED & ATMOSPHERIC CANVAS)                            */
/* ========================================================================= */
export const ContactCTASection: React.FC = () => {
  const { setCurrentRoute } = useData();
  const { isDark } = useTheme();

  return (
    <section className={`py-20 md:py-28 border-t ${
      isDark 
        ? 'border-[#1E293B] bg-[#050814]' 
        : 'border-[#E2E8F0] bg-[#F1F5F9]'
    } relative overflow-hidden`}>
      {/* Outer Atmospheric Texture & Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid mesh overlay */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[linear-gradient(to_right,#1E293B15_1px,transparent_1px),linear-gradient(to_bottom,#1E293B15_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#CBD5E140_1px,transparent_1px),linear-gradient(to_bottom,#CBD5E140_1px,transparent_1px)]'
        } bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]`} />
        
        {/* Ambient colored lighting glows */}
        <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 ${isDark ? 'bg-[#00E5FF]/8' : 'bg-cyan-500/8'} blur-[130px] rounded-full`} />
        <div className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 ${isDark ? 'bg-[#3B82F6]/8' : 'bg-blue-500/8'} blur-[130px] rounded-full`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className={`${
          isDark 
            ? 'bg-[#0B132B] border-[#1E3A5F] shadow-2xl' 
            : 'bg-white border-[#CBD5E1] shadow-2xl'
        } border p-8 md:p-14 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group`}>
          
          {/* Rich Background Photographic Texture inside Card */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
              alt="Night Sky Texture"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-all duration-700 transform group-hover:scale-105 ${
                isDark
                  ? 'opacity-20 filter grayscale contrast-125 brightness-90 mix-blend-luminosity'
                  : 'opacity-10 filter grayscale contrast-125'
              }`}
            />
            {/* Gradient Overlays for optimal contrast & readability */}
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-to-r from-[#0B132B] via-[#0B132B]/90 to-[#0B132B]/70' 
                : 'bg-gradient-to-r from-white via-white/95 to-white/80'
            }`} />

            {/* Subtle Dot Grid Texture */}
            <div className={`absolute inset-0 ${
              isDark
                ? 'bg-[radial-gradient(#00E5FF_1px,transparent_1px)] opacity-10'
                : 'bg-[radial-gradient(#00838F_1px,transparent_1px)] opacity-15'
            } [background-size:20px_20px]`} />
          </div>

          {/* Glowing Top Accent Line */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${isDark ? 'from-transparent via-[#00E5FF] to-transparent' : 'from-transparent via-[#00838F] to-transparent'} z-10`} />
          
          <div className="space-y-3 max-w-xl relative z-10">
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'} flex items-center gap-2`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              Let's Connect
            </span>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'} tracking-tight`}>
              Have an idea, project or opportunity?
            </h2>
            <p className={`text-sm ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'} leading-relaxed`}>
              Interested in connecting with founders, investors, and operators working on cross‑border businesses, scalable brands, or ventures where operations, finance, and compliance are core advantages.
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('contact')}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-wider ${
              isDark
                ? 'text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.35)]'
                : 'text-white bg-gradient-to-r from-[#00838F] to-[#0284C7] hover:from-[#0284C7] hover:to-[#00838F] shadow-[0_4px_14px_rgba(0,131,143,0.35)]'
            } transition-all rounded-md flex items-center gap-2 shrink-0 group transform hover:-translate-y-0.5 relative z-10`}
          >
            <span>Contact Me</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export const HomeSections: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const { isDark } = useTheme();

  return (
    <div className="space-y-0 animate-fade-in relative">
      {/* Top Global Scroll Progress Bar (Minimalist Parallax Telemetry) */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className={`fixed top-0 left-0 right-0 h-[2.5px] origin-left z-50 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#60A5FA]'
            : 'bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#2563EB]'
        }`}
      />

      <HeroSection />
      <IntroductionSection />
      <CoreAreasSection />
      <SelectedJourneySection />
      <SelectedWorkSection />
      <LatestArticlesSection />
      <PersonalStatementSection />
      <ContactCTASection />
    </div>
  );
};
