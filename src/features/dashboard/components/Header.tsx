import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Menu } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { toast } from 'sonner'
import type { UserType } from '@/features/auth/schema/auth.schema'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMemberProfile } from '@/features/member/hooks/useMemberProfile'
import { logoutAction } from '@/features/auth/action/auth'

interface TopbarProps {
  onSidebarToggle?: () => void
}

export function Topbar({ onSidebarToggle }: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: profile, isLoading, isError } = useMemberProfile()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return logoutAction()
    },
    onSuccess: (res) => {
      toast.success(res.message)
      // or use your session clear util
      router.navigate({ to: '/login' })
    },
    onError: () => {
      toast.error('Logout failed. Please try again.')
    },
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen)
      document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const handleProfileClick = (role: UserType) => {
    setIsDropdownOpen(false)
    router.navigate({
      to:
        role === 'MEMBER'
          ? '/dashboard/member/profile'
          : '/dashboard/employer/profile',
    })
  }

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b shadow-sm sticky top-0 z-50">
      {/* Left: Sidebar toggle + greeting */}
      <div className="flex items-center gap-3">
        {onSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        )}

        <div className="hidden sm:flex flex-col">
          <span className="text-xs text-gray-500">Welcome</span>
          <span
            className={clsx(
              'font-semibold text-gray-800 text-sm sm:text-base',
              isLoading && 'bg-gray-200 rounded w-24 h-5 animate-pulse',
            )}
          >
            {!isLoading ? (profile?.full_name ?? 'User') : ''}
          </span>
        </div>
      </div>

      {/* Right: Notifications + user dropdown */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </Button>

        <div className="relative" ref={dropdownRef}>
          <button
            className={clsx(
              'flex items-center gap-2 rounded-md transition-colors px-1',
              isLoading ? 'opacity-70 cursor-wait' : 'hover:opacity-80',
            )}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading || isError}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              className={clsx(
                'w-4 h-4 text-gray-500 transition-transform duration-200',
                isDropdownOpen && 'rotate-180',
              )}
            />
          </button>

          {isDropdownOpen && profile && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {profile.email_address}
                </p>
              </div>
              <div className="flex flex-col">
                <button
                  className="px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                  onClick={() =>
                    handleProfileClick(profile.user_type as UserType)
                  }
                >
                  Profile
                </button>
                <button className="px-4 py-2 text-left text-sm hover:bg-gray-100 transition">
                  Settings
                </button>
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                >
                  {logoutMutation.isPending ? 'Logging out…' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
