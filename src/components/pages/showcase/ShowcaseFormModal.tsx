import React, { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { ShowcaseItemType } from './ShowcaseItem';
import { ShowcaseCategoryType } from '../../../../convex/constants';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { devConsole } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from '../../uis/Button';

interface ShowcaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  showcase: ShowcaseItemType | null;
  onSubmitSuccess: () => void;
  categories: ShowcaseCategoryType[];
}

const ShowcaseFormModal = ({
  isOpen,
  onClose,
  isEditMode,
  showcase,
  onSubmitSuccess,
  categories,
}: ShowcaseFormProps) => {
  const { t } = useTranslation();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [otherLinks, setOtherLinks] = useState<Array<string>>([]);
  const [otherLinkInput, setOtherLinkInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Add state to track form submission success
  const [successMessage, setSuccessMessage] = useState('');

  // Mutations
  const createShowcase = useMutation(api.showcases.mutation.createShowcase);
  const updateShowcase = useMutation(api.showcases.mutation.updateShowcase);

  // Initialize form with showcase data if in edit mode
  useEffect(() => {
    if (isEditMode && showcase) {
      setTitle(showcase.title);
      setDescription(showcase.description);
      setCategory(showcase.category);
      setAppStoreUrl(showcase.appStoreUrl || '');
      setPlayStoreUrl(showcase.playStoreUrl || '');
      setWebsiteUrl(showcase.websiteUrl || '');

      // Handle otherLinks with improved type checking and type assertions
      if (showcase.otherLinks) {
        if (typeof showcase.otherLinks === 'string') {
          // Use type assertion to tell TypeScript this is a string
          const linkString = showcase.otherLinks as string;
          setOtherLinks(linkString.split(',').filter((link) => link.trim()));
        } else if (Array.isArray(showcase.otherLinks)) {
          // Use type assertion to tell TypeScript this is an array
          setOtherLinks(showcase.otherLinks);
        } else {
          setOtherLinks([]);
        }
      } else {
        setOtherLinks([]);
      }

      setTags(showcase.tags || []);
      setImageUrl(showcase.imageUrl || '');
    } else {
      // Default values for new showcase
      setTitle('');
      setDescription('');
      setCategory(categories.length > 0 ? categories[0].key : '');
      setAppStoreUrl('');
      setPlayStoreUrl('');
      setWebsiteUrl('');
      setOtherLinks([]);
      setOtherLinkInput('');
      setTagInput('');
      setTags([]);
      setImageUrl('');
    }
  }, [isEditMode, showcase, categories]);

  // Add state to track IME composition
  const [isComposing, setIsComposing] = useState(false);

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Update tag input keydown handler to check composition state
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    // Skip if we're in the middle of an IME composition (for languages like Korean, Japanese, Chinese)
    if (isComposing) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle IME composition events
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // Handle adding another link
  const handleAddLink = () => {
    if (otherLinkInput.trim()) {
      const newLink = otherLinkInput.trim();
      if (!otherLinks.includes(newLink)) {
        setOtherLinks([...otherLinks, newLink]);
        setOtherLinkInput('');
      }
    }
  };

  // Update link input keydown handler to check composition state
  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    // Skip if we're in the middle of an IME composition
    if (isComposing) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  // Handle removing a link
  const handleRemoveLink = (linkToRemove: string) => {
    setOtherLinks(otherLinks.filter((link) => link !== linkToRemove));
  };

  // Add URL validation utility
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is allowed, required check is separate

    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return pattern.test(url);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (!title.trim()) {
      setError(t('showcase.form.error.titleRequired'));
      return;
    }

    if (!category) {
      setError(t('showcase.form.error.categoryRequired'));
      return;
    }

    if (!imageUrl.trim()) {
      setError(t('showcase.form.error.imageRequired'));
      return;
    }

    // URL validation
    if (websiteUrl.trim() && !isValidUrl(websiteUrl)) {
      setError(t('showcase.form.error.invalidUrl', { url: websiteUrl }));
      return;
    }

    if (appStoreUrl.trim() && !isValidUrl(appStoreUrl)) {
      setError(t('showcase.form.error.invalidUrl', { url: appStoreUrl }));
      return;
    }

    if (playStoreUrl.trim() && !isValidUrl(playStoreUrl)) {
      setError(t('showcase.form.error.invalidUrl', { url: playStoreUrl }));
      return;
    }

    // Check if at least one URL is provided
    if (!websiteUrl.trim() && !appStoreUrl.trim() && !playStoreUrl.trim()) {
      setError(t('showcase.form.error.oneUrlRequired'));
      return;
    }

    // Validate each other link
    for (const link of otherLinks) {
      if (!isValidUrl(link)) {
        setError(t('showcase.form.error.invalidUrl', { url: link }));
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Join array of otherLinks into a comma-separated string
      const otherLinksString = otherLinks.length > 0 ? otherLinks.join(',') : undefined;

      // We can let the server handle the https:// prefixing to avoid duplication
      const showcaseData = {
        title: title.trim(),
        description, // Description will be included even if empty
        category,
        appStoreUrl: appStoreUrl.trim() || undefined,
        playStoreUrl: playStoreUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        otherLinks: otherLinksString, // Pass as string instead of array
        tags: tags.length > 0 ? tags : undefined,
        imageUrl: imageUrl.trim(),
      };

      if (isEditMode && showcase) {
        // Update existing showcase
        await updateShowcase({
          showcaseId: showcase._id as Id<'showcases'>,
          ...showcaseData,
        });
        setSuccessMessage(t('showcase.form.success.updated'));
      } else {
        // Create new showcase
        await createShowcase(showcaseData);
        setSuccessMessage(t('showcase.form.success.created'));
      }

      // Auto close after showing success message for 1 second
      setTimeout(() => {
        onSubmitSuccess();
      }, 1000);
    } catch (error) {
      devConsole.error('Error submitting showcase:', error);
      setError(t('showcase.form.error.general'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70 dark:bg-black/80">
      <div
        className={cn(
          'flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg shadow-xl',
          'bg-gray-100 dark:bg-gray-800',
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4',
            'border-b border-gray-200 dark:border-gray-700',
            'bg-gray-200 dark:bg-gray-700',
          )}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {isEditMode ? t('showcase.form.edit') : t('showcase.form.create')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-1"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-800">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
            {/* Display error message */}
            {error && (
              <div
                className={cn(
                  'rounded-md p-3 text-sm',
                  'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400',
                )}
              >
                {error}
              </div>
            )}

            {/* Display success message */}
            {successMessage && (
              <div
                className={cn(
                  'rounded-md p-3 text-sm',
                  'bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400',
                  'animate-fadeIn',
                )}
              >
                {successMessage}
              </div>
            )}

            {/* Category - Moved to the top */}
            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('showcase.form.category')}{' '}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(
                    'w-full rounded-md border px-4 py-2 pr-10', // Added pr-10 for more right padding
                    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                    'text-gray-900 dark:text-gray-100',
                    'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                    'appearance-none', // Ensures native dropdown arrow is hidden
                  )}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {t(`showcaseCategories.${cat.key}.name`, {
                        defaultValue: cat.name || cat.key
                      })}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow with better positioning */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg
                    className="h-4 w-4 fill-current text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('showcase.form.title')} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  'w-full rounded-md border px-4 py-2',
                  'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                  'text-gray-900 dark:text-gray-100',
                  'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                )}
                placeholder={t('showcase.form.titlePlaceholder')}
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('showcase.form.imageUrl')}{' '}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="flex">
                <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-l-md">
                  https://
                </div>
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={cn(
                    'flex-1 rounded-r-md border border-l-0 px-4 py-2',
                    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                    'text-gray-900 dark:text-gray-100',
                    'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                  )}
                  placeholder="example.com/image.jpg"
                  required
                />
                {imageUrl && (
                  <div className="ml-3 h-10 w-10 overflow-hidden rounded border border-gray-300 dark:border-gray-600">
                    <img
                      src={imageUrl.startsWith('http') ? imageUrl : `https://${imageUrl}`}
                      alt="Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.it/40x40?text=Error';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('showcase.form.imageUrlHelp')}
              </p>
            </div>

            {/* URLs */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">
                {t('showcase.form.links')} <span className="text-red-500 dark:text-red-400">*</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">
                  {t('showcase.form.linksRequired')}
                </span>
              </h4>

              {/* Website URL */}
              <div>
                <label
                  htmlFor="websiteUrl"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('showcase.form.websiteUrl')}
                </label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-l-md">
                    https://
                  </div>
                  <input
                    id="websiteUrl"
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className={cn(
                      'flex-1 rounded-r-md border border-l-0 px-4 py-2',
                      'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                      'text-gray-900 dark:text-gray-100',
                      'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                    )}
                    placeholder="example.com"
                  />
                </div>
              </div>

              {/* App Store URL */}
              <div>
                <label
                  htmlFor="appStoreUrl"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('showcase.form.appStoreUrl')}
                </label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-l-md">
                    https://
                  </div>
                  <input
                    id="appStoreUrl"
                    type="text"
                    value={appStoreUrl}
                    onChange={(e) => setAppStoreUrl(e.target.value)}
                    className={cn(
                      'flex-1 rounded-r-md border border-l-0 px-4 py-2',
                      'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                      'text-gray-900 dark:text-gray-100',
                      'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                    )}
                    placeholder="apps.apple.com/app/..."
                  />
                </div>
              </div>

              {/* Play Store URL */}
              <div>
                <label
                  htmlFor="playStoreUrl"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('showcase.form.playStoreUrl')}
                </label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-l-md">
                    https://
                  </div>
                  <input
                    id="playStoreUrl"
                    type="text"
                    value={playStoreUrl}
                    onChange={(e) => setPlayStoreUrl(e.target.value)}
                    className={cn(
                      'flex-1 rounded-r-md border border-l-0 px-4 py-2',
                      'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                      'text-gray-900 dark:text-gray-100',
                      'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                    )}
                    placeholder="play.google.com/store/apps/..."
                  />
                </div>
              </div>
            </div>

            {/* Other Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('showcase.form.otherLinks')}
                </label>
              </div>
              {/* 기존 링크 목록 표시 */}
              <div className="flex flex-wrap gap-2 mb-2">
                {otherLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    <span className="text-sm truncate max-w-[200px]">{link}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLink(link)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>

              {/* 링크 추가 UI */}
              <div className="flex">
                <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-l-md">
                  https://
                </div>
                <input
                  type="text"
                  value={otherLinkInput}
                  onChange={(e) => setOtherLinkInput(e.target.value)}
                  onKeyDown={handleLinkKeyDown}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  className={cn(
                    'flex-1 border border-l-0 px-4 py-2',
                    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                    'text-gray-900 dark:text-gray-100',
                    'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                    'rounded-r-none',
                  )}
                  placeholder="example.com/page"
                />
                <Button
                  variant={otherLinkInput.trim() ? "default" : "secondary"}
                  size="sm"
                  onClick={handleAddLink}
                  disabled={!otherLinkInput.trim()}
                  className="rounded-l-none"
                >
                  {t('showcase.form.addLink')}
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('showcase.form.tags')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    <span>{tag}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  className={cn(
                    'flex-1 rounded-l-md border px-4 py-2',
                    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                    'text-gray-900 dark:text-gray-100',
                    'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                  )}
                  placeholder={t('showcase.form.tagsPlaceholder')}
                />
                <Button
                  variant={tagInput.trim() ? "default" : "secondary"}
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="rounded-l-none"
                >
                  {t('showcase.form.addTag')}
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('showcase.form.description')}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={cn(
                  'w-full rounded-md border px-4 py-2 resize-none',
                  'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
                  'text-gray-900 dark:text-gray-100',
                  'focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400',
                )}
                placeholder={t('showcase.form.descriptionPlaceholder')}
              />
            </div>
          </form>
        </div>

        {/* Footer with Buttons */}
        <div
          className={cn(
            'flex justify-end gap-3 px-6 py-4',
            'border-t border-gray-200 dark:border-gray-700',
            'bg-gray-200 dark:bg-gray-700',
          )}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting || !!successMessage}
          >
            {t('showcase.form.cancel')}
          </Button>
          <Button
            variant="default"
            onClick={(e) => void handleSubmit(e)}
            disabled={isSubmitting || !!successMessage}
          >
            {isSubmitting
              ? t('showcase.form.submitting')
              : isEditMode
                ? t('showcase.form.update')
                : t('showcase.form.createButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseFormModal;
