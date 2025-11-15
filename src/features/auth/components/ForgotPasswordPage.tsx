import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { revalidateLogic, useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '../schema/auth.schema'
import { forgotPasswordAction } from '../action/auth'
import type { UserType } from '../schema/auth.schema'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

function getErrorMessages(errors: Array<any>): Array<string> {
  return errors.map((err) => (typeof err === 'string' ? err : err.message))
}

export function ForgotPasswordPage() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: forgotPasswordAction,
    onSuccess: (res) => {
      toast.success('Reset Code Sent', {
        description: res.message || 'Please check your email for the reset code.',
      })
      router.navigate({
        to: '/verify-otp',
        search: { context: 'reset' },
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

      toast.error('Request Failed', {
        description: err?.message || 'Unable to send reset code. Please try again.',
        richColors: true,
      })
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      user_type: 'member' as UserType,
    },
    validators: {
      onSubmit: forgotPasswordSchema,
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
            <span className="text-primary">Reset Password</span>
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Enter your details to receive a password reset code
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
            <form.Field name="user_type">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(val: typeof field.state.value) =>
                      field.handleChange(val)
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="member" id="member" />
                      <Label htmlFor="member">Member</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="employer" />
                      <Label htmlFor="employer">Employer</Label>
                    </div>
                  </RadioGroup>
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
              name="username"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: forgotPasswordSchema.shape.username,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="username">Email, Username, or ID Number</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter your email, username, or ID number"
                    value={field.state.value}
                    autoComplete="username"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-describedby={
                      field.state.meta.errors.length > 0
                        ? `${field.name}-error`
                        : undefined
                    }
                  />
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
                      <span>Sending Reset Code...</span>
                    </>
                  ) : (
                    'Send Reset Code'
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
