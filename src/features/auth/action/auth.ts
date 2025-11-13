import { createServerFn } from '@tanstack/react-start'
import { loginUserService, logoutUserService, resetPasswordService, updatePasswordService } from '../service/authService'
import { loginSchema, resetPasswordSchema, updatePasswordSchema } from '../schema/auth.schema'
import type { SessionUser } from '@/features/auth/types/auth';
import { useAppSession } from '@/lib/session';
import { SESSION_EXPIRY_SEC } from '@/lib/config/envConfig';
import { generateCsrfToken } from '@/lib/generateCsrf';


export const loginAction = createServerFn({ method: 'POST' })
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
    .handler(async () => {
        try {
            const session = await useAppSession()
            const auth_token = session.data.auth_token

            if (!auth_token) {
                throw new Error('No active session')
            }

            const res = await logoutUserService(auth_token)
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


export const getUSerSession = createServerFn({ method: 'GET' }).handler(
    async () => {
        try {
            const session = await useAppSession();
            const data = await session.data;

            if (!data.is_authed) return { authenticated: false, user: null };
            const now = Date.now();

            if (data.expiresAt && data.expiresAt < now) {
                await session.clear();
                return { authenticated: false, user: null };
            }

            const ABSOLUTE_MAX = 14 * 24 * 60 * 60 * 1000;
            if (data.createdAt && now - data.createdAt > ABSOLUTE_MAX) {
                await session.clear();
                return { authenticated: false, user: null };
            }

            const SLIDING_WINDOW = 30 * 60 * 1000;
            if (now - (data.lastTouch ?? 0) > SLIDING_WINDOW) {
                await session.update({
                    lastTouch: now,
                    expiresAt: now + SESSION_EXPIRY_SEC * 1000,
                });
            }

            return { authenticated: true, user: data.user ?? null };
        } catch (err) {
            console.error('Failed to fetch session', err);
            return { authenticated: false, user: null };
        }
    }
);


export const resetPassword = createServerFn({ method: 'POST' })
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
                    email: data.email,
                    role: "member",
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
    .inputValidator(updatePasswordSchema)
    .handler(async ({ data }) => {
        try {
            const session = await useAppSession()
            const login_token = session.data.login_token

            if (!login_token) {
                throw new Error('OTP session expired or invalid')
            }

            const res = await updatePasswordService(login_token, data)

            if (res.status_code !== 200) {
                throw new Error(res.message || 'Unable to reset password')
            }

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
