import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UnifiedItem } from './CaseStudiesAndJournalView';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeaturedCarouselProps {
  items: UnifiedItem[];
  onOpenItem: (item: UnifiedItem) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items = [], onOpenItem }) => {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Take only the most recent 5 items
  const featuredItems = (items || []).slice(0, 5);
  const totalSlides = featuredItems.length;

  // Clamp index if totalSlides changes
  useEffect(() => {
    if (totalSlides > 0 && currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // 4.5-second ultra-smooth auto slide timer with pause on hover/touch
  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, totalSlides, nextSlide]);

  if (!featuredItems || totalSlides === 0) return null;

  const safeIndex = totalSlides > 0 ? Math.min(Math.max(0, currentIndex), totalSlides - 1) : 0;
  const currentItem = featuredItems[safeIndex];

  if (!currentItem) return null;

  // Ultra-smooth easing curve matching modern studio transitions
  const transitionConfig = {
    duration: 0.6,
    ease: "easeInOut" as const,
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '40%' : '-40%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? '40%' : '-40%',
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <div 
      className="relative w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Featured Header & Navigation Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 uppercase tracking-wider text-[11px] font-mono font-bold rounded flex items-center gap-1.5 border ${
            isDark 
              ? 'bg-[#050814] border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
              : 'bg-cyan-50 border-cyan-300 text-[#00838F]'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Featured Spotlight
          </span>
        </div>

        {/* Carousel Arrow Controls */}
        {totalSlides > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous Featured Slide"
              className={`p-1.5 rounded-md border transition-all duration-300 ${
                isDark
                  ? 'bg-[#0B132B] border-[#1E293B] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/60 active:scale-95'
                  : 'bg-white border-[#CBD5E1] text-[#475569] hover:text-[#00838F] hover:border-[#00838F]/60 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next Featured Slide"
              className={`p-1.5 rounded-md border transition-all duration-300 ${
                isDark
                  ? 'bg-[#0B132B] border-[#1E293B] text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/60 active:scale-95'
                  : 'bg-white border-[#CBD5E1] text-[#475569] hover:text-[#00838F] hover:border-[#00838F]/60 active:scale-95'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Slide Card Container with Smooth Overflow Clipping */}
      <div className="relative overflow-hidden rounded-2xl will-change-transform">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentItem.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transitionConfig}
            onClick={() => onOpenItem(currentItem)}
            className={`p-6 sm:p-9 md:p-11 rounded-2xl cursor-pointer transition-all duration-500 group border relative overflow-hidden shadow-lg ${
              isDark 
                ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.18)]' 
                : 'bg-white border-[#CBD5E1] hover:border-[#00838F]/60 hover:shadow-2xl'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                  {/* Format Tag */}
                  <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-md border ${
                    currentItem.type === 'CASE_STUDY'
                      ? isDark 
                        ? 'bg-[#050814] border-blue-500/40 text-blue-400' 
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                      : isDark
                        ? 'bg-[#050814] border-purple-500/40 text-purple-400'
                        : 'bg-purple-50 border-purple-200 text-purple-700'
                  }`}>
                    {currentItem.type === 'CASE_STUDY' ? 'Case Study' : 'Journal Article'}
                  </span>

                  <span className={`uppercase tracking-wider font-semibold text-[11px] ${
                    isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
                  }`}>
                    {currentItem.category}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-colors leading-tight ${
                    isDark 
                      ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' 
                      : 'text-[#0F172A] group-hover:text-[#00838F]'
                  }`}>
                    {currentItem.title}
                  </h2>
                  
                  <p className={`text-sm sm:text-base leading-relaxed line-clamp-3 ${
                    isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                  }`}>
                    {currentItem.summary}
                  </p>
                </div>

                <div className={`pt-4 flex items-center justify-between border-t text-xs font-mono font-bold uppercase tracking-wider ${
                  isDark ? 'border-[#1E293B] text-[#00E5FF]' : 'border-slate-200 text-[#00838F]'
                }`}>
                  <span>
                    {currentItem.type === 'CASE_STUDY' ? 'Explore Full Case Study' : 'Read Journal Article'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Right Image / Hero Media */}
              {currentItem.heroImage ? (
                <div className="lg:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#050814] border border-[#1E293B]">
                  <img
                    src={currentItem.heroImage}
                    alt={currentItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 p-2 bg-[#050814]/80 backdrop-blur-sm rounded-full text-[#00E5FF] border border-cyan-500/30">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-5 aspect-[16/10] rounded-xl bg-gradient-to-br from-[#0B132B] to-[#050814] border border-[#1E293B] flex items-center justify-center p-8 text-center">
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-[#00E5FF]/40 mx-auto" />
                    <p className="text-xs font-mono text-[#94A3B8] uppercase">Published in {currentItem.category}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicator Bar Navigation */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {featuredItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                idx === currentIndex
                  ? 'w-8 bg-[#00E5FF]'
                  : isDark 
                    ? 'w-2 bg-[#1E293B] hover:bg-[#334155]' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
