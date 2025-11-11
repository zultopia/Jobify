// Job Recommendations Utility
// Provides job recommendations with company details and match data

export interface Company {
  id: string
  name: string
  logo: string
  industry: string
  location: string
  size: string
  description: string
  benefits: string[]
  website: string
}

export interface CareerPathStep {
  step: number
  title: string
  description: string
  duration: string
  skills: string[]
  resources: string[]
}

export interface JobRecommendation {
  id: string
  title: string
  company: Company
  matchScore: number
  reason: string
  description: string
  requirements: string[]
  skills: string[]
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  location: string
  type: string // 'Full-time', 'Part-time', etc.
  experienceLevel: string
  postedDate: string
  careerPath?: CareerPathStep[] // Path to achieve this job
}

export interface PersonProfile {
  id: string
  name: string
  role: string
  company: string
  experience: string
  skills: string[]
  education: string
  achievement: string
  image?: string
  linkedinUrl?: string
}

// Popular companies data
export const COMPANIES: Record<string, Company> = {
  google: {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    industry: 'Technology',
    location: 'Mountain View, CA',
    size: '100,000+ employees',
    description: 'Google is a multinational technology company that specializes in Internet-related services and products.',
    benefits: ['Health Insurance', 'Free Meals', 'Gym Membership', 'Stock Options', 'Remote Work'],
    website: 'https://www.google.com'
  },
  meta: {
    id: 'meta',
    name: 'Meta',
    logo: '📘',
    industry: 'Technology',
    location: 'Menlo Park, CA',
    size: '70,000+ employees',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
    benefits: ['Health Insurance', 'Free Meals', 'Gym Membership', 'Stock Options', 'Remote Work'],
    website: 'https://www.meta.com'
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    industry: 'E-commerce & Technology',
    location: 'Seattle, WA',
    size: '1,500,000+ employees',
    description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing, and digital streaming.',
    benefits: ['Health Insurance', 'Stock Options', 'Tuition Reimbursement', 'Career Development'],
    website: 'https://www.amazon.com'
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🪟',
    industry: 'Technology',
    location: 'Redmond, WA',
    size: '200,000+ employees',
    description: 'Microsoft is a multinational technology corporation that develops, manufactures, and licenses software and services.',
    benefits: ['Health Insurance', 'Stock Options', 'Gym Membership', 'Remote Work', 'Career Development'],
    website: 'https://www.microsoft.com'
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    logo: '🍎',
    industry: 'Technology',
    location: 'Cupertino, CA',
    size: '150,000+ employees',
    description: 'Apple is a multinational technology company that designs, develops, and sells consumer electronics and software.',
    benefits: ['Health Insurance', 'Stock Options', 'Product Discounts', 'Gym Membership', 'Career Development'],
    website: 'https://www.apple.com'
  },
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    logo: '🎬',
    industry: 'Entertainment & Technology',
    location: 'Los Gatos, CA',
    size: '12,000+ employees',
    description: 'Netflix is a streaming entertainment service that offers TV series, documentaries, and feature films.',
    benefits: ['Health Insurance', 'Stock Options', 'Unlimited PTO', 'Remote Work', 'Free Streaming'],
    website: 'https://www.netflix.com'
  },
  tesla: {
    id: 'tesla',
    name: 'Tesla',
    logo: '⚡',
    industry: 'Automotive & Energy',
    location: 'Austin, TX',
    size: '100,000+ employees',
    description: 'Tesla designs, develops, manufactures, and sells electric vehicles and energy storage systems.',
    benefits: ['Health Insurance', 'Stock Options', 'Employee Discounts', 'Career Development'],
    website: 'https://www.tesla.com'
  }
}

