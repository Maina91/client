import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'

export interface MemberProfileResponse {
  profile: {
    member_no: string
    first_name: string
    last_name: string
    email: string
    phone: string
    date_of_birth: string
    address: string
  }
  status_code: number
  message: string
}

export async function EmployerProfileService(
  token: string,
): Promise<MemberProfileResponse> {
  try {
    if (!token) throw new Error('Unauthorized')

    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.GetMemberProfile()

    // if (!response.memberProfile) {
    //   throw new Error('Unable to fetch member profile')
    // }

    return response.memberProfile
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
