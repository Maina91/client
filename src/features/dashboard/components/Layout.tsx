import { Outlet, useNavigate } from '@tanstack/react-router';
import { Sidebar } from './SideBar';
import { Topbar } from './Header';
import type { UserType } from '@/features/auth/schema/auth.schema';
import { useSession } from '@/features/auth/hooks/useSession';



export function DashboardLayout() {
    const { session, isLoading, isAuthed } = useSession();
    const navigate = useNavigate();

    if (!isLoading && !isAuthed) {
        navigate({ to: '/' });
        return null;
    }

    // Loading state
    if (isLoading || !session) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        );
    }

    const userRole: UserType = session.role;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar role={userRole} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <Topbar onSidebarToggle={() => {
                    /* implement mobile toggle if needed */
                }} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
