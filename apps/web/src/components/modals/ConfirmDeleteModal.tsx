import * as Dialog from '@radix-ui/react-dialog';
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

  // Radix handles Escape, the focus trap, scroll lock and returning focus to the trigger.
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          role="alertdialog"
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overscroll-contain rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl"
        >
          <Dialog.Title className="mb-2 text-lg font-bold">{modalTitle}</Dialog.Title>
          <Dialog.Description className="mb-6 text-sm leading-6 text-muted-foreground">
            {modalMessage}
          </Dialog.Description>
          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            {/* Cancel takes initial focus so Enter never deletes by accident. */}
            <Dialog.Close asChild>
              <Button variant="outline" className="w-full sm:w-auto" autoFocus>
                {modalCancelText}
              </Button>
            </Dialog.Close>
            <Button
              onClick={onConfirm}
              variant="outline"
              className="w-full border-destructive/40 text-destructive hover:border-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            >
              {modalConfirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
