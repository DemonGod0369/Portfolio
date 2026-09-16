import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toastMessage } = useData();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#171717] border border-[#333333] text-[#F5F5F5] px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md max-w-md"
        >
          <CheckCircle2 className="w-4 h-4 text-[#c6a87d] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toastMessage}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
