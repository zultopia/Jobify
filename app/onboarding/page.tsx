'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react'

const RIASEC_QUESTIONS = [
  { id: 1, question: 'I enjoy working with tools and machinery', type: 'R' },
  { id: 2, question: 'I like to investigate and solve problems', type: 'I' },
  { id: 3, question: 'I enjoy creative activities like art, music, or writing', type: 'A' },
  { id: 4, question: 'I like helping and teaching others', type: 'S' },
  { id: 5, question: 'I enjoy leading and persuading people', type: 'E' },
  { id: 6, question: 'I prefer organized and structured work', type: 'C' },
  { id: 7, question: 'I like working outdoors with nature', type: 'R' },
  { id: 8, question: 'I enjoy research and scientific work', type: 'I' },
  { id: 9, question: 'I express myself through creative work', type: 'A' },
  { id: 10, question: 'I care about helping people improve their lives', type: 'S' },
  { id: 11, question: 'I enjoy sales and business activities', type: 'E' },
  { id: 12, question: 'I prefer detailed and precise work', type: 'C' },
]

const JOB_INTERESTS = [
  'Software Engineer',
  'UI/UX Designer',
  'Data Scientist',
  'Product Manager',
  'Marketing Manager',
  'Business Analyst',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'QA Engineer',
  'Project Manager',
  'Sales Manager',
  'HR Manager',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [riasecAnswers, setRiasecAnswers] = useState<Record<number, number>>({})
  const [skills, setSkills] = useState<string[]>([])
  const [certificates, setCertificates] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [newCertificate, setNewCertificate] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [jobInterests, setJobInterests] = useState<string[]>([])
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    const email = userData.email

    if (!email) {
      router.push('/login')
      return
    }

    setUserEmail(email)

    // Check if this is a retake test (skip redirect if retaking)
    const urlParams = new URLSearchParams(window.location.search)
    const isRetake = urlParams.get('retake') === 'true'

    // If not retaking, check if user has already completed onboarding
    if (!isRetake) {
      const onboardingStatus = localStorage.getItem('onboardingStatus')
      if (onboardingStatus) {
        const status = JSON.parse(onboardingStatus)
        if (status[email] === true) {
          // User has already completed onboarding, load their profile and redirect to dashboard
          const userProfiles = localStorage.getItem('userProfiles')
          if (userProfiles) {
            const profiles = JSON.parse(userProfiles)
            if (profiles[email]) {
              localStorage.setItem('userProfile', JSON.stringify(profiles[email]))
            }
          }
          router.push('/dashboard')
          return
        }
      }

      // Check if userProfile exists in userProfiles storage
      const userProfiles = localStorage.getItem('userProfiles')
      if (userProfiles) {
        const profiles = JSON.parse(userProfiles)
        if (profiles[email] && profiles[email].isOnboarded) {
          // Update onboarding status and redirect
          const status = onboardingStatus ? JSON.parse(onboardingStatus) : {}
          status[email] = true
          localStorage.setItem('onboardingStatus', JSON.stringify(status))
          localStorage.setItem('userProfile', JSON.stringify(profiles[email]))
          router.push('/dashboard')
          return
        }
      }
    } else {
      // If retaking, load existing profile data if available (except personality test answers)
      const userProfiles = localStorage.getItem('userProfiles')
      if (userProfiles) {
        const profiles = JSON.parse(userProfiles)
        if (profiles[email]) {
          const existingProfile = profiles[email]
          // Load existing data for steps 2-4, but reset personality test answers
          if (existingProfile.skills) setSkills(existingProfile.skills)
          if (existingProfile.certificates) setCertificates(existingProfile.certificates)
          if (existingProfile.linkedinUrl) setLinkedinUrl(existingProfile.linkedinUrl)
          if (existingProfile.jobInterests) setJobInterests(existingProfile.jobInterests)
          // Note: CV file cannot be loaded from base64, user needs to re-upload if needed
          // Personality test answers are intentionally not loaded - user must retake the test
        }
      }
    }
  }, [router])

  const handleRiasecAnswer = (questionId: number, value: number) => {
    setRiasecAnswers({ ...riasecAnswers, [questionId]: value })
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addCertificate = () => {
    if (newCertificate.trim() && !certificates.includes(newCertificate.trim())) {
      setCertificates([...certificates, newCertificate.trim()])
      setNewCertificate('')
    }
  }

  const removeCertificate = (cert: string) => {
    setCertificates(certificates.filter(c => c !== cert))
  }

  const toggleJobInterest = (interest: string) => {
    if (jobInterests.includes(interest)) {
      setJobInterests(jobInterests.filter(i => i !== interest))
    } else {
      setJobInterests([...jobInterests, interest])
    }
  }

  const calculateRiasecType = () => {
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    
    // Calculate scores for each type
    RIASEC_QUESTIONS.forEach(q => {
      if (riasecAnswers[q.id]) {
        scores[q.type] += riasecAnswers[q.id]
      }
    })
    
    // Find the type with the highest score
    // If there's a tie, we'll use the first one alphabetically as a tiebreaker
    // (This ensures consistent results)
    const sortedTypes = Object.entries(scores)
      .sort((a, b) => {
        // First sort by score (descending)
        if (b[1] !== a[1]) {
          return b[1] - a[1]
        }
        // If scores are equal, sort alphabetically (ascending) for consistency
        return a[0].localeCompare(b[0])
      })
    
    const topType = sortedTypes[0][0]
    const topScore = sortedTypes[0][1]
    
    // Log for debugging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('RIASEC Scores:', scores)
      console.log('Top Type:', topType, 'Score:', topScore)
    }
    
    return topType
  }

  const handleComplete = async () => {
    // Get user email
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    const email = userData.email
    const name = userData.name || ''

    // Handle CV file upload if exists
    let cvFileData = null
    let cvFileName = null
    let cvFileType = null
    
    if (cvFile) {
      // Read file as base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(cvFile)
      })
      
      cvFileData = await base64Promise
      cvFileName = cvFile.name
      cvFileType = cvFile.type || 'application/pdf'
    }

    // Save user profile with email
    const profileData = {
      email,
      name,
      riasecType: calculateRiasecType(),
      skills,
      certificates,
      linkedinUrl,
      jobInterests,
      cvFile: cvFileData,
      cvFileName: cvFileName,
      cvFileType: cvFileType,
      cvUploaded: !!cvFile,
      isOnboarded: true
    }
    
    // Save profile for current user (overwrite existing)
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    
    // Also save profile per email for multi-user support
    const userProfiles = localStorage.getItem('userProfiles')
    const profiles = userProfiles ? JSON.parse(userProfiles) : {}
    profiles[email] = profileData
    localStorage.setItem('userProfiles', JSON.stringify(profiles))

    // Mark onboarding as completed for this email
    const onboardingStatus = localStorage.getItem('onboardingStatus')
    const status = onboardingStatus ? JSON.parse(onboardingStatus) : {}
    status[email] = true
    localStorage.setItem('onboardingStatus', JSON.stringify(status))

    // Dispatch custom event to update other pages
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profileData }))

    router.push('/dashboard')
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        // All personality test questions must be answered - mandatory
        return Object.keys(riasecAnswers).length === RIASEC_QUESTIONS.length
      case 2:
        return skills.length > 0
      case 3:
        return true // CV and LinkedIn are optional
      case 4:
        return jobInterests.length > 0
      default:
        return false
    }
  }

  // Calculate personality test progress
  const answeredQuestions = Object.keys(riasecAnswers).length
  const totalQuestions = RIASEC_QUESTIONS.length
  const personalityProgress = (answeredQuestions / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar - Only for Personality Test (Step 1) */}
        {step === 1 && (
          <div className="mb-6 sm:mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">Personality Test Progress</h3>
                  <p className="text-xs text-gray-600">
                    {answeredQuestions === totalQuestions 
                      ? 'All questions completed!' 
                      : `${totalQuestions - answeredQuestions} question${totalQuestions - answeredQuestions > 1 ? 's' : ''} remaining`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-bold text-blue-600">{Math.round(personalityProgress)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${personalityProgress}%` }}
              />
            </div>
            {answeredQuestions === totalQuestions && (
              <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-xs sm:text-sm text-green-700 font-medium">
                  All questions answered! You can proceed to the next step.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {/* Step 1: RIASEC Test */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 1 of 4</span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Personality Test</h2>
                    <p className="text-sm sm:text-base text-gray-600">Answer these questions to discover your Holland Code (RIASEC) type</p>
                  </div>
                  {answeredQuestions === totalQuestions && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Complete
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {RIASEC_QUESTIONS.map((q) => (
                  <div key={q.id} className={`border-b pb-4 sm:pb-6 ${riasecAnswers[q.id] ? 'border-gray-200' : 'border-red-200'}`}>
                    <div className="flex items-start gap-3 mb-3 sm:mb-4">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                        {q.id}
                      </span>
                      <p className="text-base sm:text-lg font-medium text-gray-800 flex-1">{q.question}</p>
                      {riasecAnswers[q.id] && (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 ml-9">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleRiasecAnswer(q.id, value)}
                          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium ${
                            riasecAnswers[q.id] === value
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-105'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                        >
                          {value === 1 ? 'Strongly Disagree' : 
                           value === 2 ? 'Disagree' : 
                           value === 3 ? 'Neutral' : 
                           value === 4 ? 'Agree' : 
                           'Strongly Agree'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skills and Certificates */}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 2 of 4</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-1">Skills & Certificates</h2>
                <p className="text-sm sm:text-base text-gray-600">Tell us about your skills and certifications</p>
              </div>
              
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="e.g., JavaScript, Python, React"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Your Certificates</label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                      type="text"
                      value={newCertificate}
                      onChange={(e) => setNewCertificate(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertificate())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                    <button
                      type="button"
                      onClick={addCertificate}
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certificates.map((cert) => (
                      <span
                        key={cert}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full flex items-center gap-2"
                      >
                        {cert}
                        <button
                          onClick={() => removeCertificate(cert)}
                          className="text-purple-700 hover:text-purple-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: CV and LinkedIn */}
          {step === 3 && (
            <div>
              <div className="mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 3 of 4</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-1">Resume & LinkedIn</h2>
                <p className="text-sm sm:text-base text-gray-600">Upload your CV/Resume and add your LinkedIn profile (optional)</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload CV/Resume</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/jpg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Validate file size (max 10MB)
                          if (file.size > 10 * 1024 * 1024) {
                            alert('File size should be less than 10MB')
                            e.target.value = ''
                            return
                          }
                          setCvFile(file)
                        } else {
                          setCvFile(null)
                        }
                      }}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="cursor-pointer inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                    >
                      Choose File
                    </label>
                    {cvFile && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 inline-block">
                        <p className="text-xs sm:text-sm text-gray-700 font-medium">
                          Selected: <span className="text-green-700">{cvFile.name}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-4">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">LinkedIn Profile URL</label>
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Job Interests */}
          {step === 4 && (
            <div>
              <div className="mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 4 of 4</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-1">Job Interests</h2>
                <p className="text-sm sm:text-base text-gray-600">Select the types of jobs you're interested in</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {JOB_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleJobInterest(interest)}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition text-sm sm:text-base ${
                      jobInterests.includes(interest)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
                  canProceed()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

