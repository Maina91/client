import { createServerFn } from '@tanstack/react-start'
import { MemberProfileService } from '../service/profile';
import { useAppSession } from '@/lib/session';
import { authMiddleware } from '@/middleware/authMiddleware';
// import { csrfMiddleware } from '@/middleware/checkCsrfMiddleware';


export const MemberProfileAction = createServerFn({ method: 'GET' })
    .middleware([authMiddleware])
        .handler(async () => {
        try {
            const session = await useAppSession()
            const auth_token = session.data.auth_token

            if (!auth_token) {
                throw new Response("Unauthorized", { status: 401 });
            }

            const profile = await MemberProfileService(auth_token)

            // user session data to be updated later
            const member_no = profile.profile.member_no
            if (member_no) {
                await session.update({
                    user: {
                        ...session.data.user!,
                        member_no,
                    },
                })
            }

            return {
                success: true,
                profile: profile.profile
            }

        } catch (err: any) {
            throw {
                message: err?.message ?? 'Unable to fetch profile',
                fieldErrors: err?.fieldErrors ?? null,
            }
        }
    })

