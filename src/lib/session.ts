import { useSession } from '@tanstack/react-start/server';
import type { SessionData } from '@/features/auth/types/auth';
import { NODE_ENV, SESSION_COOKIE_DOMAIN, SESSION_EXPIRY_SEC, SESSION_SECRET } from '@/lib/constants';

export const getAppSession = () => {
    return useSession<SessionData>({
        name: 'app-session',
        password: SESSION_SECRET,
        cookie: {
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            httpOnly: true,
            path: '/',
            domain: SESSION_COOKIE_DOMAIN ?? undefined, 
            maxAge: SESSION_EXPIRY_SEC,
        },
    });
};

export const useAppSession = getAppSession;