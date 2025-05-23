import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { t } from 'i18next';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  targetName?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText,
  confirmText,
  targetName,
}: ConfirmDeleteModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  // Default texts
  const modalTitle = title || t('common.deleteConfirmTitle', { defaultValue: 'Confirm Delete' });
  const modalMessage =
    message ||
    t('common.deleteConfirmMessage', {
      defaultValue: 'This action cannot be undone. Are you sure you want to delete this item?',
      target: targetName,
    });
  const modalCancelText = cancelText || t('common.cancel', { defaultValue: 'Cancel' });
  const modalConfirmText = confirmText || t('common.delete', { defaultValue: 'Delete' });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          'p-6 rounded-lg max-w-md w-full',
          'bg-background dark:bg-gray-800',
          'shadow-xl dark:shadow-black/30',
          'border border-border/30 dark:border-gray-700',
          'backdrop-blur-sm',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-title" className="text-lg font-semibold mb-2 dark:text-white">
          {modalTitle}
        </h3>
        <p className="text-muted-foreground dark:text-gray-300 mb-4">{modalMessage}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'bg-muted dark:bg-gray-700',
              'hover:bg-muted/80 dark:hover:bg-gray-600',
            )}
          >
            {modalCancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'bg-rose-500 text-white',
              'hover:bg-rose-600 dark:hover:bg-rose-600',
            )}
          >
            {modalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
