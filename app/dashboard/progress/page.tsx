'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Target, Award, Calendar, CheckCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ProgressPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [progressData, setProgressData] = useState<any>(null)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    setUserProfile(JSON.parse(profile))
    
    // Generate mock progress data
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
  }, [router])

  if (!userProfile || !progressData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

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

  const recentAchievements = [
    { title: 'Completed RIASEC Test', date: '2 days ago', icon: CheckCircle },
    { title: 'Finished Practice Interview', date: '1 week ago', icon: Award },
    { title: 'Added 5 New Skills', date: '2 weeks ago', icon: TrendingUp },
    { title: 'Connected with 10 Professionals', date: '3 weeks ago', icon: Target },
  ]

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your career development journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600',
            }
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
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

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
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
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Recent Achievements
          </h3>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{achievement.title}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {achievement.date}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Keep Going! 🚀</h2>
          <p className="mb-6 opacity-90 text-lg">
            You're making great progress on your career journey. Continue building skills, practicing interviews, 
            and networking to reach your goals.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">{progressData.networkConnections}</div>
              <div className="text-sm opacity-90">Network Connections</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">{progressData.skillsProgress[progressData.skillsProgress.length - 1].skills}</div>
              <div className="text-sm opacity-90">Total Skills</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">{Math.round((progressData.goalsCompleted / progressData.totalGoals) * 100)}%</div>
              <div className="text-sm opacity-90">Goals Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

