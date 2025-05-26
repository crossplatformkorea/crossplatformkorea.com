import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,
  admins: defineTable({
    userId: v.id('users'),
  }).index('by_userId', ['userId']),
  posts: defineTable({
    category: v.string(), // Instead of categoryId reference, use category key as string
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    updatedAt: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    authorId: v.optional(v.id('users')), // Add author reference
    // 통계 필드 모음
    likeCount: v.optional(v.number()),
    likedBy: v.optional(v.array(v.id('users'))),
    viewCount: v.optional(v.number()),
    commentCount: v.optional(v.number()), // 댓글 수 필드 추가
  })
    .index('by_category', ['category'])
    .index('by_title', ['title']) // Create a proper index for sorting by title (or any other field) that can be used for getting recent posts
    .index('by_author', ['authorId']),
  userProfiles: defineTable({
    userId: v.id('users'),
    email: v.string(),
    displayName: v.string(),
    name: v.optional(v.string()), // 실명
    organization: v.optional(v.string()), // 소속
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()), // Direct URL instead of storage ID
    deletedAt: v.optional(v.string()),
    githubId: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())), // Array of URLs
    tags: v.optional(v.array(v.string())), // Skills, interests, or status tags
    lookingFor: v.optional(v.string()), // Who they want to connect with
    expectations: v.optional(v.string()), // What they're expecting from the community
    locale: v.optional(v.string()), // 사용자 언어 설정 (en, ko, ja)
  })
    .index('by_email', ['email'])
    .index('by_user', ['userId'])
    .index('by_display_name', ['displayName'])
    .index('by_githubId', ['githubId']),
  featureRequests: defineTable({
    title: v.string(),
    description: v.string(),
    votes: v.number(),
    status: v.string(), // "requested", "planned", "in-progress", "completed"
    userId: v.string(),
    userEmail: v.optional(v.string()), // Optional user identification
    voterIds: v.array(v.string()),
    deletedAt: v.optional(v.number()), // Add deletedAt field for soft deletion
  }).index('by_votes', ['votes']),
  files: defineTable({
    storageId: v.id('_storage'),
    fileName: v.string(),
    contentType: v.string(),
    userId: v.id('users'),
    postId: v.optional(v.id('posts')), // Optional reference to a post
    url: v.optional(v.string()), // Add URL field to store the direct access URL
  })
    .index('by_user', ['userId'])
    .index('by_storage_id', ['storageId']),
  // 댓글 테이블 추가
  comments: defineTable({
    postId: v.id('posts'),
    authorId: v.id('users'),
    content: v.string(),
    updatedAt: v.optional(v.string()),
    likeCount: v.optional(v.number()), // Ensure this field is defined
    likedBy: v.optional(v.array(v.id('users'))), // Ensure this field is defined
  })
    .index('by_post', ['postId'])
    .index('by_author', ['authorId']),
  // showcases 테이블 정의
  showcases: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // SHOWCASE_CATEGORIES의 key 값
    // URLs - at least one of these is required (enforced in mutation)
    appStoreUrl: v.optional(v.string()),
    playStoreUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    otherLinks: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.string(), // Changed to required (not optional)
    userId: v.id('users'), // 작성자 ID
    featured: v.optional(v.boolean()), // 추천 앱 여부
    viewCount: v.optional(v.number()), // 조회수 필드 추가
    likeCount: v.optional(v.number()), // 좋아요 수 필드 추가
    likedBy: v.optional(v.array(v.id('users'))), // 좋아요 누른 사용자 ID 배열 추가
  })
    .index("by_category", ["category"])
    .index("by_userId", ["userId"])
    .searchIndex("search", {
      searchField: "title",
      filterFields: ["category"]
    }),
  // 알림 테이블 추가
  notifications: defineTable({
    userId: v.id('users'), // 알림을 받을 사용자
    type: v.union(
      v.literal('COMMENT_ON_POST'), // 내 포스트에 댓글
      v.literal('LIKE_ON_SHOWCASE'), // 내 showcase에 좋아요
      v.literal('LIKE_ON_POST'), // 내 포스트에 좋아요 (선택사항)
    ),
    title: v.string(), // 알림 제목
    message: v.string(), // 알림 메시지
    // 관련 리소스 ID (optional - 알림 유형에 따라 다름)
    postId: v.optional(v.id('posts')), // 포스트 관련 알림일 때
    showcaseId: v.optional(v.id('showcases')), // showcase 관련 알림일 때
    commentId: v.optional(v.id('comments')), // 댓글 관련 알림일 때
    // 알림을 발생시킨 사용자 (내가 아닌 다른 사용자)
    triggeredById: v.id('users'),
    isRead: v.boolean(), // 읽음 여부
    readAt: v.optional(v.string()), // 읽은 시간
  })
    .index('by_userId', ['userId'])
    .index('by_userId_isRead', ['userId', 'isRead'])
    .index('by_type', ['type']),
  
  // 푸시 노티피케이션 구독 테이블
  pushSubscriptions: defineTable({
    userId: v.id('users'), // 구독한 사용자
    endpoint: v.string(), // 푸시 서비스 엔드포인트
    p256dh: v.string(), // 공개키
    auth: v.string(), // 인증키
    userAgent: v.optional(v.string()), // 브라우저 정보
    isActive: v.boolean(), // 활성 상태
    updatedAt: v.optional(v.string()), // 마지막 업데이트 시간
  })
    .index('by_userId', ['userId'])
    .index('by_userId_endpoint', ['userId', 'endpoint'])
    .index('by_endpoint', ['endpoint']),
});
