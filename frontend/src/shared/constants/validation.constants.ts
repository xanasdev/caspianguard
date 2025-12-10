export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Invalid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: 'Password must be at least 6 characters',
  },
  NAME: {
    MIN_LENGTH: 2,
    MESSAGE: 'Name must be at least 2 characters',
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MESSAGE: 'Description must be at least 10 characters',
  },
} as const

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  MAX_FILES: 5,
} as const
