import { Link } from '@tanstack/react-router';
import { navConfig } from '../config/navConfig';
import type { NavItem } from '../config/navConfig';
import type { UserType } from '@/features/auth/schema/auth.schema';

interface SidebarProps {
    role: UserType;
}

export function Sidebar({ role }: SidebarProps) {
    const navItems: Array<NavItem> = navConfig[role];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-4 py-6 text-lg font-semibold">Dashboard</div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 data-[status=active]:bg-gray-200 data-[status=active]:font-semibold"
                            activeProps={{ 'data-status': 'active' }}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t text-sm text-gray-500">
                © {new Date().getFullYear()} Pension Master
            </div>
        </aside>
    );
}
