import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLoading from '@/components/AppLoading';
import { Id } from '../../../../../convex/_generated/dataModel';
import { cn } from '../../../../lib/utils';
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
import PostListItem from '../Post/posts/PostListItem';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { t } = useTranslation();
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
          <button
            onClick={handleGoBack}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer"
          >
            <ArrowLeft size={18} className="mr-2" />
            {t('common.back')}
          </button>
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
    if (!url) return <LinkIcon className="w-4 h-4" />;

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
      if (hostname.includes('linkedin.com')) return <LinkIcon className="w-4 h-4" />;
      if (hostname.includes('instagram.com')) return <SiInstagram size={16} />;
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be'))
        return <SiYoutube size={16} />;
      if (hostname.includes('medium.com')) return <SiMedium size={16} />;
      if (hostname.includes('velog.io')) return <SiVelog size={16} />;
      if (hostname.includes('blogger') || hostname.includes('blog')) return <SiBlogger size={16} />;
      if (hostname.includes('mail') || hostname.includes('gmail')) return <SiGmail size={16} />;

      return <LinkIcon className="w-4 h-4" />;
    } catch {
      return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="pt-6 max-w-4xl mx-auto px-4 pb-16">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" />
          {t('common.back')}
        </button>
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
                    return null; // Skip invalid URLs
                  }
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50 mb-6">
        <button
          className={cn(
            'px-4 py-2 font-medium transition-colors',
            selectedTab === 'posts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setSelectedTab('posts')}
        >
          {t('user.posts')}
        </button>
        <button
          className={cn(
            'px-4 py-2 font-medium transition-colors',
            selectedTab === 'about'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setSelectedTab('about')}
        >
          {t('user.about')}
        </button>
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
            <div className="p-8 text-center border border-border/30 rounded-lg bg-card/20">
              <p className="text-muted-foreground">{t('user.noPosts')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">{t('user.about')}</h2>

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-lg font-medium mb-2">{t('user.aboutMe')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* Looking for */}
          {lookingFor && (
            <div>
              <h3 className="text-lg font-medium mb-2">{t('user.lookingFor')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{lookingFor}</p>
            </div>
          )}

          {/* Expectations */}
          {expectations && (
            <div>
              <h3 className="text-lg font-medium mb-2">{t('user.expectations')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{expectations}</p>
            </div>
          )}

          {/* If no additional info is available */}
          {!description && !lookingFor && !expectations && (
            <div className="p-8 text-center border border-border/30 rounded-lg bg-card/20">
              <p className="text-muted-foreground">{t('user.noAdditionalInfo')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
