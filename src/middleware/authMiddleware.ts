import { createMiddleware } from "@tanstack/react-start";
import { getAppSession } from "@/lib/session";

/**
 * Authentication middleware
 * - Validates session
 * - Extends sliding window
 */
export const authMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next }) => {
        const session = await getAppSession();
        const data = session.data;

        // --- Step 1: Basic auth check
        if (!data.is_authed || !data.user) {
            await session.clear();
            throw new Response("Unauthorized", { status: 401 });
        }

        const now = Date.now();

        // --- Step 2: Expiry check
        if (data.expiresAt && data.expiresAt < now) {
            await session.clear();
            throw new Response("Session expired", { status: 401 });
        }

        // --- Step 3: Sliding window extension
        const SLIDING_WINDOW = 15 * 60 * 1000; // 15 min
        if (now - (data.lastTouch ?? 0) > SLIDING_WINDOW) {
            await session.update({
                lastTouch: now,
                expiresAt: now + 30 * 60 * 1000, // extend 30 minutes
            });
        }

        // --- Step 4: Continue with context
        return next({
            context: {
                user: data.user,
                csrfToken: data.csrfToken,
            },
        });
    }
);
