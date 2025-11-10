'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Briefcase, Video, TrendingUp, Building2, BarChart3, User, LogOut, Menu, X, Target } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const loadUserProfile = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    const email = userData.email

    if (!email) {
      router.push('/login')
      return
    }

    // Check onboarding status first
    const onboardingStatus = localStorage.getItem('onboardingStatus')
    const hasCompletedOnboarding = onboardingStatus 
      ? JSON.parse(onboardingStatus)[email] === true
      : false

    if (!hasCompletedOnboarding) {
      router.push('/onboarding')
      return
    }

    // Try to load profile from userProfiles (multi-user storage)
    const userProfiles = localStorage.getItem('userProfiles')
    let profileData = null
    
    if (userProfiles) {
      const profiles = JSON.parse(userProfiles)
      if (profiles[email]) {
        profileData = profiles[email]
        // Update current session profile
        localStorage.setItem('userProfile', JSON.stringify(profileData))
      }
    }
    
    // Fallback to current userProfile if email matches
    if (!profileData) {
      const profile = localStorage.getItem('userProfile')
      if (profile) {
        const parsed = JSON.parse(profile)
        if (parsed.email === email) {
          profileData = parsed
        }
      }
    }

    if (!profileData || !profileData.isOnboarded) {
      router.push('/onboarding')
      return
    }

    setUserProfile(profileData)
  }

  useEffect(() => {
    loadUserProfile()
    
    // Listen for storage changes to update profile in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile') {
        loadUserProfile()
      }
    }
    
    // Listen for custom event from profile page
    const handleProfileUpdate = () => {
      // Reload profile immediately
      loadUserProfile()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [router])

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // On mobile, default sidebar to closed
      if (mobile) {
        setSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userProfile')
    router.push('/')
  }

  const menuItems = [
    { icon: BarChart3, title: 'Dashboard', href: '/dashboard', color: 'blue' },
    { icon: Briefcase, title: 'Job Recommendations', href: '/dashboard/jobs', color: 'blue' },
    { icon: Video, title: 'Practice Interview', href: '/dashboard/interview', color: 'purple' },
    { icon: TrendingUp, title: 'Career Coaching', href: '/dashboard/coaching', color: 'green' },
    { icon: Building2, title: 'Connect to Companies', href: '/dashboard/companies', color: 'orange' },
    { icon: Target, title: 'Progress Tracking', href: '/dashboard/progress', color: 'pink' },
    { icon: User, title: 'Profile', href: '/dashboard/profile', color: 'pink' },
  ]

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex relative">
      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? sidebarOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full w-64'
            : sidebarOpen
            ? 'w-64'
            : 'w-20'
        } fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out h-screen`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo and Toggle Button */}
          <div className={`border-b sticky top-0 bg-white z-10 ${
            !isMobile && !sidebarOpen 
              ? 'flex flex-col items-center gap-4 py-4 px-2' 
              : 'px-4 py-5'
          }`}>
            {isMobile || sidebarOpen ? (
              <div className="flex items-center justify-between gap-3">
                <Link href="/dashboard" className="flex items-center justify-center flex-1 min-w-0">
                  <Image 
                    src="/assets/Jobify.png" 
                    alt="Jobify Logo" 
                    width={220} 
                    height={220}
                    className="h-24 w-auto max-w-full"
                    priority
                  />
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                  title={isMobile ? "Close sidebar" : "Collapse sidebar"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Link href="/dashboard" className="flex items-center justify-center">
                  <Image 
                    src="/assets/Jobify.png" 
                    alt="Jobify Logo" 
                    width={56} 
                    height={56}
                    className="h-14 w-14 object-contain"
                    priority
                  />
                </Link>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Expand sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className={`border-b ${
            !isMobile && !sidebarOpen 
              ? 'flex justify-center p-3' 
              : 'p-4'
          }`}>
            {isMobile || sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {userProfile?.photo ? (
                    <img 
                      src={userProfile.photo} 
                      alt={userProfile?.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {userProfile?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {userProfile?.riasecType ? `${userProfile.riasecType} Type` : 'N/A'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {userProfile?.photo ? (
                  <img 
                    src={userProfile.photo} 
                    alt={userProfile?.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className={`flex-1 overflow-y-auto ${
            !isMobile && !sidebarOpen ? 'p-2' : 'p-4'
          }`}>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      className={`flex items-center rounded-lg transition-colors ${
                        !isMobile && !sidebarOpen 
                          ? 'px-2 py-2 justify-center' 
                          : 'px-3 py-2.5 gap-2.5'
                      } ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      title={!isMobile && !sidebarOpen ? item.title : ''}
                    >
                      <Icon className={`flex-shrink-0 w-5 h-5`} />
                      {(isMobile || sidebarOpen) && (
                        <span className="text-sm leading-tight">{item.title}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className={`border-t ${
            !isMobile && !sidebarOpen 
              ? 'flex justify-center p-3' 
              : 'p-4'
          }`}>
            <button
              onClick={handleLogout}
              className={`flex items-center rounded-lg transition-colors ${
                !isMobile && !sidebarOpen 
                  ? 'px-2 py-2 justify-center' 
                  : 'px-4 py-3 w-full gap-3'
              } text-gray-700 hover:bg-red-50 hover:text-red-600`}
              title={!isMobile && !sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {(isMobile || sidebarOpen) && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - only show when sidebar is expanded on mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isMobile
          ? 'ml-0'
          : sidebarOpen
          ? 'ml-64'
          : 'ml-20'
      }`}>
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center">
            <Image 
              src="/assets/Jobify.png" 
              alt="Jobify Logo" 
              width={120} 
              height={120}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="w-10" />
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

