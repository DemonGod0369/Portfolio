import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; altText: string; caption?: string }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 z-50 p-2 text-[#969696] hover:text-[#F5F5F5] transition-colors rounded-full hover:bg-white/10"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 md:left-8 z-50 p-3 text-[#969696] hover:text-[#F5F5F5] transition-colors rounded-full hover:bg-white/10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Main Content */}
        <div
          className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={currentImage.url}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            src={currentImage.url}
            alt={currentImage.altText}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-md shadow-2xl border border-[#262626]"
          />

          <div className="mt-4 text-center max-w-xl">
            {currentImage.caption && (
              <p className="text-sm text-[#F5F5F5] font-medium leading-relaxed">
                {currentImage.caption}
              </p>
            )}
            <p className="text-xs text-[#969696] font-mono mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % images.length);
            }}
            className="absolute right-4 md:right-8 z-50 p-3 text-[#969696] hover:text-[#F5F5F5] transition-colors rounded-full hover:bg-white/10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
