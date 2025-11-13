import { useQuery } from '@tanstack/react-query';
import { getUSerSession } from '../action/auth';
import type { SessionUser } from '@/features/auth/types/auth';
import type { UserType } from '@/features/auth/schema/auth.schema';

export interface UseSessionResult {
    session: SessionUser | null;
    isAuthed: boolean;
    userRole: UserType | null;
    refresh: () => Promise<void>; 
}

const SESSION_QUERY_KEY = ['user', 'session'];

export const useSession = (): UseSessionResult & { isLoading: boolean } => {
    const { data, refetch, isLoading } = useQuery({
        queryKey: SESSION_QUERY_KEY,
        queryFn: async (): Promise<{ authenticated: boolean; user: SessionUser | null }> => {
            try {
                const res = await getUSerSession();

                return {
                    authenticated: !!res.authenticated,
                    user: res.user ?? null,
                };
            } catch (err: any) {
                console.error('Failed to fetch user session:', err?.message || err);
                return { authenticated: false, user: null };
            }
        },
        staleTime: 30_000, // cache session for 30s
        refetchOnWindowFocus: true,
        retry: false, // do not retry on failure automatically
    });

    const session = data?.user ?? null;
    const isAuthed = !!data?.authenticated;
    const userRole = session?.role ?? null;


    const refresh = async (): Promise<void> => {
        try {
            await refetch();
        } catch (err) {
            console.error('Session refresh failed:', err);
        }
    };

    return {
        session,
        isAuthed,
        userRole,
        refresh,
        isLoading,
    };
};
