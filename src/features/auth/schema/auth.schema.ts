import { z } from 'zod'


import { LoginUserTypeInput } from "@/generated/graphql"

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Email, username, or ID number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  user_type: z.nativeEnum(LoginUserTypeInput),
})

// export const resetPasswordSchema = z.object({
//   email: z
//     .string()
//     .min(1, 'Email or username is required')
//     .email('Invalid email address'),
// })
// export type ResetPasswordData = z.infer<typeof resetPasswordSchema>

// export const updatePasswordSchema = z.object({
//   currentPassword: z
//     .string()
//     .min(6, 'Current password must be at least 6 characters long'),
//   newPassword: z
//     .string()
//     .min(6, 'New password must be at least 6 characters long'),
// })
// export type updatePasswordData = z.infer<typeof updatePasswordSchema>
