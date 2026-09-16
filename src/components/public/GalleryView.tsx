import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Eye } from 'lucide-react';
import { Lightbox } from '../ui/Lightbox';
import { motion } from 'motion/react';

export const GalleryView: React.FC = () => {
  const { galleryImages } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const publishedImages = galleryImages
    .filter(img => img.published && img.category !== 'Unassigned')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const categories = ['ALL', ...Array.from(new Set(publishedImages.map(img => img.category).filter(c => Boolean(c) && c !== 'Unassigned')))];

  const filteredImages = selectedCategory === 'ALL'
    ? publishedImages
    : publishedImages.filter(img => img.category === selectedCategory);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className="space-y-4 border-b border-[#1E293B] pb-10 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
            <span className="w-2 h-[1px] bg-[#00E5FF]" />
            Visual Moments & Workspace
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] uppercase">
            Image Gallery
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed">
            An editorial collection of physical craft, technology foundations, typography explorations, and perspectives from Nepal.
          </p>
        </div>

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

        {/* Editorial Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => handleOpenLightbox(idx)}
              className="break-inside-avoid group cursor-pointer bg-[#0B132B] border border-[#1E293B] hover:border-[#00E5FF]/50 rounded-xl overflow-hidden transition-all duration-300 space-y-2 pb-3 shadow-sm hover:shadow-[0_0_25px_rgba(0,229,255,0.12)]"
            >
              <div className="relative overflow-hidden bg-[#050814]">
                <img
                  src={img.url}
                  alt={img.altText}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transition-all duration-500 transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                    <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>View fullscreen</span>
                  </div>
                </div>
              </div>

              {/* Caption & Category */}
              <div className="px-4 pt-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider">
                  <span>{img.category}</span>
                  <span className="text-[#64748B]">0{idx + 1}</span>
                </div>
                {img.caption && (
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-1 font-normal">
                    {img.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredImages.map(img => ({ url: img.url, altText: img.altText, caption: img.caption }))}
        currentIndex={lightboxIndex}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
