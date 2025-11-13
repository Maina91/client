import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { navConfig } from '../config/navConfig';
import type { NavItem } from '../config/navConfig';
import type { UserType } from '@/features/auth/schema/auth.schema';
import { useSession } from '@/features/auth/hooks/useSession';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    role: UserType;
}

export function Sidebar({ role }: SidebarProps) {
    const { refresh } = useSession();
    const navigate = useNavigate();

    const navItems: Array<NavItem> = navConfig[role];

    const handleLogout = async () => {
        try {
            // await fetch('/api/auth/logout', { method: 'POST' });
            // Clear client-side session cache
            await refresh();
            toast.success('Logged out successfully');
            navigate({ to: '/' });
        } catch (err) {
            // also clear session on error
            console.error(err);
            toast.error('Logout failed, try again');
        }
    };

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

            {/* Footer with Logout */}
            <div className="p-4 border-t flex flex-col gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-left text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
                <span className="text-sm text-gray-500">© {new Date().getFullYear()} Pension Master</span>
            </div>
        </aside>
    );
}
