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

    // Using GetMemberProfile as placeholder until Profile query is generated
    const response = await sdk.GetMemberProfile()

    // return {
    //   status_code: response.memberProfile.status_code,
    //   success: true,
    //   profile: {
    //     company_name: 'Placeholder Company',
    //     email: 'placeholder@company.com',
    //     pin_no: '123456789',
    //     company_code: 'COMP001',
    //     logo: undefined,
    //   },
    // }
    return {
      status_code: 200,
      success: true,
      profile: response.profile,
    }
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
