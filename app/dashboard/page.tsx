'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, User, Award, TrendingUp, RefreshCw, Edit, CheckCircle, ArrowRight, Lightbulb, Target, Hammer, Search, MessageCircle, Users, Clipboard, Sparkles, Star, Zap, BarChart3, Clock, BookOpen } from 'lucide-react'
import { getGamificationData } from '@/app/utils/gamification'

const RIASEC_INFO: Record<string, any> = {
  'R': {
    name: 'Realistic',
    description: 'Hands-on, practical, and enjoys working with tools',
    traits: ['Practical', 'Mechanical', 'Outdoor-oriented', 'Tool-focused'],
    suitableJobs: ['Mechanical Engineer', 'Civil Engineer', 'Electrician', 'Architect', 'Construction Manager'],
    color: 'red',
    hexColor: '#EF4444', // red
    label: 'doers',
    icon: Hammer,
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-700'
  },
  'I': {
    name: 'Investigative',
    description: 'Analytical, curious, and enjoys research',
    traits: ['Analytical', 'Scientific', 'Intellectual', 'Research-oriented'],
    suitableJobs: ['Data Scientist', 'Research Scientist', 'Software Engineer', 'Biologist', 'Physicist'],
    color: 'blue',
    hexColor: '#3B82F6', // blue
    label: 'thinkers',
    icon: Search,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-700'
  },
  'A': {
    name: 'Artistic',
    description: 'Creative, expressive, and enjoys artistic activities',
    traits: ['Creative', 'Expressive', 'Innovative', 'Artistic'],
    suitableJobs: ['UI/UX Designer', 'Graphic Designer', 'Writer', 'Musician', 'Architect'],
    color: 'green',
    hexColor: '#10B981', // green
    label: 'creators',
    icon: Lightbulb,
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    badgeBg: 'bg-green-500/10',
    badgeText: 'text-green-700'
  },
  'S': {
    name: 'Social',
    description: 'Helpful, friendly, and enjoys working with people',
    traits: ['Helpful', 'Friendly', 'Empathetic', 'People-oriented'],
    suitableJobs: ['Teacher', 'Counselor', 'Social Worker', 'Nurse', 'HR Manager'],
    color: 'purple',
    hexColor: '#8B5CF6', // purple
    label: 'helpers',
    icon: Users,
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-700'
  },
  'E': {
    name: 'Enterprising',
    description: 'Ambitious, persuasive, and enjoys leadership',
    traits: ['Ambitious', 'Persuasive', 'Leadership', 'Business-oriented'],
    suitableJobs: ['Product Manager', 'Sales Manager', 'Business Analyst', 'Entrepreneur', 'Marketing Manager'],
    color: 'orange',
    hexColor: '#F97316', // orange
    label: 'persuaders',
    icon: MessageCircle,
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-700'
  },
  'C': {
    name: 'Conventional',
    description: 'Organized, detail-oriented, and enjoys structured work',
    traits: ['Organized', 'Detail-oriented', 'Structured', 'Systematic'],
    suitableJobs: ['Accountant', 'Data Analyst', 'Administrative Assistant', 'Financial Analyst', 'Project Manager'],
    color: 'yellow',
    hexColor: '#EAB308', // yellow
    label: 'organizers',
    icon: Clipboard,
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-yellow-600',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    badgeBg: 'bg-yellow-500/10',
    badgeText: 'text-yellow-700'
  }
}