// Generate career path for a job
export const generateCareerPath = (jobTitle: string, company: Company): CareerPathStep[] => {
  const basePath: CareerPathStep[] = [
    {
      step: 1,
      title: 'Build Foundation Skills',
      description: `Learn the fundamental skills required for ${jobTitle} role`,
      duration: '3-6 months',
      skills: ['Basic Technical Skills', 'Problem Solving', 'Communication'],
      resources: ['Online Courses', 'Tutorials', 'Practice Projects']
    },
    {
      step: 2,
      title: 'Gain Practical Experience',
      description: 'Work on real projects and build a portfolio',
      duration: '6-12 months',
      skills: ['Project Management', 'Team Collaboration', 'Industry Tools'],
      resources: ['Personal Projects', 'Freelance Work', 'Internships']
    },
    {
      step: 3,
      title: 'Earn Certifications',
      description: 'Obtain relevant certifications to validate your skills',
      duration: '3-6 months',
      skills: ['Certified Skills', 'Industry Knowledge', 'Best Practices'],
      resources: ['Professional Certifications', 'Industry Courses', 'Workshops']
    },
    {
      step: 4,
      title: 'Network & Apply',
      description: `Build connections at ${company.name} and similar companies`,
      duration: '2-4 months',
      skills: ['Networking', 'Interview Skills', 'Resume Writing'],
      resources: ['LinkedIn Networking', 'Career Events', 'Job Applications']
    },
    {
      step: 5,
      title: 'Interview & Onboarding',
      description: 'Prepare for interviews and land the position',
      duration: '1-2 months',
      skills: ['Interview Preparation', 'Negotiation', 'Onboarding'],
      resources: ['Mock Interviews', 'Interview Prep', 'Company Research']
    }
  ]
  
  // Customize path based on job title
  if (jobTitle.toLowerCase().includes('engineer')) {
    basePath[0].skills = ['Programming Languages', 'Software Development', 'Algorithms']
    basePath[0].resources = ['Coding Bootcamp', 'Online Courses (Coursera, Udemy)', 'GitHub Projects']
    basePath[1].skills = ['Software Architecture', 'Code Review', 'Testing']
    basePath[1].resources = ['Open Source Contributions', 'Personal Projects', 'Hackathons']
  } else if (jobTitle.toLowerCase().includes('designer')) {
    basePath[0].skills = ['Design Tools (Figma, Adobe XD)', 'Design Principles', 'User Research']
    basePath[0].resources = ['Design Courses', 'Design Communities', 'Portfolio Building']
    basePath[1].skills = ['Prototyping', 'User Testing', 'Design Systems']
    basePath[1].resources = ['Design Challenges', 'Freelance Projects', 'Design Contests']
  } else if (jobTitle.toLowerCase().includes('manager') || jobTitle.toLowerCase().includes('analyst')) {
    basePath[0].skills = ['Business Analysis', 'Data Analysis', 'Communication']
    basePath[0].resources = ['Business Courses', 'Analytics Tools', 'Case Studies']
    basePath[1].skills = ['Project Management', 'Stakeholder Management', 'Reporting']
    basePath[1].resources = ['Business Projects', 'Consulting Work', 'Analytics Projects']
  }
  
  return basePath
}

