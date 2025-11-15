import type { EmployerProfileResponse } from '../types/profile'
import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'

export async function EmployerProfileService(
  token: string,
): Promise<EmployerProfileResponse> {
  try {
    if (!token) throw new Error('Unauthorized')

    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.Profile()

    return {
      status_code: 200,
      success: true,
      profile: {
        company_name: response.profile.company_name || '',
        email: response.profile.email || '',
        pin_no: response.profile.pin_no || '',
        company_code: response.profile.company_code || '',
        logo: response.profile.logo || undefined,
      },
    }
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
