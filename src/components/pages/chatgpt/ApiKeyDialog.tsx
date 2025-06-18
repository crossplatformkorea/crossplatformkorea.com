import { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { Button } from '@/components/uis/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/uis/Dialog';
import { t } from '@/lib/i18n';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySaved?: (apiKey: string) => void;
  onStoreApiKey: (args: { apiKey: string }) => Promise<any>;
  existingApiKey?: string | null;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  onApiKeySaved,
  onStoreApiKey,
  existingApiKey,
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing API key when dialog opens
  useEffect(() => {
    if (open && existingApiKey) {
      setApiKey(existingApiKey);
    }
  }, [open, existingApiKey]);

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    // Basic client-side validation
    if (!apiKey.trim().startsWith('sk-')) {
      alert(t('chat.errors.invalidApiKeyFormat'));
      return;
    }

    setIsLoading(true);
    try {
      // Store in Convex database instead of session storage
      await onStoreApiKey({ apiKey: apiKey.trim() });

      // Update parent component state immediately
      if (onApiKeySaved) {
        onApiKeySaved(apiKey.trim());
      }
      onOpenChange(false);
      setApiKey('');
    } catch (error) {
      console.error('Failed to save API key:', error);
      alert(error instanceof Error ? error.message : 'Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Key size={20} />
            {t('chat.apiKey.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-zinc-300">
              {t('chat.apiKey.label')}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t('chat.apiKey.placeholder')}
              className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-600 focus:border-gray-400 dark:focus:border-zinc-600"
            />
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{t('chat.apiKey.description')}</p>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">{t('chat.apiKey.sessionNotice')}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={!apiKey.trim() || isLoading}
              className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white"
            >
              {isLoading ? t('common.buttons.saving') : t('common.buttons.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
