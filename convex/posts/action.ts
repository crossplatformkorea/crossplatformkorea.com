'use node';

import { internalAction } from '../_generated/server';
import { v } from 'convex/values';

// Slack webhook URL from environment variable
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Send notification to Slack when a new post is created
export const sendSlackNotification = internalAction({
  args: {
    postId: v.id('posts'),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorName: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    if (!SLACK_WEBHOOK_URL) {
      console.log('SLACK_WEBHOOK_URL is not configured, skipping notification');
      return { success: false, error: 'SLACK_WEBHOOK_URL not configured' };
    }

    try {
      // Strip HTML tags and truncate content
      const plainContent = args.content.replace(/<[^>]*>/g, '').trim();
      const truncatedContent =
        plainContent.length > 200 ? plainContent.substring(0, 200) + '...' : plainContent;

      // Build the Slack message
      const slackMessage = {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📝 새 게시물이 등록되었습니다!',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*제목:*\n${args.title}`,
              },
              {
                type: 'mrkdwn',
                text: `*카테고리:*\n${args.category}`,
              },
            ],
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*작성자:*\n${args.authorName}`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*내용:*\n${truncatedContent}`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '게시물 보기',
                  emoji: true,
                },
                url: `https://crossplatformkorea.com/post/${args.postId}`,
                style: 'primary',
              },
            ],
          },
        ],
      };

      const response = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Slack webhook error:', errorText);
        return { success: false, error: errorText };
      }

      console.log('Slack notification sent successfully for post:', args.postId);
      return { success: true };
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
