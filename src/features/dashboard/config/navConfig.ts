import { Home, User } from 'lucide-react';
import type { UserType } from '@/features/auth/schema/auth.schema';

export interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<any>;
}


export const navConfig: Record<UserType, Array<NavItem>> = {
    MEMBER: [
        { to: '/dashboard/member/', label: 'Dashboard', icon: Home },
        { to: '/dashboard/member/profile', label: 'Profile', icon: User },
        { to: '/dashboard/member/accounts', label: 'Accounts', icon: User },
        { to: '/dashboard/member/contributions', label: 'Contributions', icon: User },
        { to: '/logout', label: 'Logout', icon: User },
    ],
    EMPLOYER: [
        { to: '/dashboard/employer/', label: 'Dashboard', icon: Home },
        { to: '/dashboard/employer/profile', label: 'Profile', icon: User },
        { to: '/dashboard/employer/employees', label: 'Employees', icon: User },
        { to: '/logout', label: 'Logout', icon: User },
    ],
};
