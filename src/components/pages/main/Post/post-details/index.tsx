import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useConvexAuth, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { ArrowLeft, MessageSquare, Heart, Pencil, Trash2 } from 'lucide-react';
import AuthorCard from './AuthorCard';
import CategoryBadge from '@/components/uis/CategoryBadge';

export default function PostDetailsPage() {
  const { isAuthenticated } = useConvexAuth();
  const { postId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useQuery(api.users.query.currentUser);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Delete post mutation
  const deletePost = useMutation(api.posts.mutation.deletePost);

  // Add toggleLike mutation
  const toggleLike = useMutation(api.posts.mutation.toggleLike);

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

  // Get author info when post and authorId exist
  const author = useQuery(
    api.users.query.getProfile,
    post && post.authorId ? { userId: post.authorId } : 'skip',
  );

  // Get comment and like stats
  const commentCountQuery = useQuery(
    api.posts.query.getCommentCount,
    post ? { postId: post._id } : 'skip',
  );
  const likeCountQuery = useQuery(
    api.posts.query.getLikeCount,
    post ? { postId: post._id } : 'skip',
  );
  const hasLiked = useQuery(api.posts.query.hasLiked, post ? { postId: post._id } : 'skip');

  const handleGoBack = () => {
    void navigate(-1);
  };

  const handleEdit = () => {
    if (post) {
      void navigate(`/post/edit/${post._id}`);
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

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center" title={t('posts.comments')}>
                <MessageSquare size={15} className="mr-1.5" />
                <span>{commentCountQuery || 0}</span>
              </div>

              {/* Make the like icon clickable */}
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-md bg-transparent border-0 ${
                  hasLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
                } hover:bg-rose-500/10 transition-colors`}
                title={t('posts.like', { defaultValue: 'Like this post' })}
                aria-pressed={hasLiked}
              >
                <Heart size={15} className={`${hasLiked ? 'fill-rose-500' : ''}`} />
                <span>{likeCountQuery || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post content with footer containing social actions */}
      <div className="bg-white dark:bg-gray-800/30 px-8 py-10 relative overflow-hidden border-b border-border/30">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>

      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">
              {t('posts.deleteConfirmTitle', { defaultValue: 'Delete Post?' })}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('posts.deleteConfirmMessage', {
                defaultValue:
                  'This action cannot be undone. Are you sure you want to delete this post?',
              })}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-md"
              >
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </button>
              <button
                onClick={() => void handleDelete()}
                className="px-4 py-2 text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 rounded-md"
              >
                {t('common.delete', { defaultValue: 'Delete' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