// Generate job recommendations based on RIASEC type and job interests
export const generateJobRecommendations = (
  riasecType: string,
  jobInterests: string[],
  skills: string[] = []
): JobRecommendation[] => {
  const recommendations: JobRecommendation[] = []
  
  // Map RIASEC types to job roles and companies
  const riasecJobMap: Record<string, { roles: string[], companies: string[] }> = {
    'R': {
      roles: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Construction Manager'],
      companies: ['tesla', 'google', 'microsoft']
    },
    'I': {
      roles: ['Software Engineer', 'Data Scientist', 'Research Scientist', 'Machine Learning Engineer'],
      companies: ['google', 'meta', 'microsoft', 'apple', 'netflix']
    },
    'A': {
      roles: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Creative Director'],
      companies: ['meta', 'apple', 'netflix', 'google']
    },
    'S': {
      roles: ['HR Manager', 'Teacher', 'Counselor', 'Social Worker', 'Customer Success Manager'],
      companies: ['google', 'microsoft', 'amazon', 'meta']
    },
    'E': {
      roles: ['Product Manager', 'Business Analyst', 'Sales Manager', 'Marketing Manager'],
      companies: ['meta', 'google', 'amazon', 'microsoft', 'netflix']
    },
    'C': {
      roles: ['Accountant', 'Data Analyst', 'Financial Analyst', 'Project Manager'],
      companies: ['microsoft', 'google', 'amazon', 'apple']
    }
  }
  
  const typeMapping = riasecJobMap[riasecType] || riasecJobMap['I']
  
  // Generate recommendations based on RIASEC type
  typeMapping.roles.slice(0, 3).forEach((role, index) => {
    const companyId = typeMapping.companies[index % typeMapping.companies.length]
    const company = COMPANIES[companyId]
    
    if (company) {
      const job: JobRecommendation = {
        id: `${companyId}-${role.toLowerCase().replace(/\s+/g, '-')}`,
        title: role,
        company: company,
        matchScore: 95 - (index * 2),
        reason: `Highly compatible with your ${riasecType} personality type`,
        description: `Join ${company.name} as a ${role} and work on cutting-edge projects in a dynamic environment.`,
        requirements: [
          `Bachelor's degree in related field`,
          `2+ years of experience in ${role.toLowerCase()}`,
          'Strong problem-solving skills',
          'Excellent communication skills'
        ],
        skills: skills.length > 0 ? skills.slice(0, 5) : ['Problem Solving', 'Communication', 'Teamwork', 'Leadership'],
        salaryRange: {
          min: 80000 + (index * 10000),
          max: 120000 + (index * 15000),
          currency: 'USD'
        },
        location: company.location,
        type: 'Full-time',
        experienceLevel: 'Mid-level',
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        careerPath: generateCareerPath(role, company)
      }
      recommendations.push(job)
    }
  })
  
  // Add recommendations based on job interests
  jobInterests.slice(0, 2).forEach((interest) => {
    if (!recommendations.find(r => r.title === interest)) {
      const companyIds = Object.keys(COMPANIES)
      const randomCompany = COMPANIES[companyIds[Math.floor(Math.random() * companyIds.length)]]
      
      const job: JobRecommendation = {
        id: `${randomCompany.id}-${interest.toLowerCase().replace(/\s+/g, '-')}`,
        title: interest,
        company: randomCompany,
        matchScore: 90,
        reason: 'Matches your job interests',
        description: `Apply for ${interest} position at ${randomCompany.name} and advance your career.`,
        requirements: [
          `Experience in ${interest}`,
          'Relevant certifications',
          'Strong technical skills'
        ],
        skills: skills.length > 0 ? skills.slice(0, 5) : ['Technical Skills', 'Problem Solving'],
        salaryRange: {
          min: 70000,
          max: 110000,
          currency: 'USD'
        },
        location: randomCompany.location,
        type: 'Full-time',
        experienceLevel: 'Mid-level',
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        careerPath: generateCareerPath(interest, randomCompany)
      }
      recommendations.push(job)
    }
  })
  
  return recommendations.slice(0, 5).sort((a, b) => b.matchScore - a.matchScore)
}

