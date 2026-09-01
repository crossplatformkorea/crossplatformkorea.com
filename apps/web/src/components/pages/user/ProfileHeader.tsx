import React from 'react';
import { ExternalLink } from 'lucide-react';
import { t } from 'i18next';
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

interface ProfileHeaderProps {
  displayName: string;
  avatarUrl: string;
  organization: string;
  tags: string[];
  socialLinks: string[];
}

export default function ProfileHeader({
  displayName,
  avatarUrl,
  organization,
  tags,
  socialLinks,
}: ProfileHeaderProps) {
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
    <div className="surface-card relative mb-6 flex flex-col overflow-hidden p-6 sm:p-8">
      <span className="pointer-events-none absolute -bottom-14 right-2 font-mono text-[10rem] font-black italic leading-none text-primary/10">
        /
      </span>
      {/* Top row: Avatar and Display Name */}
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-muted ring-4 ring-primary/10">
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
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            MEMBER / PROFILE
          </span>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">
            {displayName || t('user.anonymousUser')}
          </h1>
        </div>
      </div>

      {/* Bottom row: Additional information (if available) */}
      {(organization || tags.length > 0 || socialLinks.length > 0) && (
        <div className="relative z-10 border-t border-border/70 pt-4">
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
                  className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-primary"
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
                      className="rounded-lg border border-border/70 bg-muted/50 p-2 transition-colors hover:border-primary/40 hover:text-primary"
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
  );
}
