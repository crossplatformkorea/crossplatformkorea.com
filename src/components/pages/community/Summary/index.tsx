import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MessageSquare, User, Sparkles, LogIn } from 'lucide-react';
import SummaryPostItem from './SummaryPostItem';
import UserStats from './UserStats';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function SummaryPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const recentPosts = useQuery(api.posts.query.getRecentPosts, { limit: 6 });
  const userIdentity = useQuery(api.users.query.currentUser);
  
  // State for animation and first login tracking
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if first login using localStorage
  useEffect(() => {
    setMounted(true);
    
    if (isAuthenticated && userIdentity) {
      // Check if user has seen welcome message
      const userId = userIdentity._id;
      const welcomeShownKey = `welcome_shown_${userId}`;
      const hasSeenWelcome = localStorage.getItem(welcomeShownKey);
      
      if (!hasSeenWelcome) {
        // Show welcome message for first time
        setShowWelcome(true);
        // Mark welcome as shown
        localStorage.setItem(welcomeShownKey, 'true');
      }
    }
  }, [isAuthenticated, userIdentity]);

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className={cn(
      "min-h-full py-8 px-4",
      "bg-gradient-to-br from-background to-background/95",
      "dark:from-background/90 dark:to-background/70"
    )}>
      {/* Decorative elements - 더 연하게 조정 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] top-0 left-0 bg-primary/3 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute w-[400px] h-[400px] bottom-0 right-0 bg-secondary/3 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        {/* 환영 메시지 - 첫 로그인 시에만 표시 */}
        {showWelcome && (
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className={cn(
              "text-4xl font-bold mt-4 mb-2",
              "bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-secondary/90"
            )}>
              {t('summary.welcome')}
            </h1>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto">
              {t('summary.welcomeMessage')}
            </p>
          </motion.div>
        )}

        {/* 로그인 상태에 따라 다른 컨텐츠 표시 */}
        {isAuthenticated && userIdentity ? (
          <>
            {/* User Profile Card - 로그인된 경우 */}
            <motion.div
              className="mb-6 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="relative rounded-xl overflow-hidden backdrop-blur-[2px] bg-card/60 border border-border/40">
                {/* Background pattern - 더 미묘한 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-secondary/3 dark:from-primary/5 dark:to-secondary/5" />

                <div className="relative p-6">
                  <div className="flex items-center gap-5 flex-wrap">
                    {/* 프로필 이미지 - 더 부드러운 효과 */}
                    <div className="relative group">
                      <div className={cn(
                        "absolute -inset-0.5 rounded-full opacity-60 blur-[2px] transition-opacity duration-500",
                        "bg-gradient-to-r from-primary/60 to-secondary/60",
                        "group-hover:opacity-80"
                      )} />
                      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted/50 border border-background/30">
                        {userIdentity.avatarUrl ? (
                          <img
                            src={userIdentity.avatarUrl}
                            alt={userIdentity.profile?.displayName || 'User'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-14 w-14 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold truncate flex items-center gap-2">
                        {userIdentity.profile?.displayName || userIdentity.email?.split('@')[0]}
                        <Sparkles size={18} className="text-yellow-500 animate-pulse" />
                      </h2>
                      {userIdentity.profile?.description && (
                        <p className="text-muted-foreground line-clamp-2 text-sm mt-2">
                          {userIdentity.profile.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        {userIdentity.profile?.tags?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-primary/10 text-xs rounded-full text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className={cn(
                        "px-5 py-2.5 text-primary-foreground rounded-md transition-all duration-300 flex items-center gap-1 shrink-0",
                        "bg-primary/80 hover:bg-primary/90"
                      )}
                    >
                      {t('profile.viewEdit')}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 사용자 통계 - 로그인된 경우 */}
            {userIdentity._id && <UserStats userId={userIdentity._id} />}
          </>
        ) : (
          /* 간소화된 로그인 요청 카드 */
          <motion.div
            className="mb-10 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="relative rounded-lg overflow-hidden backdrop-blur-[1px] bg-card/40 border border-border/30">
              <div className="relative py-4 px-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <LogIn size={16} className="text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground/90">
                    {t('common.loginToAccess')}
                  </span>
                </div>
                <Link
                  to="/sign-in"
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 font-medium",
                    // 라이트모드 스타일
                    "bg-gradient-to-r from-primary/70 to-primary/80",
                    "text-primary-foreground",
                    "hover:from-primary/80 hover:to-primary/90",
                    // 다크모드 스타일 - 더 밝게 조정
                    "dark:from-primary/85 dark:to-primary/95",
                    "dark:text-primary-foreground",
                    "dark:hover:from-primary/90 dark:hover:to-primary/100"
                  )}
                >
                  {t('common.signIn')}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Sections */}
        <div className="grid grid-cols-1 gap-10">
          {/* Posts Section - 더 세련된 섹션 헤더 */}
          <motion.section
            variants={container}
            initial="hidden"
            animate={mounted ? 'show' : 'hidden'}
            className="relative"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className={cn(
                  "p-3 rounded-xl mr-4",
                  "bg-gradient-to-r from-primary/10 to-primary/5",
                  "dark:from-primary/15 dark:to-primary/5"
                )}>
                  <MessageSquare className="text-primary/80" size={28} />
                </div>
                <h2 className="text-2xl font-medium text-foreground/90">
                  {t('posts.recentPosts')}
                </h2>
              </div>
              <Link
                to="/posts"
                className={cn(
                  "group flex items-center gap-1 px-4 py-2 rounded-full bg-background border border-border/30 transition-all duration-300",
                  "hover:bg-card/80"
                )}
              >
                <span className={cn(
                  "text-muted-foreground/90 transition-colors",
                  "group-hover:text-foreground/90"
                )}>
                  {t('common.viewAll')}
                </span>
                <ArrowRight
                  size={16}
                  className={cn(
                    "text-primary/70 transform transition-transform",
                    "group-hover:translate-x-1"
                  )}
                />
              </Link>
            </div>

            {recentPosts?.length === 0 ? (
              <motion.div
                className="text-center py-12 rounded-xl bg-muted/10 backdrop-blur-[1px]"
                variants={item}
              >
                <p className="text-muted-foreground px-4">{t('posts.noPosts')}</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts?.map((post, index) => (
                  <motion.div key={post._id} variants={item} custom={index}>
                    <SummaryPostItem post={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
