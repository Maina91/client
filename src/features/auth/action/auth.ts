import { createServerFn } from '@tanstack/react-start'
import { loginUserService, logoutUserService, resetPasswordService, updatePasswordService } from '../service/authService'
import { loginSchema, resetPasswordSchema, updatePasswordSchema } from '../schema/auth.schema'
import type { SessionUser } from '@/features/auth/types/auth';
import { useAppSession } from '@/lib/session';
import { SESSION_EXPIRY_SEC } from '@/lib/config/envConfig';
import { generateCsrfToken } from '@/lib/generateCsrf';
import { csrfMiddleware } from '@/middleware/csrfMiddleware';
import { authMiddleware } from '@/middleware/authMiddleware';
import { authRateLimitMiddleware } from '@/middleware/rateLimitMiddleware';


export const loginAction = createServerFn({ method: 'POST' })
    .middleware([authRateLimitMiddleware, csrfMiddleware])
    .inputValidator(loginSchema)
    .handler(async ({ data }) => {
        try {
            const response = await loginUserService(data)
            if (!response.token) {
                throw new Error("An error occurred")
            }

            const session = await useAppSession();
            await session.clear()

            const now = Date.now()
            const csrf = generateCsrfToken()
            const user: SessionUser = {
                member_no: null,
                email: data.email_address,
                role: data.user_type,
            };

            await session.update({
                is_authed: true,
                otp_token: response.token,
                user: user,
                lastTouch: now,
                createdAt: now,
                expiresAt: now + SESSION_EXPIRY_SEC * 1000,
                csrfToken: csrf,
            });

            return {
                success: true,
                message: response.message,
                otp_generated: response.otp_generated,
                member_status: response.member_status,
            }
        } catch (err: any) {
            throw {
                message: err?.message ?? 'Login failed',
                fieldErrors: err?.fieldErrors ?? null,
            }
        }
    })

export const logoutAction = createServerFn({ method: 'POST' })
    .middleware([authMiddleware, csrfMiddleware])
    .handler(async ({ context }) => {
        try {
            const user = context;
            const auth_token = user.authToken;

            if (!auth_token) {
                throw new Response("Unauthorized", { status: 401 });
            }

            const res = await logoutUserService(auth_token)
            const session = await useAppSession()
            await session.clear()

            return {
                success: true,
                message: res.message
            }
        } catch (err: any) {
            const session = await useAppSession()
            await session.clear()

            throw {
                message: err?.message ?? 'Logged out successfully',
            }
        }
    })

export const resetPassword = createServerFn({ method: 'POST' })
    .middleware([authRateLimitMiddleware, csrfMiddleware])
    .inputValidator(resetPasswordSchema)
    .handler(async ({ data }) => {
        try {
            const res = await resetPasswordService(data)

            if (res.status_code !== 200) {
                throw new Error(res.message || 'Unable to reset password')
            }

            const session = await useAppSession()
            await session.update({
                is_authed: false,
                // login_token: res.member_token,
                user: {
                    member_no: null,
                    email: data.email,
                    role: "MEMBER",
                    custom_ref: res.customer_ref,
                },
            })

            return {
                success: true,
                message: res.message,
                member_status: res.member_status,
            }

        } catch (err: any) {
            throw {
                message: err?.message ?? 'Reset password failed',
                fieldErrors: err?.fieldErrors ?? null,
            }
        }
    })

export const updatePassword = createServerFn({ method: 'POST' })
    .middleware([authRateLimitMiddleware, csrfMiddleware])
    .inputValidator(updatePasswordSchema)
    .handler(async ({ context, data }) => {
        try {
            const user = context;
            const login_token = user.authToken;

            if (!login_token) {
                throw new Response("Unauthorized", { status: 401 });
            }

            if (!login_token) {
                throw new Error('OTP session expired or invalid')
            }

            const res = await updatePasswordService(login_token, data)

            if (res.status_code !== 200) {
                throw new Error(res.message || 'Unable to reset password')
            }

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
