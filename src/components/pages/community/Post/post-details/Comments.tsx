import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja, enUS } from 'date-fns/locale';
import { User, Send, MessageSquare, Trash2, Loader2, Heart } from 'lucide-react';
import { cn, devConsole } from '../../../../../lib/utils';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '../../../../uis/Button';
import { useNavigate } from 'react-router-dom';
import MentionInput from '../../../../uis/MentionInput';
import { renderMentions } from '../../../../../utils/mentionUtils';

interface CommentsProps {
  postId: Id<'posts'>;
}

export default function Comments({ postId }: CommentsProps) {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, requireAuth } = useAuthStore();
  const [comment, setComment] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<Id<'users'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState<Id<'comments'> | null>(null);
  const navigate = useNavigate();

  // 댓글과 현재 사용자 가져오기
  const comments = useQuery(api.comments.query.getCommentsByPostId, { postId });
  const currentUser = useQuery(api.users.query.currentUser);

  // 댓글 작성자 정보 가져오기 - 전체 쿼리로 변경
  const authorProfiles = useQuery(api.comments.query.getCommentAuthorProfiles, { postId });

  // 뮤테이션
  const addComment = useMutation(api.comments.mutation.addComment);
  const deleteComment = useMutation(api.comments.mutation.deleteComment);
  const toggleLike = useMutation(api.comments.mutation.toggleLike);

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
          mentionedUsers: mentionedUsers.length > 0 ? mentionedUsers : undefined
        });
        setComment('');
        setMentionedUsers([]);
      } catch (error) {
        devConsole.error('Error adding comment:', error);
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
        devConsole.error('Error deleting comment:', error);
      }
    })();
  };
  
  // 사용자 프로필 페이지로 이동 핸들러
  const handleUserClick = (userId: Id<'users'>, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void navigate(`/user/${userId}`);
  };

  // 멘션 클릭 핸들러
  const handleMentionClick = (userId: Id<'users'>, _displayName: string) => {
    void navigate(`/user/${userId}`);
  };
  
  // 댓글 좋아요 토글 핸들러
  const handleToggleLike = (commentId: Id<'comments'>, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    
    void toggleLike({ commentId });
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
            <MentionInput
              value={comment}
              onChange={handleCommentChange}
              onSubmit={handleSubmitComment}
              placeholder={t('comments.writePlaceholder')}
              className='p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30'
              disabled={isSubmitting}
              rows={4}
            />
            <div className={cn(
              "flex justify-end p-2 border-t border-border",
              "dark:border-gray-700",
              "bg-muted/20 dark:bg-gray-800/50"
            )}>
              <Button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                variant={comment.trim() ? "default" : "secondary"}
                size="sm"
                className="gap-1.5"
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
        <div className={cn(
          "rounded-md p-4 mb-8 text-center",
          "bg-muted/30 dark:bg-gray-800/40"
        )}>
          <p className="text-muted-foreground">
            {t('comments.loginRequired')}
          </p>
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

            return (
              <div
                key={comment._id.toString()}
                className="border-b border-border/30 dark:border-gray-700/30 pb-4 last:border-b-0"
              >
                {/* 댓글 작성자 정보 */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {/* 프로필 이미지 - 클릭 시 사용자 페이지로 이동 */}
                    <div 
                      onClick={comment.authorId ? (e) => handleUserClick(comment.authorId, e) : undefined}
                      className="cursor-pointer"
                    >
                      {commentAuthor?.avatarUrl ? (
                        <img
                          src={commentAuthor.avatarUrl}
                          alt={commentAuthor.displayName || ''}
                          className={cn(
                            "h-8 w-8 rounded-full mr-3", // Increased margin-right from mr-2 to mr-3
                            "object-cover border border-border/30",
                            "hover:border-primary/60 transition-colors",
                            "dark:border-gray-700/50"
                          )}
                        />
                      ) : (
                        <div className={cn(
                          "h-8 w-8 rounded-full mr-3", // Increased margin-right from mr-2 to mr-3
                          "flex items-center justify-center",
                          "bg-muted hover:bg-muted/80 transition-colors",
                          "dark:bg-gray-700"
                        )}>
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="ml-0.5"> {/* Added a small left margin */}
                      {/* 사용자 이름 - 클릭 시 사용자 페이지로 이동 */}
                      <div 
                        className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                        onClick={comment.authorId ? (e) => handleUserClick(comment.authorId, e) : undefined}
                      >
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

                  <div className="flex items-center">
                    {/* 좋아요 버튼 */}
                    <Button
                      onClick={(e) => handleToggleLike(comment._id, e)}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex items-center gap-1 py-1 px-2 h-8",
                        hasLiked ? 'text-rose-500' : 'text-muted-foreground',
                        "hover:bg-rose-500/10 hover:text-rose-500"
                      )}
                      title={hasLiked ? t('common.unlike') : t('common.like')}
                    >
                      <Heart 
                        className={cn("h-3.5 w-3.5", hasLiked && "fill-rose-500")} 
                      />
                      <span className="text-xs">{likeCount}</span>
                    </Button>

                    {/* 댓글 삭제 버튼 - 작성자만 볼 수 있음 */}
                    {isCommentAuthor && (
                      <Button
                        onClick={() => setShowDeleteCommentModal(comment._id)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 h-8 w-8 ml-1"
                        title={t('common.delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* 댓글 내용 - Also adjusted margin for consistency */}
                <div className="ml-11 mb-2"> {/* Increased from ml-10 to ml-11 to match new avatar spacing */}
                  <p className="text-foreground dark:text-gray-200 whitespace-pre-wrap break-words text-sm">
                    {renderMentions(comment.content, {
                      onMentionClick: handleMentionClick
                    })}
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
