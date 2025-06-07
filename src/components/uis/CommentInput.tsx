import React, { useCallback, useMemo } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { cn } from '../../lib/utils';

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentionedUsers: Id<'users'>[]) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
}

const CommentInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Write a comment...',
  disabled = false,
  className,
  rows = 3,
  maxLength = 3000,
}) => {
  // Fetch all users for mentions (limit 4명 기본)
  const users = useQuery(api.users.query.getAllUsersForMention, { limit: 4 });

  const handleChange = useCallback(
    (event: any, newValue: string, newPlainTextValue: string, mentions: any[]) => {
      // Apply character limit with automatic truncation
      let processedValue = newValue;
      if (maxLength && newPlainTextValue.length > maxLength) {
        // Find the last complete word to avoid cutting mentions in the middle
        const truncatedPlainText = newPlainTextValue.substring(0, maxLength);
        const lastSpaceIndex = truncatedPlainText.lastIndexOf(' ');
        const truncateLength = lastSpaceIndex > maxLength * 0.8 ? lastSpaceIndex : maxLength;

        // Count characters in the value with markup and truncate accordingly
        let plainCharCount = 0;
        let truncatedValue = '';

        for (let i = 0; i < newValue.length && plainCharCount < truncateLength; i++) {
          const char = newValue[i];
          truncatedValue += char;

          // Skip counting characters inside mention markup
          if (char === '@' && newValue.substring(i).match(/^@\[.*?\]\(.*?\)/)) {
            const markupMatch = newValue.substring(i).match(/^@\[([^\]]+)\]\([^)]+\)/);
            if (markupMatch) {
              const displayLength = markupMatch[1].length + 1; // +1 for the @
              if (plainCharCount + displayLength <= truncateLength) {
                truncatedValue += newValue.substring(i + 1, i + markupMatch[0].length);
                i += markupMatch[0].length - 1;
                plainCharCount += displayLength;
              } else {
                truncatedValue = truncatedValue.substring(0, truncatedValue.length - 1);
                break;
              }
            } else {
              plainCharCount++;
            }
          } else {
            plainCharCount++;
          }
        }

        processedValue = truncatedValue;
      }

      // Extract mentioned user IDs
      const mentionedUserIds: Id<'users'>[] = mentions.map((mention) => mention.id as Id<'users'>);
      onChange(processedValue, mentionedUserIds);
    },
    [onChange, maxLength],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onSubmit?.();
      }
    },
    [onSubmit],
  ); // Transform users data for react-mentions
  // Mentions 검색어에 맞는 유저 최대 4명만 보여주기
  const userData = useMemo(() => {
    if (!users) return [];
    return (search: string) => {
      if (!search) {
        // 검색어 없으면 상위 4명만
        return users.slice(0, 4).map((user) => ({
          id: user._id,
          display: user.displayName || 'Anonymous',
        }));
      }
      // 검색어가 있으면 displayName에 포함되는 유저 최대 4명만
      const lower = search.toLowerCase();
      return users
        .filter((user) => (user.displayName || '').toLowerCase().includes(lower))
        .slice(0, 4)
        .map((user) => ({
          id: user._id,
          display: user.displayName || 'Anonymous',
        }));
    };
  }, [users]);

  // Minimal inline styles - let CSS handle most styling
  const mentionInputStyles = {
    control: {
      fontSize: 14,
      fontWeight: 'normal',
    },
    '&multiLine': {
      control: {
        fontFamily: 'inherit',
        minHeight: rows * 24,
        maxHeight: rows * 24 * 3, // Allow up to 3x the initial height
        overflowY: 'auto' as const, // Enable scrolling
      },
      highlighter: {
        display: 'none',
      },
      input: {
        outline: 'none',
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        fontFamily: 'inherit',
        resize: 'none' as const,
        maxHeight: 'inherit',
        overflowY: 'auto' as const, // Enable scrolling for input
      },
    },
  };

  // GitHub-style mention styling - blue color like GitHub
  const mentionStyles = {
    color: '#0969da', // GitHub blue (will be overridden by CSS for dark mode)
    backgroundColor: 'transparent',
    fontWeight: '500',
    textDecoration: 'none',
  };

  return (
    <div className={cn('mentions', className)}>
      <MentionsInput
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={mentionInputStyles}
        singleLine={false}
        allowSuggestionsAboveCursor={false}
        allowSpaceInQuery={false}
      >
        <Mention
          trigger="@"
          data={userData}
          markup="@[__display__](__id__)"
          displayTransform={(id, display) => `@${display}`}
          style={mentionStyles}
          // react-mentions가 data를 함수로 받으면 (search, callback) 형태로 호출함
          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-sm transition-colors duration-150',
                'border-l-2 border-transparent',
                // Base styles for light mode
                'bg-white text-gray-900 hover:bg-gray-50',
                // Dark mode styles
                'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
                // Focused state styles
                focused && [
                  'bg-blue-50 border-l-blue-500 text-blue-900',
                  'dark:bg-blue-950/50 dark:text-blue-100 dark:border-l-blue-400',
                ],
              )}
            >
              {/* GitHub-style avatar */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                  'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                  focused && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                )}
              >
                {(suggestion.display || 'A').charAt(0).toUpperCase()}
              </div>

              {/* User name with search highlight */}
              <span className="flex-1 font-medium">{highlightedDisplay}</span>
            </div>
          )}
        />
      </MentionsInput>
    </div>
  );
};

export default CommentInput;
