import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { t } from 'i18next';
import { Button } from '@/components/uis/Button';

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
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {modalCancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {modalConfirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
