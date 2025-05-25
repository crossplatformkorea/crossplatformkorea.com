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
import { cn, devLog, devConsole } from '../../../../lib/utils';
import { Id } from '../../../../../convex/_generated/dataModel';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_READABLE } from '../../../../constants';
import { DEFAULT_CATEGORY } from '../../../../../convex/constants';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '../../../uis/Button';

// Import additional plugins for ReactMarkdown to handle HTML content and line breaks
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { api } from '../../../../../convex/_generated/api';

interface PostWriteProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  // 추가된 props: 수정 모드 관련
  isEditMode?: boolean;
  postId?: Id<'posts'>;
  defaultTitle?: string;
  defaultContent?: string;
  defaultTags?: string[];
}

export default function PostWriteModal({
  isOpen,
  onClose,
  defaultCategory,
  isEditMode = false,
  postId,
  defaultTitle = '',
  defaultContent = '',
  defaultTags = [],
}: PostWriteProps) {
  const { t } = useTranslation();
  const { isAuthenticated, requireAuth } = useAuthStore(); // Correctly destructure requireAuth

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // State for form values - 초기값 활용
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [category, setCategory] = useState(defaultCategory || DEFAULT_CATEGORY);
  const [tags, setTags] = useState<string[]>(defaultTags);
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
  // Get existing post mutation for edit mode
  const updatePostMutation = useMutation(api.posts.mutation.updatePost);

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

  // Set initial values if editing an existing post
  useEffect(() => {
    if (isOpen && isEditMode) {
      setTitle(defaultTitle);
      setContent(defaultContent);
      setTags(defaultTags || []);
      if (defaultCategory) {
        setCategory(defaultCategory);
      }
    }
  }, [isOpen, isEditMode, defaultTitle, defaultContent, defaultTags, defaultCategory]);

  // Reset all form data function
  const resetFormData = useCallback(() => {
    // 수정 모드가 아닐 때만 초기화
    if (!isEditMode) {
      setTitle('');
      setContent('');
      setCategory(defaultCategory || 'GENERAL');
      setTags([]);
    }
    setTagInput('');
    setError(null);
    setIsPreviewMode(false);
  }, [defaultCategory, isEditMode]);

  // Add cleanupUploadedFiles function
  const cleanupUploadedFiles = useCallback(async () => {
    if (uploadedStorageIds.length > 0) {
      try {
        // Log the cleanup process
        devLog(`Cleaning up ${uploadedStorageIds.length} uploaded images...`);

        // Attempt to delete all uploaded files
        const deletePromises = uploadedStorageIds.map((storageId) => deleteFile({ storageId }));

        await Promise.all(deletePromises);
        devLog(`Successfully cleaned up ${uploadedStorageIds.length} temporary images`);

        // Reset the tracking array
        setUploadedStorageIds([]);
      } catch (error) {
        devConsole.error('Error cleaning up uploaded files:', error);
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
            devConsole.error('Error cleaning up uploaded file on unload:', storageId);
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

  // 수정된 handleSubmit 함수 - 수정 모드에 따라 다르게 동작
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      requireAuth();
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
      if (isEditMode && postId) {
        // 수정 모드: updatePost 호출
        await updatePostMutation({
          postId,
          title,
          content,
          category,
          tags,
        });
      } else {
        // 생성 모드: createPost 호출
        await createPostMutation({
          title,
          content,
          category,
          tags,
          storageIds: uploadedStorageIds.length > 0 ? uploadedStorageIds : undefined,
        });
      }

      // 게시 성공 시 파일 추적 배열 초기화
      setUploadedStorageIds([]);

      // 폼 초기화 및 모달 닫기
      resetFormData();
      onClose();
    } catch (error) {
      devConsole.error(isEditMode ? 'Error updating post:' : 'Error creating post:', error);
      setError(isEditMode ? t('errors.postUpdateFailed') : t('errors.postCreationFailed'));
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
      devConsole.error('Error uploading file:', err);
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
          <h2 className="text-xl font-semibold">
            {isEditMode ? t('postWrite.editPost') : t('postWrite.writeNewPost')}
          </h2>

          <div className="flex items-center gap-2">
            {/* View toggle for mobile */}
            <div className="md:hidden flex items-center gap-2 bg-muted/50 rounded-md overflow-hidden">
              <Button
                variant={!isPreviewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsPreviewMode(false)}
                className="rounded-none flex items-center gap-1"
              >
                <Edit size={16} />
                {t('postWrite.edit')}
              </Button>
              <Button
                variant={isPreviewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsPreviewMode(true)}
                className="rounded-none flex items-center gap-1"
              >
                <Eye size={16} />
                {t('postWrite.preview')}
              </Button>
            </div>

            {/* Fullscreen toggle button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="rounded-full p-2"
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
            </Button>

            {/* Close button - updated to use handleClose */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-full p-2"
              aria-label={t('common.close')}
            >
              <X size={20} />
            </Button>
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
                {t('postWrite.categoryLabel')}
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 
                  dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                {categories?.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {t(`postCategories.${cat.key}.name`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags input */}
          <div className="mt-4">
            <label htmlFor="post-tags" className="block text-sm font-medium mb-1">
              {t('postWrite.tagsLabel')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0 h-auto w-auto ml-1 hover:bg-transparent"
                  >
                    <X size={14} />
                  </Button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="post-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t('postWrite.addTag')}
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 
                  dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              <Button
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                type="button"
              >
                {t('postWrite.addTag')}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mobile view - single pane with toggle */}
          <div className="md:hidden w-full flex flex-col">
            {!isPreviewMode ? (
              <div className="flex-1 flex flex-col">
                {/* Formatting toolbar - always visible at top */}
                <div className="bg-background border-b p-2 flex items-center gap-2 overflow-x-auto shadow-sm min-h-[52px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('bold')}
                    className="flex-shrink-0"
                    title={t('postWrite.bold')}
                  >
                    <Bold size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('italic')}
                    className="flex-shrink-0"
                    title={t('postWrite.italic')}
                  >
                    <Italic size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('link')}
                    className="flex-shrink-0"
                    title={t('postWrite.link')}
                  >
                    <Link size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex-shrink-0"
                    title={t('postWrite.image')}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('list')}
                    className="flex-shrink-0"
                    title={t('postWrite.bulletList')}
                  >
                    <List size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('ordered-list')}
                    className="flex-shrink-0"
                    title={t('postWrite.numberedList')}
                  >
                    <ListOrdered size={16} />
                  </Button>
                  {/* Hidden file input for image upload */}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      void (async () => {
                        const files = e.target.files;
                        if (!files) return;
                        
                        for (const file of Array.from(files)) {
                          const imageHtml = await uploadFile(file);
                          if (imageHtml) {
                            insertTextAtCursor(imageHtml + '\n');
                          }
                        }
                        e.target.value = ''; // Reset input
                      })();
                    }}
                  />
                </div>
                
                {/* Content textarea container with overflow and top padding to prevent toolbar overlap */}
                <div className="flex-1 overflow-hidden">
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={(e) => void handlePaste(e)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => void handleDrop(e)}
                    placeholder={t('postWrite.contentPlaceholder')}
                    className="w-full h-full p-4 pt-8 border-0 focus:outline-none resize-none min-h-[400px]
                      dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
                <div className="prose prose-sm max-w-none dark:prose-invert break-words text-sm">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Desktop view - split pane */}
          <div className="hidden md:flex w-full">
            {/* Editor pane */}
            <div className="w-1/2 flex flex-col border-r">
              {/* Formatting toolbar - always visible at top */}
              <div className="bg-background border-b p-2 flex items-center gap-2 overflow-x-auto shadow-sm min-h-[52px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFormatting('bold')}
                  className="flex-shrink-0"
                  title={t('postWrite.bold')}
                >
                  <Bold size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFormatting('italic')}
                  className="flex-shrink-0"
                  title={t('postWrite.italic')}
                >
                  <Italic size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFormatting('link')}
                  className="flex-shrink-0"
                  title={t('postWrite.link')}
                >
                  <Link size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById('image-upload-desktop')?.click()}
                  className="flex-shrink-0"
                  title={t('postWrite.image')}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFormatting('list')}
                  className="flex-shrink-0"
                  title={t('postWrite.bulletList')}
                >
                  <List size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFormatting('ordered-list')}
                  className="flex-shrink-0"
                  title={t('postWrite.numberedList')}
                >
                  <ListOrdered size={16} />
                </Button>
                {/* Hidden file input for image upload */}
                <input
                  id="image-upload-desktop"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    void (async () => {
                      const files = e.target.files;
                      if (!files) return;
                      
                      for (const file of Array.from(files)) {
                        const imageHtml = await uploadFile(file);
                        if (imageHtml) {
                          insertTextAtCursor(imageHtml + '\n');
                        }
                      }
                      e.target.value = ''; // Reset input
                    })();
                  }}
                />
              </div>
              
              {/* Content textarea container with overflow and padding to prevent toolbar overlap */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  ref={contentRef}
                  value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={(e) => void handlePaste(e)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => void handleDrop(e)}
                    placeholder={t('postWrite.contentPlaceholder')}
                    className="w-full h-full p-4 pt-12 border-0 focus:outline-none resize-none min-h-[400px]
                      dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
            </div>

            {/* Preview pane */}
            <div className="w-1/2 flex flex-col">
              <div className="sticky top-0 z-10 bg-background border-b p-2 flex items-center min-h-[52px]">
                <Eye size={16} className="mr-2" />
                <span className="text-sm font-medium">{t('postWrite.preview')}</span>
              </div>
              <div className="flex-1 pb-4 px-4 overflow-y-auto overflow-x-hidden">
                <div className="prose prose-sm max-w-none dark:prose-invert text-sm">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Footer with submit button */}
        <div className="p-4 border-t bg-background">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {isUploading && (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {t('postWrite.uploadingImages')}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={(e) => void handleSubmit(e)}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    {isEditMode ? t('postWrite.updatePost') : t('postWrite.publishPost')}
                  </>
                ) : (
                  isEditMode ? t('postWrite.updatePost') : t('postWrite.publishPost')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
