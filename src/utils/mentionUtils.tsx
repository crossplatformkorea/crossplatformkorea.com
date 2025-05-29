import React from 'react';
import { Id } from '../../convex/_generated/dataModel';

export interface ParsedMention {
  type: 'text' | 'mention';
  content: string;
  userId?: Id<'users'>;
  displayName?: string;
}

/**
 * Parse mention text and return array of text/mention segments
 * Converts "@[DisplayName](userId)" format to separate text and mention components
 */
export function parseMentions(text: string): ParsedMention[] {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const segments: ParsedMention[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index);
      if (textContent) {
        segments.push({
          type: 'text',
          content: textContent,
        });
      }
    }

    // Add mention
    segments.push({
      type: 'mention',
      content: `@${match[1]}`,
      displayName: match[1],
      userId: match[2] as Id<'users'>,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      segments.push({
        type: 'text',
        content: remainingText,
      });
    }
  }

  return segments;
}

/**
 * Render parsed mentions as React components
 */
export function renderMentions(
  text: string,
  options?: {
    className?: string;
    onMentionClick?: (userId: Id<'users'>, displayName: string) => void;
  }
): React.ReactNode {
  const segments = parseMentions(text);

  return segments.map((segment, index) => {
    if (segment.type === 'mention') {
      const handleClick = () => {
        if (options?.onMentionClick && segment.userId) {
          options.onMentionClick(segment.userId, segment.displayName || '');
        }
      };

      return (
        <span
          key={index}
          onClick={handleClick}
          className={`inline-block bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-1 py-0.5 rounded text-sm font-medium cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors ${options?.className || ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {segment.content}
        </span>
      );
    }

    return (
      <span key={index} className={options?.className}>
        {segment.content}
      </span>
    );
  });
}

// Enhanced function to render both mentions and links
export const renderMentionsAndLinks = (
  content: string,
  options: {
    onMentionClick?: (userId: Id<'users'>, displayName: string) => void;
  } = {},
) => {
  if (!content) return content;

  // URL regex pattern to match various URL formats
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  
  // Mention regex pattern
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;

  let lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let elementKey = 0;

  // Find all matches for both mentions and URLs
  const allMatches: Array<{
    type: 'mention' | 'url';
    match: RegExpMatchArray;
    index: number;
  }> = [];

  // Find mention matches
  let mentionMatch;
  while ((mentionMatch = mentionRegex.exec(content)) !== null) {
    if (mentionMatch.index !== undefined) {
      allMatches.push({
        type: 'mention',
        match: mentionMatch,
        index: mentionMatch.index,
      });
    }
  }

  // Find URL matches
  let urlMatch;
  while ((urlMatch = urlRegex.exec(content)) !== null) {
    if (urlMatch.index !== undefined) {
      allMatches.push({
        type: 'url',
        match: urlMatch,
        index: urlMatch.index,
      });
    }
  }

  // Sort matches by their position in the string
  allMatches.sort((a, b) => a.index - b.index);

  // Process each match
  allMatches.forEach(({ type, match, index }) => {
    const matchEnd = index + match[0].length;

    // Add text before this match
    if (index > lastIndex) {
      const textBefore = content.slice(lastIndex, index);
      if (textBefore) {
        elements.push(textBefore);
      }
    }

    // Add the processed match
    if (type === 'mention') {
      const displayName = match[1];
      const userId = match[2] as Id<'users'>;
      
      elements.push(
        <button
          key={`mention-${elementKey++}`}
          onClick={() => options.onMentionClick?.(userId, displayName)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium cursor-pointer bg-transparent border-none p-0 underline"
        >
          @{displayName}
        </button>,
      );
    } else if (type === 'url') {
      const url = match[0];
      
      elements.push(
        <a
          key={`url-${elementKey++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>,
      );
    }

    lastIndex = matchEnd;
  });

  // Add remaining text after the last match
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText) {
      elements.push(remainingText);
    }
  }

  return elements.length > 0 ? elements : content;
};
