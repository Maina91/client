import type { UserType } from '../schema/auth.schema'

export type SessionUser = {
    member_no: string | null
    email: string
    role: UserType
    custom_ref?: string
}

export type SessionData = {
    is_authed: boolean
    user: SessionUser | null
    auth_token?: string
    otp_token?: string
    csrfToken?: string
    lastTouch?: number
    createdAt?: number
    expiresAt?: number
}