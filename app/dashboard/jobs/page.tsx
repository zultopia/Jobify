'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, MapPin, Briefcase, CheckCircle, Building2, Clock, Target, ArrowRight, TrendingUp, BookOpen, Users, Award, Calendar } from 'lucide-react'
import { generateJobRecommendations, saveSelectedJob, getSelectedJob, JobRecommendation, CareerPathStep } from '@/app/utils/jobRecommendations'

export default function JobsPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<JobRecommendation[]>([])
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    const parsed = JSON.parse(profile)
    setUserProfile(parsed)
    
    // Generate job recommendations using utility function
    const jobs = generateJobRecommendations(
      parsed.riasecType || 'I',
      parsed.jobInterests || [],
      parsed.skills || []
    )
    setRecommendedJobs(jobs)
    
    // Load currently selected job if exists
    const currentSelectedJob = getSelectedJob()
    if (currentSelectedJob) {
      setSelectedJob(currentSelectedJob)
    }
  }, [router])

  const handleSelectJob = (job: JobRecommendation) => {
    saveSelectedJob(job)
    setSelectedJob(job)
    // Dispatch event to notify dashboard
    window.dispatchEvent(new CustomEvent('jobSelected'))
    // Show success message
    alert(`Successfully selected ${job.title} at ${job.company.name}! Your progress tracking will now focus on this role.`)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Job Recommendations</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Based on your RIASEC type ({userProfile.riasecType}) and interests. Select a job to start tracking your progress.
          </p>
        </div>

        {/* Currently Selected Job Banner */}
        {selectedJob && (
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-600">Currently Tracking:</p>
                  <p className="font-bold text-gray-900">{selectedJob.title} at {selectedJob.company.name}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Job Recommendations */}
        <div className="space-y-6">
          {recommendedJobs.map((job) => {
            const isSelected = selectedJob?.id === job.id
            const isExpanded = expandedJobId === job.id
            
            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-green-500 bg-green-50/30' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                }`}
              >
                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                          {isSelected && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Currently Selected
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4" />
                          {job.company.name} • <MapPin className="w-4 h-4" /> {job.location}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {job.matchScore}% Match
                          </span>
                          <span className="text-sm text-gray-500">{job.reason}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-lg">
                          ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {job.type} • {job.experienceLevel}
                      </div>
                    </div>
                </div>

                  {/* Job Description */}
                  <p className="text-gray-700 mb-4">{job.description}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    </div>
                  </div>

                  {/* Expandable Career Path */}
                  {job.careerPath && job.careerPath.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">Career Path to {job.title}</span>
                        </div>
                        <ArrowRight 
                          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="space-y-4">
                            {job.careerPath.map((step: CareerPathStep, idx: number) => (
                              <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {step.step}
                                  </div>
                                  {idx < job.careerPath!.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-300 mx-auto mt-2" style={{ height: 'calc(100% - 2.5rem)' }}></div>
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-bold text-gray-900">{step.title}</h4>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                      {step.duration}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700 mb-1">Skills to Learn:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {step.skills.map((skill, skillIdx) => (
                                          <span key={skillIdx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700 mb-1">Resources:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {step.resources.map((resource, resIdx) => (
                                          <span key={resIdx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                                            {resource}
                      </span>
                    ))}
                                      </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {!isSelected ? (
                      <button
                        onClick={() => handleSelectJob(job)}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Target className="w-5 h-5" />
                        Select This Job
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <TrendingUp className="w-5 h-5" />
                        View Progress
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/dashboard/interview`)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      Practice Interview
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {recommendedJobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base md:text-lg text-gray-600">No job recommendations available. Please complete your profile.</p>
          </div>
        )}
      </div>
    </div>
  )
}

