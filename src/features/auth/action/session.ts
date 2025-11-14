import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from '@/lib/session'
import { SESSION_EXPIRY_SEC } from '@/lib/config/envConfig'

export const getUSerSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const session = await useAppSession()
      const data = await session.data

      if (!data.is_authed) return { authenticated: false, user: null }
      const now = Date.now()

      if (data.expiresAt && data.expiresAt < now) {
        await session.clear()
        return { authenticated: false, user: null }
      }

      const ABSOLUTE_MAX = 14 * 24 * 60 * 60 * 1000
      if (data.createdAt && now - data.createdAt > ABSOLUTE_MAX) {
        await session.clear()
        return { authenticated: false, user: null }
      }

      const SLIDING_WINDOW = 30 * 60 * 1000
      if (now - (data.lastTouch ?? 0) > SLIDING_WINDOW) {
        await session.update({
          lastTouch: now,
          expiresAt: now + SESSION_EXPIRY_SEC * 1000,
        })
      }

      return { authenticated: true, user: data.user ?? null }
    } catch (err) {
      console.error('Failed to fetch session', err)
      return { authenticated: false, user: null }
    }
  },
)

export const clearUserSession = createServerFn({ method: 'POST' }).handler(
  async () => {
    try {
      const session = await useAppSession()
      await session.clear()

      return {
        success: true,
        message: 'Session cleared successfully',
      }
    } catch (err: any) {
      console.error('Failed to clear session', err)
      return {
        success: false,
        message: err?.message || 'Failed to clear session',
      }
    }
  },
)
