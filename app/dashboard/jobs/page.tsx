'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, MapPin, Briefcase, CheckCircle } from 'lucide-react'

const JOB_DATA: Record<string, any> = {
  'R': [
    {
      title: 'Mechanical Engineer',
      description: 'Design and develop mechanical systems and components',
      responsibilities: ['Design mechanical systems', 'Test prototypes', 'Create technical drawings', 'Collaborate with cross-functional teams'],
      skills: ['CAD Software', 'Engineering Principles', 'Problem Solving', 'Project Management'],
      salary: '$70,000 - $100,000',
      companies: ['Boeing', 'Tesla', 'Caterpillar']
    },
    {
      title: 'Civil Engineer',
      description: 'Plan and design infrastructure projects',
      responsibilities: ['Design infrastructure', 'Manage construction projects', 'Ensure safety standards', 'Budget planning'],
      skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'Communication'],
      salary: '$65,000 - $95,000',
      companies: ['AECOM', 'Bechtel', 'Fluor Corporation']
    }
  ],
  'I': [
    {
      title: 'Data Scientist',
      description: 'Analyze complex data to help organizations make decisions',
      responsibilities: ['Analyze large datasets', 'Build predictive models', 'Create data visualizations', 'Present findings to stakeholders'],
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
      salary: '$100,000 - $150,000',
      companies: ['Google', 'Meta', 'Amazon', 'Microsoft']
    },
    {
      title: 'Research Scientist',
      description: 'Conduct research and experiments in scientific fields',
      responsibilities: ['Design experiments', 'Collect and analyze data', 'Publish research papers', 'Collaborate with research teams'],
      skills: ['Research Methods', 'Data Analysis', 'Scientific Writing', 'Critical Thinking'],
      salary: '$80,000 - $120,000',
      companies: ['MIT', 'Stanford Research', 'IBM Research']
    }
  ],
  'A': [
    {
      title: 'UI/UX Designer',
      description: 'Create intuitive and beautiful user interfaces',
      responsibilities: ['Design user interfaces', 'Create wireframes and prototypes', 'Conduct user research', 'Collaborate with developers'],
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      salary: '$75,000 - $120,000',
      companies: ['Apple', 'Google', 'Adobe', 'Figma']
    },
    {
      title: 'Graphic Designer',
      description: 'Create visual concepts to communicate ideas',
      responsibilities: ['Design marketing materials', 'Create brand identities', 'Develop visual concepts', 'Work with clients'],
      skills: ['Adobe Creative Suite', 'Typography', 'Color Theory', 'Branding'],
      salary: '$50,000 - $85,000',
      companies: ['Pentagram', 'IDEO', 'Landor', 'Wolff Olins']
    }
  ],
  'S': [
    {
      title: 'Software Engineer',
      description: 'Develop software applications and systems',
      responsibilities: ['Write clean code', 'Debug and test software', 'Collaborate with team', 'Maintain existing systems'],
      skills: ['Programming Languages', 'Software Development', 'Problem Solving', 'Team Collaboration'],
      salary: '$90,000 - $150,000',
      companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple']
    },
    {
      title: 'Teacher/Educator',
      description: 'Educate and inspire students',
      responsibilities: ['Plan lessons', 'Teach students', 'Assess progress', 'Support student development'],
      skills: ['Communication', 'Patience', 'Subject Knowledge', 'Classroom Management'],
      salary: '$45,000 - $75,000',
      companies: ['Public Schools', 'Private Schools', 'Online Education Platforms']
    }
  ],
  'E': [
    {
      title: 'Product Manager',
      description: 'Lead product development and strategy',
      responsibilities: ['Define product vision', 'Prioritize features', 'Work with engineering teams', 'Analyze market trends'],
      skills: ['Product Strategy', 'Agile Methodology', 'Stakeholder Management', 'Data Analysis'],
      salary: '$110,000 - $180,000',
      companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple']
    },
    {
      title: 'Sales Manager',
      description: 'Lead sales teams and drive revenue',
      responsibilities: ['Manage sales team', 'Develop sales strategies', 'Build client relationships', 'Meet revenue targets'],
      skills: ['Sales Techniques', 'Leadership', 'Negotiation', 'CRM Software'],
      salary: '$80,000 - $140,000',
      companies: ['Salesforce', 'Oracle', 'SAP', 'Microsoft']
    }
  ],
  'C': [
    {
      title: 'Accountant',
      description: 'Manage financial records and ensure compliance',
      responsibilities: ['Prepare financial statements', 'Ensure tax compliance', 'Audit financial records', 'Provide financial advice'],
      skills: ['Accounting Principles', 'Tax Law', 'Financial Software', 'Attention to Detail'],
      salary: '$55,000 - $90,000',
      companies: ['Deloitte', 'PwC', 'EY', 'KPMG']
    },
    {
      title: 'Data Analyst',
      description: 'Analyze data to support business decisions',
      responsibilities: ['Collect and analyze data', 'Create reports', 'Identify trends', 'Support decision-making'],
      skills: ['Excel', 'SQL', 'Data Visualization', 'Statistical Analysis'],
      salary: '$60,000 - $95,000',
      companies: ['Amazon', 'Microsoft', 'IBM', 'Accenture']
    }
  ]
}

export default function JobsPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    const parsed = JSON.parse(profile)
    setUserProfile(parsed)
    
    // Get recommended jobs based on RIASEC type
    const jobs = JOB_DATA[parsed.riasecType] || []
    
    // Also add jobs based on interests
    const interestJobs: any[] = []
    if (parsed.jobInterests?.includes('Software Engineer')) {
      interestJobs.push({
        title: 'Software Engineer',
        description: 'Develop software applications and systems',
        responsibilities: ['Write clean code', 'Debug and test software', 'Collaborate with team', 'Maintain existing systems'],
        skills: ['Programming Languages', 'Software Development', 'Problem Solving', 'Team Collaboration'],
        salary: '$90,000 - $150,000',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple']
      })
    }
    if (parsed.jobInterests?.includes('UI/UX Designer')) {
      interestJobs.push({
        title: 'UI/UX Designer',
        description: 'Create intuitive and beautiful user interfaces',
        responsibilities: ['Design user interfaces', 'Create wireframes and prototypes', 'Conduct user research', 'Collaborate with developers'],
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
        salary: '$75,000 - $120,000',
        companies: ['Apple', 'Google', 'Adobe', 'Figma']
      })
    }
    
    setRecommendedJobs([...jobs, ...interestJobs].slice(0, 5))
  }, [router])

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Recommendations</h1>
          <p className="text-gray-600">Based on your RIASEC type ({userProfile.riasecType}) and interests</p>
        </div>

        <div className="space-y-6">
          {recommendedJobs.map((job, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                  <p className="text-gray-600">{job.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                    <DollarSign className="w-5 h-5" />
                    {job.salary}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-3 mt-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Recommended Companies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.companies.map((company: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendedJobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No job recommendations available. Please complete your profile.</p>
          </div>
        )}
      </div>
    </div>
  )
}

