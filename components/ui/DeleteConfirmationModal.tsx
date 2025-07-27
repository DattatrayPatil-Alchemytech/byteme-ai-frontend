'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  itemName,
  isLoading = false
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Modal Content */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Header */}
                <div className="relative p-6 pb-4">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 15 }}
                      className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
                    >
                      <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </motion.div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100 mb-2">
                    {title}
                  </h3>
                  
                  {/* Message */}
                  <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
                    {message}
                  </p>
                  
                  {/* Item Name */}
                  {itemName && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Item to delete:</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{itemName}</p>
                    </div>
                  )}
                  
                  {/* Warning */}
                  <div className="flex items-center justify-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                      This action cannot be undone
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 p-6 pt-0">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isDeleting || isLoading}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirm}
                    disabled={isDeleting || isLoading}
                    className="flex-1 h-11 relative overflow-hidden"
                  >
                    {isDeleting || isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Deleting...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </motion.div>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 