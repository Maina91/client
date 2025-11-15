import type { MemberProfileResponse } from '../types/memberProfile'
import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'


export async function MemberProfileService(
  token: string,
): Promise<MemberProfileResponse> {
  try {
    if (!token) throw new Error('Unauthorized')

    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.GetMemberProfile()

    if (!response.memberProfile) {
      throw new Error('Unable to fetch member profile')
    }

    return response.memberProfile
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
