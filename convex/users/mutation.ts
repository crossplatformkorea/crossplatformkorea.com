import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { Doc, Id } from '../_generated/dataModel';
import { ErrorCode } from '../constants';
import { validateUsername, normalizeUsername } from '../validators';

// Create or update a user profile after authentication
export const createOrUpdateUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    realName: v.optional(v.string()),
    displayName: v.optional(v.string()),
    organization: v.optional(v.string()),
    description: v.optional(v.string()),
    lookingFor: v.optional(v.string()),
    expectations: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    socialLinks: v.optional(v.array(v.string())),
    locale: v.optional(v.string()), // locale 필드 추가
    githubId: v.optional(v.string()), // githubId 필드 추가
  },
  returns: v.union(
    v.object({
      profileId: v.id('userProfiles'),
      success: v.boolean(),
    }),
    v.object({
      profileId: v.id('userProfiles'),
      success: v.boolean(),
      errorCode: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    // Get authenticated user ID using getAuthUserId
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Get GitHub username from auth identity if available
    let githubId = args.githubId;
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (identity?.tokenIdentifier.startsWith('github|')) {
        // GitHub OAuth provides the username in the identity information
        if (identity.nickname) {
          // Use the nickname which is the GitHub username
          githubId = identity.nickname;
        } else if (identity.tokenIdentifier) {
          // Fallback: Extract GitHub user ID from tokenIdentifier (format: 'github|12345')
          const extractedId = identity.tokenIdentifier.split('|')[1];
          if (extractedId) {
            githubId = extractedId;
          }
        }
      }
    } catch (error) {
      console.error('Failed to get GitHub username from auth:', error);
    }

    // Prioritize displayName from args, fallback to name, or generate
    let userDisplayName = args.displayName || args.name;

    // Normalize displayName (replace spaces and special characters with hyphens)
    if (userDisplayName) {
      userDisplayName = normalizeUsername(userDisplayName);
    }

    if (!userDisplayName) {
      try {
        // Generate a unique GitHub-style nickname
        let nickname = '';
        let isUnique = false;

        while (!isUnique) {
          nickname = 'User' + Math.floor(Math.random() * 100000);

          const existingWithName = await ctx.db
            .query('userProfiles')
            .filter((q: any) => q.eq(q.field('displayName'), nickname))
            .first();

          if (!existingWithName) {
            isUnique = true;
          }
        }

        userDisplayName = nickname;
      } catch (error) {
        console.error('Failed to generate unique nickname:', error);
        // Fallback to a basic name if generation fails
        userDisplayName = 'User' + Math.floor(Math.random() * 10000);
      }
    } else {
      // Validate username format first
      const validation = validateUsername(userDisplayName);
      if (!validation.isValid) {
        return {
          profileId: '' as Id<'userProfiles'>, // Empty ID as placeholder
          success: false,
          errorCode: validation.error || 'errors.username.invalidCharacters',
        };
      }

      // Check if the display name is already taken by another user
      const existingWithName = await ctx.db
        .query('userProfiles')
        .filter((q) =>
          q.and(
            q.eq(q.field('displayName'), userDisplayName as string),
            q.neq(q.field('userId'), userId as Id<'users'>),
          ),
        )
        .first();

      if (existingWithName) {
        return {
          profileId: '' as Id<'userProfiles'>, // Empty ID as placeholder
          success: false,
          errorCode: ErrorCode.DISPLAY_NAME_TAKEN,
        };
      }
    }

    // Check if user profile already exists
    const existingProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId as Id<'users'>))
      .first();

    if (existingProfile) {
      // Update existing profile with provided fields
      const updateFields: Partial<Doc<'userProfiles'>> = {};

      // Basic fields - now check for displayName uniqueness
      if (args.displayName && args.displayName.trim() !== '') {
        // Normalize displayName (replace spaces and special characters with hyphens)
        const normalizedDisplayName = normalizeUsername(args.displayName);

        // Validate username format first
        const validation = validateUsername(normalizedDisplayName);
        if (!validation.isValid) {
          return {
            profileId: existingProfile._id,
            success: false,
            errorCode: validation.error || 'errors.username.invalidCharacters',
          };
        }

        // Only check uniqueness if display name is changing
        if (normalizedDisplayName !== existingProfile.displayName) {
          // Check if the display name is already taken by another user
          const existingWithName = await ctx.db
            .query('userProfiles')
            .filter((q) =>
              q.and(
                q.eq(q.field('displayName'), normalizedDisplayName),
                q.neq(q.field('userId'), userId as Id<'users'>),
              ),
            )
            .first();

          if (existingWithName) {
            return {
              profileId: existingProfile._id,
              success: false,
              errorCode: ErrorCode.DISPLAY_NAME_TAKEN,
            };
          }
        }

        console.log('Updating displayName to:', normalizedDisplayName);
        updateFields.displayName = normalizedDisplayName;
      } else if (args.name && args.name.trim() !== '') {
        // Normalize name if using it as displayName
        const normalizedName = normalizeUsername(args.name);

        // Validate name as username if using it as displayName
        const validation = validateUsername(normalizedName);
        if (!validation.isValid) {
          return {
            profileId: existingProfile._id,
            success: false,
            errorCode: validation.error || 'errors.username.invalidCharacters',
          };
        }

        console.log('Updating displayName from name:', normalizedName);
        updateFields.displayName = normalizedName;
      }
      if (args.description !== undefined) updateFields.description = args.description;

      // 추가 필드
      if (args.realName !== undefined) updateFields.name = args.realName;
      if (args.organization !== undefined) updateFields.organization = args.organization;

      // New fields - use GitHub ID from auth if available
      if (githubId !== undefined) updateFields.githubId = githubId;
      if (args.lookingFor !== undefined) updateFields.lookingFor = args.lookingFor;
      if (args.expectations !== undefined) updateFields.expectations = args.expectations;
      if (args.tags !== undefined) updateFields.tags = args.tags;
      if (args.socialLinks !== undefined) updateFields.socialLinks = args.socialLinks;

      // Only update if there are fields to update
      if (Object.keys(updateFields).length > 0) {
        await ctx.db.patch(existingProfile._id, updateFields);
      }

      return {
        profileId: existingProfile._id,
        success: true,
      };
    }

    // Create a new user profile with all fields
    console.log('Creating new profile with displayName:', userDisplayName);

    const profileId = await ctx.db.insert('userProfiles', {
      userId: userId as Id<'users'>,
      email: args.email,
      displayName: userDisplayName,
      name: args.realName, // 실명
      organization: args.organization, // 소속
      description: args.description || '',
      githubId, // Use GitHub ID from auth if available
      lookingFor: args.lookingFor,
      expectations: args.expectations,
      tags: args.tags,
      socialLinks: args.socialLinks,
    });

    return {
      profileId,
      success: true,
    };
  },
});

