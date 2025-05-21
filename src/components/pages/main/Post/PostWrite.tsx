import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Image,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlertCircle,
  Eye,
  Edit,
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTranslation } from 'react-i18next';
import { useConvexAuth } from 'convex/react';
import { cn } from '../../../../lib/utils';

// Import a markdown rendering library (you may need to install this)
// For example: npm install react-markdown
import ReactMarkdown from 'react-markdown';

interface PostWriteProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export default function PostWrite({ isOpen, onClose, defaultCategory }: PostWriteProps) {
  const { t } = useTranslation();
  const { isAuthenticated } = useConvexAuth();

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // State for form values
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'GENERAL');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // State for view mode (especially for mobile)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation states
  const [isClosing, setIsClosing] = useState(false);
  const [previousFullscreen, setPreviousFullscreen] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  // Mutations
  //   const createPost = useMutation(api.posts.createPost);

  // Get categories from API
  const categories = useQuery(api.categories.getCategories);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle modal open animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Start with modal positioned at bottom
      setHasAppeared(false);

      // Use RAF to ensure browser renders the initial position first
      requestAnimationFrame(() => {
        // Then use setTimeout to trigger the animation
        setTimeout(() => {
          setHasAppeared(true);
        }, 10);
      });

      // Focus title input after animation completes
      const focusTimer = setTimeout(() => {
        titleRef.current?.focus();
      }, 350);

      return () => clearTimeout(focusTimer);
    } else {
      document.body.style.overflow = 'auto';
      setHasAppeared(false);
    }
  }, [isOpen]);

  // Manage fullscreen toggle animations
  useEffect(() => {
    if (isFullscreen !== previousFullscreen) {
      setPreviousFullscreen(isFullscreen);
    }
  }, [isFullscreen, previousFullscreen]);

  // Set initial category if provided
  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Handle adding tags
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }

    setTagInput('');
  };

  // Handle tag input key events
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle formatting buttons for the content textarea
  const handleFormatting = (format: string) => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';
    let cursorPosition = 0;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorPosition = start + 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorPosition = start + 1;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link'}](url)`;
        cursorPosition = start + 1;
        break;
      case 'image':
        formattedText = `![${selectedText || 'alt text'}](image_url)`;
        cursorPosition = start + 2;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        cursorPosition = start + 3;
        break;
      case 'ordered-list':
        formattedText = `\n1. ${selectedText}`;
        cursorPosition = start + 4;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Set focus back to textarea with cursor position
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.selectionStart = selectedText
          ? start + formattedText.length
          : cursorPosition;
        contentRef.current.selectionEnd = selectedText
          ? start + formattedText.length
          : cursorPosition;
      }
    }, 0);
  };

  // Modified close handler to support exit animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling the actual onClose
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match transition duration
  };

  // Toggle fullscreen mode with animation
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError(t('errors.authRequired'));
      return;
    }

    if (!title.trim()) {
      setError(t('errors.titleRequired'));
      return;
    }

    if (!content.trim()) {
      setError(t('errors.contentRequired'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Add dark mode compatible input styling throughout the component
      //   await createPost({
      //     title,
      //     content,
      //     category,
      //     tags,
      //   });

      // Reset form and close modal on success
      setTitle('');
      setContent('');
      setTags([]);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setError(t('errors.postCreationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything if modal is closed and not in closing animation
  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-center transition-all duration-300 ease-out',
        isFullscreen ? 'items-center' : 'items-end',
        isOpen && !isClosing
          ? 'opacity-100 bg-black/60 backdrop-blur-sm'
          : 'opacity-0 bg-black/0 backdrop-blur-none',
        !isOpen && !isClosing && 'pointer-events-none',
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-background overflow-hidden flex flex-col',
          'transform transition-all duration-300 ease-out',
          'shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)]',
          'dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] dark:border dark:border-gray-700/80',
          // Increase width by changing max-w-5xl to max-w-7xl (1280px)
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-[98%] max-w-7xl mx-auto max-h-[85vh] rounded-t-xl',
          // Animation states - improved transition
          hasAppeared ? 'translate-y-0' : 'translate-y-full',
          isClosing && 'translate-y-full',
        )}
        aria-modal="true"
        role="dialog"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700/70">
          <h2 className="text-xl font-semibold">{t('postWrite.writeNewPost')}</h2>

          <div className="flex items-center gap-2">
            {/* View toggle for mobile */}
            <div className="md:hidden flex items-center gap-2 bg-muted/50 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className={cn(
                  'p-2 text-sm transition-colors flex items-center gap-1',
                  !isPreviewMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                )}
              >
                <Edit size={16} />
                {t('postWrite.edit')}
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewMode(true)}
                className={cn(
                  'p-2 text-sm transition-colors flex items-center gap-1',
                  isPreviewMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                )}
              >
                <Eye size={16} />
                {t('postWrite.preview')}
              </button>
            </div>

            {/* Fullscreen toggle button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label={isFullscreen ? t('common.exitFullscreen') : t('common.enterFullscreen')}
              title={isFullscreen ? t('common.exitFullscreen') : t('common.enterFullscreen')}
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3v4a1 1 0 0 1-1 1H3"></path>
                  <path d="M21 8h-4a1 1 0 0 1-1-1V3"></path>
                  <path d="M3 16h4a1 1 0 0 1 1 1v4"></path>
                  <path d="M16 21v-4a1 1 0 0 1 1-1h4"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              )}
            </button>

            {/* Close button - updated to use handleClose */}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label={t('common.close')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Post metadata inputs */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title input */}
            <div>
              <label htmlFor="post-title" className="block text-sm font-medium mb-1">
                {t('postWrite.titleLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                ref={titleRef}
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('postWrite.titlePlaceholder')}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 
                  dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
            </div>

            {/* Category selection */}
            <div>
              <label htmlFor="post-category" className="block text-sm font-medium mb-1">
                {t('postWrite.categoryLabel')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="post-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 pr-10 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30
                    dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 appearance-none"
                >
                  {categories?.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.icon} {t(`postCategories.${cat.key}.name`)}
                    </option>
                  )) || <option value="GENERAL">{t('postCategories.GENERAL.name')}</option>}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tags input */}
          <div className="mt-4">
            <label htmlFor="post-tags" className="block text-sm font-medium mb-1">
              {t('postWrite.tagsLabel')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md dark:bg-primary/20"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                id="post-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t('postWrite.tagsPlaceholder')}
                className="flex-1 px-3 py-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30
                  dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className={cn(
                  'px-3 py-2 rounded-r-md transition-colors',
                  tagInput.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed dark:bg-gray-700',
                )}
              >
                {t('postWrite.addTag')}
              </button>
            </div>
          </div>
        </div>

        {/* Split view editor section - removing gap below input */}
        <div
          className={cn(
            'flex flex-1 overflow-hidden',
            isFullscreen ? 'h-[calc(100vh-180px)]' : '', // Increase height in fullscreen mode
          )}
        >
          {/* Editor side */}
          <div
            className={cn(
              'flex flex-col flex-1 overflow-hidden',
              'md:block', // Always show on desktop
              isPreviewMode ? 'hidden' : 'block', // Toggle on mobile
            )}
          >
            {/* Formatting toolbar - removing bottom margin */}
            <div className="flex items-center gap-1 border-t-0 border-b border-x p-1 bg-muted/50 dark:bg-gray-800/50 mb-0">
              <button
                type="button"
                onClick={() => handleFormatting('bold')}
                className="p-1.5 hover:bg-background rounded transition-colors dark:hover:bg-gray-700"
                title={t('postWrite.formatting.bold')}
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatting('italic')}
                className="p-1.5 hover:bg-background rounded transition-colors dark:hover:bg-gray-700"
                title={t('postWrite.formatting.italic')}
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatting('link')}
                className="p-1.5 hover:bg-background rounded transition-colors dark:hover:bg-gray-700"
                title={t('postWrite.formatting.link')}
              >
                <Link size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatting('image')}
                className="p-1.5 hover:bg-background rounded transition-colors dark:hover:bg-gray-700"
                title={t('postWrite.formatting.image')}
              >
                <Image size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatting('list')}
                className="p-1.5 hover:bg-background rounded transition-colors dark:hover:bg-gray-700"
                title={t('postWrite.formatting.list')}
              >
                <List size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatting('ordered-list')}
                className="p-1.5 hover:bg-background rounded transition-colors dark:hover:bg-gray-700"
                title={t('postWrite.formatting.orderedList')}
              >
                <ListOrdered size={18} />
              </button>
            </div>

            {/* Content textarea - ensuring it fills the space completely */}
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('postWrite.contentPlaceholder')}
              className={cn(
                'flex-1 w-full px-3 py-2 border border-t-0 border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none',
                'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                'block', // Ensure proper display
                isFullscreen ? 'h-full' : 'min-h-[350px]', // Increase default height and fill space in fullscreen
              )}
              style={{ marginTop: 0, marginBottom: 0 }} // Explicitly remove vertical margins
            />
          </div>

          {/* Preview side - show on desktop or when preview mode is active on mobile */}
          <div
            className={cn(
              'flex-1 border-l border-border overflow-y-auto p-4',
              'md:block', // Always show on desktop
              isPreviewMode ? 'block' : 'hidden', // Toggle on mobile
              isFullscreen ? 'h-full' : '', // Fill height in fullscreen mode
            )}
          >
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="mb-4">{title || t('postWrite.previewTitle')}</h2>
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">{t('postWrite.previewPlaceholder')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 p-2 bg-red-50 dark:bg-red-900/20 mx-4 my-2 rounded-md">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Modal footer */}
        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700/70">
          <button
            type="button"
            onClick={handleClose} // Updated to use handleClose
            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors dark:hover:bg-gray-700 dark:border-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              isSubmitting && 'opacity-70 cursor-not-allowed',
            )}
          >
            {isSubmitting ? t('common.submitting') : t('postWrite.publishPost')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add a wrapper component that handles the slide-up animation properly
export function AnimatedPostWrite(props: PostWriteProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // When the modal opens, first render it off-screen, then animate up
    if (props.isOpen && !mounted) {
      // Use requestAnimationFrame to ensure the initial off-screen render happens
      requestAnimationFrame(() => {
        setMounted(true);
      });
    } else if (!props.isOpen) {
      setMounted(false);
    }
  }, [mounted, props.isOpen]);

  return <PostWrite {...props} />;
}
