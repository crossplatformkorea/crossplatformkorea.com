import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { t } from 'i18next';
import { Button } from '@/components/uis/Button';
import PostListItem from '../community/Post/posts/PostListItem';
import ProfileHeader from './ProfileHeader';
import UserSkeleton from './UserSkeleton';
import { useMetaTags } from '@/hooks/useMetaTags';

export default function UserProfilePage() {
  const { displayName } = useParams<{ displayName: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'posts' | 'about'>('posts');

  // Check if the displayName starts with @ and extract the actual display name
  const rawDisplayName = displayName || '';
  const isValidUserProfile = rawDisplayName.startsWith('@');

  // Extract displayName from the parameter (remove @ prefix and decode)
  const decodedDisplayName = isValidUserProfile ? decodeURIComponent(rawDisplayName.slice(1)) : '';

  // Redirect to home if not a valid user profile route
  useEffect(() => {
    if (!isValidUserProfile) {
      void navigate('/', { replace: true });
    }
  }, [isValidUserProfile, navigate]);

  // Fetch user data by display name (case-insensitive)
  const user = useQuery(
    api.users.query.getProfileByDisplayName,
    decodedDisplayName ? { displayName: decodedDisplayName } : 'skip',
  );

  // Fetch user's posts with pagination (only if we have a user and pass the correct userId)
  const userPosts = useQuery(
    api.posts.query.getPostsByAuthor,
    user && user !== null ? { authorId: user.userId, limit: 10 } : 'skip', // Use userId instead of _id
  );

  // SEO optimization for user profile pages
  useMetaTags(
    user
      ? {
          title: `${user.displayName || 'User'} | Cross-Platform Korea`,
          description:
            user.description ||
            `${user.displayName}'s profile on Cross-Platform Korea - ${user.organization || ''}`.trim(),
          keywords: user.tags
            ? `${user.tags.join(', ')}, cross-platform, korea, developer, profile`
            : 'cross-platform, korea, developer, profile',
          ogTitle: `${user.displayName || 'User'} | Cross-Platform Korea`,
          ogDescription:
            user.description || `${user.displayName}'s profile on Cross-Platform Korea`,
          ogImage: user.avatarUrl || '/og-preview.jpg',
          twitterTitle: `${user.displayName || 'User'} | Cross-Platform Korea`,
          twitterDescription: user.description || `${user.displayName}'s profile`,
        }
      : undefined,
  );

  // Add JSON-LD structured data for user profiles
  useEffect(() => {
    if (user) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: user.displayName || 'Anonymous',
        description: user.description,
        url: window.location.href,
        image: user.avatarUrl,
        worksFor: user.organization
          ? {
              '@type': 'Organization',
              name: user.organization,
            }
          : undefined,
        sameAs: [user.socialLinks].filter(Boolean),
      };

      // Remove existing structured data script if any
      const existingScript = document.querySelector('script[data-type="person-ld-json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-type', 'person-ld-json');
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Cleanup on unmount
      return () => {
        const scriptToRemove = document.querySelector('script[data-type="person-ld-json"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [user]);

  // Loading state
  if (user === undefined) {
    return <UserSkeleton />;
  }

  // Early return if not a valid user profile route
  if (!isValidUserProfile) {
    return null;
  }

  // Handle back button click
  const handleGoBack = () => {
    void navigate(-1);
  };

  // User not found state
  if (user === null) {
    return (
      <div className="pt-6 max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-muted-foreground hover:text-foreground p-2"
          >
            <ArrowLeft size={18} className="mr-2" />
            {t('common.back')}
          </Button>
        </div>

        <div className="p-8 text-center border border-border/50 rounded-lg bg-card/30">
          <h2 className="text-2xl font-bold mb-2">{t('user.userNotFound')}</h2>
          <p className="text-muted-foreground">{t('user.userNotFoundMessage')}</p>
        </div>
      </div>
    );
  }

  // Extract profile data
  const userDisplayName = user.displayName || '';
  const avatarUrl = user.avatarUrl || '';
  const organization = user.organization || '';
  const description = user.description || '';
  const lookingFor = user.lookingFor || '';
  const expectations = user.expectations || '';
  const socialLinks = user.socialLinks || [];
  const tags = user.tags || [];

  return (
    <div>
      {/* Back button */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="text-muted-foreground hover:text-foreground p-2"
        >
          <ArrowLeft size={18} className="mr-2" />
          {t('common.back')}
        </Button>
      </div>

      {/* Profile header */}
      <ProfileHeader
        displayName={userDisplayName}
        avatarUrl={avatarUrl}
        organization={organization}
        tags={tags}
        socialLinks={socialLinks}
      />

      {/* Tabs */}
      <div className="flex border-b border-border/50 mb-6">
        <Button
          variant="ghost"
          className={cn(
            'px-4 py-2 font-medium transition-colors rounded-none',
            selectedTab === 'posts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setSelectedTab('posts')}
        >
          {t('user.posts')}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'px-4 py-2 font-medium transition-colors rounded-none',
            selectedTab === 'about'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setSelectedTab('about')}
        >
          {t('user.about')}
        </Button>
      </div>

      {/* Tab content */}
      {selectedTab === 'posts' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {t('user.postsBy', { name: userDisplayName || t('user.anonymousUser') })}
          </h2>

          {/* User's posts */}
          {userPosts === undefined ? (
            <div className="space-y-4">
              {/* Posts loading skeleton */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card/30 border border-border/50 rounded-lg p-4 space-y-3"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted/40 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-24 h-4 bg-muted/30 rounded-md"></div>
                      <div className="w-32 h-3 bg-muted/20 rounded-md"></div>
                    </div>
                  </div>
                  {/* Post title */}
                  <div className="w-3/4 h-5 bg-muted/40 rounded-md"></div>
                  {/* Post content */}
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted/20 rounded-md"></div>
                    <div className="w-5/6 h-4 bg-muted/20 rounded-md"></div>
                  </div>
                  {/* Post actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-4">
                      <div className="w-12 h-6 bg-muted/30 rounded-md"></div>
                      <div className="w-12 h-6 bg-muted/30 rounded-md"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostListItem key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">{t('user.noPostsYet')}</div>
          )}
        </div>
      ) : (
        <div className="bg-card/30 border border-border/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('user.aboutUser', { name: userDisplayName || t('user.anonymousUser') })}
          </h2>
          {description ? (
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{description}</p>
          ) : (
            <p className="text-muted-foreground mb-4">{t('user.noDescription')}</p>
          )}
          {lookingFor && (
            <div className="mb-4">
              <h3 className="font-medium text-foreground mb-1">{t('user.lookingFor')}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{lookingFor}</p>
            </div>
          )}
          {expectations && (
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('user.expectations')}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{expectations}</p>
            </div>
          )}
          {!description && !lookingFor && !expectations && (
            <p className="text-muted-foreground">{t('user.noProfileDetails')}</p>
          )}
        </div>
      )}
    </div>
  );
}
