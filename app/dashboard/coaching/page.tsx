'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, BookOpen, MessageCircle, Star, Clock, CheckCircle, User, GraduationCap, Award, Mail, Briefcase, Building2 } from 'lucide-react'
import { getSelectedJob, JobRecommendation } from '@/app/utils/jobRecommendations'

interface Coach {
  id: string
  name: string
  title: string
  specialization: string
  experience: string
  rating: number
  students: number
  photo?: string
  bio: string
}

interface CoachingClass {
  id: string
  title: string
  description: string
  coach: Coach
  schedule: string
  duration: string
  maxStudents: number
  currentStudents: number
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: string
}

interface UserEnrollment {
  classId: string
  enrolledAt: string
  status: 'active' | 'completed'
}

interface CoachAdvice {
  id: string
  classId: string
  userId: string
  coachId: string
  advice: string
  date: string
  read: boolean
}

const COACHES: Coach[] = [
  {
    id: 'coach1',
    name: 'Dr. Sarah Johnson',
    title: 'Career Development Expert',
    specialization: 'Technology & Software Engineering',
    experience: '15+ years',
    rating: 4.9,
    students: 1250,
    bio: 'Former tech executive with extensive experience in career development and mentorship. Specializes in helping professionals transition into tech roles.',
  },
  {
    id: 'coach2',
    name: 'Prof. Michael Chen',
    title: 'Business Strategy Coach',
    specialization: 'Business & Entrepreneurship',
    experience: '20+ years',
    rating: 4.8,
    students: 980,
    bio: 'Business professor and serial entrepreneur. Has helped hundreds of professionals start their own businesses and advance in corporate careers.',
  },
  {
    id: 'coach3',
    name: 'Dr. Emily Rodriguez',
    title: 'Career Transition Specialist',
    specialization: 'Career Change & Transition',
    experience: '12+ years',
    rating: 4.9,
    students: 850,
    bio: 'Licensed career counselor with expertise in helping professionals navigate career changes and find their true calling.',
  },
  {
    id: 'coach4',
    name: 'Prof. James Wilson',
    title: 'Leadership Development Coach',
    specialization: 'Leadership & Management',
    experience: '18+ years',
    rating: 4.7,
    students: 1100,
    bio: 'Executive coach and leadership development expert. Has coached C-level executives and mid-level managers across various industries.',
  },
]

