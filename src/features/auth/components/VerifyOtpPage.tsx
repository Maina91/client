import { useEffect, useState } from 'react'
import {
  useNavigate,
  useRouteContext,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { revalidateLogic, useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { otpSchema } from '../schema/otp.schema'
import { resendOtpAction, verifyOtpAction } from '../action/otp'
import type { UserType } from '@/features/auth/schema/auth.schema'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useSession } from '@/features/auth/hooks/useSession'
import { OTP_MAX_RETRIES, OTP_RESEND_INTERVAL } from '@/lib/config/envConfig'

function getErrorMessages(errors: Array<any>): Array<string> {
  return errors.map((err) => (typeof err === 'string' ? err : err.message))
}

export function VerifyOtpPage() {
  const router = useRouter()
  const search = useSearch({ from: '/_auth/verify-otp' })
  const context = search.context || 'login'

  // check for user /agent
  const { session, isLoading, isAuthed } = useSession()
  const navigate = useNavigate()

  if (!isLoading && !isAuthed) {
    navigate({ to: '/login' })
    return null
  }

  // Loading state
  if (isLoading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  const userRole: UserType = session.role

  // Dynamic content based on context
  const getContent = () => {
    switch (context) {
      case 'reset':
        return {
          title: 'Reset Password',
          description: 'We have sent a 6-digit code to your email. Please enter it to reset your password.',
          successMessage: 'Password reset OTP verified successfully',
          buttonText: 'Reset Password',
        }
      case 'login':
      default:
        return {
          title: 'Verify Your Account',
          description: 'We have sent a 6-digit code to your email/phone. Please enter it to verify your account.',
          successMessage: 'OTP Verified Successfully',
          buttonText: 'Verify OTP',
        }
    }
  }

  const content = getContent()

  const [destination, setDestination] = useState<'EMAIL' | 'MOBILE'>('EMAIL')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendCount, setResendCount] = useState(0)

  const userAgent =
    typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'

  const form = useForm({
    defaultValues: {
      otp: '',
      user_agent: userAgent,
    },
    validators: {
      onSubmit: otpSchema,
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'blur',
    }),
    onSubmit: async ({ value }) => {
      await verifyMutation.mutateAsync({ data: value })
    },
  })

  // Verify OTP
  const verifyMutation = useMutation({
    mutationFn: verifyOtpAction,
    onSuccess: (res) => {
      toast.success('OTP Verified Successfully', {
        description: res.message || 'Verification successful',
        richColors: true,
      })

      if (context === 'reset') {
        router.navigate({ to: '/reset-password' })
      } else {
        router.navigate({
          to:
            userRole === 'member' ? '/dashboard/member' : '/dashboard/employer',
        })
      }
    },
    onError: (err: any) => {
      toast.error('OTP Verification Failed', {
        description: err?.message || 'Invalid OTP. Please try again.',
        richColors: true,
      })
    },
  })

  // Resend OTP
  const resendMutation = useMutation({
    mutationFn: () => resendOtpAction({ data: { description: destination } }),
    onSuccess: (res) => {
      console.log('resend otp res', res)
      toast.success('OTP Resent', {
        description: 'A new OTP has been sent to your email/phone.',
      })
      setResendCooldown(OTP_RESEND_INTERVAL)
      setResendCount((prev) => prev + 1)
    },
    onError: (err: any) => {
      toast.error('Failed to Resend OTP', {
        description: err?.message || 'Please try again later.',
        richColors: true,
      })
    },
  })

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendCooldown])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl p-6">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-xl font-bold tracking-tight">
            {content.title}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            {content.description}
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
              name="otp"
              validators={{
                onChangeAsyncDebounceMs: 800,
                onChangeAsync: otpSchema.shape.otp,
              }}
            >
              {(field) => (
                <div className="flex flex-col items-center space-y-4">
                  <InputOTP
                    id={field.name}
                    name={field.name}
                    maxLength={6}
                    value={field.state.value}
                    onChange={(val) => {
                      field.handleChange(val)
                      // Auto-submit when OTP is complete
                      if (val.length === 6) {
                        form.handleSubmit()
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault()
                      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                      field.handleChange(pastedData)
                      if (pastedData.length === 6) {
                        form.handleSubmit()
                      }
                    }}
                    onBlur={field.handleBlur}
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-describedby={
                      field.state.meta.errors.length > 0
                        ? `${field.name}-error`
                        : undefined
                    }
                    className="mx-auto"
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  {!field.state.meta.errors.length && (
                    <div className="text-center text-muted-foreground text-sm">
                      Enter your one-time password
                    </div>
                  )}

                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p
                        id={`${field.name}-error`}
                        className="text-sm text-red-500 text-center"
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
                  disabled={!canSubmit || verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Spinner className="h-4 w-4 animate-spin text-white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    content.buttonText
                  )}
                </Button>
              )}
            </form.Subscribe>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Didn’t receive a code?
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-center ">
              <RadioGroup
                value={destination}
                onValueChange={(value: string) =>
                  setDestination(value as 'EMAIL' | 'MOBILE')
                }
                className="flex justify-center gap-6 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EMAIL" id="email" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MOBILE" id="sms" />
                  <Label htmlFor="sms">SMS</Label>
                </div>
              </RadioGroup>

              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  disabled={
                    resendCooldown > 0 ||
                    resendCount >= OTP_MAX_RETRIES ||
                    resendMutation.isPending
                  }
                  onClick={() => resendMutation.mutate()}
                  className="text-sm"
                >
                  {resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : resendCount >= OTP_MAX_RETRIES
                      ? 'Maximum attempts reached'
                      : 'Resend OTP'}
                </Button>
                {resendCount >= OTP_MAX_RETRIES && (
                  <p className="text-xs text-muted-foreground">
                    Too many attempts. Please try again later.
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
