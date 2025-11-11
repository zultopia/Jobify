'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Target, Award, Calendar, CheckCircle, Sparkles, Gift, Zap, Star, Trophy, Crown, Gem, Coins, Building2, MapPin, Users, Linkedin, GraduationCap, Briefcase, BookOpen, CheckCircle2, FileCheck, MessageCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EXP_REWARDS, calculateExpNeeded, getCharacterEvolution, GamificationData, saveGamification, initializeGamification } from '@/app/utils/gamification'
import { getSelectedJob, getPeopleAtCompany, JobRecommendation, PersonProfile, calculateCareerPathProgress } from '@/app/utils/jobRecommendations'

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
  { id: 1, title: 'Premium Discount 20%', description: 'Get 20% off on premium features', icon: Gift, color: 'blue' }, // Discount = gift
  { id: 2, title: 'Free Coaching Session', description: '1 free career coaching session', icon: Users, color: 'purple' }, // Coaching = people/mentor
  { id: 3, title: 'Priority Support', description: 'Get priority customer support', icon: Zap, color: 'yellow' }, // Priority = fast/lightning
  { id: 4, title: 'Exclusive Badge', description: 'Unlock exclusive achievement badge', icon: Trophy, color: 'orange' }, // Badge = trophy
  { id: 5, title: 'Premium Features Access', description: '7 days free premium access', icon: Crown, color: 'pink' }, // Premium = crown
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
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)
  const [peopleAtCompany, setPeopleAtCompany] = useState<PersonProfile[]>([])

  // Generate job-specific progress data based on selected job and career path
  const generateJobSpecificProgress = (job: JobRecommendation | null, userProfile: any): any => {
    if (!job) {
      // Generic progress if no job selected
      return {
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
    }
    
    // Get required skills for the job
    const requiredSkills = job.skills || []
    const userSkills = userProfile?.skills || []
    
    // Calculate progress based on career path steps using utility function
    const careerPathProgress = calculateCareerPathProgress(job, userProfile)
    const completedSteps = careerPathProgress.completedSteps
    const careerPath = job.careerPath || []
    
    // Calculate relevant skills progress (skills that match job requirements)
    const relevantSkillsCount = userSkills.filter((skill: string) => 
      requiredSkills.some(required => required.toLowerCase().includes(skill.toLowerCase()) || 
                                     skill.toLowerCase().includes(required.toLowerCase()))
    ).length
    
    // Calculate progress metrics based on job requirements
    const totalRequiredSkills = requiredSkills.length
    const skillsProgressPercentage = totalRequiredSkills > 0 
      ? Math.min(100, Math.round((relevantSkillsCount / totalRequiredSkills) * 100))
      : 0
    
    // Generate progress over time (simulated based on career path progress)
    // For demo: Show gradual progress that reflects 60% completion (3 out of 5 steps)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const skillsProgress = months.map((month, index) => {
      // Simulate gradual skill acquisition - cap at 60% of required skills for demo
      const maxSkillsForDemo = Math.floor(totalRequiredSkills * 0.6) // 60% of required skills
      const baseSkills = Math.max(1, Math.floor(maxSkillsForDemo * (index + 1) / months.length))
      return { month, skills: Math.min(baseSkills + Math.floor(Math.random() * 2), maxSkillsForDemo) }
    })
    
    // Interview scores improving over time (practice makes perfect)
    // For demo: Cap at around 75-80% to show progress but not perfection
    const interviewScore = months.map((month, index) => {
      const baseScore = 60 + (completedSteps * 4) + (index * 2) // Slower improvement for demo
      return { month, score: Math.min(80, baseScore + Math.floor(Math.random() * 3)) } // Max 80% for demo
    })
    
    // Goals completed based on career path steps
    // For demo: Show 60% completion (3 out of 5 steps)
    const totalGoals = careerPath.length * 4 // 4 goals per step
    const goalsCompleted = Math.floor(totalGoals * (completedSteps / careerPath.length))
    
    // Certifications relevant to job
    // For demo: Show 2-3 certifications (realistic for 60% progress)
    const relevantCertifications = Math.min(completedSteps, 2) // 2 certifications for demo
    
    // Interviews completed (practice for job interviews)
    // For demo: Show moderate number of interviews (6-8 interviews)
    const interviewsCompleted = completedSteps * 2 + 2 // 6-8 interviews for demo
    
    // Network connections at target company
    // For demo: Show moderate network building (20-30 connections)
    const networkConnections = Math.floor(completedSteps * 7) + 12 // 20-30 connections for demo
    
    return {
      skillsProgress,
      interviewScore,
      goalsCompleted,
      totalGoals,
      interviewsCompleted,
      jobsApplied: Math.floor(completedSteps * 3) + 5, // Applications sent
      certificationsEarned: relevantCertifications,
      networkConnections,
      jobSpecificMetrics: {
        requiredSkillsProgress: skillsProgressPercentage,
        careerPathStepsCompleted: completedSteps,
        totalCareerPathSteps: careerPath.length,
        relevantSkillsAcquired: relevantSkillsCount,
        totalRequiredSkills: totalRequiredSkills,
      }
    }
  }

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    const parsedProfile = JSON.parse(profile)
    setUserProfile(parsedProfile)
    
    // Load selected job
    const savedJob = getSelectedJob()
    if (savedJob) {
      setSelectedJob(savedJob)
      // Load people at company
      const people = getPeopleAtCompany(savedJob.company.id, savedJob.title)
      setPeopleAtCompany(people)
    }
    
    // Load gamification data
    const loadGamification = () => {
      const stored = localStorage.getItem('gamificationData')
      let gameData: GamificationData
      
      // Generate job-specific progress data first
      const jobProgressData = generateJobSpecificProgress(savedJob, parsedProfile)
      
      // If no real data exists, create mock data based on job progress
      if (!stored) {
        // Calculate mock EXP based on job-specific progress data
        const mockInterviewsCompleted = jobProgressData.interviewsCompleted || 8
        const mockSkillsCount = jobProgressData.jobSpecificMetrics?.relevantSkillsAcquired || 
                               jobProgressData.skillsProgress?.[jobProgressData.skillsProgress.length - 1]?.skills || 
                               parsedProfile?.skills?.length || 0
        const mockCertifications = jobProgressData.certificationsEarned || 0
        const mockGoalsCompleted = jobProgressData.goalsCompleted || 0
        
        // Calculate total EXP from activities (interconnected with progress data)
        const interviewExp = mockInterviewsCompleted * EXP_REWARDS.completeInterview
        const skillsExp = mockSkillsCount * EXP_REWARDS.addSkill
        const certificationsExp = mockCertifications * EXP_REWARDS.earnCertification
        const goalsExp = mockGoalsCompleted * EXP_REWARDS.completeGoal
        const riasecTestExp = EXP_REWARDS.completeRiasecTest
        
        const totalMockExp = interviewExp + skillsExp + certificationsExp + goalsExp + riasecTestExp
        
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
        
        // Create mock gamification data (interconnected with progress)
        const mockGamificationData: GamificationData = {
          level: mockLevel,
          currentExp: mockCurrentExp,
          expNeeded: mockExpNeeded,
          totalExp: totalMockExp,
          benefitsAvailable: mockCurrentExp >= mockExpNeeded,
          benefitsClaimed: Math.floor(mockLevel / 5), // Claim benefits every 5 levels
          characterEvolution: getCharacterEvolution(mockLevel),
          lastBenefitClaimDate: mockLevel > 5 ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        }
        
        // Save mock data to localStorage
        localStorage.setItem('gamificationData', JSON.stringify(mockGamificationData))
        gameData = mockGamificationData
      } else {
        gameData = JSON.parse(stored)
      }
      
      setGamification(gameData)
      setProgressData(jobProgressData)
    }
    loadGamification()
    
    // Listen for gamification updates
    const handleGamificationUpdate = () => {
      loadGamification()
    }
    
    window.addEventListener('gamificationUpdated', handleGamificationUpdate)
    
    return () => {
      window.removeEventListener('gamificationUpdated', handleGamificationUpdate)
    }
  }, [router])

  // Calculate career path progress if job is selected
  const careerPathProgress = selectedJob 
    ? calculateCareerPathProgress(selectedJob, userProfile)
    : null
  
  // Use career path progress percentage if available, otherwise use EXP percentage
  const progressPercentage = careerPathProgress 
    ? careerPathProgress.progressPercentage
    : (gamification && gamification.expNeeded > 0 
      ? (gamification.currentExp / gamification.expNeeded) * 100 
      : 0)
  
  // For "Your Career Character" card, use career path progress if available
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
  
  const characterEvolution = gamification ? getCharacterEvolution(gamification.level) : 1
  
  // Generate job-specific achievements based on selected job and progress
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
    
    // Job-specific metrics
    const jobMetrics = progressData?.jobSpecificMetrics
    const mockInterviews = progressData?.interviewsCompleted || 0
    const mockSkills = jobMetrics?.relevantSkillsAcquired || progressData?.skillsProgress?.[progressData.skillsProgress.length - 1]?.skills || userProfile?.skills?.length || 0
    const mockCertifications = progressData?.certificationsEarned || 0
    const mockGoals = progressData?.goalsCompleted || 0
    const careerPathSteps = jobMetrics?.careerPathStepsCompleted || 0
    
    // Job-specific achievements
    if (selectedJob) {
      // Career path progress
      if (careerPathSteps > 0) {
        achievements.push({
          title: `Completed ${careerPathSteps} Career Path Step${careerPathSteps > 1 ? 's' : ''} for ${selectedJob.title}`,
          date: 'Recently',
          icon: TrendingUp,
          exp: careerPathSteps * 40
        })
      }
      
      // Relevant skills acquired
      if (jobMetrics?.relevantSkillsAcquired > 0) {
        const skillsProgress = jobMetrics.requiredSkillsProgress || 0
        achievements.push({
          title: `Acquired ${jobMetrics.relevantSkillsAcquired}/${jobMetrics.totalRequiredSkills} Required Skills (${skillsProgress}%)`,
          date: 'Recently',
          icon: GraduationCap, // Skills = learning/education
          exp: jobMetrics.relevantSkillsAcquired * EXP_REWARDS.addSkill
        })
      }
      
      // Job-specific interview practice
      if (mockInterviews > 0) {
        achievements.push({
          title: `Completed ${mockInterviews} Interview${mockInterviews > 1 ? 's' : ''} for ${selectedJob.title}`,
          date: 'Recently',
          icon: MessageCircle, // Interview = communication
          exp: mockInterviews * EXP_REWARDS.completeInterview
        })
      }
      
      // Relevant certifications
      if (mockCertifications > 0) {
        achievements.push({
          title: `Earned ${mockCertifications} Certification${mockCertifications > 1 ? 's' : ''} for ${selectedJob.title}`,
          date: 'Recently',
          icon: Award, // Certifications = achievements
          exp: mockCertifications * EXP_REWARDS.earnCertification
        })
      }
    } else {
      // Generic achievements if no job selected
      if (userProfile?.riasecType && gamification.totalExp >= EXP_REWARDS.completeRiasecTest) {
        achievements.push({
          title: 'Completed RIASEC Test',
          date: 'Recently',
          icon: CheckCircle, // Test completion = checkmark
          exp: EXP_REWARDS.completeRiasecTest
        })
      }
      
      if (mockSkills > 0) {
        achievements.push({
          title: `Added ${mockSkills} ${mockSkills === 1 ? 'Skill' : 'Skills'}`,
          date: 'Recently',
          icon: GraduationCap, // Skills = learning/education
          exp: mockSkills * EXP_REWARDS.addSkill
        })
      }
      
      if (mockInterviews > 0) {
        achievements.push({
          title: `Finished ${mockInterviews} Practice Interview${mockInterviews > 1 ? 's' : ''}`,
          date: 'Recently',
          icon: MessageCircle, // Interview = communication
          exp: mockInterviews * EXP_REWARDS.completeInterview
        })
      }
      
      if (mockCertifications > 0) {
        achievements.push({
          title: `Earned ${mockCertifications} Certification${mockCertifications > 1 ? 's' : ''}`,
          date: 'Recently',
          icon: Award, // Certifications = achievements
          exp: mockCertifications * EXP_REWARDS.earnCertification
        })
      }
    }
    
    // Career path goals
    if (mockGoals > 0) {
      achievements.push({
        title: `Completed ${mockGoals} Career Goal${mockGoals > 1 ? 's' : ''}${selectedJob ? ` for ${selectedJob.title}` : ''}`,
        date: 'Recently',
        icon: Target,
        exp: mockGoals * EXP_REWARDS.completeGoal
      })
    }
    
    // If no achievements yet, show placeholder
    if (achievements.length === 0) {
      achievements.push({
        title: selectedJob 
          ? `Start working on skills for ${selectedJob.title} to earn achievements!`
          : 'Complete activities to earn achievements!',
        date: 'Now',
        icon: Target,
        exp: 0
      })
    }
    
    // Sort by EXP (highest first) and limit to 4 most recent
    return achievements
      .sort((a, b) => b.exp - a.exp)
      .slice(0, 4)
  }, [progressData, gamification, userProfile, selectedJob])
  
  // Debug: Log gamification data to help troubleshoot (can be removed in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Gamification Data:', gamification)
      console.log('Progress Percentage:', progressPercentage)
      console.log('Career Path Progress:', careerPathProgress)
      console.log('Current EXP:', gamification.currentExp)
      console.log('EXP Needed:', gamification.expNeeded)
      console.log('Total EXP:', gamification.totalExp)
      console.log('User Profile:', userProfile)
      console.log('Progress Data:', progressData)
    }
  }, [gamification, progressPercentage, careerPathProgress, userProfile, progressData])

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

  // Job-specific stats based on selected job
  const stats = selectedJob && progressData?.jobSpecificMetrics ? [
    {
      title: 'Career Path Progress',
      value: `${progressData.jobSpecificMetrics.careerPathStepsCompleted}/${progressData.jobSpecificMetrics.totalCareerPathSteps} Steps`,
      percentage: (progressData.jobSpecificMetrics.careerPathStepsCompleted / progressData.jobSpecificMetrics.totalCareerPathSteps) * 100,
      icon: TrendingUp, // Career path = progress/growth
      color: 'blue'
    },
    {
      title: 'Required Skills',
      value: `${progressData.jobSpecificMetrics.relevantSkillsAcquired}/${progressData.jobSpecificMetrics.totalRequiredSkills}`,
      percentage: progressData.jobSpecificMetrics.requiredSkillsProgress || 0,
      icon: GraduationCap, // Skills = learning/education
      color: 'purple'
    },
    {
      title: 'Interviews Completed',
      value: progressData.interviewsCompleted.toString(),
      icon: MessageCircle, // Interview = communication/conversation
      color: 'green'
    },
    {
      title: 'Certifications',
      value: progressData.certificationsEarned.toString(),
      icon: Award, // Certifications = achievements/awards
      color: 'orange'
    }
  ] : [
    {
      title: 'Goals Completed',
      value: `${progressData.goalsCompleted}/${progressData.totalGoals}`,
      percentage: (progressData.goalsCompleted / progressData.totalGoals) * 100,
      icon: Target, // Goals = targets
      color: 'blue'
    },
    {
      title: 'Interviews Completed',
      value: progressData.interviewsCompleted.toString(),
      icon: MessageCircle, // Interview = communication
      color: 'purple'
    },
    {
      title: 'Jobs Applied',
      value: progressData.jobsApplied.toString(),
      icon: Briefcase, // Jobs = briefcase/work
      color: 'green'
    },
    {
      title: 'Certifications',
      value: progressData.certificationsEarned.toString(),
      icon: Award, // Certifications = achievements
      color: 'orange'
    }
  ]


  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-sm sm:text-base text-gray-600">
            {selectedJob 
              ? `Tracking your journey to ${selectedJob.title} at ${selectedJob.company.name}`
              : 'Monitor your career development journey and level up your character'}
          </p>
        </div>

        {/* Selected Job Information */}
        {selectedJob && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {selectedJob.company.name} • <MapPin className="w-4 h-4" /> {selectedJob.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {selectedJob.matchScore}% Match
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Salary Range</div>
                <p className="font-semibold text-gray-900">
                  ${selectedJob.salaryRange.min.toLocaleString()} - ${selectedJob.salaryRange.max.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Experience Level</div>
                <p className="font-semibold text-gray-900">{selectedJob.experienceLevel}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Job Type</div>
                <p className="font-semibold text-gray-900">{selectedJob.type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Career Path Progress Section */}
        {selectedJob && selectedJob.careerPath && selectedJob.careerPath.length > 0 && progressData?.jobSpecificMetrics && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Career Path Progress</h2>
                  <p className="text-sm text-gray-600">
                    {progressData.jobSpecificMetrics.careerPathStepsCompleted} of {progressData.jobSpecificMetrics.totalCareerPathSteps} steps completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((progressData.jobSpecificMetrics.careerPathStepsCompleted / progressData.jobSpecificMetrics.totalCareerPathSteps) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <div className="space-y-4">
              {selectedJob.careerPath.map((step, index) => {
                const isCompleted = index < progressData.jobSpecificMetrics.careerPathStepsCompleted
                const isCurrent = index === progressData.jobSpecificMetrics.careerPathStepsCompleted
                
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : step.step}
                      </div>
                      {index < selectedJob.careerPath!.length - 1 && (
                        <div className={`w-0.5 h-12 mx-auto ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-bold ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                          {step.title}
                        </h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.slice(0, 3).map((skill, skillIdx) => (
                          <span key={skillIdx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* People at Company Section */}
        {selectedJob && peopleAtCompany.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">People at {selectedJob.company.name}</h2>
                <p className="text-sm text-gray-600">Learn from professionals who work as {selectedJob.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {peopleAtCompany.map((person) => (
                <div
                  key={person.id}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.role}</p>
                      <p className="text-xs text-gray-500">{person.experience}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-xs text-gray-600">{person.education}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-xs text-gray-600">{person.achievement}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {person.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {person.linkedinUrl && (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Linkedin className="w-3 h-3" />
                      View LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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

              {/* Progress Circle - Career Path or EXP */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200/50 shadow-lg">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">
                      {careerPathProgress 
                        ? 'Career Path Progress'
                        : `Progress Level ${gamification?.level || 1}`
                      }
                    </h3>
                  </div>
                  <CircularProgress percentage={displayProgress.percentage} size={140} strokeWidth={10} />
                  <div className="mt-6 text-center w-full">
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-xs text-blue-700 font-bold">
                        {displayProgress.current}/{displayProgress.total} {careerPathProgress ? 'Steps' : 'EXP'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(displayProgress.percentage, 100)}%` }}
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
                  <MessageCircle className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-lg font-bold text-blue-600">{EXP_REWARDS.completeInterview}</div>
                  <div className="text-xs text-gray-600">Interview</div>
                </div>
                <div className="text-center">
                  <GraduationCap className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-lg font-bold text-green-600">{EXP_REWARDS.addSkill}</div>
                  <div className="text-xs text-gray-600">Add Skill</div>
                </div>
                <div className="text-center">
                  <Target className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <div className="text-lg font-bold text-purple-600">{EXP_REWARDS.completeGoal}</div>
                  <div className="text-xs text-gray-600">Complete Goal</div>
                </div>
                <div className="text-center">
                  <Award className="w-5 h-5 mx-auto mb-1 text-orange-600" />
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
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {selectedJob 
                ? `Required Skills Progress for ${selectedJob.title}`
                : 'Skills Growth'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData.skillsProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  label={selectedJob 
                    ? { value: 'Relevant Skills', angle: -90, position: 'insideLeft' }
                    : { value: 'Skills', angle: -90, position: 'insideLeft' }
                  }
                />
                <Tooltip 
                  formatter={(value: any) => [
                    selectedJob 
                      ? `${value} relevant skills`
                      : `${value} skills`,
                    selectedJob ? 'Relevant Skills' : 'Skills'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="skills" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name={selectedJob ? 'Relevant Skills' : 'Skills'} 
                />
              </LineChart>
            </ResponsiveContainer>
            {selectedJob && progressData?.jobSpecificMetrics && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Progress:</strong> {progressData.jobSpecificMetrics.relevantSkillsAcquired} of {progressData.jobSpecificMetrics.totalRequiredSkills} required skills ({progressData.jobSpecificMetrics.requiredSkillsProgress}%)
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {selectedJob 
                ? `Interview Performance for ${selectedJob.title}`
                : 'Interview Performance'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData.interviewScore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Interview Score']}
                />
                <Legend />
                <Bar 
                  dataKey="score" 
                  fill="#8b5cf6" 
                  name="Interview Score" 
                />
              </BarChart>
            </ResponsiveContainer>
            {selectedJob && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Practice interviews tailored for <strong>{selectedJob.title}</strong> at <strong>{selectedJob.company.name}</strong>
                </p>
              </div>
            )}
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
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {selectedJob && progressData?.jobSpecificMetrics
                  ? `${progressData.jobSpecificMetrics.relevantSkillsAcquired}/${progressData.jobSpecificMetrics.totalRequiredSkills}`
                  : progressData.skillsProgress[progressData.skillsProgress.length - 1].skills
                }
              </div>
              <div className="text-xs sm:text-sm opacity-90">
                {selectedJob ? 'Required Skills' : 'Total Skills'}
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {selectedJob && progressData?.jobSpecificMetrics
                  ? `${Math.round((progressData.jobSpecificMetrics.careerPathStepsCompleted / progressData.jobSpecificMetrics.totalCareerPathSteps) * 100)}%`
                  : `${Math.round((progressData.goalsCompleted / progressData.totalGoals) * 100)}%`
                }
              </div>
              <div className="text-xs sm:text-sm opacity-90">
                {selectedJob ? 'Career Path Progress' : 'Goals Progress'}
              </div>
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
