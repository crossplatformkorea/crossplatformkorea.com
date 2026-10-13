import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja, enUS } from 'date-fns/locale';
import { User, Send, MessageSquare, Trash2, Loader2, Heart, LogIn } from 'lucide-react';
import { cn, devConsole, createUserProfileLink } from '../../../../../lib/utils';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '../../../../uis/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommentInput from '../../../../uis/CommentInput';
import { toast } from 'sonner';
import { userFacingErrorMessage } from '@/lib/errors';
import { renderMentionsAndLinks } from '../../../../../utils/mentionUtils';
import { createSignInHref } from '@/lib/authRedirect';
import { useReducedMotion } from 'framer-motion';
import { commentAnchorId } from '@/lib/notificationTarget';

interface CommentsProps {
  postId: Id<'posts'>;
  /** Comment a notification linked straight to; scrolled to and flashed once. */
  highlightCommentId?: string | null;
}

export default function Comments({ postId, highlightCommentId }: CommentsProps) {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, requireAuth } = useAuthStore();
  const [comment, setComment] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<Id<'users'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState<Id<'comments'> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 댓글과 현재 사용자 가져오기
  const comments = useQuery(api.comments.query.getCommentsByPostId, { postId });
  const currentUser = useQuery(api.users.query.currentUser);

  // 댓글 작성자 정보 가져오기 - 전체 쿼리로 변경
  const authorProfiles = useQuery(api.comments.query.getCommentAuthorProfiles, { postId });

  // The browser cannot honour a `#comment-<id>` hash on its own: the anchor does
  // not exist at navigation time because comments arrive from their own query.
  // Scroll once the list has rendered, keyed on the navigation as well as the
  // comment — clicking the same notification again after scrolling away is a
  // fresh request to go back there, and keying on the id alone would swallow it.
  const scrolledToRef = useRef<string | null>(null);
  useEffect(() => {
    if (!highlightCommentId || !comments) return;

    const scrollKey = `${location.key}:${highlightCommentId}`;
    if (scrolledToRef.current === scrollKey) return;

    const target = document.getElementById(commentAnchorId(highlightCommentId));
    // Not rendered yet — leave the ref unset so the next `comments` change retries.
    if (!target) return;

    scrolledToRef.current = scrollKey;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }, [highlightCommentId, comments, location.key, reduceMotion]);

  // 뮤테이션
  const addComment = useMutation(api.comments.mutation.addComment);
  const deleteComment = useMutation(api.comments.mutation.deleteComment);
  const toggleLike = useMutation(api.comments.mutation.toggleLike);

  // 언어별 로케일 설정
  const getLocale = () => {
    switch (i18n.language.split('-')[0]) {
      case 'ko':
        return ko;
      case 'ja':
        return ja;
      default:
        return enUS;
    }
  };

  // Handle comment input change from MentionInput
  const handleCommentChange = (value: string, mentions: Id<'users'>[]) => {
    setComment(value);
    setMentionedUsers(mentions);
  };

  // 댓글 제출 핸들러
  const handleSubmitComment = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);

    // Use void operator to explicitly ignore the Promise
    void (async () => {
      try {
        await addComment({
          postId,
          content: comment.trim(),
          mentionedUsers: mentionedUsers.length > 0 ? mentionedUsers : undefined,
        });
        setComment('');
        setMentionedUsers([]);
      } catch (error) {
        devConsole.error('Error adding comment:', error);
        toast.error(userFacingErrorMessage(error, t('errors.commentCreationFailed')));
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId: Id<'comments'>) => {
    // Use void operator to explicitly ignore the Promise
    void (async () => {
      try {
        await deleteComment({ commentId });
      } catch (error) {
        devConsole.error('Error deleting comment:', error);
        toast.error(userFacingErrorMessage(error, t('errors.commentDeleteFailed')));
      } finally {
        // Closing only on success left the confirm dialog stuck open with the
        // comment still there and nothing explaining why.
        setShowDeleteCommentModal(null);
      }
    })();
  };

  // 멘션 클릭 핸들러
  const handleMentionClick = (userId: Id<'users'>, displayName: string) => {
    void navigate(createUserProfileLink(displayName));
  };

  // 댓글 좋아요 토글 핸들러
  const handleToggleLike = (commentId: Id<'comments'>, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      void navigate(
        createSignInHref(`${location.pathname}${location.search}#${commentAnchorId(commentId)}`),
      );
      return;
    }

    void (async () => {
      try {
        await toggleLike({ commentId });
      } catch (error) {
        devConsole.error('Error toggling comment like:', error);
        toast.error(userFacingErrorMessage(error, t('errors.likeFailed')));
      }
    })();
  };

  // 좋아요 상태 체크 함수
  const checkIfLiked = (comment: any): boolean => {
    if (!currentUser || !comment.likedBy) return false;
    return comment.likedBy.some((id: Id<'users'>) => id === currentUser._id);
  };

  if (!comments) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // authorProfiles 데이터로 lookup 객체 생성
  const authorLookup =
    authorProfiles?.reduce((acc: Record<string, any>, profile) => {
      acc[profile.userId.toString()] = profile;
      return acc;
    }, {}) || {};

  return (
    <div className="min-w-0">
      <p className="section-kicker mb-3 text-muted-foreground">{t('posts.discussionKicker')}</p>
      <h2 className="mb-7 flex items-center gap-2 text-2xl font-bold tracking-[-0.035em]">
        <MessageSquare className="mr-1 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        {t('comments.title')}
        <span className="ml-2 text-sm text-muted-foreground">({comments.length})</span>
      </h2>

      {/* 댓글 작성 폼 */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="rounded-2xl border border-border/80 bg-card/40">
            <CommentInput
              value={comment}
              onChange={handleCommentChange}
              onSubmit={handleSubmitComment}
              placeholder={t('comments.writePlaceholder')}
              className="p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30"
              disabled={isSubmitting}
              rows={4}
              maxLength={3000}
            />
            <div
              className={cn(
                'flex flex-wrap justify-between items-center gap-3 rounded-b-2xl p-3 border-t border-border/70 bg-muted/20',
              )}
            >
              <span className="text-xs text-muted-foreground">{t('comments.shortcuts')}</span>
              <Button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                variant={comment.trim() ? 'default' : 'secondary'}
                size="sm"
                className="min-h-10 gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{t('comments.submit')}</span>
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border/70 bg-muted/30 p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">{t('comments.loginRequired')}</p>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => {
              const returnTo = `${location.pathname}${location.search}${location.hash || '#comments'}`;
              void navigate(createSignInHref(returnTo));
            }}
          >
            <LogIn size={15} />
            {t('common.signIn')}
          </Button>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments
            .slice()
            .sort((a, b) => b._creationTime - a._creationTime)
            .map((comment) => {
              // 댓글 작성자 정보 가져오기 - lookup 객체 사용
              const commentAuthor = comment.authorId
                ? authorLookup[comment.authorId.toString()]
                : null;

              const isCommentAuthor =
                currentUser && commentAuthor && currentUser._id === comment.authorId;

              // 좋아요 상태 체크 - 주석 처리된 기존 코드 대신 새 함수 사용
              const hasLiked = checkIfLiked(comment);
              const likeCount = comment.likeCount || 0;

              const isHighlighted = highlightCommentId === comment._id.toString();

              return (
                <div
                  key={comment._id.toString()}
                  id={commentAnchorId(comment._id.toString())}
                  className={cn(
                    'border-b border-border/70 pb-6 last:border-b-0',
                    'scroll-mt-24 rounded-xl transition-colors duration-500 motion-reduce:transition-none',
                    isHighlighted && 'bg-primary/10 ring-1 ring-primary/30 px-3 pt-3',
                  )}
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {commentAuthor?.displayName ? (
                        <Link
                          to={createUserProfileLink(commentAuthor.displayName)}
                          aria-label={commentAuthor.displayName}
                          className="shrink-0 rounded-full"
                        >
                          {commentAuthor.avatarUrl ? (
                            <img
                              src={commentAuthor.avatarUrl}
                              alt=""
                              loading="lazy"
                              className="h-8 w-8 rounded-full border border-border/70 object-cover"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-muted">
                              <User size={14} />
                            </span>
                          )}
                        </Link>
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted">
                          <User size={14} />
                        </span>
                      )}
                      <div className="min-w-0">
                        {commentAuthor?.displayName ? (
                          <Link
                            to={createUserProfileLink(commentAuthor.displayName)}
                            className="block truncate text-sm font-semibold hover:underline"
                          >
                            {commentAuthor.displayName}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold">{t('user.anonymousUser')}</span>
                        )}
                        <time
                          dateTime={new Date(comment._creationTime).toISOString()}
                          className="mt-1 block text-[11px] text-muted-foreground"
                        >
                          {formatDistanceToNow(new Date(comment._creationTime), {
                            addSuffix: true,
                            locale: getLocale(),
                          })}
                        </time>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <Button
                        type="button"
                        onClick={(e) => handleToggleLike(comment._id, e)}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'min-h-11 gap-1.5 px-2',
                          hasLiked ? 'text-foreground' : 'text-muted-foreground',
                        )}
                        aria-pressed={hasLiked}
                        aria-label={`${isAuthenticated ? t(hasLiked ? 'common.unlike' : 'common.like') : t('posts.loginToLike')} · ${likeCount}`}
                        title={
                          isAuthenticated
                            ? t(hasLiked ? 'common.unlike' : 'common.like')
                            : t('posts.loginToLike')
                        }
                      >
                        <Heart className={cn('h-3.5 w-3.5', hasLiked && 'fill-current')} />
                        <span className="text-xs">{likeCount}</span>
                      </Button>
                      {isCommentAuthor && (
                        <Button
                          type="button"
                          onClick={() => setShowDeleteCommentModal(comment._id)}
                          variant="ghost"
                          size="icon"
                          className="min-h-11 min-w-11 text-muted-foreground hover:text-destructive"
                          aria-label={t('common.delete')}
                          title={t('common.delete')}
                        >
                          <Trash2 size={15} />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 댓글 내용 - Also adjusted margin for consistency */}
                  <div className="ml-11 mb-2">
                    {' '}
                    {/* Increased from ml-10 to ml-11 to match new avatar spacing */}
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground/90">
                      {renderMentionsAndLinks(comment.content, {
                        onMentionClick: handleMentionClick,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>{t('comments.noComments')}</p>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmDeleteModal
        isOpen={!!showDeleteCommentModal}
        onClose={() => setShowDeleteCommentModal(null)}
        onConfirm={() => {
          if (showDeleteCommentModal) {
            handleDeleteComment(showDeleteCommentModal);
          }
        }}
        title={t('comments.deleteCommentTitle')}
        message={t('comments.deleteCommentMessage')}
      />
    </div>
  );
}
