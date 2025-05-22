import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useConvexAuth } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MessageSquare, User, Sparkles, LogIn } from 'lucide-react';
import SummaryPostItem from './SummaryPostItem';
import UserStats from './UserStats';
import { motion } from 'framer-motion';

export default function SummaryPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useConvexAuth();
  const [mounted, setMounted] = useState(false);

  // Get user profile
  const userIdentity = useQuery(api.users.query.currentUser);
  const recentPosts = useQuery(api.posts.query.getRecentPosts, { limit: 6 });

  // Animate components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-full bg-gradient-to-br from-background to-background/95 dark:from-background/90 dark:to-background/70 py-8 px-4">
      {/* Decorative elements - 더 연하게 조정 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] top-0 left-0 bg-primary/3 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute w-[400px] h-[400px] bottom-0 right-0 bg-secondary/3 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-secondary/90 mt-4 mb-2">
            {t('summary.welcome')}
          </h1>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto">
            {t('summary.welcomeMessage')}
          </p>
        </motion.div>

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
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-full opacity-60 group-hover:opacity-80 blur-[2px] transition-opacity duration-500" />
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
                      className="px-5 py-2.5 bg-primary/80 hover:bg-primary/90 text-primary-foreground rounded-md transition-all duration-300 flex items-center gap-1 shrink-0"
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
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-md transition-all 
                  hover:bg-primary/90 flex items-center gap-1.5 font-medium"
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
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/15 dark:to-primary/5 p-3 rounded-xl mr-4">
                  <MessageSquare className="text-primary/80" size={28} />
                </div>
                <h2 className="text-2xl font-medium text-foreground/90">
                  {t('posts.recentPosts')}
                </h2>
              </div>
              <Link
                to="/posts"
                className="group flex items-center gap-1 px-4 py-2 rounded-full bg-background hover:bg-card/80 border border-border/30 transition-all duration-300"
              >
                <span className="text-muted-foreground/90 group-hover:text-foreground/90 transition-colors">
                  {t('common.viewAll')}
                </span>
                <ArrowRight
                  size={16}
                  className="text-primary/70 transform group-hover:translate-x-1 transition-transform"
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
