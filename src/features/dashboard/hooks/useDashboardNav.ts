import { useMemo } from 'react'
import { navConfig } from '../config/navConfig'
import type { NavItem } from '../config/navConfig'
import type { UserType } from '@/features/auth/schema/auth.schema'

export function useDashboardNav(role?: UserType | null): Array<NavItem> {
  return useMemo<Array<NavItem>>(() => {
    if (!role) return []
    return navConfig[role]
  }, [role])
}
