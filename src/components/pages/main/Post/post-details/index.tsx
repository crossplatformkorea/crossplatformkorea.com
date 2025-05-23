import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useConvexAuth, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { ArrowLeft, MessageSquare, Heart, Pencil, Trash2, Eye } from 'lucide-react';
import AuthorCard from './AuthorCard';
import CategoryBadge from '@/components/uis/CategoryBadge';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import PostWrite from '../../Post/PostWrite';
import Comments from './Comments';

export default function PostDetailsPage() {
  const { isAuthenticated } = useConvexAuth();
  const { postId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useQuery(api.users.query.currentUser);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);
  // 수정 모달 관련 상태 추가
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete post mutation
  const deletePost = useMutation(api.posts.mutation.deletePost);

  // Add toggleLike mutation
  const toggleLike = useMutation(api.posts.mutation.toggleLike);

  // Add incrementViewCount mutation
  const incrementViewCount = useMutation(api.posts.mutation.incrementViewCount);

  // If no postId is provided, navigate back
  useEffect(() => {
    if (!postId) {
      void navigate(-1);
    }
  }, [postId, navigate]);

  // Only query when postId exists and is a valid ID format
  const post = useQuery(
    api.posts.query.getPostById,
    postId ? { postId: postId as Id<'posts'> } : 'skip',
  );

  // Increment view count once when the post is loaded
  useEffect(() => {
    if (post && postId && !viewIncremented) {
      void incrementViewCount({ postId: postId as Id<'posts'> });
      setViewIncremented(true);
    }
  }, [post, postId, incrementViewCount, viewIncremented]);

  // Get author info when post and authorId exist
  const author = useQuery(
    api.users.query.getProfile,
    post && post.authorId ? { userId: post.authorId } : 'skip',
  );

  // 개별 통계 쿼리 제거하고 post 객체에서 직접 가져오도록 변경
  // 단, hasLiked는 현재 사용자의 상태이므로 쿼리 유지
  const hasLiked = useQuery(api.posts.query.hasLiked, post ? { postId: post._id } : 'skip');

  const handleGoBack = () => {
    void navigate(-1);
  };

  const handleEdit = () => {
    if (post) {
      // 편집 버튼을 클릭하면 모달 열기
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (post) {
      await deletePost({ postId: post._id });
      void navigate('/posts');
    }
  };

  // Add handleLikeClick function
  const handleLikeClick = () => {
    if (post) {
      void toggleLike({ postId: post._id });
    }
  };

  // Show loading state while waiting for post data
  if (!postId) {
    return null; // Will redirect via useEffect
  }

  if (!post) {
    return (
      <div className="mt-8 text-center">
        {t('posts.loadingPost', { defaultValue: 'Loading...' })}
      </div>
    );
  }

  // 포스트 통계 데이터 - post 객체에서 직접 가져옴
  const commentCount = post.commentCount || 0;
  const viewCount = post.viewCount || 0;
  const likeCount = post.likeCount || 0;

  const isAuthor = isAuthenticated && user && post.authorId === user._id;

  const formattedDate = formatDistanceToNow(new Date(post._creationTime), {
    addSuffix: true,
    locale: i18n.language === 'ko' ? ko : undefined,
  });

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} className="mr-1" />
        <span>{t('common.back', { defaultValue: 'Back' })}</span>
      </button>

      {/* Post header section with visual depth */}
      <div className="mb-8 bg-muted/5 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/10">
          {/* Category and tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryBadge category={post.category} />

            {post.tags &&
              post.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
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
                <button
                  onClick={handleEdit}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                  title={t('posts.edit', { defaultValue: 'Edit Post' })}
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                  title={t('posts.delete', { defaultValue: 'Delete Post' })}
                >
                  <Trash2 size={18} />
                </button>
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
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-md bg-transparent border-0 ${
                  hasLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
                } hover:bg-rose-500/10 transition-colors`}
                title={t('posts.like', { defaultValue: 'Like this post' })}
                aria-pressed={hasLiked}
              >
                <Heart size={15} className={`${hasLiked ? 'fill-rose-500' : ''}`} />
                <span>{likeCount}</span>
              </button>

              {/* Comment count */}
              <div
                className="flex items-center"
                title={t('posts.comments', { defaultValue: 'Comments' })}
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
      <div className="bg-white dark:bg-gray-800/30 px-8 py-10 relative overflow-hidden border-b border-border/30">
        <div
          className="prose prose-lg max-w-none whitespace-pre-wrap"
          style={{ wordBreak: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>
      
      {/* 댓글 컴포넌트 추가 - border 제거 */}
      <div className="bg-background dark:bg-gray-800/20 px-8 py-8 mt-2 rounded-lg shadow-sm">
        {post && <Comments postId={post._id} />}
      </div>

      {/* 수정 모달 */}
      {post && (
        <PostWrite
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
