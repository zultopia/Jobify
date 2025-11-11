'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Target, Award, Calendar, CheckCircle, Sparkles, Gift, Zap, Star, Trophy, Crown, Gem, Coins } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EXP_REWARDS, calculateExpNeeded, getCharacterEvolution, GamificationData, saveGamification, initializeGamification } from '@/app/utils/gamification'

// RIASEC Type Information
const RIASEC_INFO: Record<string, any> = {
  'R': { name: 'Realistic', color: '#EF4444', bgColor: 'bg-red-100', textColor: 'text-red-600' },
  'I': { name: 'Investigative', color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  'A': { name: 'Artistic', color: '#10B981', bgColor: 'bg-green-100', textColor: 'text-green-600' },
  'S': { name: 'Social', color: '#8B5CF6', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  'E': { name: 'Enterprising', color: '#F97316', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
  'C': { name: 'Conventional', color: '#EAB308', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
}

// Gamification System types and functions are imported from utils/gamification.ts

// Available benefits
const AVAILABLE_BENEFITS = [
  { id: 1, title: 'Premium Discount 20%', description: 'Get 20% off on premium features', icon: Gift, color: 'blue' },
  { id: 2, title: 'Free Coaching Session', description: '1 free career coaching session', icon: Sparkles, color: 'purple' },
  { id: 3, title: 'Priority Support', description: 'Get priority customer support', icon: Zap, color: 'yellow' },
  { id: 4, title: 'Exclusive Badge', description: 'Unlock exclusive achievement badge', icon: Trophy, color: 'orange' },
  { id: 5, title: 'Premium Features Access', description: '7 days free premium access', icon: Crown, color: 'pink' },
]

// All gamification functions are imported from utils/gamification.ts

// Circular Progress Component for EXP
function CircularProgress({ percentage, size = 120, strokeWidth = 8 }: { percentage: number, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</div>
          <div className="text-xs text-gray-500">EXP</div>
        </div>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [progressData, setProgressData] = useState<any>(null)
  const [gamification, setGamification] = useState<GamificationData>(initializeGamification())
  const [showBenefitModal, setShowBenefitModal] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    const parsedProfile = JSON.parse(profile)
    setUserProfile(parsedProfile)
    
    // Load gamification data
    const loadGamification = () => {
      const stored = localStorage.getItem('gamificationData')
      let gameData: GamificationData
      
      // If no real data exists, create mock data that's consistent with progress data
      if (!stored) {
        // Calculate mock EXP based on mock progress data
        // This ensures all mock data is interconnected
        const mockInterviewsCompleted = 8
        const mockSkillsCount = 22 // From skillsProgress latest month
        const mockCertifications = 3
        const mockGoalsCompleted = 12
        
        // Calculate total EXP from activities
        const interviewExp = mockInterviewsCompleted * EXP_REWARDS.completeInterview // 8 * 50 = 400
        const skillsExp = mockSkillsCount * EXP_REWARDS.addSkill // 22 * 20 = 440
        const certificationsExp = mockCertifications * EXP_REWARDS.earnCertification // 3 * 100 = 300
        const goalsExp = mockGoalsCompleted * EXP_REWARDS.completeGoal // 12 * 30 = 360
        const riasecTestExp = EXP_REWARDS.completeRiasecTest // 50
        
        const totalMockExp = interviewExp + skillsExp + certificationsExp + goalsExp + riasecTestExp // 1550
        
        // Calculate level based on total EXP
        let mockLevel = 1
        let mockExpNeeded = calculateExpNeeded(1)
        let remainingExp = totalMockExp
        let mockCurrentExp = 0
        
        while (remainingExp >= mockExpNeeded) {
          remainingExp -= mockExpNeeded
          mockLevel += 1
          mockExpNeeded = calculateExpNeeded(mockLevel)
        }
        mockCurrentExp = remainingExp
        
        // Create mock gamification data
        const mockGamificationData: GamificationData = {
          level: mockLevel,
          currentExp: mockCurrentExp,
          expNeeded: mockExpNeeded,
          totalExp: totalMockExp,
          benefitsAvailable: mockCurrentExp >= mockExpNeeded,
          benefitsClaimed: 2, // User has claimed benefits 2 times
          characterEvolution: getCharacterEvolution(mockLevel),
          lastBenefitClaimDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        }
        
        // Save mock data to localStorage
        localStorage.setItem('gamificationData', JSON.stringify(mockGamificationData))
        gameData = mockGamificationData
      } else {
        gameData = JSON.parse(stored)
      }
      
      setGamification(gameData)
    }
    loadGamification()
    
    // Listen for gamification updates
    const handleGamificationUpdate = () => {
      loadGamification()
    }
    
    window.addEventListener('gamificationUpdated', handleGamificationUpdate)
    
    // Generate mock progress data (consistent with gamification mock data)
    const mockData = {
      skillsProgress: [
        { month: 'Jan', skills: 5 },
        { month: 'Feb', skills: 8 },
        { month: 'Mar', skills: 12 },
        { month: 'Apr', skills: 15 },
        { month: 'May', skills: 18 },
        { month: 'Jun', skills: 22 },
      ],
      interviewScore: [
        { month: 'Jan', score: 65 },
        { month: 'Feb', score: 70 },
        { month: 'Mar', score: 75 },
        { month: 'Apr', score: 80 },
        { month: 'May', score: 82 },
        { month: 'Jun', score: 85 },
      ],
      goalsCompleted: 12,
      totalGoals: 20,
      interviewsCompleted: 8,
      jobsApplied: 15,
      certificationsEarned: 3,
      networkConnections: 45,
    }
    setProgressData(mockData)
    
    return () => {
      window.removeEventListener('gamificationUpdated', handleGamificationUpdate)
    }
  }, [router])

  // Calculate EXP percentage (handle division by zero) - same calculation as dashboard
  const expPercentage = gamification && gamification.expNeeded > 0 
    ? (gamification.currentExp / gamification.expNeeded) * 100 
    : 0
  const characterEvolution = gamification ? getCharacterEvolution(gamification.level) : 1
  
  // Generate recent achievements based on actual data (including mock data)
  const recentAchievements = useMemo(() => {
    if (!progressData || !gamification) {
      return [{
        title: 'Loading achievements...',
        date: 'Now',
        icon: Target,
        exp: 0
      }]
    }
    
    const achievements: Array<{ title: string, date: string, icon: any, exp: number }> = []
    
    // Use mock progress data to generate achievements if available
    const mockInterviews = progressData?.interviewsCompleted || 0
    const mockSkills = progressData?.skillsProgress?.[progressData.skillsProgress.length - 1]?.skills || userProfile?.skills?.length || 0
    const mockCertifications = progressData?.certificationsEarned || userProfile?.certificates?.length || 0
    const mockGoals = progressData?.goalsCompleted || 0
    
    // Check if user has completed RIASEC test
    if (userProfile?.riasecType && gamification.totalExp >= EXP_REWARDS.completeRiasecTest) {
      achievements.push({
        title: 'Completed RIASEC Test',
        date: 'Recently',
        icon: CheckCircle,
        exp: EXP_REWARDS.completeRiasecTest
      })
    }
    
    // Check skills (use mock data if available, otherwise use real data)
    const skillsCount = mockSkills > 0 ? mockSkills : (userProfile?.skills?.length || 0)
    if (skillsCount > 0 && gamification.totalExp >= (skillsCount * EXP_REWARDS.addSkill)) {
      achievements.push({
        title: `Added ${skillsCount} ${skillsCount === 1 ? 'Skill' : 'Skills'}`,
        date: 'Recently',
        icon: TrendingUp,
        exp: skillsCount * EXP_REWARDS.addSkill
      })
    }
    
    // Check interviews (use mock data if available)
    if (mockInterviews > 0 && gamification.totalExp >= (mockInterviews * EXP_REWARDS.completeInterview)) {
      achievements.push({
        title: `Finished ${mockInterviews} Practice Interview${mockInterviews > 1 ? 's' : ''}`,
        date: 'Recently',
        icon: Award,
        exp: mockInterviews * EXP_REWARDS.completeInterview
      })
    } else if (gamification.totalExp >= EXP_REWARDS.completeInterview) {
      // Calculate from totalExp if mock data not available
      let remainingExp = gamification.totalExp
      if (userProfile?.riasecType) {
        remainingExp -= EXP_REWARDS.completeRiasecTest
      }
      if (skillsCount > 0) {
        remainingExp -= skillsCount * EXP_REWARDS.addSkill
      }
      const interviewCount = Math.max(1, Math.floor(remainingExp / EXP_REWARDS.completeInterview))
      if (interviewCount > 0) {
        achievements.push({
          title: `Finished ${interviewCount} Practice Interview${interviewCount > 1 ? 's' : ''}`,
          date: 'Recently',
          icon: Award,
          exp: interviewCount * EXP_REWARDS.completeInterview
        })
      }
    }
    
    // Check certifications
    if (mockCertifications > 0 && gamification.totalExp >= (mockCertifications * EXP_REWARDS.earnCertification)) {
      achievements.push({
        title: `Earned ${mockCertifications} Certification${mockCertifications > 1 ? 's' : ''}`,
        date: 'Recently',
        icon: Award,
        exp: mockCertifications * EXP_REWARDS.earnCertification
      })
    } else if (userProfile?.certificates && userProfile.certificates.length > 0) {
      achievements.push({
        title: `Earned ${userProfile.certificates.length} Certification${userProfile.certificates.length > 1 ? 's' : ''}`,
        date: 'Recently',
        icon: Award,
        exp: userProfile.certificates.length * EXP_REWARDS.earnCertification
      })
    }
    
    // Check goals completed
    if (mockGoals > 0 && gamification.totalExp >= (mockGoals * EXP_REWARDS.completeGoal)) {
      achievements.push({
        title: `Completed ${mockGoals} Goal${mockGoals > 1 ? 's' : ''}`,
        date: 'Recently',
        icon: Target,
        exp: mockGoals * EXP_REWARDS.completeGoal
      })
    }
    
    // If no achievements yet, show placeholder
    if (achievements.length === 0) {
      achievements.push({
        title: 'Complete activities to earn achievements!',
        date: 'Now',
        icon: Target,
        exp: 0
      })
    }
    
    // Sort by EXP (highest first) and limit to 4 most recent
    return achievements
      .sort((a, b) => b.exp - a.exp)
      .slice(0, 4)
  }, [progressData, gamification, userProfile])
  
  // Debug: Log gamification data to help troubleshoot (can be removed in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Gamification Data:', gamification)
      console.log('EXP Percentage:', expPercentage)
      console.log('Current EXP:', gamification.currentExp)
      console.log('EXP Needed:', gamification.expNeeded)
      console.log('Total EXP:', gamification.totalExp)
      console.log('User Profile:', userProfile)
      console.log('Progress Data:', progressData)
    }
  }, [gamification, expPercentage, userProfile, progressData])

  // Claim benefit function
  const claimBenefit = (benefitId: number) => {
    const newGamification = {
      ...gamification,
      currentExp: 0,
      expNeeded: calculateExpNeeded(gamification.level),
      benefitsAvailable: false,
      benefitsClaimed: gamification.benefitsClaimed + 1,
      lastBenefitClaimDate: new Date().toISOString(),
    }
    setGamification(newGamification)
    saveGamification(newGamification)
    setShowBenefitModal(false)
    
    // Show success notification (you can enhance this with a toast library)
    alert('Benefit claimed successfully! Your EXP has been reset and you can start earning again.')
  }

  // Simulate EXP gain (this would be called when user completes activities)
  const simulateExpGain = () => {
    const expGained = EXP_REWARDS.completeInterview
    let newExp = gamification.currentExp + expGained
    let newLevel = gamification.level
    let newExpNeeded = gamification.expNeeded
    let benefitsAvailable = false

    // Check if level up
    while (newExp >= newExpNeeded) {
      newExp -= newExpNeeded
      newLevel += 1
      newExpNeeded = calculateExpNeeded(newLevel)
      benefitsAvailable = true // Benefits available when EXP circle is full
    }

    const updatedGamification = {
      ...gamification,
      level: newLevel,
      currentExp: newExp,
      expNeeded: newExpNeeded,
      totalExp: gamification.totalExp + expGained,
      benefitsAvailable: benefitsAvailable || gamification.benefitsAvailable,
      characterEvolution: getCharacterEvolution(newLevel),
    }

    setGamification(updatedGamification)
    saveGamification(updatedGamification)
  }

  if (!userProfile || !progressData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const userRiasecType = userProfile.riasecType || 'S'
  const riasecInfo = RIASEC_INFO[userRiasecType] || RIASEC_INFO['S']

  const stats = [
    {
      title: 'Goals Completed',
      value: `${progressData.goalsCompleted}/${progressData.totalGoals}`,
      percentage: (progressData.goalsCompleted / progressData.totalGoals) * 100,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Interviews Completed',
      value: progressData.interviewsCompleted.toString(),
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Jobs Applied',
      value: progressData.jobsApplied.toString(),
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Certifications',
      value: progressData.certificationsEarned.toString(),
      icon: CheckCircle,
      color: 'orange'
    }
  ]


  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor your career development journey and level up your character</p>
        </div>

        {/* Gamification Section - Character & EXP */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-100 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Career Character</h2>
                <p className="text-sm text-gray-600">Level up by completing activities and earn rewards!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Character Display */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200/50 shadow-lg">
                <div className="text-center mb-4">
                  <div className="inline-block relative">
                    <div className={`w-32 h-32 sm:w-40 sm:h-40 ${riasecInfo.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white relative overflow-hidden`}>
                      <img 
                        src="/assets/R2.png" 
                        alt={`${riasecInfo.name} Character`}
                        className="w-full h-full object-contain"
                      />
                      {/* Evolution Badge */}
                      <div className="absolute top-2 right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1.5 shadow-lg">
                        <Star className="w-4 h-4 text-white" fill="white" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                      Level {gamification?.level || 1}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{riasecInfo.name} Character</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < characterEvolution
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Evolution Stage {characterEvolution}/5
                    </p>
                  </div>
                </div>

                {/* Character Stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{gamification?.totalExp || 0}</div>
                    <div className="text-xs text-gray-600">Total EXP</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{gamification?.benefitsClaimed || 0}</div>
                    <div className="text-xs text-gray-600">Benefits Claimed</div>
                  </div>
                </div>
              </div>

              {/* EXP Progress Circle */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200/50 shadow-lg">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">Progress Level {gamification?.level || 1}</h3>
                  </div>
                  <CircularProgress percentage={expPercentage} size={140} strokeWidth={10} />
                  <div className="mt-6 text-center w-full">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-xs text-blue-700 font-bold">
                        {gamification?.currentExp || 0}/{gamification?.expNeeded || 100} EXP
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(expPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      {gamification?.totalExp || 0} total EXP earned
                    </p>
                    
                    {/* Benefits Available Badge */}
                    {gamification?.benefitsAvailable && (
                      <button
                        onClick={() => setShowBenefitModal(true)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl py-3 px-4 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse"
                      >
                        <Gift className="w-5 h-5" />
                        Claim Your Reward!
                      </button>
                    )}

                    {/* EXP Info */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-700 text-center">
                        Complete activities to earn EXP and unlock rewards!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXP Earning Guide */}
            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                How to Earn EXP
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{EXP_REWARDS.completeInterview}</div>
                  <div className="text-xs text-gray-600">Interview</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{EXP_REWARDS.addSkill}</div>
                  <div className="text-xs text-gray-600">Add Skill</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{EXP_REWARDS.completeGoal}</div>
                  <div className="text-xs text-gray-600">Complete Goal</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{EXP_REWARDS.earnCertification}</div>
                  <div className="text-xs text-gray-600">Certification</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600',
            }
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2">{stat.title}</div>
                {stat.percentage !== undefined && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[0]}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Skills Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData.skillsProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="skills" stroke="#3b82f6" strokeWidth={2} name="Skills" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Interview Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData.interviewScore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8b5cf6" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            Recent Achievements
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {recentAchievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{achievement.title}</div>
                    <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {achievement.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Coins className="w-4 h-4" />
                    <span className="text-sm font-bold">+{achievement.exp}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Keep Going! 🚀</h2>
          <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base md:text-lg">
            You're making great progress on your career journey. Continue building skills, practicing interviews, 
            and networking to reach your goals and level up your character!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">{progressData.networkConnections}</div>
              <div className="text-xs sm:text-sm opacity-90">Network Connections</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">{progressData.skillsProgress[progressData.skillsProgress.length - 1].skills}</div>
              <div className="text-xs sm:text-sm opacity-90">Total Skills</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">{Math.round((progressData.goalsCompleted / progressData.totalGoals) * 100)}%</div>
              <div className="text-xs sm:text-sm opacity-90">Goals Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Modal */}
      {showBenefitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-yellow-500" />
                  Claim Your Reward!
                </h2>
                <button
                  onClick={() => setShowBenefitModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Congratulations! You've filled your EXP circle. Choose one of these amazing benefits:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AVAILABLE_BENEFITS.map((benefit) => {
                  const Icon = benefit.icon
                  const colorClasses: Record<string, { bg: string, text: string }> = {
                    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
                    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
                    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
                    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
                    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
                  }
                  const colors = colorClasses[benefit.color] || colorClasses.blue
                  return (
                    <button
                      key={benefit.id}
                      onClick={() => claimBenefit(benefit.id)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                    >
                      <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> After claiming a benefit, your EXP will reset to 0 and you can start earning again to unlock more rewards!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
