import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja, enUS } from 'date-fns/locale';
import { User, Send, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { useAuthStore } from '@/stores/authStore';

interface CommentsProps {
  postId: Id<'posts'>;
}

export default function Comments({ postId }: CommentsProps) {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, requireAuth } = useAuthStore();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState<Id<'comments'> | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // 댓글과 현재 사용자 가져오기
  const comments = useQuery(api.comments.query.getCommentsByPostId, { postId });
  const currentUser = useQuery(api.users.query.currentUser);

  // 댓글 작성자 정보 가져오기 - 전체 쿼리로 변경
  const authorProfiles = useQuery(api.comments.query.getCommentAuthorProfiles, { postId });

  // 뮤테이션
  const addComment = useMutation(api.comments.mutation.addComment);
  const deleteComment = useMutation(api.comments.mutation.deleteComment);

  // 언어별 로케일 설정
  const getLocale = () => {
    switch (i18n.language) {
      case 'ko':
        return ko;
      case 'ja':
        return ja;
      default:
        return enUS;
    }
  };

  // 댓글 제출 핸들러
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    
    if (!comment.trim()) return;

    setIsSubmitting(true);

    // Use void operator to explicitly ignore the Promise
    void (async () => {
      try {
        await addComment({ postId, content: comment.trim() });
        setComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
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
        setShowDeleteCommentModal(null);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    })();
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
    <div className="mt-8">
      <h3 className="font-semibold text-xl mb-5 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        {t('comments.title')}
        <span className="ml-2 text-sm text-muted-foreground">({comments.length})</span>
      </h3>

      {/* 댓글 작성 폼 */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="border border-border dark:border-gray-700 rounded-md">
            <textarea
              ref={commentInputRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('comments.writePlaceholder')}
              className="w-full p-3 min-h-[100px] bg-transparent border-0 focus:ring-0 resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-end p-2 border-t border-border dark:border-gray-700 bg-muted/20 dark:bg-gray-800/50">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors',
                  comment.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{t('comments.submit')}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-muted/30 dark:bg-gray-800/40 rounded-md p-4 mb-8 text-center">
          <p className="text-muted-foreground">
            {t('comments.loginRequired')}
          </p>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => {
            // 댓글 작성자 정보 가져오기 - lookup 객체 사용
            const commentAuthor = comment.authorId
              ? authorLookup[comment.authorId.toString()]
              : null;

            const isCommentAuthor =
              currentUser && commentAuthor && currentUser._id === comment.authorId;

            return (
              <div
                key={comment._id.toString()}
                className="border-b border-border/30 dark:border-gray-700/30 pb-4 last:border-b-0"
              >
                {/* 댓글 작성자 정보 */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {commentAuthor?.avatarUrl ? (
                      <img
                        src={commentAuthor.avatarUrl}
                        alt={commentAuthor.displayName || ''}
                        className="h-8 w-8 rounded-full mr-2 object-cover border border-border/30 dark:border-gray-700/50"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-muted dark:bg-gray-700 rounded-full mr-2 flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {commentAuthor?.displayName || t('user.anonymousUser')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment._creationTime), {
                          addSuffix: true,
                          locale: getLocale(),
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 댓글 삭제 버튼 - 작성자만 볼 수 있음 */}
                  {isCommentAuthor && (
                    <button
                      onClick={() => setShowDeleteCommentModal(comment._id)}
                      className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-full transition-colors"
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* 댓글 내용 */}
                <div className="ml-10 mb-2">
                  <p className="text-foreground dark:text-gray-200 whitespace-pre-wrap break-words text-sm">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>
              {t('comments.noComments')}
            </p>
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
