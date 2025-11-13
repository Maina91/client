import { Outlet, useNavigate } from '@tanstack/react-router';
import { Sidebar } from './SideBar';
import { Topbar } from './Header';

import type { User } from '@/lib/session';
import type { UserType } from '@/features/auth/schema/auth.schema';
import { useAppSession } from '@/lib/session';


export function DashboardLayout() {
    const { data: session, isLoading } = useAppSession();
    const navigate = useNavigate();

    // Redirect unauthenticated users to login
    if (!isLoading && !session?.is_authed) {
        navigate({ to: '/' });
        return null;
    }

    if (isLoading || !session) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    const userRole = session.user.role as UserType;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar role={userRole} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <Topbar onSidebarToggle={() => { /* implement mobile toggle if needed */ }} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
