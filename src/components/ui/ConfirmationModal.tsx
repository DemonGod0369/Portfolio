import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { confirmModal, closeConfirmModal } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmModal.isOpen) {
        closeConfirmModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmModal.isOpen, closeConfirmModal]);

  if (!confirmModal.isOpen) return null;

  return (
    <AnimatePresence>
      {confirmModal.isOpen && (
        <div
          id="confirmation-modal-backdrop"
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeConfirmModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md bg-[#121212] border border-[#2a2a2a] text-[#F5F5F5] rounded-lg shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full shrink-0 ${confirmModal.destructive !== false ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {confirmModal.destructive !== false ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 id="modal-title" className="text-base font-serif font-bold text-[#F5F5F5] leading-snug">
                  {confirmModal.title}
                </h3>
                <p className="mt-2 text-xs text-[#969696] leading-relaxed">
                  {confirmModal.message || 'This action cannot be undone. The selected record will be permanently deleted from the system.'}
                </p>
              </div>

              <button
                id="modal-close-button"
                onClick={closeConfirmModal}
                className="text-[#737373] hover:text-[#F5F5F5] transition-colors p-1"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
              <button
                id="modal-cancel-button"
                onClick={closeConfirmModal}
                className="px-4 py-2 text-xs font-mono tracking-wider uppercase text-[#A3A3A3] hover:text-[#F5F5F5] bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] rounded transition-colors"
              >
                Cancel
              </button>

              <button
                id="modal-confirm-button"
                onClick={() => {
                  try {
                    confirmModal.onConfirm();
                  } finally {
                    closeConfirmModal();
                  }
                }}
                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase font-semibold text-white rounded transition-colors flex items-center gap-2 ${
                  confirmModal.destructive !== false
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/30'
                    : 'bg-[#c6a87d] hover:bg-[#b59567] text-black shadow-lg'
                }`}
              >
                {confirmModal.destructive !== false && <Trash2 className="w-3.5 h-3.5" />}
                {confirmModal.confirmLabel || (confirmModal.destructive !== false ? 'Delete' : 'Confirm')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
