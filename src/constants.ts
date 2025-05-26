// File size limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const MAX_FILE_SIZE_READABLE = '10MB'; // Human-readable version of the limit

// Notification banner settings
export const BANNER_REDISPLAY_INTERVAL = import.meta.env.DEV 
  ? 10 * 1000 // 10초 (개발 모드)
  : 24 * 60 * 60 * 1000; // 24시간 (프로덕션 모드)
