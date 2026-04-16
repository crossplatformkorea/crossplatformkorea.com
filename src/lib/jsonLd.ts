/**
 * Schema.org JSON-LD builders for post detail pages.
 *
 * All builders are pure — they take raw inputs and return plain JSON-serializable
 * objects. The caller is responsible for injecting the script tag with a unique
 * `data-schema` id so multiple blocks can coexist and be cleaned up on unmount.
 */

import { extractYouTubeVideoId } from '@/utils/youtube';

const SITE_ORIGIN = 'https://crossplatformkorea.com';
const SITE_NAME = 'Cross-Platform Korea';

export interface BlogPostingInput {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url?: string };
  category: string;
  tags?: string[];
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
}

export function buildBlogPosting(input: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: input.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    image: input.image ? [input.image] : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      '@type': 'Person',
      name: input.author.name,
      url: input.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/assets/favicon.png`,
      },
    },
    articleSection: input.category,
    keywords: input.tags?.join(', '),
    inLanguage: 'ko',
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: input.likeCount ?? 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: input.commentCount ?? 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: input.viewCount ?? 0,
      },
    ],
  };
}

export function buildBreadcrumbs(params: {
  categoryLabel: string;
  postTitle: string;
  postUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: SITE_ORIGIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '커뮤니티',
        item: `${SITE_ORIGIN}/posts`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: params.categoryLabel,
        item: `${SITE_ORIGIN}/posts`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: params.postTitle,
        item: params.postUrl,
      },
    ],
  };
}

/**
 * Parses `### Q. ...` headings followed by `A. ...` bodies from markdown content
 * and emits a FAQPage schema block. Returns null if fewer than 2 Q/A pairs are
 * found (Google recommends at least 2 to qualify as a real FAQ).
 */
export function buildFaqPage(content: string) {
  const pairs: { question: string; answer: string }[] = [];

  // Match H3 headings that look like a question: `### Q. …` or `### Q: …`
  // and capture the following text up to the next heading of any level, or
  // end of string. JS regex has no `\Z` — use `$(?![\s\S])` for end-of-input.
  const questionRegex = /^###\s+(?:Q[.\s:]*)([^\n]+)\n+([\s\S]*?)(?=^#{1,6}\s|$(?![\s\S]))/gm;

  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    const question = match[1].trim();
    let answer = match[2].trim();

    // Strip a leading `A. ` / `A: ` from the answer body.
    answer = answer.replace(/^A[.\s:]*\s*/, '').trim();

    // Flatten to plain text for the JSON-LD — schema allows HTML but keeping
    // it terse makes it easier for answer engines to extract a single snippet.
    answer = answer
      .replace(/\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (question && answer) {
      pairs.push({ question, answer });
    }
  }

  if (pairs.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: p.answer,
      },
    })),
  };
}

/**
 * Emits a VideoObject schema when the post content embeds a YouTube video.
 * Returns null if no YouTube URL is found.
 */
export function buildVideoObject(params: {
  content: string;
  postTitle: string;
  description: string;
  datePublished: string;
}) {
  const urlMatch = params.content.match(
    /https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11}[^\s)]*/,
  );
  if (!urlMatch) return null;

  const url = urlMatch[0];
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: params.postTitle,
    description: params.description,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    ],
    uploadDate: params.datePublished,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}