const COACHING_CLASSES: CoachingClass[] = [
  // Technical Classes
  {
    id: 'class1',
    title: 'Software Engineering Fundamentals',
    description: 'Master core programming concepts, algorithms, and software development best practices. Perfect for aspiring software engineers.',
    coach: COACHES[0],
    schedule: 'Every Tuesday & Thursday, 6:00 PM - 7:30 PM',
    duration: '10 weeks',
    maxStudents: 25,
    currentStudents: 18,
    category: 'Technology',
    level: 'Intermediate',
    price: 'Free',
  },
  {
    id: 'class2',
    title: 'Tech Career Accelerator',
    description: 'Accelerate your tech career with proven strategies from industry experts. Learn how to break into tech and advance quickly.',
    coach: COACHES[0],
    schedule: 'Every Monday & Wednesday, 7:00 PM - 8:30 PM',
    duration: '8 weeks',
    maxStudents: 30,
    currentStudents: 24,
    category: 'Technology',
    level: 'Advanced',
    price: 'Free',
  },
  {
    id: 'class3',
    title: 'UI/UX Design Mastery',
    description: 'Learn user interface and user experience design principles, tools, and methodologies. Build a professional design portfolio.',
    coach: COACHES[0],
    schedule: 'Every Saturday, 10:00 AM - 12:00 PM',
    duration: '12 weeks',
    maxStudents: 20,
    currentStudents: 15,
    category: 'Technology',
    level: 'Beginner',
    price: 'Free',
  },
  {
    id: 'class4',
    title: 'Data Science & Analytics',
    description: 'Master data analysis, machine learning, and statistical modeling. Learn tools like Python, SQL, and data visualization.',
    coach: COACHES[0],
    schedule: 'Every Friday, 7:00 PM - 9:00 PM',
    duration: '10 weeks',
    maxStudents: 25,
    currentStudents: 20,
    category: 'Technology',
    level: 'Intermediate',
    price: 'Free',
  },
  // Leadership & Management
  {
    id: 'class5',
    title: 'Leadership Excellence Program',
    description: 'Develop your leadership skills and advance to management positions. Learn team management, decision-making, and strategic thinking.',
    coach: COACHES[3],
    schedule: 'Every Saturday, 2:00 PM - 4:00 PM',
    duration: '12 weeks',
    maxStudents: 20,
    currentStudents: 15,
    category: 'Leadership',
    level: 'Intermediate',
    price: 'Free',
  },
  {
    id: 'class6',
    title: 'Project Management Professional',
    description: 'Master project management methodologies, Agile/Scrum, and team coordination. Essential for managers and team leads.',
    coach: COACHES[3],
    schedule: 'Every Wednesday, 6:00 PM - 8:00 PM',
    duration: '8 weeks',
    maxStudents: 30,
    currentStudents: 22,
    category: 'Leadership',
    level: 'Intermediate',
    price: 'Free',
  },
  // Soft Skills & Professional Development
  {
    id: 'class7',
    title: 'Resume & Interview Mastery',
    description: 'Master the art of resume writing and interview techniques to land your dream job. Learn how to stand out in applications.',
    coach: COACHES[2],
    schedule: 'Every Sunday, 2:00 PM - 4:00 PM',
    duration: '4 weeks',
    maxStudents: 40,
    currentStudents: 32,
    category: 'Professional Development',
    level: 'Beginner',
    price: 'Free',
  },
  {
    id: 'class8',
    title: 'Networking & Personal Branding',
    description: 'Build your professional network and personal brand to unlock career opportunities. Learn LinkedIn optimization and networking strategies.',
    coach: COACHES[1],
    schedule: 'Every Wednesday, 8:00 PM - 9:30 PM',
    duration: '5 weeks',
    maxStudents: 30,
    currentStudents: 22,
    category: 'Professional Development',
    level: 'Intermediate',
    price: 'Free',
  },
  {
    id: 'class9',
    title: 'Effective Communication Skills',
    description: 'Enhance your communication skills for professional success. Learn presentation, negotiation, and cross-functional collaboration.',
    coach: COACHES[3],
    schedule: 'Every Thursday, 7:00 PM - 8:30 PM',
    duration: '6 weeks',
    maxStudents: 35,
    currentStudents: 28,
    category: 'Professional Development',
    level: 'Beginner',
    price: 'Free',
  },
  {
    id: 'class10',
    title: 'Career Transition Masterclass',
    description: 'Learn how to successfully transition into a new career field with confidence and strategy. Perfect for career changers.',
    coach: COACHES[2],
    schedule: 'Every Monday, 7:00 PM - 8:30 PM',
    duration: '8 weeks',
    maxStudents: 30,
    currentStudents: 24,
    category: 'Career Change',
    level: 'Intermediate',
    price: 'Free',
  },
]