// Get people who work/hired at specific company and job
export const getPeopleAtCompany = (companyId: string, jobTitle: string): PersonProfile[] => {
  const company = COMPANIES[companyId]
  if (!company) return []
  
  const jobTitleLower = jobTitle.toLowerCase()
  
  // Generate job-specific skills based on job title
  const getJobSpecificSkills = (title: string): string[] => {
    if (title.includes('engineer') || title.includes('developer') || title.includes('programmer')) {
      return ['JavaScript', 'Python', 'React', 'Node.js', 'System Design', 'Problem Solving']
    } else if (title.includes('designer') || title.includes('design')) {
      return ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'UI/UX']
    } else if (title.includes('analyst') || title.includes('data')) {
      return ['SQL', 'Python', 'Data Visualization', 'Machine Learning', 'Statistics', 'Analytics']
    } else if (title.includes('manager') || title.includes('lead')) {
      return ['Project Management', 'Team Leadership', 'Strategic Planning', 'Communication', 'Agile', 'Stakeholder Management']
    } else if (title.includes('scientist') || title.includes('researcher')) {
      return ['Research Methods', 'Data Analysis', 'Machine Learning', 'Python', 'Statistics', 'Scientific Writing']
    } else {
      return ['Problem Solving', 'Communication', 'Teamwork', 'Project Management', 'Analytics', 'Leadership']
    }
  }
  
  // Generate job-specific education based on job title
  const getJobSpecificEducation = (title: string): string => {
    if (title.includes('engineer') || title.includes('developer')) {
      return 'Bachelor of Science in Computer Science'
    } else if (title.includes('designer')) {
      return 'Bachelor of Design or related field'
    } else if (title.includes('analyst') || title.includes('data')) {
      return 'Master of Science in Data Science or related field'
    } else if (title.includes('manager') || title.includes('lead')) {
      return 'Master of Business Administration or related field'
    } else if (title.includes('scientist')) {
      return 'Master of Science or PhD in related field'
    } else {
      return 'Bachelor\'s degree in related field'
    }
  }
  
  // Generate job-specific achievements based on job title
  const getJobSpecificAchievement = (title: string, index: number): string => {
    if (title.includes('engineer') || title.includes('developer')) {
      const achievements = [
        'Led team of 10 engineers, increased productivity by 30%',
        'Architected scalable system serving 1M+ users',
        'Reduced system latency by 50% through optimization',
        'Mentored 5 junior developers, all promoted within 2 years',
        'Launched 3 major features with 99.9% uptime'
      ]
      return achievements[index % achievements.length]
    } else if (title.includes('designer')) {
      const achievements = [
        'Designed award-winning user experience with 40% increase in user engagement',
        'Led design system adoption across 5 product teams',
        'Improved conversion rate by 25% through UX optimization',
        'Created design guidelines used by 50+ designers',
        'Won design award for innovative product interface'
      ]
      return achievements[index % achievements.length]
    } else if (title.includes('analyst') || title.includes('data')) {
      const achievements = [
        'Built predictive model improving business decisions by 35%',
        'Improved system efficiency by 40% through data analysis',
        'Identified $2M cost savings opportunity through data insights',
        'Created dashboard used by 100+ stakeholders',
        'Led data-driven initiative resulting in 20% revenue increase'
      ]
      return achievements[index % achievements.length]
    } else if (title.includes('manager') || title.includes('lead')) {
      const achievements = [
        'Grew team from 5 to 25 members, maintaining 95% retention',
        'Successfully launched 3 major products on time and budget',
        'Increased team productivity by 35% through process improvement',
        'Led cross-functional initiative resulting in $5M revenue',
        'Reduced project delivery time by 30% through agile practices'
      ]
      return achievements[index % achievements.length]
    } else {
      const achievements = [
        'Led team of 10, increased productivity by 30%',
        'Successfully launched 3 major products',
        'Improved system efficiency by 40%',
        'Grew team from 5 to 25 members',
        'Achieved 95% customer satisfaction rating'
      ]
      return achievements[index % achievements.length]
    }
  }
  
  const jobSkills = getJobSpecificSkills(jobTitle)
  const jobEducation = getJobSpecificEducation(jobTitle)
  
  // Generate realistic people profiles with job-specific data
  const people: PersonProfile[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: jobTitle,
      company: company.name,
      experience: '5 years at ' + company.name,
      skills: jobSkills.slice(0, 4),
      education: jobEducation,
      achievement: getJobSpecificAchievement(jobTitle, 0),
      linkedinUrl: 'https://linkedin.com/in/sarah-johnson'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: jobTitle,
      company: company.name,
      experience: '3 years at ' + company.name,
      skills: jobSkills.slice(1, 5),
      education: jobEducation,
      achievement: getJobSpecificAchievement(jobTitle, 1),
      linkedinUrl: 'https://linkedin.com/in/michael-chen'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: jobTitle,
      company: company.name,
      experience: '4 years at ' + company.name,
      skills: jobSkills.slice(2, 6).length > 0 ? jobSkills.slice(2, 6) : jobSkills.slice(0, 4),
      education: jobEducation,
      achievement: getJobSpecificAchievement(jobTitle, 2),
      linkedinUrl: 'https://linkedin.com/in/emily-rodriguez'
    },
    {
      id: '4',
      name: 'David Kim',
      role: jobTitle,
      company: company.name,
      experience: '2 years at ' + company.name,
      skills: jobSkills.slice(0, 3),
      education: jobEducation,
      achievement: getJobSpecificAchievement(jobTitle, 3),
      linkedinUrl: 'https://linkedin.com/in/david-kim'
    },
    {
      id: '5',
      name: 'Jessica Wang',
      role: jobTitle,
      company: company.name,
      experience: '6 years at ' + company.name,
      skills: jobSkills.slice(1, 4),
      education: jobEducation,
      achievement: getJobSpecificAchievement(jobTitle, 4),
      linkedinUrl: 'https://linkedin.com/in/jessica-wang'
    }
  ]
  
  return people
}

