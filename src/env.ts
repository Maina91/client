import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development')
      .describe('Node environment'),
    API_URL: z
      .string()
      .url()
      .describe('API endpoint URL (required)'),
    // Session configuration
    SESSION_SECRET: z
      .string()
      .min(32)
      .describe('Secret key for session encryption (min 32 chars, required)'),
    SESSION_EXPIRY: z
      .coerce
      .number()
      .positive()
      .max(86400) // Max 24 hours
      .default(600)
      .describe('Session expiry time in seconds'),
    SESSION_COOKIE_DOMAIN: z
      .string()
      .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/, 'Must be a valid domain')
      .optional()
      .describe('Domain for cookies (e.g., example.com)'),
    // Rate limiting configuration
    RATE_LIMIT_ENABLED: z
      .coerce
      .boolean()
      .default(true)
      .describe('Enable rate limiting'),
    RATE_LIMIT_MAX_REQUESTS_PER_MINUTE: z
      .coerce
      .number()
      .positive()
      .default(100)
      .describe('Max requests per minute per user/IP'),
    RATE_LIMIT_WINDOW_MS: z
      .coerce
      .number()
      .positive()
      .default(60000)
      .describe('Rate limit window in milliseconds'),
    RATE_LIMIT_AUTH_MAX_REQUESTS: z
      .coerce
      .number()
      .positive()
      .default(5)
      .describe('Max auth requests per window per IP'),
    RATE_LIMIT_AUTH_WINDOW_MS: z
      .coerce
      .number()
      .positive()
      .default(300000)
      .describe('Auth rate limit window in milliseconds (5 minutes)'),
    RATE_LIMIT_GLOBAL_MAX_REQUESTS: z
      .coerce
      .number()
      .positive()
      .default(1000)
      .describe('Global max requests per window'),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },
  // runtimeEnv: import.meta.env,
  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  emptyStringAsUndefined: true,
  onValidationError: (error) => {
    console.error('Environment validation error:', error)
    throw new Error('Missing required environment variables')
  },
})
