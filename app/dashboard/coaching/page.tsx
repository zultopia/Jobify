'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lightbulb, Target, TrendingUp, BookOpen, MessageCircle } from 'lucide-react'

export default function CoachingPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [advice, setAdvice] = useState<any>(null)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    setUserProfile(JSON.parse(profile))
    generateAdvice(JSON.parse(profile))
  }, [router])

  const generateAdvice = (profile: any) => {
    // Simulate AI-generated advice based on profile
    const riasecAdvice: Record<string, any> = {
      'R': {
        path: 'Technical/Hands-on Career Path',
        steps: [
          'Focus on building practical skills through hands-on projects',
          'Consider obtaining relevant certifications (e.g., AWS, Cisco)',
          'Build a portfolio showcasing your technical projects',
          'Network with professionals in engineering and technical fields',
          'Apply for internships or entry-level technical positions',
        ],
        advice: 'Your practical and hands-on nature makes you well-suited for technical roles. Focus on building tangible skills and creating a portfolio that demonstrates your abilities.'
      },
      'I': {
        path: 'Research/Analytical Career Path',
        steps: [
          'Pursue advanced education or certifications in your field',
          'Engage in research projects or publications',
          'Develop strong analytical and problem-solving skills',
          'Join professional research organizations',
          'Seek opportunities in research institutions or R&D departments',
        ],
        advice: 'Your investigative nature suggests you thrive in research and analytical roles. Consider roles that allow you to explore, analyze, and discover new insights.'
      },
      'A': {
        path: 'Creative/Design Career Path',
        steps: [
          'Build a strong creative portfolio',
          'Learn industry-standard design tools (Figma, Adobe Creative Suite)',
          'Participate in design challenges and competitions',
          'Network with creative professionals',
          'Consider freelance work to build experience',
        ],
        advice: 'Your artistic and creative personality is perfect for design roles. Focus on building a diverse portfolio that showcases your unique creative vision.'
      },
      'S': {
        path: 'Helping/Service Career Path',
        steps: [
          'Develop strong communication and empathy skills',
          'Volunteer in roles that help others',
          'Consider certifications in counseling, teaching, or healthcare',
          'Build experience through internships or volunteer work',
          'Network with professionals in helping professions',
        ],
        advice: 'Your social and helping nature makes you ideal for service-oriented roles. Focus on roles where you can make a positive impact on others\' lives.'
      },
      'E': {
        path: 'Business/Entrepreneurial Career Path',
        steps: [
          'Develop leadership and communication skills',
          'Build a professional network through networking events',
          'Consider business certifications or MBA',
          'Gain experience in sales, marketing, or management',
          'Start building your personal brand',
        ],
        advice: 'Your enterprising nature suggests you excel in business and leadership roles. Focus on building your network and developing strong business acumen.'
      },
      'C': {
        path: 'Organized/Administrative Career Path',
        steps: [
          'Develop strong organizational and detail-oriented skills',
          'Learn relevant software (Excel, project management tools)',
          'Consider certifications in accounting, project management, or administration',
          'Build experience in administrative or support roles',
          'Focus on efficiency and process improvement',
        ],
        advice: 'Your conventional and organized nature makes you well-suited for administrative and structured roles. Focus on roles that value precision and organization.'
      }
    }

    const profileAdvice = riasecAdvice[profile.riasecType] || riasecAdvice['S']
    setAdvice(profileAdvice)
    setSelectedPath(profileAdvice.path)
  }

  const careerTips = [
    {
      title: 'Build Your Network',
      description: 'Connect with professionals in your target industry. Attend networking events, join online communities, and engage on LinkedIn.',
      icon: MessageCircle
    },
    {
      title: 'Continuous Learning',
      description: 'Stay updated with industry trends. Take online courses, attend workshops, and read industry publications regularly.',
      icon: BookOpen
    },
    {
      title: 'Set Clear Goals',
      description: 'Define your short-term and long-term career goals. Break them down into actionable steps and track your progress.',
      icon: Target
    },
    {
      title: 'Seek Feedback',
      description: 'Regularly seek feedback from mentors, peers, and supervisors. Use constructive criticism to improve your skills.',
      icon: TrendingUp
    }
  ]

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Coaching</h1>
          <p className="text-gray-600">Personalized career advice and path guidance</p>
        </div>

        {advice && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Career Path</h2>
                <p className="text-xl text-blue-600 font-semibold">{advice.path}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Career Advice</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{advice.advice}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Steps</h3>
              <ol className="space-y-3">
                {advice.steps.map((step: string, index: number) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Development Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {careerTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="mb-6 opacity-90">
            Explore job recommendations tailored to your profile and start your career journey today.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Job Recommendations
          </Link>
        </div>
      </div>
    </div>
  )
}