// Save selected job recommendation
export const saveSelectedJob = (job: JobRecommendation) => {
  localStorage.setItem('selectedJob', JSON.stringify(job))
  localStorage.setItem('selectedJobDate', new Date().toISOString())
}

// Get selected job recommendation
export const getSelectedJob = (): JobRecommendation | null => {
  const saved = localStorage.getItem('selectedJob')
  if (!saved) return null
  return JSON.parse(saved)
}

// Clear selected job
export const clearSelectedJob = () => {
  localStorage.removeItem('selectedJob')
  localStorage.removeItem('selectedJobDate')
}

// Calculate career path progress based on job and user profile
export const calculateCareerPathProgress = (job: JobRecommendation | null, userProfile: any): {
  completedSteps: number
  totalSteps: number
  progressPercentage: number
  relevantSkillsAcquired: number
  totalRequiredSkills: number
  skillsProgressPercentage: number
} => {
  if (!job || !job.careerPath || job.careerPath.length === 0) {
    return {
      completedSteps: 0,
      totalSteps: 0,
      progressPercentage: 0,
      relevantSkillsAcquired: 0,
      totalRequiredSkills: 0,
      skillsProgressPercentage: 0,
    }
  }
  
  const totalSteps = job.careerPath.length
  const requiredSkills = job.skills || []
  const userSkills = userProfile?.skills || []
  
  // Calculate relevant skills progress (skills that match job requirements)
  const relevantSkillsCount = userSkills.filter((skill: string) => 
    requiredSkills.some(required => required.toLowerCase().includes(skill.toLowerCase()) || 
                                   skill.toLowerCase().includes(required.toLowerCase()))
  ).length
  
  const totalRequiredSkills = requiredSkills.length
  const skillsProgressPercentage = totalRequiredSkills > 0 
    ? Math.min(100, Math.round((relevantSkillsCount / totalRequiredSkills) * 100))
    : 0
  
  // Calculate completed steps based on skills progress and other factors
  // For prototype demo, set progress to middle range (40-60%) for realistic demo
  // User has completed steps based on their progress
  let completedSteps = 0
  if (skillsProgressPercentage >= 80) {
    completedSteps = Math.min(totalSteps, 4) // Max 4 out of 5 for demo (80%)
  } else if (skillsProgressPercentage >= 60) {
    completedSteps = Math.min(totalSteps, 3) // 3 out of 5 for demo (60%)
  } else if (skillsProgressPercentage >= 40) {
    completedSteps = Math.min(totalSteps, 3) // 3 out of 5 for demo (60%)
  } else if (skillsProgressPercentage >= 20) {
    completedSteps = Math.min(totalSteps, 2) // 2 out of 5 for demo (40%)
  } else if (skillsProgressPercentage > 0) {
    completedSteps = 1 // 1 out of 5 for demo (20%)
  }
  
  // For prototype demo: Set to middle range (2-3 steps out of 5 = 40-60%)
  // This provides a realistic demo without showing 100% completion
  const mockCompletedSteps = totalSteps >= 5 
    ? 3 // 3 out of 5 steps = 60% progress (good for demo)
    : Math.floor(totalSteps * 0.6) // 60% of total steps
  
  // Use the mock value for consistent demo experience
  completedSteps = mockCompletedSteps
  
  const progressPercentage = totalSteps > 0 
    ? Math.round((completedSteps / totalSteps) * 100)
    : 0
  
  return {
    completedSteps,
    totalSteps,
    progressPercentage,
    relevantSkillsAcquired: relevantSkillsCount,
    totalRequiredSkills,
    skillsProgressPercentage,
  }
}

