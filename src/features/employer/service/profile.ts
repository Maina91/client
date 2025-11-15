import { getSdk } from '@/generated/graphql'
import { getGraphQLClient, handleGraphQLError } from '@/lib/graphql-client'

export interface EmployerProfileResponse {
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
): Promise<EmployerProfileResponse> {
  try {
    if (!token) throw new Error('Unauthorized')

    const client = getGraphQLClient(token)
    const sdk = getSdk(client)

    const response = await sdk.GetMemberProfile()

    // if (!response.employerProfile) {
    //   throw new Error('Unable to fetch employer profile')
    // }

    return response.memberProfile
  } catch (error) {
    handleGraphQLError(error)
    throw error
  }
}
