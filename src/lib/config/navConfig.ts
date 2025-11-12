import { BarChart2, Home, LineChart, Ticket, User } from 'lucide-react';
import type { UserType } from '@/features/auth/schema/auth.schema';


export interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<any>;
}

export const navConfig: Record<UserType | 'shared', Array<NavItem>> = {
    shared: [
        { to: '/logout', label: 'Logout', icon: Home },
    ],
    MEMBER: [
        { to: '/dashboard/member/', label: 'Dashboard', icon: Home },
        { to: '/dashboard/member/investments', label: 'Investments', icon: LineChart },
        { to: '/dashboard/member/profile', label: 'Profile', icon: User },
    ],
    EMPLOYER: [
        { to: '/dashboard/agent/', label: 'Dashboard', icon: Home },
        { to: '/dashboard/employer/profile', label: 'Profile', icon: User },
        { to: '/dashboard/employer/metrics', label: 'Metrics', icon: BarChart2 },
        { to: '/dashboard/employer/tickets', label: 'Tickets', icon: Ticket },
    ],
};
