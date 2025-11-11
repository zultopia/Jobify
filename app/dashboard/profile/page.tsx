'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Briefcase, Award, BookOpen, Link as LinkIcon, FileText, Edit2, CheckCircle, Upload, X as XIcon } from 'lucide-react'
import { addExp, EXP_REWARDS } from '@/app/utils/gamification'

export default function ProfilePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<any>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvPreview, setCvPreview] = useState<string | null>(null)
  const [cvFileName, setCvFileName] = useState<string | null>(null)

  const loadProfile = useCallback(() => {
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

    // Try to load profile from userProfiles (multi-user storage)
    const userProfiles = localStorage.getItem('userProfiles')
    let parsed = null
    
    if (userProfiles) {
      const profiles = JSON.parse(userProfiles)
      if (profiles[email]) {
        parsed = profiles[email]
        // Update current session profile
        localStorage.setItem('userProfile', JSON.stringify(parsed))
      }
    }
    
    // Fallback to current userProfile if email matches
    if (!parsed) {
      const profile = localStorage.getItem('userProfile')
      if (profile) {
        const profileData = JSON.parse(profile)
        if (profileData.email === email) {
          parsed = profileData
        }
      }
    }

    if (!parsed) {
      router.push('/onboarding')
      return
    }
    
    // Ensure email is preserved
    if (!parsed.email) {
      parsed.email = email
    }
    
    setUserProfile(parsed)
    setEditedProfile(parsed)
    if (parsed.photo) {
      setPhotoPreview(parsed.photo)
    }
    if (parsed.cvFile) {
      setCvPreview(parsed.cvFile)
      setCvFileName(parsed.cvFileName || 'Resume.pdf')
    }
  }, [router])

  useEffect(() => {
    loadProfile()
    
    // Listen for profile updates (e.g., after retaking test)
    const handleProfileUpdate = (event: CustomEvent) => {
      loadProfile()
    }
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener)
    }
  }, [loadProfile])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      
      // Read file as base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPhotoPreview(base64String)
        setEditedProfile({ ...editedProfile, photo: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setEditedProfile({ ...editedProfile, photo: null })
  }

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    
    // Validate file type (PDF, DOC, DOCX, or images)
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    
    // Check file extension as fallback
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const validExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension || '')) {
      alert('Please upload a PDF, DOC, DOCX, JPG, or PNG file')
      // Reset input
      e.target.value = ''
      return
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB')
      // Reset input
      e.target.value = ''
      return
    }
    
    // Clean up previous blob URL if exists
    if (cvPreview && cvPreview.startsWith('blob:')) {
      URL.revokeObjectURL(cvPreview)
    }
    
    setCvFile(file)
    setCvFileName(file.name)
    
    // Read file as base64 for storage
    const reader = new FileReader()
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
      e.target.value = ''
    }
    reader.onloadend = () => {
      const base64String = reader.result as string
      
      if (!base64String) {
        alert('Error reading file. Please try again.')
        return
      }
      
      // For PDF, create blob URL for preview (better performance)
      if (file.type === 'application/pdf' || fileExtension === 'pdf') {
        const objectUrl = URL.createObjectURL(file)
        setCvPreview(objectUrl)
      } else {
        // For images and other files, use base64 for preview
        setCvPreview(base64String)
      }
      
      // Store base64 in editedProfile for saving
      setEditedProfile({ 
        ...editedProfile, 
        cvFile: base64String, 
        cvFileName: file.name, 
        cvFileType: file.type || `application/${fileExtension}` 
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveCV = () => {
    // Clean up object URL if it exists
    if (cvPreview && cvPreview.startsWith('blob:')) {
      URL.revokeObjectURL(cvPreview)
    }
    setCvFile(null)
    setCvPreview(null)
    setCvFileName(null)
    setEditedProfile({ ...editedProfile, cvFile: null, cvFileName: null, cvFileType: null })
  }

  const handleSave = () => {
    // Get user email to preserve it
    const user = localStorage.getItem('user')
    const userData = user ? JSON.parse(user) : null
    const email = userData?.email || userProfile?.email

    if (!email) {
      alert('Email is required')
      return
    }

    // Clean up blob URL if exists (we'll use base64 for storage)
    if (cvPreview && cvPreview.startsWith('blob:')) {
      URL.revokeObjectURL(cvPreview)
    }

    const updatedProfile = { 
      ...editedProfile,
      email: email, // Preserve email
      isOnboarded: userProfile?.isOnboarded !== false // Preserve onboarding status
    }
    
    if (photoPreview) {
      updatedProfile.photo = photoPreview
    }
    
    // Save CV file if uploaded (base64 is already stored in editedProfile.cvFile)
    if (editedProfile.cvFile) {
      updatedProfile.cvFile = editedProfile.cvFile
      updatedProfile.cvFileName = editedProfile.cvFileName || cvFileName
      updatedProfile.cvFileType = editedProfile.cvFileType
    }
    
    // Save to current session
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
    
    // Also save to multi-user storage
    const userProfiles = localStorage.getItem('userProfiles')
    const profiles = userProfiles ? JSON.parse(userProfiles) : {}
    profiles[email] = updatedProfile
    localStorage.setItem('userProfiles', JSON.stringify(profiles))
    
    // Update state with saved profile (use base64 for preview)
    setUserProfile(updatedProfile)
    setEditedProfile(updatedProfile)
    setCvPreview(updatedProfile.cvFile || null)
    setCvFile(null)
    setIsEditing(false)
    // Dispatch custom event to update sidebar
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }))
  }

  const handleCancel = () => {
    setEditedProfile(userProfile)
    setPhotoPreview(userProfile?.photo || null)
    // Clean up CV preview object URL if it exists
    if (cvPreview && cvPreview.startsWith('blob:')) {
      URL.revokeObjectURL(cvPreview)
    }
    setCvFile(null)
    setCvPreview(userProfile?.cvFile || null)
    setCvFileName(userProfile?.cvFileName || null)
    setIsEditing(false)
  }

  if (!userProfile || !editedProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const profile = isEditing ? editedProfile : userProfile

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage and update your profile information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true)
                  // Ensure CV state is properly initialized when entering edit mode
                  if (userProfile?.cvFile) {
                    setCvPreview(userProfile.cvFile)
                    setCvFileName(userProfile.cvFileName || 'Resume.pdf')
                  } else {
                    setCvPreview(null)
                    setCvFileName(null)
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 relative overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                  {photoPreview || userProfile?.photo ? (
                    <img 
                      src={photoPreview || userProfile?.photo} 
                      alt={userProfile?.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute -bottom-1 -right-1 flex gap-1.5">
                    <label className="cursor-pointer bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {(photoPreview || userProfile?.photo) && (
                      <button
                        onClick={handleRemovePhoto}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
                        title="Remove photo"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="border-2 border-blue-200 rounded-xl px-4 py-2.5 text-xl sm:text-2xl font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="Your Name"
                      />
                    ) : (
                      profile.name || 'User'
                    )}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="flex-1 border-2 border-blue-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <span className="text-sm sm:text-base">{profile.email || 'Add your email'}</span>
                    )}
                  </div>
                  {/* LinkedIn in Profile Header */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <LinkIcon className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.linkedinUrl || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, linkedinUrl: e.target.value })}
                        className="flex-1 border-2 border-blue-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : (
                      profile.linkedinUrl ? (
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base break-all"
                        >
                          {profile.linkedinUrl}
                        </a>
                      ) : (
                        <span className="text-sm sm:text-base text-gray-500">Add LinkedIn URL</span>
                      )
                    )}
                  </div>
                </div>

                {/* Edit Mode Actions */}
                {isEditing && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium shadow-md hover:shadow-lg active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Profile Sections - Left: RIASEC (smaller), Right: Job Interests + Skills (larger) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Left Column - RIASEC Type (smaller width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">RIASEC Personality Type</h3>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-3xl font-bold text-white">{profile.riasecType || 'N/A'}</span>
                </div>
                <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed text-center sm:text-left">
                    {profile.riasecType === 'R' && 'Realistic - Hands-on, practical, and enjoys working with tools'}
                    {profile.riasecType === 'I' && 'Investigative - Analytical, curious, and enjoys research'}
                    {profile.riasecType === 'A' && 'Artistic - Creative, expressive, and enjoys artistic activities'}
                    {profile.riasecType === 'S' && 'Social - Helpful, friendly, and enjoys working with people'}
                    {profile.riasecType === 'E' && 'Enterprising - Ambitious, persuasive, and enjoys leadership'}
                    {profile.riasecType === 'C' && 'Conventional - Organized, detail-oriented, and enjoys structured work'}
                    {!profile.riasecType && 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Job Interests and Skills (larger width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Job Interests */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Job Interests</h3>
              </div>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap gap-2.5 mb-4 min-h-[3rem]">
                    {profile.jobInterests?.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
                      >
                        {interest}
                        <button
                          onClick={() => {
                            const newInterests = profile.jobInterests.filter((s: string, i: number) => i !== index)
                            setEditedProfile({ ...editedProfile, jobInterests: newInterests })
                          }}
                          className="text-white hover:text-red-200 transition-colors font-bold text-lg leading-none"
                          title="Remove interest"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a job interest and press Enter"
                      className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newInterests = [...(profile.jobInterests || []), e.currentTarget.value.trim()]
                          setEditedProfile({ ...editedProfile, jobInterests: newInterests })
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5 min-h-[2.5rem]">
                  {profile.jobInterests && profile.jobInterests.length > 0 ? (
                    profile.jobInterests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:scale-105 border border-purple-300/50"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <div className="w-full py-6 text-center">
                      <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No job interests added yet. Click Edit to add interests.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Skills</h3>
              </div>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap gap-2.5 mb-4 min-h-[3rem]">
                    {profile.skills?.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
                      >
                        {skill}
                        <button
                          onClick={() => {
                            const newSkills = profile.skills.filter((s: string, i: number) => i !== index)
                            setEditedProfile({ ...editedProfile, skills: newSkills })
                          }}
                          className="text-white hover:text-red-200 transition-colors font-bold text-lg leading-none"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newSkills = [...(profile.skills || []), e.currentTarget.value.trim()]
                          setEditedProfile({ ...editedProfile, skills: newSkills })
                          // Add EXP for adding skill
                          try {
                            addExp(EXP_REWARDS.addSkill)
                            window.dispatchEvent(new CustomEvent('gamificationUpdated'))
                          } catch (error) {
                            console.error('Error adding EXP:', error)
                          }
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5 min-h-[2.5rem]">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:scale-105 border border-blue-300/50"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <div className="w-full py-6 text-center">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No skills added yet. Click Edit to add skills.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificates - Full Width */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Certificates</h3>
          </div>
          {isEditing ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {profile.certificates?.map((cert: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Award className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium text-sm truncate">{cert}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newCerts = profile.certificates.filter((s: string, i: number) => i !== index)
                        setEditedProfile({ ...editedProfile, certificates: newCerts })
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-medium text-sm ml-2 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a certificate name and press Enter"
                  className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const newCerts = [...(profile.certificates || []), e.currentTarget.value.trim()]
                      setEditedProfile({ ...editedProfile, certificates: newCerts })
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.certificates && profile.certificates.length > 0 ? (
                profile.certificates.map((cert: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 hover:shadow-md transition-all"
                  >
                    <Award className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium text-sm">{cert}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full w-full py-8 text-center">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No certificates added yet. Click Edit to add certificates.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CV Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Resume/CV</h3>
          </div>
          {isEditing ? (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-10 text-center mb-6 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/jpg,image/png"
                    onChange={handleCVUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all text-sm font-semibold mb-3 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="w-5 h-5" />
                    <span>{cvFileName || cvPreview ? 'Change CV/Resume' : 'Upload CV/Resume'}</span>
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-3">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click the button above to select a file
                </p>
                {(cvFileName || cvPreview || editedProfile?.cvFileName) && (
                  <div className="mt-6 pt-6 border-t border-gray-300 flex items-center justify-center gap-3 bg-white/50 rounded-xl p-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      {cvFileName || editedProfile?.cvFileName || 'Resume file'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveCV()
                        // Reset file input
                        const fileInput = document.getElementById('cv-upload') as HTMLInputElement
                        if (fileInput) {
                          fileInput.value = ''
                        }
                      }}
                      type="button"
                      className="ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove CV"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* CV Preview */}
              {cvPreview && (
                <div className="mt-6 border-2 border-gray-200 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Preview
                  </h4>
                  <div className="rounded-xl overflow-hidden bg-white border-2 border-gray-200 shadow-inner">
                    {cvPreview.startsWith('blob:') || editedProfile?.cvFileType === 'application/pdf' ? (
                      <iframe
                        src={cvPreview}
                        className="w-full h-96 sm:h-[500px] border-0"
                        title="CV Preview"
                      />
                    ) : editedProfile?.cvFileType?.startsWith('image/') || (cvPreview.startsWith('data:image')) ? (
                      <div className="flex items-center justify-center p-6">
                        <img
                          src={cvPreview}
                          alt="CV Preview"
                          className="max-w-full h-auto max-h-96 sm:max-h-[500px] rounded-lg shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="p-8 sm:p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-base font-semibold text-gray-700 mb-2">
                          {cvFileName || 'Resume file uploaded'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Preview not available for this file type. File is ready to be saved.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {profile.cvFile ? (
                <div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-6 border border-green-200 shadow-sm">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">CV Uploaded</p>
                      <p className="text-xs text-gray-600">{profile.cvFileName || 'Resume.pdf'}</p>
                    </div>
                  </div>
                  
                  {/* CV Preview in view mode */}
                  <div className="border-2 border-gray-200 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Preview
                    </h4>
                    <div className="rounded-xl overflow-hidden bg-white border-2 border-gray-200 shadow-inner">
                      {profile.cvFileType === 'application/pdf' || (profile.cvFile && profile.cvFile.startsWith('data:application/pdf')) ? (
                        <iframe
                          src={profile.cvFile}
                          className="w-full h-96 sm:h-[500px] border-0"
                          title="CV Preview"
                        />
                      ) : profile.cvFileType?.startsWith('image/') || (profile.cvFile && profile.cvFile.startsWith('data:image')) ? (
                        <div className="flex items-center justify-center p-6">
                          <img
                            src={profile.cvFile}
                            alt="CV Preview"
                            className="max-w-full h-auto max-h-96 sm:max-h-[500px] rounded-lg shadow-md"
                          />
                        </div>
                      ) : (
                        <div className="p-8 sm:p-12 text-center">
                          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                          </div>
                          <p className="text-base font-semibold text-gray-700 mb-2">
                            {profile.cvFileName || 'Resume file'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Preview not available for this file type.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full py-12 text-center bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-700 mb-1">No CV uploaded yet</p>
                  <p className="text-sm text-gray-500">Click Edit to upload your resume/CV</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