export default function CoachingPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'available' | 'my-classes'>('available')
  const [enrolledClasses, setEnrolledClasses] = useState<UserEnrollment[]>([])
  const [coachAdvice, setCoachAdvice] = useState<CoachAdvice[]>([])
  const [selectedClass, setSelectedClass] = useState<CoachingClass | null>(null)
  const [showAdviceModal, setShowAdviceModal] = useState(false)
  const [newAdvice, setNewAdvice] = useState('')
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)

  // Get relevant coaching classes based on selected job
  const getRelevantClasses = (job: JobRecommendation | null, allClasses: CoachingClass[]): CoachingClass[] => {
    if (!job) {
      // If no job selected, show all classes including soft skills
      return allClasses
    }
    
    const relevantClasses: CoachingClass[] = []
    const jobTitle = job.title.toLowerCase()
    const jobSkills = job.skills.map(s => s.toLowerCase())
    const jobCompany = job.company.name.toLowerCase()
    
    // Technical classes based on job title and skills
    allClasses.forEach(cls => {
      const classTitle = cls.title.toLowerCase()
      const classDesc = cls.description.toLowerCase()
      const classCategory = cls.category.toLowerCase()
      
      // Check if class is relevant to job
      const isRelevant = 
        // Technical relevance
        (jobTitle.includes('engineer') && (classTitle.includes('tech') || classTitle.includes('software') || classTitle.includes('coding'))) ||
        (jobTitle.includes('designer') && (classTitle.includes('design') || classTitle.includes('ui') || classTitle.includes('ux'))) ||
        (jobTitle.includes('analyst') && (classTitle.includes('data') || classTitle.includes('analytics'))) ||
        (jobTitle.includes('manager') && (classTitle.includes('leadership') || classTitle.includes('management'))) ||
        // Skill-based relevance
        jobSkills.some(skill => classDesc.includes(skill) || classTitle.includes(skill)) ||
        // Category relevance
        (classCategory === 'technology' && (jobTitle.includes('engineer') || jobTitle.includes('developer') || jobTitle.includes('scientist'))) ||
        (classCategory === 'leadership' && (jobTitle.includes('manager') || jobTitle.includes('lead') || jobTitle.includes('director'))) ||
        // Always include soft skill classes
        classCategory === 'professional development' ||
        classTitle.includes('networking') ||
        classTitle.includes('resume') ||
        classTitle.includes('interview') ||
        classTitle.includes('communication') ||
        classTitle.includes('leadership') ||
        classTitle.includes('networking')
      
      if (isRelevant) {
        relevantClasses.push(cls)
      }
    })
    
    // If no relevant classes found, return all classes
    if (relevantClasses.length === 0) {
      return allClasses
    }
    
    // Always ensure we have soft skill classes mixed in
    const softSkillClasses = allClasses.filter(cls => 
      cls.category.toLowerCase() === 'professional development' ||
      cls.title.toLowerCase().includes('networking') ||
      cls.title.toLowerCase().includes('resume') ||
      cls.title.toLowerCase().includes('interview') ||
      cls.title.toLowerCase().includes('communication') ||
      cls.title.toLowerCase().includes('leadership')
    )
    
    // Combine relevant technical classes with soft skill classes, avoiding duplicates
    const combined = [...relevantClasses]
    softSkillClasses.forEach(softClass => {
      if (!combined.find(c => c.id === softClass.id)) {
        combined.push(softClass)
      }
    })
    
    return combined
  }

  useEffect(() => {
    // Load selected job
    const savedJob = getSelectedJob()
    if (savedJob) {
      setSelectedJob(savedJob)
    }
  }, [])

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (!profile) {
      router.push('/onboarding')
      return
    }
    const parsed = JSON.parse(profile)
    setUserProfile(parsed)

    // Load enrolled classes
    const enrollments = localStorage.getItem('coachingEnrollments')
    if (enrollments) {
      setEnrolledClasses(JSON.parse(enrollments))
    }

    // Load coach advice
    const loadAdvice = () => {
      const advice = localStorage.getItem('coachAdvice')
      if (advice && parsed.email) {
        const allAdvice = JSON.parse(advice)
        // Filter advice for current user
        const userAdvice = allAdvice.filter((a: CoachAdvice) => a.userId === parsed.email)
        setCoachAdvice(userAdvice)
      }
    }
    
    loadAdvice()

    // Listen for advice updates
    const handleAdviceUpdate = () => {
      const profile = localStorage.getItem('userProfile')
      if (profile) {
        const userData = JSON.parse(profile)
        const advice = localStorage.getItem('coachAdvice')
        if (advice && userData.email) {
          const allAdvice = JSON.parse(advice)
          const userAdvice = allAdvice.filter((a: CoachAdvice) => a.userId === userData.email)
          setCoachAdvice(userAdvice)
        }
      }
    }
    
    window.addEventListener('adviceUpdated', handleAdviceUpdate)
    
    return () => {
      window.removeEventListener('adviceUpdated', handleAdviceUpdate)
    }
  }, [router])

  const handleEnroll = (classId: string) => {
    const enrollment: UserEnrollment = {
      classId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
    }

    const updatedEnrollments = [...enrolledClasses, enrollment]
    setEnrolledClasses(updatedEnrollments)
    localStorage.setItem('coachingEnrollments', JSON.stringify(updatedEnrollments))

    // Simulate coach giving initial advice after enrollment
    const classData = COACHING_CLASSES.find(c => c.id === classId)
    if (classData && userProfile) {
      const advice: CoachAdvice = {
        id: `advice-${Date.now()}`,
        classId,
        userId: userProfile.email,
        coachId: classData.coach.id,
        advice: `Welcome to ${classData.title}! I'm ${classData.coach.name}, and I'm excited to work with you. Based on your profile, I'll provide personalized guidance throughout this course. Let's start by setting clear goals for your career development.`,
        date: new Date().toISOString(),
        read: false,
      }

      const allAdvice = localStorage.getItem('coachAdvice')
      const adviceList = allAdvice ? JSON.parse(allAdvice) : []
      adviceList.push(advice)
      localStorage.setItem('coachAdvice', JSON.stringify(adviceList))
      setCoachAdvice([...coachAdvice, advice])
    }

    alert('Successfully enrolled in the class! Check "My Classes" to see coach advice.')
  }

  const handleUnenroll = (classId: string) => {
    const updatedEnrollments = enrolledClasses.filter(e => e.classId !== classId)
    setEnrolledClasses(updatedEnrollments)
    localStorage.setItem('coachingEnrollments', JSON.stringify(updatedEnrollments))
    alert('Successfully unenrolled from the class.')
  }

  const getEnrolledClass = (classId: string) => {
    return enrolledClasses.find(e => e.classId === classId)
  }

  const getMyClasses = () => {
    return COACHING_CLASSES.filter(c => enrolledClasses.some(e => e.classId === c.id))
  }

  const getClassAdvice = (classId: string) => {
    return coachAdvice.filter(a => a.classId === classId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  const generateCoachResponse = (request: string, coachingClass: CoachingClass, profile: any): string => {
    // Generate personalized advice based on user request, class, and profile
    const responses: string[] = []
    
    responses.push(`Thank you for reaching out! Based on your request and your ${profile.riasecType || 'personality'} type, here's my advice:\n\n`)
    
    if (request.toLowerCase().includes('transition') || request.toLowerCase().includes('career change')) {
      responses.push('Career transitions require careful planning. Start by:\n')
      responses.push('1. Assessing your transferable skills\n')
      responses.push('2. Identifying gaps in your skill set\n')
      responses.push('3. Building a network in your target industry\n')
      responses.push('4. Gaining relevant experience through projects or volunteer work\n\n')
    }
    
    if (request.toLowerCase().includes('leadership') || request.toLowerCase().includes('manage')) {
      responses.push('To develop leadership skills:\n')
      responses.push('1. Take on additional responsibilities in your current role\n')
      responses.push('2. Mentor junior colleagues\n')
      responses.push('3. Lead cross-functional projects\n')
      responses.push('4. Seek feedback from your team and supervisors\n\n')
    }
    
    if (request.toLowerCase().includes('skill') || request.toLowerCase().includes('learn')) {
      responses.push('Skill development is key to career growth:\n')
      responses.push('1. Identify the most in-demand skills in your field\n')
      responses.push('2. Take online courses and get certifications\n')
      responses.push('3. Practice through real projects\n')
      responses.push('4. Build a portfolio to showcase your skills\n\n')
    }
    
    if (request.toLowerCase().includes('interview') || request.toLowerCase().includes('job search')) {
      responses.push('For successful job searching:\n')
      responses.push('1. Tailor your resume for each application\n')
      responses.push('2. Practice common interview questions\n')
      responses.push('3. Prepare specific examples using the STAR method\n')
      responses.push('4. Follow up after interviews\n\n')
    }
    
    // Add class-specific advice
    if (coachingClass.category === 'Technology') {
      responses.push(`Since you're in the ${coachingClass.title}, I recommend focusing on:\n`)
      responses.push('- Building a strong GitHub portfolio\n')
      responses.push('- Contributing to open-source projects\n')
      responses.push('- Networking at tech meetups and conferences\n')
      responses.push('- Staying updated with latest technologies\n\n')
    }
    
    if (coachingClass.category === 'Business' || coachingClass.category === 'Entrepreneurship') {
      responses.push(`For ${coachingClass.category.toLowerCase()} success:\n`)
      responses.push('- Develop a strong business plan\n')
      responses.push('- Build your professional network\n')
      responses.push('- Learn from successful entrepreneurs\n')
      responses.push('- Start with a minimum viable product (MVP)\n\n')
    }
    
    // Add RIASEC-specific advice
    if (profile.riasecType === 'R') {
      responses.push('Given your Realistic personality type, you excel in hands-on work. Consider roles that allow you to build and create tangible results.\n\n')
    } else if (profile.riasecType === 'I') {
      responses.push('Your Investigative nature suggests you thrive in analytical roles. Focus on roles that allow you to research, analyze, and solve complex problems.\n\n')
    } else if (profile.riasecType === 'A') {
      responses.push('With your Artistic personality, you shine in creative roles. Look for opportunities that allow you to express your creativity and innovation.\n\n')
    } else if (profile.riasecType === 'S') {
      responses.push('Your Social personality makes you ideal for roles that involve helping others. Consider careers where you can make a positive impact on people\'s lives.\n\n')
    } else if (profile.riasecType === 'E') {
      responses.push('Your Enterprising nature suggests you excel in leadership and business roles. Focus on developing your leadership and communication skills.\n\n')
    } else if (profile.riasecType === 'C') {
      responses.push('With your Conventional personality, you thrive in structured environments. Look for roles that value organization and attention to detail.\n\n')
    }
    
    responses.push('Remember, career development is a journey. Stay committed to your goals and don\'t hesitate to reach out if you need more guidance!\n\n')
    responses.push(`Best regards,\n${coachingClass.coach.name}`)
    
    return responses.join('')
  }

  const handleSendAdvice = () => {
    if (!selectedClass || !newAdvice.trim()) return

    // Simulate coach response after a short delay
    setTimeout(() => {
      const coachResponse = generateCoachResponse(newAdvice, selectedClass, userProfile)
      
      const advice: CoachAdvice = {
        id: `advice-${Date.now()}`,
        classId: selectedClass.id,
        userId: userProfile.email,
        coachId: selectedClass.coach.id,
        advice: coachResponse,
        date: new Date().toISOString(),
        read: false,
      }

      const allAdvice = localStorage.getItem('coachAdvice')
      const adviceList = allAdvice ? JSON.parse(allAdvice) : []
      adviceList.push(advice)
      localStorage.setItem('coachAdvice', JSON.stringify(adviceList))
      setCoachAdvice([...coachAdvice, advice])
      
      // Dispatch custom event to update UI
      window.dispatchEvent(new CustomEvent('adviceUpdated'))
    }, 1000)

    setNewAdvice('')
    setShowAdviceModal(false)
    setSelectedClass(null)
    alert('Your request has been sent! The coach will respond shortly. Check back in a moment to see the advice.')
  }

  const markAdviceAsRead = (adviceId: string) => {
    const allAdvice = localStorage.getItem('coachAdvice')
    if (allAdvice) {
      const adviceList = JSON.parse(allAdvice)
      const updated = adviceList.map((a: CoachAdvice) => 
        a.id === adviceId ? { ...a, read: true } : a
      )
      localStorage.setItem('coachAdvice', JSON.stringify(updated))
      setCoachAdvice(coachAdvice.map(a => a.id === adviceId ? { ...a, read: true } : a))
    }
  }

  const getUnreadCount = () => {
    return coachAdvice.filter(a => !a.read).length
  }

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const myClasses = getMyClasses()
  const unreadCount = getUnreadCount()
  
  // Get relevant classes based on selected job (using the function defined above)
  const relevantClasses = getRelevantClasses(selectedJob, COACHING_CLASSES)

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Career Coaching</h1>
          <p className="text-sm sm:text-base text-gray-600">
            {selectedJob 
              ? `Get personalized coaching for ${selectedJob.title} at ${selectedJob.company.name}`
              : 'Join coaching classes and get personalized advice from expert coaches'}
          </p>
        </div>

        {/* Selected Job Card */}
        {selectedJob && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {selectedJob.company.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Coaching recommendations tailored for this role
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 border-b">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition border-b-2 ${
              activeTab === 'available'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Classes
          </button>
          <button
            onClick={() => setActiveTab('my-classes')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition border-b-2 relative ${
              activeTab === 'my-classes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Classes
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Available Classes Tab */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relevantClasses.map((coachingClass) => {
              const isEnrolled = getEnrolledClass(coachingClass.id)
              const isFull = coachingClass.currentStudents >= coachingClass.maxStudents

              return (
                <div
                  key={coachingClass.id}
                  className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{coachingClass.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">{coachingClass.description}</p>
                    </div>
                  </div>

                  {/* Coach Info */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {coachingClass.coach.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">
                        {coachingClass.coach.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs sm:text-sm text-gray-600">{coachingClass.coach.rating}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-600">{coachingClass.coach.students}+ students</span>
                      </div>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{coachingClass.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      <span>{coachingClass.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{coachingClass.currentStudents}/{coachingClass.maxStudents} students</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                      {coachingClass.category}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
                      {coachingClass.level}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
                      {coachingClass.price}
                    </span>
                  </div>

                  {/* Action Button */}
                  {isEnrolled ? (
                    <button
                      onClick={() => handleUnenroll(coachingClass.id)}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
                    >
                      Enrolled
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed text-sm sm:text-base"
                    >
                      Class Full
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(coachingClass.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* My Classes Tab */}
        {activeTab === 'my-classes' && (
          <div className="space-y-6">
            {myClasses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Classes Yet</h3>
                <p className="text-gray-600 mb-6">Enroll in a coaching class to get started!</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Browse Classes
                </button>
              </div>
            ) : (
              myClasses.map((coachingClass) => {
                const enrollment = getEnrolledClass(coachingClass.id)
                const classAdvice = getClassAdvice(coachingClass.id)
                const unreadAdvice = classAdvice.filter(a => !a.read)

                return (
                  <div key={coachingClass.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    {/* Class Header */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{coachingClass.title}</h3>
                          {unreadAdvice.length > 0 && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              {unreadAdvice.length} new
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-3">{coachingClass.description}</p>
                        
                        {/* Coach Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base text-gray-900">
                              {coachingClass.coach.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {coachingClass.coach.title}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                            {coachingClass.schedule}
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
                            {coachingClass.duration}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedClass(coachingClass)
                          setShowAdviceModal(true)
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base whitespace-nowrap"
                      >
                        Request Advice
                      </button>
                    </div>

                    {/* Coach Advice Section */}
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        Coach Advice
                        {unreadAdvice.length > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {unreadAdvice.length} unread
                          </span>
                        )}
                      </h4>

                      {classAdvice.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No advice from coach yet. Request advice to get started!</p>
                      ) : (
                        <div className="space-y-4">
                          {classAdvice.map((advice) => (
                            <div
                              key={advice.id}
                              className={`p-3 sm:p-4 rounded-lg border-2 ${
                                advice.read
                                  ? 'bg-gray-50 border-gray-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm sm:text-base text-gray-900">
                                      {coachingClass.coach.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(advice.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                {!advice.read && (
                                  <button
                                    onClick={() => markAdviceAsRead(advice.id)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                                  >
                                    Mark as Read
                                  </button>
                                )}
                              </div>
                              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                                {advice.advice}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Advice Modal */}
        {showAdviceModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Request Advice from {selectedClass.coach.name}</h3>
                <button
                  onClick={() => {
                    setShowAdviceModal(false)
                    setSelectedClass(null)
                    setNewAdvice('')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Send a message to {selectedClass.coach.name} requesting personalized advice. The coach will respond with guidance tailored to your career goals and personality type.
                </p>
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Tip:</strong> Be specific about what you need help with. Mention your goals, challenges, or areas where you want to improve. The coach will provide personalized advice based on your profile.
                  </p>
                </div>
                <textarea
                  value={newAdvice}
                  onChange={(e) => setNewAdvice(e.target.value)}
                  placeholder="Describe what kind of advice you're looking for. For example: 'I need help transitioning from my current role to a tech position' or 'I want to improve my leadership skills' or 'How can I develop my skills in data science?'..."
                  className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                />
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setShowAdviceModal(false)
                    setSelectedClass(null)
                    setNewAdvice('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAdvice}
                  disabled={!newAdvice.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base ${
                    newAdvice.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
