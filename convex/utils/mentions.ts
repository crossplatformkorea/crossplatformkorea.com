import { QueryCtx } from '../_generated/server';
import { Id } from '../_generated/dataModel';

// @displayName 패턴을 찾는 정규식
const MENTION_REGEX = /@(\w+)/g;

// 텍스트에서 멘션 추출
export function extractMentions(text: string): string[] {
  const mentions: string[] = [];
  let match;
  
  while ((match = MENTION_REGEX.exec(text)) !== null) {
    const displayName = match[1];
    if (displayName && !mentions.includes(displayName)) {
      mentions.push(displayName);
    }
  }
  
  return mentions;
}

// 멘션된 displayName들을 userId로 변환
export async function resolveMentions(
  ctx: QueryCtx,
  mentionedDisplayNames: string[]
): Promise<Id<'users'>[]> {
  const userIds: Id<'users'>[] = [];
  
  for (const displayName of mentionedDisplayNames) {
    const userProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_display_name', (q) => q.eq('displayName', displayName))
      .first();
    
    if (userProfile) {
      userIds.push(userProfile.userId);
    }
  }
  
  return userIds;
}
