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

    // Check if user has already completed onboarding
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
    RIASEC_QUESTIONS.forEach(q => {
      if (riasecAnswers[q.id]) {
        scores[q.type] += riasecAnswers[q.id]
      }
    })
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  }

  const handleComplete = () => {
    // Get user email
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    const email = userData.email
    const name = userData.name || ''

    // Save user profile with email
    const profileData = {
      email,
      name,
      riasecType: calculateRiasecType(),
      skills,
      certificates,
      linkedinUrl,
      jobInterests,
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

    router.push('/dashboard')
  }

  const canProceed = () => {
    switch (step) {
      case 1:
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm font-medium text-gray-700">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: RIASEC Test */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Personality Test</h2>
              <p className="text-gray-600 mb-8">Answer these questions to discover your Holland Code (RIASEC) type</p>
              
              <div className="space-y-6">
                {RIASEC_QUESTIONS.map((q) => (
                  <div key={q.id} className="border-b pb-6">
                    <p className="text-lg font-medium text-gray-800 mb-4">{q.question}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleRiasecAnswer(q.id, value)}
                          className={`flex-1 py-3 px-2 rounded-lg border-2 transition text-sm ${
                            riasecAnswers[q.id] === value
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                              : 'border-gray-200 hover:border-gray-300'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills & Certificates</h2>
              <p className="text-gray-600 mb-8">Tell us about your skills and certifications</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., JavaScript, Python, React"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newCertificate}
                      onChange={(e) => setNewCertificate(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertificate())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                    <button
                      type="button"
                      onClick={addCertificate}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume & LinkedIn</h2>
              <p className="text-gray-600 mb-8">Upload your CV/Resume and add your LinkedIn profile (optional)</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload CV/Resume</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Choose File
                    </label>
                    {cvFile && (
                      <p className="mt-4 text-sm text-gray-600">{cvFile.name}</p>
                    )}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Interests</h2>
              <p className="text-gray-600 mb-8">Select the types of jobs you're interested in</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {JOB_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleJobInterest(interest)}
                    className={`py-3 px-4 rounded-lg border-2 transition ${
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
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                  canProceed()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

