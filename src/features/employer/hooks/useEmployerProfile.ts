import { useQuery } from '@tanstack/react-query'
import { EmployerProfileAction } from '../action/profile'
// import type { EmployerProfile } from '../types/profile'

const EMPLOYER_PROFILE_QUERY_KEY = ['employer', 'profile']

export const useEmployerProfile = () => {
  return useQuery({
    queryKey: EMPLOYER_PROFILE_QUERY_KEY,
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
