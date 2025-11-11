'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, User, Award, TrendingUp, RefreshCw, Edit, ArrowRight, Lightbulb, Target, Hammer, Search, MessageCircle, Users, Clipboard, Star, Zap, BarChart3, Clock, BookOpen, MapPin, DollarSign, Building2, Heart, Video, GraduationCap, Trophy, CheckCircle2 } from 'lucide-react'
import { getGamificationData } from '@/app/utils/gamification'
import { getSelectedJob, JobRecommendation, calculateCareerPathProgress } from '@/app/utils/jobRecommendations'

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
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)

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
    
    // Note: Selected job will be loaded separately in useEffect
    // to avoid timing issues and ensure proper loading
  }, [router])

  // Load selected job function
  const loadSelectedJob = useCallback(() => {
    try {
      // First try using the utility function
      const savedJob = getSelectedJob()
      if (savedJob && savedJob.id && savedJob.title && savedJob.company) {
        setSelectedJob(savedJob)
        return
      }
      
      // Fallback: try to parse directly from localStorage
      const rawData = localStorage.getItem('selectedJob')
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData)
          // Validate that parsed data has required fields
          if (parsed && parsed.id && parsed.title && parsed.company) {
            setSelectedJob(parsed)
          } else {
            console.warn('Selected job data is incomplete:', parsed)
            setSelectedJob(null)
          }
        } catch (e) {
          console.error('Error parsing selectedJob from localStorage:', e)
          setSelectedJob(null)
        }
      } else {
        setSelectedJob(null)
      }
    } catch (e) {
      console.error('Error loading selected job:', e)
      setSelectedJob(null)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Load selected job separately to ensure it loads after profile
  useEffect(() => {
    // Small delay to ensure localStorage is accessible
    const timer = setTimeout(() => {
      loadSelectedJob()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [loadSelectedJob])

  useEffect(() => {
    // Listen for profile updates (e.g., after retaking test)
    const handleProfileUpdate = (event: CustomEvent) => {
      loadProfile()
      // Reload selected job after profile update
      setTimeout(() => {
        loadSelectedJob()
      }, 100)
    }
    
    // Listen for job selection updates
    const handleJobSelected = () => {
      loadSelectedJob()
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
    window.addEventListener('jobSelected', handleJobSelected)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener)
      window.removeEventListener('gamificationUpdated', handleGamificationUpdate)
      window.removeEventListener('jobSelected', handleJobSelected)
    }
  }, [loadProfile, loadSelectedJob])

  const handleRetakeTest = () => {
    // Add retake parameter to allow access even if onboarding is completed
    router.push('/onboarding?retake=true')
  }

  // Calculate career path progress if job is selected (outside IIFE for proper scope)
  const careerPathProgress = selectedJob && userProfile
    ? calculateCareerPathProgress(selectedJob, userProfile)
    : null
  
  // Use career path progress percentage if available, otherwise use EXP percentage
  const progressPercentage = careerPathProgress 
    ? careerPathProgress.progressPercentage
    : (gamification ? (gamification.currentExp / gamification.expNeeded) * 100 : 0)
  
  // For display, use career path progress if available
  const displayProgress = careerPathProgress
    ? {
        current: careerPathProgress.completedSteps,
        total: careerPathProgress.totalSteps,
        percentage: careerPathProgress.progressPercentage,
        label: 'Career Path Progress',
        subtitle: `${careerPathProgress.completedSteps} of ${careerPathProgress.totalSteps} steps completed`
      }
    : {
        current: gamification?.currentExp || 0,
        total: gamification?.expNeeded || 100,
        percentage: progressPercentage,
        label: 'EXP Progress',
        subtitle: `${gamification?.totalExp || 0} total EXP earned`
      }

  const handleUpdateSkills = () => {
    router.push('/dashboard/profile')
  }

  const handleUpdateInterest = () => {
    router.push('/dashboard/profile')
  }

  // Debug: Log selectedJob state in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Selected Job State:', selectedJob)
      const rawData = localStorage.getItem('selectedJob')
      console.log('LocalStorage selectedJob:', rawData ? 'Exists' : 'Not found')
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData)
          console.log('Parsed selectedJob:', parsed)
        } catch (e) {
          console.error('Error parsing:', e)
        }
      }
    }
  }, [selectedJob])

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
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                {getGreeting()}, {userProfile.name || 'User'}!
                <span className="text-3xl sm:text-4xl md:text-5xl">👋</span>
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Here's your personalized career dashboard</p>
            </div>
          </div>
        </div>

        {/* Selected Job Tracking Card */}
        {selectedJob ? (
          <div className="mb-4 sm:mb-6 bg-white backdrop-blur-sm rounded-xl shadow-md p-4 border border-blue-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-lg font-bold text-gray-900">Tracking: {selectedJob.title}</h2>
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {selectedJob.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {selectedJob.company.name} • {selectedJob.location}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/progress"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                View Progress
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="bg-white/70 rounded-lg p-2.5 border border-gray-200/40">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Salary Range</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ${selectedJob.salaryRange.min.toLocaleString()} - ${selectedJob.salaryRange.max.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/70 rounded-lg p-2.5 border border-gray-200/40">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Type</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{selectedJob.type} • {selectedJob.experienceLevel}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-2.5 border border-gray-200/40">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Required Skills</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {skill}
                    </span>
                  ))}
                  {selectedJob.skills.length > 3 && (
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                      +{selectedJob.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 sm:mb-6 bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-300/60 shadow-sm">
            <div className="text-center max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100/80 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">No Job Selected</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Choose a job recommendation to begin tracking your progress
              </p>
              <Link
                href="/dashboard/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        )}

        {/* RIASEC Type Card with Visualization */}
        {riasecInfo && (() => {
          const colors = getColorClasses(userProfile.riasecType)
          
          return (
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-100/50 rounded-full blur-3xl -ml-24 -mb-24"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left side - Text info */}
                <div className="flex flex-col">
                  <div className="relative">
                    {/* Decorative badge */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
                    
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
                  
                  {/* Progress Section - Career Path or EXP */}
                  {(gamification || careerPathProgress) && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-blue-600 text-sm">
                            {careerPathProgress 
                              ? `Career Path Progress`
                              : `Progress Level ${gamification?.level || 1}`
                            }
                          </h3>
                        </div>
                        <span className="text-xs text-blue-700 font-bold">
                          {displayProgress.current}/{displayProgress.total} {careerPathProgress ? 'Steps' : 'EXP'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <SimpleCircularProgress 
                          percentage={displayProgress.percentage} 
                          size={70} 
                          strokeWidth={6}
                          color="#3B82F6"
                        />
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(displayProgress.percentage, 100)}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">
                            {displayProgress.subtitle}
                          </p>
                          {careerPathProgress && selectedJob && (
                            <p className="text-xs text-gray-500 mt-1">
                              Towards {selectedJob.title} at {selectedJob.company.name}
                            </p>
                          )}
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
                      
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm mb-3">
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
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg transform group-hover:scale-105"
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
      </div>
    </div>
  )
}
