'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, User, Award, TrendingUp, RefreshCw, Edit, CheckCircle, ArrowRight, Lightbulb, Target } from 'lucide-react'

const RIASEC_INFO: Record<string, any> = {
  'R': {
    name: 'Realistic',
    description: 'Hands-on, practical, and enjoys working with tools',
    traits: ['Practical', 'Mechanical', 'Outdoor-oriented', 'Tool-focused'],
    suitableJobs: ['Mechanical Engineer', 'Civil Engineer', 'Electrician', 'Architect', 'Construction Manager'],
    color: 'blue'
  },
  'I': {
    name: 'Investigative',
    description: 'Analytical, curious, and enjoys research',
    traits: ['Analytical', 'Scientific', 'Intellectual', 'Research-oriented'],
    suitableJobs: ['Data Scientist', 'Research Scientist', 'Software Engineer', 'Biologist', 'Physicist'],
    color: 'purple'
  },
  'A': {
    name: 'Artistic',
    description: 'Creative, expressive, and enjoys artistic activities',
    traits: ['Creative', 'Expressive', 'Innovative', 'Artistic'],
    suitableJobs: ['UI/UX Designer', 'Graphic Designer', 'Writer', 'Musician', 'Architect'],
    color: 'pink'
  },
  'S': {
    name: 'Social',
    description: 'Helpful, friendly, and enjoys working with people',
    traits: ['Helpful', 'Friendly', 'Empathetic', 'People-oriented'],
    suitableJobs: ['Teacher', 'Counselor', 'Social Worker', 'Nurse', 'HR Manager'],
    color: 'green'
  },
  'E': {
    name: 'Enterprising',
    description: 'Ambitious, persuasive, and enjoys leadership',
    traits: ['Ambitious', 'Persuasive', 'Leadership', 'Business-oriented'],
    suitableJobs: ['Product Manager', 'Sales Manager', 'Business Analyst', 'Entrepreneur', 'Marketing Manager'],
    color: 'orange'
  },
  'C': {
    name: 'Conventional',
    description: 'Organized, detail-oriented, and enjoys structured work',
    traits: ['Organized', 'Detail-oriented', 'Structured', 'Systematic'],
    suitableJobs: ['Accountant', 'Data Analyst', 'Administrative Assistant', 'Financial Analyst', 'Project Manager'],
    color: 'yellow'
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [riasecInfo, setRiasecInfo] = useState<any>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    const parsed = JSON.parse(profile)
    setUserProfile(parsed)
    
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

  const handleRetakeTest = () => {
    router.push('/onboarding')
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

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    pink: 'bg-pink-100 text-pink-600 border-pink-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome back, {userProfile.name || 'User'}! Here's your personalized career insights.</p>
        </div>

        {/* RIASEC Type Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 ${colorClasses[riasecInfo.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center border-2 flex-shrink-0`}>
                <span className="text-2xl sm:text-3xl font-bold">{userProfile.riasecType}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{riasecInfo.name} Type</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-4">{riasecInfo.description}</p>
                <div className="flex flex-wrap gap-2">
                  {riasecInfo.traits.map((trait: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleRetakeTest}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="whitespace-nowrap">Retake Test</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <button
            onClick={handleUpdateSkills}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 transition" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Update Skills</h3>
            <p className="text-sm sm:text-base text-gray-600">Add or modify your skills to get better job recommendations</p>
          </button>

          <button
            onClick={handleUpdateInterest}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-purple-600 transition" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Update Interests</h3>
            <p className="text-sm sm:text-base text-gray-600">Update your job interests to discover more opportunities</p>
          </button>
        </div>

        {/* Job Matching Information */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Job Matching Insights</h2>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Based on your <span className="font-semibold text-blue-600">{riasecInfo.name}</span> personality type, 
              you're best suited for roles that involve {riasecInfo.description.toLowerCase()}. 
              These types of positions allow you to leverage your natural strengths and work in an environment that matches your personality.
            </p>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Why This Matters</h3>
              <p className="text-xs sm:text-sm text-gray-700">
                Research shows that people who work in jobs that match their personality type are more satisfied, 
                perform better, and are more likely to stay in their roles long-term. Your {riasecInfo.name} type 
                indicates you thrive in environments that align with your natural preferences.
              </p>
            </div>
          </div>

          {/* Recommended Jobs */}
          {recommendedJobs.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Top Job Matches for You</h3>
              <div className="space-y-3 sm:space-y-4">
                {recommendedJobs.map((job, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{job.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{job.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <div className="text-base sm:text-lg font-bold text-blue-600">{job.matchScore}%</div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                      <Link
                        href="/dashboard/jobs"
                        className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
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

        {/* Suitable Jobs List */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Suitable Job Categories for {riasecInfo.name} Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {riasecInfo.suitableJobs.map((job: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{job}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:mt-6">
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base w-full sm:w-auto"
            >
              Explore All Job Recommendations
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{recommendedJobs.length}</div>
            <div className="text-xs sm:text-sm opacity-90">Job Matches</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{userProfile.skills?.length || 0}</div>
            <div className="text-xs sm:text-sm opacity-90">Skills Added</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{userProfile.jobInterests?.length || 0}</div>
            <div className="text-xs sm:text-sm opacity-90">Job Interests</div>
          </div>
        </div>
      </div>
    </div>
  )
}
