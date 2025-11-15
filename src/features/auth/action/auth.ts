import { createServerFn } from '@tanstack/react-start'
import { forgotPasswordService, loginUserService, resetPasswordService } from '../service/authService'
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from '../schema/auth.schema'
import type { SessionUser } from '../types/session'
import { useAppSession } from '@/lib/session';
import { SESSION_EXPIRY_SEC } from '@/lib/config/envConfig';
import { generateCsrfToken } from '@/lib/generateCsrf';
import { csrfMiddleware } from '@/middleware/csrfMiddleware';
import { authMiddleware } from '@/middleware/authMiddleware';
import { authRateLimitMiddleware, rateLimitMiddleware } from '@/middleware/rateLimitMiddleware';


export const loginAction = createServerFn({ method: 'POST' })
  .middleware([authRateLimitMiddleware])
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    try {
      const response = await loginUserService({
        username: data.username,
        password: data.password,
        user_type: data.user_type,
      })

      if (!response.login.accessToken) {
        throw new Error('An error occurred')
      }

      const session = await useAppSession()
      await session.clear()

      const now = Date.now()
      const csrf = generateCsrfToken()
      const user: SessionUser = {
        member_no: null,
        username: data.username,
        role: data.user_type,
      }

      await session.update({
        is_authed: true,
        otp_token: response.login.accessToken,
        user: user,
        lastTouch: now,
        createdAt: now,
        expiresAt: now + SESSION_EXPIRY_SEC * 1000,
        csrfToken: csrf,
      })

      return {
        success: true,
        message: 'Login successful',
        otp_generated: true,
        member_status: 'active',
      }
    } catch (err: any) {
      throw {
        message: err?.message ?? 'Login failed',
        fieldErrors: err?.fieldErrors ?? null,
      }
    }
  })


export const logoutAction = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, csrfMiddleware, rateLimitMiddleware])
  .handler(async ({ context }) => {
    try {
      const user = context
      const auth_token = user.authToken

      if (!auth_token) {
        throw new Response('Missing auth token', { status: 401 })
      }

      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (err: any) {
      const session = await useAppSession()
      await session.clear()

      throw {
        message: err?.message ?? 'Logged out successfully',
      }
    }
  })

// export const logoutAction = createServerFn({ method: 'POST' })
//   .middleware([authMiddleware, csrfMiddleware])
//   .handler(async ({ context }) => {
//     try {
//       const user = context
//       const auth_token = user.authToken

//       if (!auth_token) {
//         throw new Response('Unauthorized', { status: 401 })
//       }

//       const res = await logoutUserService(auth_token)
//       const session = await useAppSession()
//       await session.clear()

//       return {
//         success: true,
//         message: 'Logged out successfully',
//       }
//     } catch (err: any) {
//       const session = await useAppSession()
//       await session.clear()

//       throw {
//         message: err?.message ?? 'Logged out successfully',
//       }
//     }
//   })

export const forgotPasswordAction = createServerFn({ method: 'POST' })
  .middleware([authRateLimitMiddleware])
  .inputValidator(forgotPasswordSchema)
  .handler(async ({ data }) => {
    try {
      const res = await forgotPasswordService(data)

      const session = await useAppSession()
      await session.update({
        is_authed: false,
        otp_token: 'temp_token', // Temporary token for OTP flow
        user: {
          member_no: null,
          username: data.username,
          role: data.user_type,
        },
      })

      return {
        success: true,
        message: res.message,
        otp_generated: true,
      }
    } catch (err: any) {
      throw {
        message: err?.message ?? 'Forgot password request failed',
        fieldErrors: err?.fieldErrors ?? null,
      }
    }
  })

export const resetPasswordAction = createServerFn({ method: 'POST' })
  .middleware([authRateLimitMiddleware, authMiddleware, csrfMiddleware])
  .inputValidator(resetPasswordSchema)
  .handler(async ({ context, data }) => {
    try {
      const user = context
      const auth_token = user.authToken

      if (!auth_token) {
        throw new Response('Unauthorized', { status: 401 })
      }

      const res = await resetPasswordService(data.password, auth_token)

      const session = await useAppSession()
      await session.clear()

      return {
        success: true,
        message: res.message,
      }
    } catch (err: any) {
      throw {
        message: err?.message ?? 'Reset password failed',
        fieldErrors: err?.fieldErrors ?? null,
      }
    }
  })

// export const updatePassword = createServerFn({ method: 'POST' })
//     .middleware([authRateLimitMiddleware, csrfMiddleware])
//     .inputValidator(updatePasswordSchema)
//     .handler(async ({ context, data }) => {
//         try {
//       const user = context
//       const login_token = user?.authToken

//       if (!login_token) {
//         throw new Response('Unauthorized', { status: 401 })
//       }

//       const res = await updatePasswordService(login_token, {
//         currentPassword: data.currentPassword,
//         newPassword: data.newPassword,
//       })

//       const session = await useAppSession()
//       await session.clear()

//       return {
//         success: true,
//         message: res.message,
//       }
//     } catch (err: any) {
//       throw {
//         message: err?.message ?? 'Reset password failed',
//         fieldErrors: err?.fieldErrors ?? null,
//       }
//     }
//   })
