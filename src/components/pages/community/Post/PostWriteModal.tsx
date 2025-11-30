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
  MoreVertical,
  ImageIcon,
  Check,
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
  defaultThumbnail?: string;
}

// 컨텐츠에서 이미지 URL 추출하는 헬퍼 함수
function extractImageUrlsFromContent(content: string): string[] {
  const urls: string[] = [];
  const urlRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
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
  defaultThumbnail = '',
}: PostWriteProps) {
  const { t } = useTranslation();
  const { isAuthenticated, requireAuth } = useAuthStore(); // Correctly destructure requireAuth

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const contentRefDesktop = useRef<HTMLTextAreaElement>(null);

  // State for form values - 초기값 활용
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [category, setCategory] = useState(defaultCategory || DEFAULT_CATEGORY);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [tagInput, setTagInput] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(defaultThumbnail);
  const [showThumbnailMenu, setShowThumbnailMenu] = useState(false);
  const thumbnailMenuRef = useRef<HTMLDivElement>(null);

  // 컨텐츠에서 이미지 URL 목록 추출
  const contentImages = extractImageUrlsFromContent(content);

  // 현재 선택된 썸네일 또는 기본 첫 번째 이미지
  const currentThumbnail = selectedThumbnail || (contentImages.length > 0 ? contentImages[0] : null);

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
      setSelectedThumbnail(defaultThumbnail || '');
      if (defaultCategory) {
        setCategory(defaultCategory);
      }
    }
  }, [isOpen, isEditMode, defaultTitle, defaultContent, defaultTags, defaultCategory, defaultThumbnail]);

  // Reset all form data function
  const resetFormData = useCallback(() => {
    // 수정 모드가 아닐 때만 초기화
    if (!isEditMode) {
      setTitle('');
      setContent('');
      setCategory(defaultCategory || 'GENERAL');
      setTags([]);
      setSelectedThumbnail('');
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
    // Choose the appropriate ref based on screen size
    const targetRef = window.innerWidth >= 768 ? contentRefDesktop : contentRef;
    if (!targetRef.current) return;

    const start = targetRef.current.selectionStart;
    const end = targetRef.current.selectionEnd;
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
      if (targetRef.current) {
        targetRef.current.focus();
        targetRef.current.selectionStart = selectedText
          ? start + formattedText.length
          : cursorPosition;
        targetRef.current.selectionEnd = selectedText
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

  // Close thumbnail menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (thumbnailMenuRef.current && !thumbnailMenuRef.current.contains(event.target as Node)) {
        setShowThumbnailMenu(false);
      }
    };

    if (showThumbnailMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThumbnailMenu]);

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
      // 썸네일 결정: 선택된 것이 없으면 첫 번째 이미지 사용
      const thumbnailToSave = selectedThumbnail || (contentImages.length > 0 ? contentImages[0] : undefined);

      if (isEditMode && postId) {
        // 수정 모드: updatePost 호출
        await updatePostMutation({
          postId,
          title,
          content,
          category,
          tags,
          storageIds: uploadedStorageIds.length > 0 ? uploadedStorageIds : undefined,
          thumbnail: thumbnailToSave,
        });
      } else {
        // 생성 모드: createPost 호출
        await createPostMutation({
          title,
          content,
          category,
          tags,
          storageIds: uploadedStorageIds.length > 0 ? uploadedStorageIds : undefined,
          thumbnail: thumbnailToSave,
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

  // Handle paste event for images and auto-link conversion
  const handlePaste = async (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // Handle image paste first
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;

        const markdownUrl = await uploadFile(file);
        if (!markdownUrl) continue;

        insertTextAtCursor(markdownUrl);
        return;
      }
    }

    // Handle text paste with auto-link conversion
    const pastedText = clipboardData.getData('text');
    if (pastedText && isValidHttpUrl(pastedText.trim())) {
      e.preventDefault();
      const markdownLink = `[${pastedText.trim()}](${pastedText.trim()})`;
      insertTextAtCursor(markdownLink);
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
  }; // Helper function to insert text at cursor position
  const insertTextAtCursor = (text: string) => {
    // Choose the appropriate ref based on screen size
    const targetRef = window.innerWidth >= 768 ? contentRefDesktop : contentRef;
    if (!targetRef.current) return;

    const start = targetRef.current.selectionStart;
    const end = targetRef.current.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);

    // Restore cursor position after the inserted text
    setTimeout(() => {
      if (targetRef.current) {
        targetRef.current.focus();
        const newPosition = start + text.length;
        targetRef.current.selectionStart = newPosition;
        targetRef.current.selectionEnd = newPosition;
      }
    }, 0);
  };

  // Calculate number of lines in content
  const contentLineCount = content.split('\n').length;

  // Auto-link detection utility for clipboard paste
  const isValidHttpUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0;
    } catch {
      return false;
    }
  };

  // Don't render anything if modal is closed and not in closing animation
  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div
      className={cn(
        // Layout & Positioning
        'fixed inset-0 z-50 flex justify-center',
        isFullscreen ? 'items-center' : 'items-end',
        // Animation & Transitions
        'transition-all duration-300 ease-out',
        // Background & Blur Effects
        isOpen && !isClosing
          ? 'opacity-100 bg-black/60 backdrop-blur-sm'
          : 'opacity-0 bg-black/0 backdrop-blur-none',
        // Interactive States
        !isOpen && !isClosing && 'pointer-events-none',
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          // Layout & Positioning
          'flex flex-col overflow-hidden mx-auto',
          isFullscreen ? 'w-full h-full' : 'w-[98%] max-w-7xl max-h-[85vh]',
          // Background & Visual Effects
          'bg-background',
          'shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)]',
          'dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] dark:border dark:border-gray-700/80',
          // Border Radius
          isFullscreen ? 'rounded-none' : 'rounded-t-xl',
          // Animation & Transform
          'transform transition-all duration-300 ease-out',
          hasAppeared ? 'translate-y-0' : 'translate-y-full',
          isClosing && 'translate-y-full',
        )}
        aria-modal="true"
        role="dialog"
      >
        {/* Modal header */}
        <div
          className={cn(
            // Layout & Positioning
            'flex items-center justify-between',
            // Spacing & Borders
            'p-4 border-b',
            // Theme-specific styling
            'dark:border-gray-700/70',
          )}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {isEditMode ? t('postWrite.editPost') : t('postWrite.writeNewPost')}
            </h2>

            {/* Thumbnail preview with options - only show when there are images in content */}
            {contentImages.length > 0 && (
              <div className="relative" ref={thumbnailMenuRef}>
                <div className="relative group">
                  {currentThumbnail ? (
                    <img
                      src={currentThumbnail}
                      alt="Thumbnail preview"
                      className="w-10 h-10 object-cover rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-lg border border-border flex items-center justify-center">
                      <ImageIcon size={16} className="text-muted-foreground" />
                    </div>
                  )}
                  {/* Options button overlay */}
                  <button
                    type="button"
                    onClick={() => setShowThumbnailMenu(!showThumbnailMenu)}
                    className={cn(
                      'absolute -top-1 -right-1 w-5 h-5 rounded-full',
                      'bg-background border border-border shadow-sm',
                      'flex items-center justify-center',
                      'hover:bg-muted transition-colors',
                    )}
                    title={t('postWrite.changeThumbnail', '썸네일 변경')}
                  >
                    <MoreVertical size={12} />
                  </button>
                </div>

                {/* Dropdown menu */}
                {showThumbnailMenu && (
                  <div
                    className={cn(
                      'absolute top-full left-0 mt-2 z-50',
                      'bg-background border border-border rounded-lg shadow-lg',
                      'p-2 min-w-[200px]',
                    )}
                  >
                    <p className="text-xs text-muted-foreground px-2 pb-2 border-b border-border mb-2">
                      {t('postWrite.selectThumbnail', '대표 이미지 선택')}
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                      {contentImages.map((imageUrl, index) => {
                        const isSelected = selectedThumbnail === imageUrl || (!selectedThumbnail && index === 0);
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedThumbnail(imageUrl);
                              setShowThumbnailMenu(false);
                            }}
                            className={cn(
                              'relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all',
                              isSelected
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-border hover:border-primary/50',
                            )}
                          >
                            <img
                              src={imageUrl}
                              alt={`Option ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <Check size={16} className="text-primary" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className={cn(
              // Layout
              'flex items-center gap-2',
            )}
          >
            {/* View toggle for mobile */}
            <div
              className={cn(
                // Responsive & Layout
                'md:hidden flex items-center gap-2',
                // Background & Visual
                'bg-muted/50 rounded-md',
                // Overflow handling
                'overflow-hidden',
              )}
            >
              <Button
                variant={!isPreviewMode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setIsPreviewMode(false)}
                className={cn(
                  // Layout & Interaction
                  'rounded-none flex items-center gap-1',
                )}
              >
                <Edit size={16} />
                {t('postWrite.edit')}
              </Button>
              <Button
                variant={isPreviewMode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setIsPreviewMode(true)}
                className={cn(
                  // Layout & Interaction
                  'rounded-none flex items-center gap-1',
                )}
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
              className={cn(
                // Shape & Spacing
                'rounded-full p-2',
              )}
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
              className={cn(
                // Shape & Spacing
                'rounded-full p-2',
              )}
              aria-label={t('common.close')}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Post metadata inputs */}
        <div
          className={cn(
            // Spacing & Borders
            'p-4 border-b',
          )}
        >
          <div
            className={cn(
              // Layout & Responsive
              'grid grid-cols-1 md:grid-cols-2 gap-4',
            )}
          >
            {/* Title input */}
            <div>
              <label
                htmlFor="post-title"
                className={cn(
                  // Layout & Typography
                  'block text-sm font-medium mb-1',
                )}
              >
                {t('postWrite.titleLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                ref={titleRef}
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('postWrite.titlePlaceholder')}
                className={cn(
                  // Layout & Sizing
                  'w-full px-3 py-2',
                  // Visual & Borders
                  'border border-border rounded-md',
                  // Focus States
                  'focus:outline-none focus:ring-1 focus:ring-primary/40', // Use ring-1 for thinner border
                  // Theme Support
                  'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                )}
              />
            </div>

            {/* Category selection */}
            <div className="relative">
              <label
                htmlFor="post-category"
                className={cn(
                  // Layout & Typography
                  'block text-sm font-medium mb-1',
                )}
              >
                {t('postWrite.categoryLabel')}
              </label>
              <div className="relative">
                <select
                  id="post-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(
                    // Layout & Sizing
                    'w-full pl-2 pr-8 py-2', // Use pr-8, caret will be custom
                    // Visual & Borders
                    'border border-border rounded-md',
                    // Focus States
                    'focus:outline-none focus:ring-1 focus:ring-primary/40',
                    // Theme Support
                    'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                    // Remove default browser arrow for consistency
                    'appearance-none',
                  )}
                >
                  {categories?.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {t(`postCategories.${cat.key}.name`)}
                    </option>
                  ))}
                </select>
                {/* Custom caret icon */}
                <svg
                  className="pointer-events-none absolute right-3 inset-y-0 my-auto w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tags input section removed from here */}
        </div>

        {/* Main content area */}
        <div
          className={cn(
            // Layout & Overflow
            'flex-1 flex overflow-hidden',
          )}
        >
          {/* Mobile view - single pane with toggle */}
          <div
            className={cn(
              // Responsive & Layout
              'md:hidden w-full flex flex-col',
            )}
          >
            {!isPreviewMode ? (
              <div
                className={cn(
                  // Layout
                  'flex-1 flex flex-col',
                )}
              >
                {/* Formatting toolbar - always visible at top */}
                <div
                  className={cn(
                    // Layout & Sizing
                    'p-2 flex items-center gap-2 min-h-[52px]',
                    // Background & Borders
                    'bg-background border-b',
                    // Overflow & Visual Effects
                    'overflow-x-auto shadow-sm',
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('bold')}
                    className={cn(
                      // Layout
                      'flex-shrink-0',
                    )}
                    title={t('postWrite.bold')}
                  >
                    <Bold size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('italic')}
                    className={cn(
                      // Layout
                      'flex-shrink-0',
                    )}
                    title={t('postWrite.italic')}
                  >
                    <Italic size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('link')}
                    className={cn(
                      // Layout
                      'flex-shrink-0',
                    )}
                    title={t('postWrite.link')}
                  >
                    <Link size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className={cn(
                      // Layout
                      'flex-shrink-0',
                    )}
                    title={t('postWrite.image')}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Image size={16} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('list')}
                    className={cn(
                      // Layout
                      'flex-shrink-0',
                    )}
                    title={t('postWrite.bulletList')}
                  >
                    <List size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatting('ordered-list')}
                    className={cn(
                      // Layout
                      'flex-shrink-0',
                    )}
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

                {/* === MOBILE INPUT AREA === */}
                <div
                  className={cn(
                    // Layout & Overflow
                    'flex-1 flex flex-col overflow-hidden',
                  )}
                >
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={(e) => void handlePaste(e)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => void handleDrop(e)}
                    placeholder={t('postWrite.contentPlaceholder')}
                    className={cn(
                      // Layout & Sizing
                      'flex-1 w-full p-4',
                      // Border & Focus
                      'border-0 focus:outline-none resize-none',
                      // Overflow & Scrolling
                      'overflow-y-auto',
                      // Theme Support
                      'dark:bg-gray-800 dark:text-gray-100',
                    )}
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </div>
            ) : (
              /* === MOBILE PREVIEW AREA === */
              <div
                className={cn(
                  // Layout & Overflow
                  'flex-1 p-4 overflow-y-auto overflow-x-hidden',
                )}
              >
                <div
                  className={cn(
                    // Typography & Styling
                    'prose prose-sm max-w-none text-sm break-words',
                    // Theme Support
                    'dark:prose-invert',
                  )}
                >
                  <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      // Fix list spacing and formatting
                      ul: ({ children, ...props }) => (
                        <ul className="pl-6 mb-4" style={{ listStyleType: 'disc', listStylePosition: 'outside' }} {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol className="pl-6 mb-4" style={{ listStyleType: 'decimal', listStylePosition: 'outside' }} {...props}>
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li className="mb-1" style={{ display: 'list-item' }} {...props}>
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* === DESKTOP VIEW - SPLIT PANE === */}
          <div
            className={cn(
              // Responsive & Layout
              'hidden md:flex w-full',
            )}
          >
            {/* === DESKTOP EDITOR PANE === */}
            <div
              className={cn(
                // Layout & Borders
                'w-1/2 flex flex-col border-r',
              )}
            >
              {/* === DESKTOP FORMATTING TOOLBAR === */}
              <div
                className={cn(
                  // Layout & Sizing
                  'p-2 flex items-center gap-2 min-h-[52px]',
                  // Background & Borders
                  'bg-background border-b',
                  // Overflow & Visual Effects
                  'overflow-x-auto shadow-sm',
                )}
              >
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
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Image size={16} />
                  )}
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
              <div
                className={cn(
                  // Layout & Overflow
                  'flex-1 overflow-hidden',
                )}
              >
                <textarea
                  ref={contentRefDesktop}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={(e) => void handlePaste(e)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => void handleDrop(e)}
                  placeholder={t('postWrite.contentPlaceholder')}
                  className={cn(
                    // Layout & Sizing
                    'w-full h-full min-h-[400px]',
                    // Spacing (conditional padding)
                    contentLineCount >= 12 ? 'pt-12' : 'pt-4',
                    'px-4 pb-4',
                    // Border & Focus
                    'border-0 focus:outline-none resize-none',
                    // Theme Support
                    'dark:bg-gray-800 dark:text-gray-100',
                  )}
                />
              </div>
            </div>

            {/* === DESKTOP PREVIEW PANE === */}
            <div
              className={cn(
                // Layout
                'w-1/2 flex flex-col',
              )}
            >
              {/* === DESKTOP PREVIEW HEADER === */}
              <div
                className={cn(
                  // Position & Layout
                  'sticky top-0 z-10 p-2 flex items-center min-h-[52px]',
                  // Background & Borders
                  'bg-background border-b',
                )}
              >
                <Eye size={16} className="mr-2" />
                <span
                  className={cn(
                    // Typography
                    'text-sm font-medium',
                  )}
                >
                  {t('postWrite.preview')}
                </span>
              </div>
              {/* === DESKTOP PREVIEW CONTENT === */}
              <div
                className={cn(
                  // Layout & Overflow
                  'flex-1 pb-4 px-4 overflow-y-auto overflow-x-hidden',
                )}
              >
                <div
                  className={cn(
                    // Typography & Styling
                    'prose prose-sm max-w-none text-sm',
                    // Theme Support
                    'dark:prose-invert',
                  )}
                >
                  <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      // Fix list spacing and formatting
                      ul: ({ children, ...props }) => (
                        <ul className="pl-6 mb-4" style={{ listStyleType: 'disc', listStylePosition: 'outside' }} {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol className="pl-6 mb-4" style={{ listStyleType: 'decimal', listStylePosition: 'outside' }} {...props}>
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li className="mb-1" style={{ display: 'list-item' }} {...props}>
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === ERROR MESSAGE === */}
        {error && (
          <div
            className={cn(
              // Layout & Spacing
              'px-4 py-2 flex items-center gap-2',
              // Background & Visual
              'bg-destructive/10 border-l-4 border-destructive',
              // Typography
              'text-destructive text-sm',
            )}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* === FOOTER WITH SUBMIT BUTTON === */}
        <div
          className={cn(
            // Layout & Spacing
            'p-4',
            // Background & Borders
            'bg-background border-t',
          )}
        >
          {/* Tags input moved here */}
          <div
            className={cn(
              // Spacing & Margin
              'mb-4',
            )}
          >
            {/* Label removed */}
            <div
              className={cn(
                // Layout & Spacing
                'flex flex-wrap gap-2 mb-2',
              )}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    // Layout & Spacing
                    'inline-flex items-center gap-1 px-2 py-1',
                    // Visual & Typography
                    'bg-primary/10 text-primary rounded-md text-sm',
                  )}
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(tag)}
                    className={cn(
                      // Layout & Sizing
                      'p-0 h-auto w-auto ml-1',
                      // Interactive States
                      'hover:bg-transparent',
                    )}
                  >
                    <X size={14} />
                  </Button>
                </span>
              ))}
            </div>
            <div
              className={cn(
                // Layout with standard gap between elements
                'flex gap-2 items-center',
              )}
            >
              <input
                id="post-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t('postWrite.addTag')}
                className={cn(
                  // Layout & Sizing - explicitly set height
                  'flex-1 px-3 h-10',
                  // Visual & Borders
                  'border border-border rounded-md',
                  // Focus States
                  'focus:outline-none focus:ring-2 focus:ring-primary/30',
                  // Theme Support
                  'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                )}
              />
              <Button
                variant="default"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                type="button"
                className={cn(
                  // Explicitly set the same height as input
                  'h-10 px-4 rounded-md',
                  // Button styling
                  'bg-primary hover:bg-primary/90',
                )}
              >
                {t('common.add')}
              </Button>
            </div>
          </div>

          <div
            className={cn(
              // Layout
              'flex justify-between items-center',
            )}
          >
            <div
              className={cn(
                // Typography
                'text-sm text-muted-foreground',
              )}
            >
              {isUploading && (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {t('postWrite.uploadingImages')}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
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
                ) : isEditMode ? (
                  t('postWrite.updatePost')
                ) : (
                  t('postWrite.publishPost')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
