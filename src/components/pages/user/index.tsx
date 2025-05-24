import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { t } from 'i18next';
import { Button } from '@/components/uis/Button';
import AppLoading from '@/components/AppLoading';
import {
  SiGithub,
  SiX,
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiMedium,
  SiVelog,
  SiGmail,
  SiBlogger,
} from '@icons-pack/react-simple-icons';
import PostListItem from '../community/Post/posts/PostListItem';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'posts' | 'about'>('posts');

  // Fetch user data - this returns basic user info
  const user = useQuery(
    api.users.query.getProfile,
    userId ? { userId: userId as Id<'users'> } : 'skip',
  );

  // Fetch user's posts with pagination
  const userPosts = useQuery(
    api.posts.query.getPostsByAuthor,
    userId ? { authorId: userId as Id<'users'>, limit: 10 } : 'skip',
  );

  // Loading state
  if (user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AppLoading />
      </div>
    );
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

  // Extract profile data - using safe access for potentially missing properties
  // First check if we have profile data from the user object

  // Combine data from user and profile objects with fallbacks
  const displayName = user?.displayName || '';
  const avatarUrl = user?.avatarUrl || '';
  const organization = user?.organization || '';
  const description = user?.description || '';
  const lookingFor = user?.lookingFor || '';
  const expectations = user?.expectations || '';
  const socialLinks = user?.socialLinks || [];
  const tags = user?.tags || [];

  // Get the appropriate icon for a social media URL
  const getSocialIcon = (url: string) => {
    if (!url) return <ExternalLink className="w-4 h-4" />;

    try {
      // Try to extract the domain from the URL
      let domain = url.toLowerCase();
      if (!domain.startsWith('http')) {
        domain = 'https://' + domain;
      }

      const urlObj = new URL(domain);
      const hostname = urlObj.hostname;

      if (hostname.includes('github.com')) return <SiGithub size={16} />;
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return <SiX size={16} />;
      if (hostname.includes('facebook.com')) return <SiFacebook size={16} />;
      if (hostname.includes('linkedin.com')) return <ExternalLink className="w-4 h-4" />;
      if (hostname.includes('instagram.com')) return <SiInstagram size={16} />;
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be'))
        return <SiYoutube size={16} />;
      if (hostname.includes('medium.com')) return <SiMedium size={16} />;
      if (hostname.includes('velog.io')) return <SiVelog size={16} />;
      if (hostname.includes('blogger') || hostname.includes('blog')) return <SiBlogger size={16} />;
      if (hostname.includes('mail') || hostname.includes('gmail')) return <SiGmail size={16} />;

      return <ExternalLink className="w-4 h-4" />;
    } catch {
      return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="pt-6 max-w-4xl mx-auto px-4 pb-16">
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
      <div className="border border-border/50 rounded-lg p-6 bg-card/30 mb-6">
        {/* Top row: Avatar and Display Name */}
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {displayName ? displayName[0].toUpperCase() : '?'}
                </span>
              </div>
            )}
          </div>

          {/* Display Name */}
          <h1 className="text-2xl font-bold">{displayName || t('user.anonymousUser')}</h1>
        </div>

        {/* Bottom row: Additional information (if available) */}
        {(organization || tags.length > 0 || socialLinks.length > 0) && (
          <div className="pt-4 border-t border-border/20">
            {/* Organization */}
            {organization && (
              <p className="mb-3">
                <span className="text-muted-foreground">{organization}</span>
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, index) => {
                  try {
                    const url = new URL(link.startsWith('http') ? link : `https://${link}`);
                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        title={url.hostname}
                      >
                        {getSocialIcon(link)}
                      </a>
                    );
                  } catch {
                    return null;
                  }
                })}
              </div>
            )}
          </div>
        )}
      </div>

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
            {t('user.postsBy', { name: displayName || t('user.anonymousUser') })}
          </h2>

          {/* User's posts */}
          {userPosts === undefined ? (
            <div className="flex justify-center py-6">
              <AppLoading />
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
            {t('user.aboutUser', { name: displayName || t('user.anonymousUser') })}
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
