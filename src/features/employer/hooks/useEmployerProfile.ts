import { useQuery } from '@tanstack/react-query'
import { EmployerProfileAction } from '../action/profile'
import type { EmployerProfile } from '../types/profile'


const CUSTOMER_PROFILE_QUERY_KEY = ['customer', 'clientProfile']

export const useMemberProfile = () => {
  return useQuery<EmployerProfile, Error>({
    queryKey: CUSTOMER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await EmployerProfileAction()
        return res.profile
      } catch (err: any) {
        const error = err?.message ?? ''
        console.error(error)

        const error_message = 'Failed to load profile info'
        throw new Error(error_message)
      }
    },
  })
}