// locale만 업데이트하는 가벼운 mutation
export const updateUserLocale = mutation({
  args: {
    locale: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // 사용자 프로필 조회
    const userProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // locale만 업데이트
    await ctx.db.patch(userProfile._id, {
      locale: args.locale,
    });

    return null;
  },
});

export const updateProfile = mutation({
  args: {
    displayName: v.string(),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    githubId: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    lookingFor: v.optional(v.string()),
    expectations: v.optional(v.string()),
    locale: v.optional(v.string()), // locale 필드 추가
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    // Normalize and validate username format
    const normalizedDisplayName = normalizeUsername(args.displayName);
    const validation = validateUsername(normalizedDisplayName);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid username format');
    }

    // Replace the displayName with normalized version
    args.displayName = normalizedDisplayName;

    // 사용자 프로필 조회
    const userProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Check if displayName is changing and if the new name is available
    if (args.displayName !== userProfile.displayName) {
      const existingWithName = await ctx.db
        .query('userProfiles')
        .filter((q) =>
          q.and(q.eq(q.field('displayName'), args.displayName), q.neq(q.field('userId'), userId)),
        )
        .first();

      if (existingWithName) {
        throw new Error('This display name is already taken');
      }
    }

    // 프로필 업데이트
    await ctx.db.patch(userProfile._id, {
      displayName: args.displayName,
      description: args.description,
      avatarUrl: args.avatarUrl,
      githubId: args.githubId,
      socialLinks: args.socialLinks,
      tags: args.tags,
      lookingFor: args.lookingFor,
      expectations: args.expectations,
      locale: args.locale, // locale 필드 포함
    });

    return null;
  },
});

/**
 * 사용자 프로필이 없으면 자동으로 생성하는 함수
 * 사용자가 로그인한 후 프로필이 없을 때 자동 호출됨
 */
export const ensureUserProfile = mutation({
  args: {},
  returns: v.union(
    v.object({
      profileId: v.id('userProfiles'),
      success: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    // 인증된 사용자 ID 가져오기
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null; // 인증되지 않은 경우 아무것도 하지 않음
    }

    // 사용자 정보 가져오기
    const user = await ctx.db.get(userId as Id<'users'>);
    if (!user) {
      return null; // 사용자가 없으면 아무것도 하지 않음
    }

    // 기존 프로필 확인
    const existingProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId as Id<'users'>))
      .first();

    if (existingProfile) {
      return {
        profileId: existingProfile._id,
        success: true,
      };
    }

    // 기본 사용자 정보 추출
    const email = user.email || `user_${Math.random().toString(36).substring(2, 9)}@example.com`;

    // OAuth 정보에서 추가 데이터 가져오기
    const authInfo = await ctx.auth.getUserIdentity();
    const tokenIdentifier = authInfo?.tokenIdentifier;
    const githubId = tokenIdentifier?.split('|')[1] || undefined;

    // GitHub OAuth에서 제공하는 정보 활용
    const nickname = user.name || githubId || null;

    // 고유한 displayName 생성
    const displayName = nickname || `User_${Math.random().toString(36).substring(2, 7)}`;

    // 프로필 생성
    const profileId = await ctx.db.insert('userProfiles', {
      userId: userId as Id<'users'>,
      email: email,
      displayName: displayName,
      // 추가 필드
      avatarUrl: user.image,
      githubId,
    });

    return {
      profileId,
      success: true,
    };
  },
});
