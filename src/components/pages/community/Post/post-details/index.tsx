import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import PostDetailsSkeleton from './PostDetailsSkeleton';
import { useTranslation } from 'react-i18next';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { ArrowLeft, MessageSquare, Heart, Pencil, Trash2, Eye } from 'lucide-react';
import AuthorCard from './AuthorCard';
import CategoryBadge from '@/components/uis/CategoryBadge';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import PostWriteModal from '../PostWriteModal';
import Comments from './Comments';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/uis/Button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { YouTubeEmbed } from '@/components/uis/YouTubeEmbed';
import { extractYouTubeVideoId } from '@/utils/youtube';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PostDetailsPage() {
  const { isAuthenticated, requireAuth } = useAuthStore();
  const { postId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useQuery(api.users.query.currentUser);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const deletePost = useMutation(api.posts.mutation.deletePost);
  const toggleLike = useMutation(api.posts.mutation.toggleLike);
  const incrementViewCount = useMutation(api.posts.mutation.incrementViewCount);

  // Add ref for the comments section
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!postId) {
      void navigate(-1);
    }
  }, [postId, navigate]);

  const post = useQuery(api.posts.query.getById, postId ? { id: postId as Id<'posts'> } : 'skip');

  useEffect(() => {
    if (post && postId && !viewIncremented) {
      void incrementViewCount({ postId: postId as Id<'posts'> });
      setViewIncremented(true);
    }
  }, [post, postId, incrementViewCount, viewIncremented]);

  const author = useQuery(
    api.users.query.getProfile,
    post && post.authorId ? { userId: post.authorId } : 'skip',
  );

  const hasLiked = useQuery(api.posts.query.hasLiked, post ? { postId: post._id } : 'skip');

  const handleGoBack = () => {
    void navigate(-1);
  };

  const handleEdit = () => {
    if (post) {
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (post) {
      await deletePost({ postId: post._id });
      void navigate('/posts');
    }
  };

  const handleLikeClick = () => {
    if (post) {
      if (!isAuthenticated) {
        requireAuth();
        return;
      }
      void toggleLike({ postId: post._id });
    }
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const commentCount = post?.commentCount || 0;
  const viewCount = post?.viewCount || 0;
  const likeCount = post?.likeCount || 0;

  const isAuthor = isAuthenticated && user && post?.authorId === user._id;

  const formattedDate = post
    ? formatDistanceToNow(new Date(post._creationTime), {
        addSuffix: true,
        locale: i18n.language === 'ko' ? ko : undefined,
      })
    : '';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button - 로딩 상태와 관계 없이 항상 표시 */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="flex items-center mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={18} className="mr-1" />
        <span>{t('common.back', { defaultValue: 'Back' })}</span>
      </Button>

      {/* Show loading state while waiting for post data */}
      {!postId ? null : !post ? (
        <PostDetailsSkeleton /> // AppLoading 대신 PostDetailsSkeleton 사용
      ) : (
        <>
          {/* Post header section with visual depth */}
          <div className="mb-8 bg-muted/5 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/10">
              {/* Category and tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <CategoryBadge category={post.category} />

                {post.tags &&
                  post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Title and post actions */}
              <div className="relative">
                <h1 className="text-3xl font-bold mb-4 pr-20">{post.title}</h1>

                {/* Post actions - For author only */}
                {isAuthor && (
                  <div className="absolute top-0 right-0 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="p-2 text-muted-foreground rounded-full hover:text-foreground hover:bg-muted/50"
                      title={t('posts.edit', { defaultValue: 'Edit Post' })}
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmDelete(true)}
                      className="p-2 text-muted-foreground rounded-full hover:text-rose-500 hover:bg-rose-500/10"
                      title={t('posts.delete', { defaultValue: 'Delete Post' })}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Author info and metadata */}
              <div className="flex items-center justify-between border-t border-border/10 mt-4 pt-4 ">
                <AuthorCard
                  author={author}
                  creationTime={post._creationTime}
                  formattedDate={formattedDate}
                />

                {/* Stats row - all aligned in one container */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {/* Like button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLikeClick}
                    className={cn(
                      'flex items-center gap-1.5 py-1 px-2 rounded-md',
                      hasLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500',
                      'hover:bg-rose-500/10',
                    )}
                    title={t('posts.like', { defaultValue: 'Like this post' })}
                    aria-pressed={hasLiked}
                  >
                    <Heart size={15} className={`${hasLiked ? 'fill-rose-500' : ''}`} />
                    <span>{likeCount}</span>
                  </Button>

                  {/* Comment count */}
                  <div
                    className="flex items-center cursor-pointer hover:text-primary transition-colors"
                    title={t('posts.comments', { defaultValue: 'Comments' })}
                    onClick={scrollToComments}
                    aria-label={`View ${commentCount} comments`}
                  >
                    <MessageSquare size={15} className="mr-1.5" />
                    <span>{commentCount}</span>
                  </div>

                  {/* View count */}
                  <div
                    className="flex items-center"
                    title={t('posts.views', { defaultValue: 'Views' })}
                  >
                    <Eye size={15} className="mr-1.5 opacity-70" />
                    <span>{viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post content with footer containing social actions */}
          <div
            className={cn(
              'px-8 py-10 relative overflow-hidden border-b border-border/30',
              'bg-white dark:bg-gray-800/30',
            )}
          >
            {/* Replace dangerouslySetInnerHTML with ReactMarkdown */}
            <div className="prose prose-lg max-w-none" style={{ wordBreak: 'break-word' }}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom component for links to detect and embed YouTube videos
                  a: ({ href, children, ...props }) => {
                    if (href) {
                      const videoId = extractYouTubeVideoId(href);
                      if (videoId) {
                        return (
                          <div className="my-4">
                            <YouTubeEmbed videoId={videoId} />
                            {/* Also show the original link */}
                            <a
                              href={href}
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm mt-2 block"
                            >
                              {href}
                            </a>
                          </div>
                        );
                      }
                    }

                    // Regular link - ensure all links are properly wrapped
                    return (
                      <a
                        href={href}
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-words"
                      >
                        {children}
                      </a>
                    );
                  },
                  // Ensure other elements don't interfere with link rendering
                  p: ({ children, ...props }) => (
                    <p className="mb-3 leading-relaxed" {...props}>
                      {children}
                    </p>
                  ),
                  // Handle code blocks with syntax highlighting
                  code: ({ children, className, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    const isInline = !className?.includes('language-');
                    
                    // For inline code
                    if (isInline) {
                      return (
                        <code
                          className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    
                    // For code blocks with syntax highlighting
                    return (
                      <div className="relative my-4">
                        {language && (
                          <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded z-10">
                            {language}
                          </div>
                        )}
                        <SyntaxHighlighter
                          language={language || 'text'}
                          style={isDarkMode ? vscDarkPlus : vs}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            paddingTop: language ? '2rem' : '1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            backgroundColor: isDarkMode ? '#1e1e1e' : '#f6f8fa',
                          }}
                          showLineNumbers={false}
                          wrapLongLines={true}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                  // Override pre to not wrap code blocks
                  pre: ({ children }) => {
                    return <>{children}</>;
                  },
                  // Table styling
                  table: ({ children, ...props }) => (
                    <div className="my-6 overflow-x-auto border border-border">
                      <table className="min-w-full divide-y divide-border" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children, ...props }) => (
                    <thead className="bg-muted/50 dark:bg-gray-800/50" {...props}>
                      {children}
                    </thead>
                  ),
                  tbody: ({ children, ...props }) => (
                    <tbody className="divide-y divide-border bg-background" {...props}>
                      {children}
                    </tbody>
                  ),
                  th: ({ children, ...props }) => (
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-foreground border-r last:border-r-0 border-border/50"
                      {...props}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td 
                      className="px-4 py-3 text-sm text-foreground border-r last:border-r-0 border-border/30"
                      {...props}
                    >
                      {children}
                    </td>
                  ),
                  tr: ({ children, ...props }) => (
                    <tr className="hover:bg-muted/20 dark:hover:bg-gray-800/30 transition-colors" {...props}>
                      {children}
                    </tr>
                  ),
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
                  // Handle headers
                  h1: ({ children, ...props }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-lg font-bold mt-4 mb-2" {...props}>
                      {children}
                    </h3>
                  ),
                  // Handle blockquotes
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-700 dark:text-gray-300" {...props}>
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {post.content || ''}
              </ReactMarkdown>
            </div>
          </div>

          {/* 댓글 컴포넌트 추가 - border 제거 */}
          <div
            className={cn(
              'px-8 py-8 mt-2 rounded-lg shadow-sm',
              'bg-background dark:bg-gray-800/20',
            )}
          >
            {/* Add ref to the Comments section */}
            <div ref={commentsRef} id="comments">
              {post && <Comments postId={post._id} />}
            </div>
          </div>
        </>
      )}

      {/* 수정 및 삭제 모달은 로딩 상태와 관계없이 항상 조건부 렌더링 */}
      {post && (
        <PostWriteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEditMode={true}
          postId={post._id}
          defaultTitle={post.title}
          defaultContent={post.content}
          defaultCategory={post.category}
          defaultTags={post.tags}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmDeleteModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => void handleDelete()}
        title={t('posts.deleteConfirmTitle')}
        message={t('posts.deleteConfirmMessage')}
        targetName={post?.title}
      />
    </div>
  );
}