// Simple Circular Progress Component for EXP
function SimpleCircularProgress({ percentage, size = 80, strokeWidth = 6, color = '#3B82F6' }: { percentage: number, size?: number, strokeWidth?: number, color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{Math.round(percentage)}%</div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [riasecInfo, setRiasecInfo] = useState<any>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])
  const [hoveredJob, setHoveredJob] = useState<number | null>(null)
  const [gamification, setGamification] = useState<any>(null)

  const loadProfile = useCallback(() => {
    // Try to load from userProfiles first (multi-user support)
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/onboarding')
      return
    }
    
    const userData = JSON.parse(user)
    const email = userData.email
    
    if (!email) {
      router.push('/onboarding')
      return
    }
    
    const userProfiles = localStorage.getItem('userProfiles')
    let parsed = null
    
    if (userProfiles) {
      const profiles = JSON.parse(userProfiles)
      if (profiles[email]) {
        parsed = profiles[email]
        localStorage.setItem('userProfile', JSON.stringify(parsed))
      }
    }
    
    // Fallback to current userProfile
    if (!parsed) {
      const profile = localStorage.getItem('userProfile')
      if (profile) {
        const profileData = JSON.parse(profile)
        if (profileData.email === email) {
          parsed = profileData
        }
      }
    }
    
    if (!parsed) {
      router.push('/onboarding')
      return
    }
    
    setUserProfile(parsed)
    
    // Load gamification data
    try {
      const gameData = getGamificationData()
      setGamification(gameData)
    } catch (e) {
      setGamification({
        level: 1,
        currentExp: 0,
        expNeeded: 100,
        totalExp: 0,
      })
    }
    
    // Get RIASEC info
    if (parsed.riasecType) {
      const info = RIASEC_INFO[parsed.riasecType] || RIASEC_INFO['S']
      setRiasecInfo(info)
      
      // Get recommended jobs based on RIASEC type and interests
      const jobs: any[] = []
      
      // Add jobs based on RIASEC type
      if (info.suitableJobs) {
        info.suitableJobs.slice(0, 3).forEach((jobTitle: string) => {
          jobs.push({
            title: jobTitle,
            matchScore: 95,
            reason: `Highly compatible with your ${info.name} personality type`
          })
        })
      }
      
      // Add jobs based on user interests
      if (parsed.jobInterests && parsed.jobInterests.length > 0) {
        parsed.jobInterests.slice(0, 2).forEach((interest: string) => {
          if (!jobs.find(j => j.title === interest)) {
            jobs.push({
              title: interest,
              matchScore: 90,
              reason: 'Matches your job interests'
            })
          }
        })
      }
      
      setRecommendedJobs(jobs.slice(0, 5))
    }
  }, [router])

  useEffect(() => {
    loadProfile()
    
    // Listen for profile updates (e.g., after retaking test)
    const handleProfileUpdate = (event: CustomEvent) => {
      loadProfile()
    }
    
    // Listen for gamification updates
    const handleGamificationUpdate = () => {
      try {
        const gameData = getGamificationData()
        setGamification(gameData)
      } catch (e) {
        console.error('Error loading gamification data:', e)
      }
    }
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener)
    window.addEventListener('gamificationUpdated', handleGamificationUpdate)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener)
      window.removeEventListener('gamificationUpdated', handleGamificationUpdate)
    }
  }, [loadProfile])

  const handleRetakeTest = () => {
    // Add retake parameter to allow access even if onboarding is completed
    router.push('/onboarding?retake=true')
  }

  const handleUpdateSkills = () => {
    router.push('/dashboard/profile')
  }

  const handleUpdateInterest = () => {
    router.push('/dashboard/profile')
  }

  if (!userProfile || !riasecInfo) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Get color classes based on RIASEC type
  const getColorClasses = (type: string) => {
    const info = RIASEC_INFO[type] || RIASEC_INFO['S']
    return {
      bg: info.bgColor,
      text: info.textColor,
      border: info.borderColor,
      gradient: `bg-gradient-to-br ${info.gradientFrom} ${info.gradientTo}`,
      badgeBg: info.badgeBg,
      badgeText: info.badgeText,
      hex: info.hexColor
    }
  }

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    let completed = 0
    const total = 5
    if (userProfile?.name) completed++
    if (userProfile?.skills && userProfile.skills.length > 0) completed++
    if (userProfile?.jobInterests && userProfile.jobInterests.length > 0) completed++
    if (userProfile?.cvFile) completed++
    if (userProfile?.linkedinUrl) completed++
    return Math.round((completed / total) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {getGreeting()}, {userProfile.name || 'User'}!
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">Here's your personalized career dashboard</p>
                </div>
              </div>
            </div>
            
            {/* Profile Completion Badge */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 sm:w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              {profileCompletion < 100 && (
                <p className="text-xs text-gray-500 mt-2">
                  Complete your profile for better recommendations
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{recommendedJobs.length}</div>
            <div className="text-sm opacity-90">Job Matches</div>
            <Link href="/dashboard/jobs" className="text-xs opacity-75 hover:opacity-100 mt-2 inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                <Award className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{userProfile.skills?.length || 0}</div>
            <div className="text-sm opacity-90">Skills Added</div>
            <button onClick={handleUpdateSkills} className="text-xs opacity-75 hover:opacity-100 mt-2 inline-flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                <Target className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{userProfile.jobInterests?.length || 0}</div>
            <div className="text-sm opacity-90">Job Interests</div>
            <button onClick={handleUpdateInterest} className="text-xs opacity-75 hover:opacity-100 mt-2 inline-flex items-center gap-1">
              Update <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <Star className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{riasecInfo?.name?.charAt(0) || 'N/A'}</div>
            <div className="text-sm opacity-90">RIASEC Type</div>
            <button onClick={handleRetakeTest} className="text-xs opacity-75 hover:opacity-100 mt-2 inline-flex items-center gap-1">
              Retake test <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RIASEC Type Card with Visualization */}
        {riasecInfo && (() => {
          const colors = getColorClasses(userProfile.riasecType)
          const expPercentage = gamification ? (gamification.currentExp / gamification.expNeeded) * 100 : 0
          
          return (
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-100 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left side - Text info */}
                <div className="flex flex-col">
                  <div className="relative">
                    {/* Decorative badge */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-xl"></div>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-6">
                      {/* Badge dengan warna sesuai tipe */}
                      <div className={`relative w-24 h-24 sm:w-28 sm:h-28 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center border-2 ${colors.border} flex-shrink-0 shadow-lg transform hover:scale-105 transition-transform`}>
                        <span className="text-4xl sm:text-5xl font-bold">{userProfile.riasecType}</span>
                        {/* Decorative corner */}
                        <div className={`absolute top-0 right-0 w-6 h-6 ${colors.gradient} opacity-20 rounded-bl-2xl`}></div>
                      </div>
                      <div className="flex-1">
                        {/* Judul tipe dengan warna sesuai tipe */}
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${colors.text}`}>{riasecInfo.name} Type</h2>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-base sm:text-lg text-gray-700 mb-5 leading-relaxed font-medium">{riasecInfo.description}</p>
                        <div className="flex flex-wrap gap-2.5">
                          {riasecInfo.traits.map((trait: string, index: number) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold shadow-sm border border-gray-200/50 hover:shadow-md hover:scale-105 transition-all"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* EXP Progress Section */}
                  {gamification && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-600 text-sm">Progress Level {gamification.level}</h3>
                        </div>
                        <span className="text-xs text-blue-700 font-bold">
                          {gamification.currentExp}/{gamification.expNeeded} EXP
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <SimpleCircularProgress 
                          percentage={expPercentage} 
                          size={70} 
                          strokeWidth={6}
                          color="#3B82F6"
                        />
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(expPercentage, 100)}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">
                            {gamification.totalExp} total EXP earned
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional info card */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-200/50 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">Career Insight</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Your {riasecInfo.name} personality type suggests you thrive in environments that value {riasecInfo.traits[0].toLowerCase()} and {riasecInfo.traits[1].toLowerCase()} approaches.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRetakeTest}
                    className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto self-start"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="whitespace-nowrap">Retake Test</span>
                  </button>
                </div>
                
                {/* Right side - RIASEC Visualization Image (Smaller) */}
                <div className="flex justify-center lg:justify-end items-start">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 border-2 border-gray-200/50 shadow-xl w-full max-w-xs relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-blue-50/50 to-transparent rounded-t-xl"></div>
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-purple-50/50 to-transparent rounded-b-xl"></div>
                    
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-2 border border-gray-100 shadow-inner flex items-center justify-center mb-3">
                        <img 
                          src="/assets/R1.png" 
                          alt="RIASEC Visualization" 
                          className="w-full h-auto max-w-full object-contain"
                        />
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200/50 shadow-sm mb-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.hex }}></div>
                          <p className="text-center text-xs text-gray-800 font-semibold">
                            Your type: <span className={`font-bold text-sm ${colors.text}`}>{riasecInfo.name}</span>
                          </p>
                        </div>
                        <p className="text-center text-xs text-gray-600">
                          RIASEC personality visualization
                        </p>
                      </div>
                      
                      {/* Legend for RIASEC types */}
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center mb-2 font-medium">RIASEC Model</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['R', 'I', 'A', 'S', 'E', 'C'].map((type) => {
                            const typeInfo = RIASEC_INFO[type]
                            const isUserType = userProfile.riasecType === type
                            return (
                              <div 
                                key={type}
                                className={`flex items-center gap-1 p-1.5 rounded text-xs ${
                                  isUserType ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                                }`}
                              >
                                <div 
                                  className="w-2.5 h-2.5 rounded-full" 
                                  style={{ backgroundColor: typeInfo.hexColor }}
                                ></div>
                                <span className={`font-medium ${isUserType ? 'text-blue-700' : 'text-gray-600'}`}>
                                  {type}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Quick Actions Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <button
              onClick={handleUpdateSkills}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-left group border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md">
                  <Edit className="w-7 h-7 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Update Skills</h3>
              <p className="text-sm text-gray-600 mb-3">Add or modify your skills to get better job recommendations</p>
              <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                <span>Manage skills</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={handleUpdateInterest}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-left group border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md">
                  <Target className="w-7 h-7 text-purple-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Update Interests</h3>
              <p className="text-sm text-gray-600 mb-3">Update your job interests to discover more opportunities</p>
              <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                <span>Edit interests</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <Link
              href="/dashboard/interview"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 text-left group border border-gray-100 hover:border-green-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md">
                  <BookOpen className="w-7 h-7 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Practice Interview</h3>
              <p className="text-sm text-gray-600 mb-3">Improve your interview skills with AI-powered mock interviews</p>
              <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                <span>Start practice</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>

        {/* Job Matching Information - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border border-gray-100 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Matching Insights</h2>
                <p className="text-sm text-gray-500">Personalized recommendations just for you</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
                <p className="text-base sm:text-lg text-gray-800 mb-4 leading-relaxed">
                  Based on your <span className="font-bold text-blue-600">{riasecInfo.name}</span> personality type, 
                  you're best suited for roles that involve <span className="font-semibold">{riasecInfo.description.toLowerCase()}</span>. 
                  These positions allow you to leverage your natural strengths and work in environments that match your personality.
                </p>
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-blue-200/50">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">Why This Matters</h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      Research shows that people in jobs matching their personality type are more satisfied, 
                      perform better, and stay longer. Your {riasecInfo.name} type indicates you thrive in 
                      environments aligned with your natural preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Jobs - Enhanced */}
            {recommendedJobs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Top Job Matches</h3>
                  <Link
                    href="/dashboard/jobs"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {recommendedJobs.map((job, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredJob(index)}
                      onMouseLeave={() => setHoveredJob(null)}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform ${hoveredJob === index ? 'ring-2 ring-blue-400' : ''}`}>
                            <Briefcase className="w-7 h-7 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.reason}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">{job.matchScore}%</span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Match Score</div>
                            <div className="text-xs font-semibold text-green-600">Excellent Match</div>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/jobs"
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform group-hover:scale-105"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suitable Job Categories - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Suitable Job Categories
              </h2>
              <p className="text-sm text-gray-600">Discover career paths aligned with your {riasecInfo.name} personality</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
            {riasecInfo.suitableJobs.map((job: string, index: number) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors flex-1">
                  {job}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore All Job Recommendations
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">What's Next?</h2>
            </div>
            <p className="text-blue-100 mb-6 text-lg">
              Take the next steps in your career journey with personalized recommendations and tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/interview"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 transform hover:-translate-y-1"
              >
                <BookOpen className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Practice Interviews</h3>
                <p className="text-sm text-blue-100">Improve your interview skills with AI-powered mock interviews</p>
              </Link>
              <Link
                href="/dashboard/coaching"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 transform hover:-translate-y-1"
              >
                <Users className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Career Coaching</h3>
                <p className="text-sm text-blue-100">Get personalized advice from expert career coaches</p>
              </Link>
              <Link
                href="/dashboard/companies"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 transform hover:-translate-y-1"
              >
                <Briefcase className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Connect Companies</h3>
                <p className="text-sm text-blue-100">Explore and connect with companies that match your profile</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
