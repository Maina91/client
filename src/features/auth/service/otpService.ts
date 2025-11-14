import type { OtpData, ResendOtpData } from '../schema/otp.schema'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'

export interface OtpResponse {
  token: string
  message: string
  member_status: string
  accounts_count: number
}

export interface ResendOtpResponse {
  message: string
}

const VERIFY_OTP_MUTATION = `
  mutation VerifyOtp($input: OtpInput!) {
    verifyOtp(input: $input) {
      token
      message
      member_status
      accounts_count
    }
  }
`

const RESEND_OTP_MUTATION = `
  mutation ResendOtp($input: ResendOtpInput!) {
    resendOtp(input: $input) {
      message
    }
  }
`

export async function verifyOtpService(
  token: string,
  data: OtpData
): Promise<OtpResponse> {
  try {
    const client = getGraphQLClient(token)

    const response = await client.request<{
      verifyOtp: {
        token: string
        message: string
        member_status: string
        accounts_count: number
      }
    }>(VERIFY_OTP_MUTATION, { input: data })

    return response.verifyOtp
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}

export async function resendOtpService(
  token: string,
  data: ResendOtpData
): Promise<ResendOtpResponse> {
  try {
    const client = getGraphQLClient(token)

    const response = await client.request<{
      resendOtp: {
        message: string
      }
    }>(RESEND_OTP_MUTATION, { input: data })

    return response.resendOtp
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
