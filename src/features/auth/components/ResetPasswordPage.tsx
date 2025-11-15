import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { revalidateLogic, useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { resetPasswordSchema } from '../schema/auth.schema'
import { resetPasswordAction } from '../action/auth'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

function getErrorMessages(errors: Array<any>): Array<string> {
  return errors.map((err) => (typeof err === 'string' ? err : err.message))
}

export function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const mutation = useMutation({
    mutationFn: resetPasswordAction,
    onSuccess: (res) => {
      toast.success('Password Reset Successful', {
        description: res.message || 'Your password has been reset successfully.',
      })
      router.navigate({
        to: '/login',
      })
    },
    onError: (err: any) => {
      if (err?.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          form.setFieldMeta(field as keyof typeof form.state.values, (meta) => ({
            ...meta,
            errors: [String(message)],
          }))
        })
      }

      toast.error('Password Reset Failed', {
        description: err?.message || 'Unable to reset password. Please try again.',
        richColors: true,
      })
    },
  })

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'blur',
    }),
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({ data: value })
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            <span className="text-primary">Set New Password</span>
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Enter your new password below
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field
              name="password"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: resetPasswordSchema.shape.password,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={field.state.value}
                      autoComplete="new-password"
                      className="pr-10"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p
                        id={`${field.name}-error`}
                        className="text-sm text-red-500"
                        aria-live="polite"
                      >
                        {getErrorMessages(field.state.meta.errors)[0]}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: resetPasswordSchema.shape.confirmPassword,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={field.state.value}
                      autoComplete="new-password"
                      className="pr-10"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-describedby={
                        field.state.meta.errors.length > 0
                          ? `${field.name}-error`
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p
                        id={`${field.name}-error`}
                        className="text-sm text-red-500"
                        aria-live="polite"
                      >
                        {getErrorMessages(field.state.meta.errors)[0]}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(s) => [s.canSubmit]}>
              {([canSubmit]) => (
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!canSubmit || mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Spinner className="h-4 w-4 animate-spin text-white" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              )}
            </form.Subscribe>

            <div className="flex justify-center text-sm">
              <a
                href="/login"
                className="text-muted-foreground hover:underline"
              >
                Back to Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
