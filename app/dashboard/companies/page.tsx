'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Users, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react'

const COMPANIES = [
  {
    name: 'Google',
    industry: 'Technology',
    location: 'Mountain View, CA',
    employees: '150,000+',
    description: 'Leading technology company focused on internet-related services and products',
    path: [
      'Apply for entry-level positions or internships',
      'Build strong technical skills in relevant areas',
      'Network with Google employees',
      'Prepare for technical interviews',
      'Showcase projects on GitHub',
      'Apply through Google Careers portal'
    ],
    benefits: ['Competitive salary', 'Great work-life balance', 'Learning opportunities', 'Innovation culture']
  },
  {
    name: 'Meta',
    industry: 'Technology',
    location: 'Menlo Park, CA',
    employees: '77,000+',
    description: 'Social media and technology company building products to connect people',
    path: [
      'Complete relevant technical certifications',
      'Build portfolio with React/React Native projects',
      'Attend Meta tech talks and events',
      'Practice coding interviews',
      'Connect with Meta recruiters on LinkedIn',
      'Apply for positions matching your skills'
    ],
    benefits: ['High compensation', 'Cutting-edge technology', 'Remote work options', 'Strong culture']
  },
  {
    name: 'Amazon',
    industry: 'E-commerce & Cloud',
    location: 'Seattle, WA',
    employees: '1,500,000+',
    description: 'Global e-commerce and cloud computing leader',
    path: [
      'Gain experience with AWS services',
      'Build leadership principles understanding',
      'Prepare for behavioral interviews',
      'Showcase customer obsession in projects',
      'Network with Amazon employees',
      'Apply through Amazon Jobs portal'
    ],
    benefits: ['Career growth', 'Diverse opportunities', 'Innovation focus', 'Global presence']
  },
  {
    name: 'Microsoft',
    industry: 'Technology',
    location: 'Redmond, WA',
    employees: '220,000+',
    description: 'Technology corporation developing computer software and services',
    path: [
      'Learn Microsoft technologies (Azure, .NET)',
      'Build projects using Microsoft stack',
      'Attend Microsoft events and webinars',
      'Prepare for technical assessments',
      'Connect with Microsoft community',
      'Apply through Microsoft Careers'
    ],
    benefits: ['Great benefits', 'Work-life balance', 'Learning culture', 'Innovation']
  },
  {
    name: 'Apple',
    industry: 'Technology',
    location: 'Cupertino, CA',
    employees: '164,000+',
    description: 'Technology company designing consumer electronics and software',
    path: [
      'Develop iOS/macOS development skills',
      'Build portfolio with Apple ecosystem projects',
      'Attend WWDC and Apple events',
      'Master design principles',
      'Network with Apple developers',
      'Apply through Apple Jobs'
    ],
    benefits: ['Premium brand', 'Design focus', 'Innovation', 'Quality products']
  }
]

export default function CompaniesPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    setUserProfile(JSON.parse(profile))
  }, [router])

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const company = selectedCompany ? COMPANIES.find(c => c.name === selectedCompany) : null

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Connect to Companies</h1>
          <p className="text-gray-600">Explore top companies and create your path to join them</p>
        </div>

        {!selectedCompany ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANIES.map((company) => (
              <div
                key={company.name}
                onClick={() => setSelectedCompany(company.name)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{company.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.employees}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 font-semibold text-sm">View Path →</span>
                </div>
              </div>
            ))}
          </div>
        ) : company && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              onClick={() => setSelectedCompany(null)}
              className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
            >
              ← Back to Companies
            </button>

            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h2>
                  <p className="text-gray-600 mb-2">{company.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {company.employees}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {company.industry}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Your Path to {company.name}
                </h3>
                <ol className="space-y-3">
                  {company.path.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Culture</h3>
                <ul className="space-y-2">
                  {company.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Start working on the first steps of your path. Focus on building relevant skills and networking with professionals at {company.name}.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                    Save This Path
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

