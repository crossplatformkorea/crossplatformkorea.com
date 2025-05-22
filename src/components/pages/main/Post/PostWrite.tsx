import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { useConvexAuth } from 'convex/react';
import { cn } from '../../../../lib/utils';
import { Id } from '../../../../../convex/_generated/dataModel';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_READABLE } from '../../../../constants';
import { DEFAULT_CATEGORY } from '../../../../../convex/constants';

// Import additional plugins for ReactMarkdown to handle HTML content and line breaks
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { api } from '../../../../../convex/_generated/api';

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
  const [category, setCategory] = useState(defaultCategory || DEFAULT_CATEGORY); // Use DEFAULT_CATEGORY as fallback
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // State for view mode (especially for mobile)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Animation states
  const [isClosing, setIsClosing] = useState(false);
  const [previousFullscreen, setPreviousFullscreen] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  // Add state to track uploaded files for cleanup
  const [uploadedStorageIds, setUploadedStorageIds] = useState<Id<'_storage'>[]>([]);

  // Mutations
  const generateUploadUrl = useMutation(api.files.mutation.generateUploadUrl);
  const saveFileMetadata = useMutation(api.files.mutation.saveFileMetadata);
  const createPostMutation = useMutation(api.posts.mutation.createPost);

  // Add file deletion action
  const deleteFile = useAction(api.files.action.deleteFileByStorageId);

  // Get categories from API
  const categories = useQuery(api.categories.query.getCategories);

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

  // Reset all form data function
  const resetFormData = useCallback(() => {
    setTitle('');
    setContent('');
    setCategory(defaultCategory || 'GENERAL');
    setTags([]);
    setTagInput('');
    setError(null);
    setIsPreviewMode(false);
  }, [defaultCategory]);

  // Add cleanupUploadedFiles function
  const cleanupUploadedFiles = useCallback(async () => {
    if (uploadedStorageIds.length > 0) {
      try {
        // Log the cleanup process
        console.log(`Cleaning up ${uploadedStorageIds.length} uploaded images...`);

        // Attempt to delete all uploaded files
        const deletePromises = uploadedStorageIds.map((storageId) => deleteFile({ storageId }));

        await Promise.all(deletePromises);
        console.log(`Successfully cleaned up ${uploadedStorageIds.length} temporary images`);

        // Reset the tracking array
        setUploadedStorageIds([]);
      } catch (error) {
        console.error('Error cleaning up uploaded files:', error);
      }
    }
  }, [deleteFile, uploadedStorageIds]);

  // Modified close handler to reset form data and support exit animation
  const handleClose = useCallback(() => {
    // 게시 중이면 파일 정리 생략
    if (!isSubmitting) {
      void cleanupUploadedFiles();
    }

    // 폼 데이터 초기화
    resetFormData();

    setIsClosing(true);
    // 애니메이션 완료 후 실제 onClose 호출
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // 전환 지속 시간과 일치
  }, [onClose, resetFormData, cleanupUploadedFiles, isSubmitting]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        // Use handleClose instead of onClose to ensure proper cleanup
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleClose, isOpen]); // Add handleClose to dependency array

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

  // Toggle fullscreen mode with animation
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Add window unload event to clean up files on refresh/navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (uploadedStorageIds.length > 0) {
        // Note: This runs synchronously and can't guarantee file deletion
        // This is best effort cleanup
        uploadedStorageIds.forEach((storageId) => {
          try {
            void deleteFile({ storageId });
          } catch {
            // Can't do much in the unload event
            console.error('Error cleaning up uploaded file on unload:', storageId);
          }
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clean up on component unmount
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [deleteFile, uploadedStorageIds]);

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
        // Use handleClose instead of onClose to ensure proper cleanup
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, handleClose]); // Add handleClose to dependency array

  // 수정된 handleSubmit 함수 - postId와 연결하고 사용하지 않는 이미지는 삭제하도록 수정
  const handleSubmit = async (e: React.FormEvent) => {
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
      // 모든 업로드된 이미지 ID를 보내서 서버에서 처리하도록 함
      await createPostMutation({
        title,
        content,
        category,
        tags,
        storageIds: uploadedStorageIds.length > 0 ? uploadedStorageIds : undefined,
      });

      // 게시 성공 시 파일 추적 배열 초기화
      setUploadedStorageIds([]);

      // 폼 초기화 및 모달 닫기
      resetFormData();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setError(t('errors.postCreationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const uploadFile = async (file: File): Promise<string | null> => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError(t('errors.onlyImagesAllowed'));
      return null;
    }

    // Check file size using both constants from constants.ts
    if (file.size > MAX_FILE_SIZE) {
      setError(
        t('errors.fileTooLarge', { size: MAX_FILE_SIZE_READABLE }) ||
          `File size exceeds ${MAX_FILE_SIZE_READABLE} limit`,
      );

      return null;
    }

    const uniqueId = Date.now().toString();
    setIsUploading(true);
    setUploadProgress((prev) => ({ ...prev, [uniqueId]: 0 }));

    try {
      // Step 1: Generate a URL for uploading
      const postUrl = await generateUploadUrl();

      // Step 2: Upload the file directly using fetch
      const controller = new AbortController();

      // Upload file directly
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
        signal: controller.signal,
      });

      if (!result.ok) {
        throw new Error(`Upload failed with status ${result.status}`);
      }

      // Get the storageId from the response
      const responseData = await result.json();
      const storageId = responseData.storageId;

      if (!storageId) {
        throw new Error('No storageId returned from upload');
      }

      // Step 3: Save the uploaded file's metadata in Convex
      const saveResult = await saveFileMetadata({
        storageId: storageId as Id<'_storage'>,
        fileName: file.name,
        contentType: file.type,
      });

      // Track the uploaded file for potential cleanup
      setUploadedStorageIds((prev) => [...prev, storageId as Id<'_storage'>]);

      // Clean up progress tracking
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[uniqueId];
        return updated;
      });

      if (Object.keys(uploadProgress).length === 0) {
        setIsUploading(false);
      }

      // Return HTML img tag instead of markdown image syntax
      return `<img src="${saveResult.url}" alt="${file.name}" width="300" />`;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(t('errors.imageUploadFailed'));

      if (Object.keys(uploadProgress).length === 0) {
        setIsUploading(false);
      }
      return null;
    }
  };

  // Handle paste event for images
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        // Prevent the default paste behavior for images
        e.preventDefault();

        const file = items[i].getAsFile();
        if (!file) continue;

        const markdownUrl = await uploadFile(file);
        if (!markdownUrl) continue;

        // Insert the markdown at cursor position
        insertTextAtCursor(markdownUrl);
        break;
      }
    }
  };

  // Handle drag and drop for images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files.length) return;

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));

    if (files.length === 0) {
      setError(t('errors.onlyImagesAllowed'));
      return;
    }

    // Upload each image and insert markdown
    for (const file of files) {
      const markdownUrl = await uploadFile(file);
      if (markdownUrl) {
        insertTextAtCursor(markdownUrl + '\n');
      }
    }
  };

  // Helper function to insert text at cursor position
  const insertTextAtCursor = (text: string) => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;

    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);

    // Restore cursor position after the inserted text
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        const newPosition = start + text.length;
        contentRef.current.selectionStart = newPosition;
        contentRef.current.selectionEnd = newPosition;
      }
    }, 0);
  };

  // Enhanced function to prepare content for preview - add cache busting to images
  const prepareContentForPreview = (rawContent: string) => {
    // First handle the line breaks as before
    let content = rawContent.replace(/\n{2,}/g, (match) => {
      const breaks = Array(match.length).fill('<br />').join('');
      return breaks;
    });

    // Add cache busting to image URLs to prevent showing deleted images
    content = content.replace(/<img src="([^"]+)"([^>]*)>/g, (match, url, rest) => {
      // Add cache busting parameter to URL
      const cacheBuster = `?t=${Date.now()}`;
      const newUrl = url.includes('?') ? `${url}&_=${cacheBuster}` : `${url}${cacheBuster}`;
      return `<img src="${newUrl}"${rest}>`;
    });

    return content;
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
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[98%] max-w-7xl mx-auto max-h-[85vh] rounded-t-xl',
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

        {/* Split view editor section */}
        <div
          className={cn(
            'flex flex-1 overflow-hidden',
            isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[calc(100%-180px)]',
          )}
        >
          {/* Editor side */}
          <div
            className={cn(
              'flex flex-col flex-1 overflow-hidden',
              'md:block',
              isPreviewMode ? 'hidden' : 'block',
            )}
          >
            {/* Formatting toolbar */}
            <div className="flex items-center gap-1 border-t-0 border-b border-x p-1 bg-muted/50 dark:bg-gray-800/50 mb-0 flex-shrink-0">
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

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="px-3 py-1 bg-primary/10 border-b border-x border-border flex items-center gap-2 flex-shrink-0">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">{t('postWrite.uploadingImages')}...</span>
              </div>
            )}

            {/* Content textarea with drag drop support */}
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={(e) => {
                void handlePaste(e);
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                void handleDrop(e);
              }}
              placeholder={t('postWrite.contentPlaceholder')}
              className={cn(
                'flex-1 w-full px-3 py-2 border border-t-0 border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none',
                'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                'block h-full min-h-0',
                isFullscreen ? 'h-full' : 'min-h-[350px]',
              )}
              style={{ marginTop: 0, marginBottom: 0 }}
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
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Handle paragraphs with preserved whitespace
                    p: (props) => <p style={{ whiteSpace: 'pre-wrap' }} {...props} />,
                  }}
                >
                  {prepareContentForPreview(content)}
                </ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">{t('postWrite.previewPlaceholder')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error message with dismiss button */}
        {error && (
          <div className="flex items-center justify-between gap-2 text-red-500 p-2 bg-red-50 dark:bg-red-900/20 mx-4 my-2 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 p-1 rounded-full transition-colors"
              aria-label={t('common.dismiss')}
            >
              <X size={16} />
            </button>
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
            onClick={(e) => {
              void handleSubmit(e);
            }}
            disabled={isSubmitting}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              isSubmitting && 'opacity-70 cursor-not-allowed',
            )}
          >
            {isSubmitting ? t('common.buttons.submitting') : t('postWrite.publishPost')}
          </button>
        </div>
      </div>
    </div>
  );
}
