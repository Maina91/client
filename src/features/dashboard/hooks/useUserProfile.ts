import { useQuery } from '@tanstack/react-query'
import { LoginUserTypeInput } from '@/generated/graphql'
import { useSession } from '@/features/auth/hooks/useSession'
import { useMemberProfile } from '@/features/member/hooks/useMemberProfile'
import { useEmployerProfile } from '@/features/employer/hooks/useEmployerProfile'

export interface UnifiedProfile {
  displayName: string
  email: string
  userType: LoginUserTypeInput
  avatarFallback: string
  // Additional fields for specific user types
  member_no?: string
  company_name?: string
  full_name?: string
}

export const useUserProfile = () => {
  const { userRole, isAuthed } = useSession()

  // Fetch member profile if user is member
  const memberQuery = useMemberProfile()
  // Fetch employer profile if user is employer
  const employerQuery = useEmployerProfile()

  // Determine which query to use based on user role
  const activeQuery = userRole === LoginUserTypeInput.Member ? memberQuery : employerQuery

  // Transform the profile data into a unified format
  const unifiedProfile = useQuery({
    queryKey: ['unified-profile', userRole],
    queryFn: async (): Promise<UnifiedProfile | null> => {
      if (!isAuthed || !userRole) return null

      try {
        const profile = activeQuery.data

        if (!profile) return null

        if (userRole === LoginUserTypeInput.Member) {
          const memberProfile = profile as any // Type assertion for member profile
          return {
            displayName: memberProfile.full_name || 'Member',
            email: memberProfile.email_address || '',
            userType: LoginUserTypeInput.Member,
            avatarFallback: memberProfile.full_name?.charAt(0).toUpperCase() || 'M',
            member_no: memberProfile.member_no,
            full_name: memberProfile.full_name,
          }
        } else {
          const employerProfile = profile as any // Type assertion for employer profile
          return {
            displayName: employerProfile.company_name || 'Employer',
            email: employerProfile.email || '',
            userType: LoginUserTypeInput.Employer,
            avatarFallback: employerProfile.company_name?.charAt(0).toUpperCase() || 'E',
            company_name: employerProfile.company_name,
          }
        }
      } catch (error) {
        console.error('Failed to unify profile:', error)
        return null
      }
    },
    enabled: !!isAuthed && !!userRole && activeQuery.isSuccess,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    profile: unifiedProfile.data,
    isLoading: activeQuery.isLoading || unifiedProfile.isLoading,
    isError: activeQuery.isError || unifiedProfile.isError,
    error: activeQuery.error || unifiedProfile.error,
    refetch: () => {
      if (userRole === LoginUserTypeInput.Member) {
        memberQuery.refetch()
      } else {
        employerQuery.refetch()
      }
      unifiedProfile.refetch()
    },
  }
}
