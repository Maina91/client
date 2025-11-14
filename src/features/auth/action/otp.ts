import { createServerFn } from '@tanstack/react-start'
import { otpSchema, resendOtpSchema } from '../schema/otp.schema'
import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'
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
        throw new Response('Unauthorized', { status: 401 })
      }

      const client = getGraphQLClient(auth_token)
      const sdk = getSdk(client)

      const response = await sdk.VerifyOtp({ input: data })

      if (!response.verifyOtp) {
        throw new Error('OTP verification failed')
      }

      const session = await useAppSession()
            await session.update({
                is_authed: true,
        auth_token: response.verifyOtp.token,
        otp_token: undefined,
            })

      return {
        success: true,
        message: response.verifyOtp.message,
        member_status: response.verifyOtp.member_status,
        accounts_count: response.verifyOtp.accounts_count,
      }
    } catch (error) {
      handleGraphQLError(error)
      throw {
        message: error?.message ?? 'OTP verification failed',
        fieldErrors: error?.fieldErrors ?? null,
      }
    }
  })

export const resendOtpAction = createServerFn({ method: 'POST' })
    .middleware([authRateLimitMiddleware])
    .inputValidator(resendOtpSchema)
    .handler(async ({ data }) => {
        try {
      const session = await useAppSession()
      const sessionData = await session.data
      const login_token = sessionData.otp_token

      if (!login_token) {
        throw new Error('OTP session expired or invalid')
      }

      const client = getGraphQLClient(login_token)
      const sdk = getSdk(client)

      const response = await sdk.ResendOtp({ input: data })

      if (!response.resendOtp) {
        throw new Error('Resending OTP failed')
      }

      return {
        success: true,
        message: response.resendOtp.message,
      }
    } catch (error) {
      handleGraphQLError(error)
      throw {
        message: error?.message ?? 'Resending OTP failed',
        fieldErrors: error?.fieldErrors ?? null,
      }
    }
  })
