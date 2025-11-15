import type { LoginUserTypeInput } from "@/generated/graphql"

export type SessionUser = {
    member_no: string | null
    username: string
    role: LoginUserTypeInput
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