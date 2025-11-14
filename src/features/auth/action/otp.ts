import { createServerFn } from '@tanstack/react-start'
import { otpSchema, resendOtpSchema } from '../schema/otp.schema'
import { resendOtpService, verifyOtpService, } from '@/core/services/auth/otp.service'
import { authMiddleware } from '@/middleware/authMiddleware'
import { csrfMiddleware } from '@/middleware/csrfMiddleware'
import { authRateLimitMiddleware } from '@/middleware/rateLimitMiddleware'
import { useAppSession } from '@/lib/session'


export const verifyOtpAction = createServerFn({ method: 'POST' })
    .middleware([authRateLimitMiddleware, authMiddleware, csrfMiddleware])
    .inputValidator(otpSchema)
    .handler(async ({ context, data }) => {
        try {
            const auth_token = context.authToken

            if (!auth_token) {
                throw new Response("Unauthorized", { status: 401 });
            }

            const res = await verifyOtpService(auth_token, data)

            if (!res.token) {
                throw new Error("OTP verification failed")
            }

            const session = await useAppSession();
            await session.update({
                is_authed: true,
                auth_token: res.token,
            })

            return {
                success: true,
                message: res.message,
                member_status: res.member_status,
                accounts_count: res.accounts_count,
            }
        } catch (err: any) {
            throw {
                message: err?.message ?? 'OTP verification failed',
                fieldErrors: err?.fieldErrors ?? null,
            }
        }
    })

export const resendOtpAction = createServerFn({ method: 'POST' })
    .middleware([authRateLimitMiddleware])
    .inputValidator(resendOtpSchema)
    .handler(async ({ data }) => {
        try {
            const session = await useAppSession();
            const login_token = session.data.otp_token

            if (!login_token) {
                throw new Error('OTP session expired or invalid')
            }

            const res = await resendOtpService(login_token, data)

            return {
                success: true,
                message: res.message,
            }
        } catch (err: any) {
            throw {
                message: err?.message ?? 'Resending OTP failed',
                fieldErrors: err?.fieldErrors ?? null,
            }
        }
    })

