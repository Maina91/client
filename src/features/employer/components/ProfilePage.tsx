import { useEmployerProfile } from '../hooks/useEmployerProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileSkeleton } from '@/components/custom/ProfileSkeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ProfilePage() {
  const { data: profile, isLoading, error } = useEmployerProfile()

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.message || 'Failed to load employer profile'}
        </AlertDescription>
      </Alert>
    )
  }

  if (!profile) {
    return (
      <Alert>
        <AlertDescription>No profile data available</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.logo} alt={profile.company_name} />
              <AvatarFallback className="text-2xl">
                {profile.company_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{profile.company_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">PIN Number</label>
              <p className="text-lg">{profile.pin_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Company Code</label>
              <p className="text-lg">{profile.company_code}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
