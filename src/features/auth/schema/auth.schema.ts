import { z } from 'zod'


import { LoginUserTypeInput } from "@/generated/graphql"

export const loginSchema = z.object({
  email_address: z
    .string()
    .min(1, 'Email or username is required')
    .email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  user_type: z.enum(LoginUserTypeInput),
})
export type LoginData = z.infer<typeof loginSchema>

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
