import { useQuery } from '@tanstack/react-query'
import { MemberProfileAction } from '../action/profile';
import type { MemberProfile } from '../types/memberProfile';


const CUSTOMER_PROFILE_QUERY_KEY = ['customer', 'clientProfile'];

export const useMemberProfile = () => {
    return useQuery<MemberProfile, Error>({
        queryKey: CUSTOMER_PROFILE_QUERY_KEY,
        queryFn: async () => {
            try {
                const res = await MemberProfileAction()
                return res.profile
            } catch (err: any) {
                const error = err?.message ?? ''
                console.error(error)

                const error_message = 'Failed to load profile info'
                throw new Error(error_message)
            }
        }
    })
}

