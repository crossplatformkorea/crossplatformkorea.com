import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCode } from './constants';

// Replace getUser with currentUser
export const currentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      // Fields from various OAuth providers
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      // GitHub specific fields
      image: v.optional(v.string()),
      // User profile from our database
      profile: v.optional(
        v.object({
          _id: v.id('userProfiles'),
          _creationTime: v.number(),
          userId: v.id('users'),
          email: v.string(),
          displayName: v.string(),
          name: v.optional(v.string()), // Add field for realName/name in profile
          organization: v.optional(v.string()), // Add organization field
          description: v.optional(v.string()),
          avatarUrlId: v.optional(v.id('_storage')),
          deletedAt: v.optional(v.string()),
          // New fields
          githubId: v.optional(v.string()),
          socialLinks: v.optional(v.array(v.string())),
          tags: v.optional(v.array(v.string())),
          lookingFor: v.optional(v.string()),
          expectations: v.optional(v.string()),
        }),
      ),
      // Convenience fields
      displayName: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      // Return null if not authenticated
      if (!userId) return null;

      const user = await ctx.db.get(userId as Id<'users'>);
      // Return null if user not found
      if (!user) return null;

      // Get the user profile
      const profile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user', (q) => q.eq('userId', userId as Id<'users'>))
        .first();

      // Note: If the profile doesn't exist, it will be created when the user visits the profile page
      // via the createOrUpdateUser mutation which is called from the client

      // Get avatar URL if available
      let avatarUrl: string | null = null;
      if (profile?.avatarUrlId) {
        try {
          avatarUrl = await ctx.storage.getUrl(profile.avatarUrlId);
        } catch (error) {
          console.error('Failed to fetch avatar URL:', error);
        }
      }

      // Return user with profile and convenient access fields
      return {
        ...user,
        profile: profile || undefined,
        displayName: profile?.displayName,
        avatarUrl: avatarUrl || undefined,
      };
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  },
});

// Create or update a user profile after authentication
export const createOrUpdateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    // Add displayName to the validator to match client input
    displayName: v.optional(v.string()),
    // 추가 필드
    realName: v.optional(v.string()), // 실명
    organization: v.optional(v.string()), // 소속
    // New fields
    githubId: v.optional(v.string()),
    description: v.optional(v.string()),
    lookingFor: v.optional(v.string()),
    expectations: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    socialLinks: v.optional(v.array(v.string())),
  },
  returns: v.union(
    v.object({
      profileId: v.id('userProfiles'),
      success: v.boolean(),
      errorCode: v.optional(v.string()),
    }),
    v.null(),
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
    if (!userDisplayName) {
      try {
        // Generate a unique nickname without passing ctx
        let nickname = '';
        let isUnique = false;

        while (!isUnique) {
          nickname = 'User_' + uuidv4().split('-')[0];

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
        userDisplayName = 'User_' + Math.floor(Math.random() * 10000);
      }
    } else {
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
        // Only check uniqueness if display name is changing
        if (args.displayName !== existingProfile.displayName) {
          // Check if the display name is already taken by another user
          const existingWithName = await ctx.db
            .query('userProfiles')
            .filter((q) =>
              q.and(
                q.eq(q.field('displayName'), args.displayName),
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

        console.log('Updating displayName to:', args.displayName);
        updateFields.displayName = args.displayName;
      } else if (args.name && args.name.trim() !== '') {
        console.log('Updating displayName from name:', args.name);
        updateFields.displayName = args.name;
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

// Get user profile by user ID
export const getProfile = query({
  args: { userId: v.id('users') },
  returns: v.union(
    v.object({
      _id: v.id('userProfiles'),
      _creationTime: v.number(),
      userId: v.id('users'),
      email: v.string(),
      displayName: v.string(),
      description: v.optional(v.string()),
      avatarUrlId: v.optional(v.id('_storage')),
      deletedAt: v.optional(v.string()),
      // New fields
      githubId: v.optional(v.string()),
      socialLinks: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      lookingFor: v.optional(v.string()),
      expectations: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    return profile;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    description: v.optional(v.string()),
    avatarUrlId: v.optional(v.id('_storage')),
    // New fields
    githubId: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    lookingFor: v.optional(v.string()),
    expectations: v.optional(v.string()),
  },
  returns: v.id('userProfiles'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Authentication required');
    }

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', userId as Id<'users'>))
      .first();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Build update object with only provided fields
    const updateFields: Partial<Doc<'userProfiles'>> = {};

    // Basic fields
    if (args.displayName !== undefined) updateFields.displayName = args.displayName;
    if (args.description !== undefined) updateFields.description = args.description;
    if (args.avatarUrlId !== undefined) updateFields.avatarUrlId = args.avatarUrlId;

    // New fields
    if (args.githubId !== undefined) updateFields.githubId = args.githubId;
    if (args.lookingFor !== undefined) updateFields.lookingFor = args.lookingFor;
    if (args.expectations !== undefined) updateFields.expectations = args.expectations;
    if (args.tags !== undefined) updateFields.tags = args.tags;
    if (args.socialLinks !== undefined) updateFields.socialLinks = args.socialLinks;

    await ctx.db.patch(profile._id, updateFields);

    return profile._id;
  },
});
