import type { OtpData, ResendOtpData } from '../schema/otp.schema'
import type { OtpResponse, ResendOtpResponse } from '../types/otp'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'
import { getSdk } from '@/generated/graphql'



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
    const sdk = getSdk(client)


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
