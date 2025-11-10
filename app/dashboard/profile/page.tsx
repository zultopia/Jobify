'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Briefcase, Award, BookOpen, Link as LinkIcon, FileText, Edit2, CheckCircle, Upload, X as XIcon } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<any>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

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
  }, [router])

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

  const handleSave = () => {
    // Get user email to preserve it
    const user = localStorage.getItem('user')
    const userData = user ? JSON.parse(user) : null
    const email = userData?.email || userProfile?.email

    if (!email) {
      alert('Email is required')
      return
    }

    const updatedProfile = { 
      ...editedProfile,
      email: email, // Preserve email
      isOnboarded: userProfile?.isOnboarded !== false // Preserve onboarding status
    }
    
    if (photoPreview) {
      updatedProfile.photo = photoPreview
    }
    
    // Save to current session
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
    
    // Also save to multi-user storage
    const userProfiles = localStorage.getItem('userProfiles')
    const profiles = userProfiles ? JSON.parse(userProfiles) : {}
    profiles[email] = updatedProfile
    localStorage.setItem('userProfiles', JSON.stringify(profiles))
    
    setUserProfile(updatedProfile)
    setEditedProfile(updatedProfile)
    setIsEditing(false)
    // Dispatch custom event to update sidebar
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }))
  }

  const handleCancel = () => {
    setEditedProfile(userProfile)
    setPhotoPreview(userProfile?.photo || null)
    setIsEditing(false)
  }

  if (!userProfile || !editedProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const profile = isEditing ? editedProfile : userProfile

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {photoPreview || userProfile?.photo ? (
                    <img 
                      src={photoPreview || userProfile?.photo} 
                      alt={userProfile?.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute bottom-0 right-0 flex gap-1">
                    <label className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
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
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-2xl font-bold"
                      placeholder="Your Name"
                    />
                  ) : (
                    profile.name || 'User'
                  )}
                </h2>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="your.email@example.com"
                    />
                  ) : (
                    profile.email || 'Add your email'
                  )}
                </p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIASEC Type */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            RIASEC Personality Type
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{profile.riasecType || 'N/A'}</span>
            </div>
            <div>
              <p className="text-gray-700 font-medium">
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

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            Skills
          </h3>
          {isEditing ? (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => {
                        const newSkills = profile.skills.filter((s: string, i: number) => i !== index)
                        setEditedProfile({ ...editedProfile, skills: newSkills })
                      }}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const newSkills = [...(profile.skills || []), e.currentTarget.value]
                      setEditedProfile({ ...editedProfile, skills: newSkills })
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>
          )}
        </div>

        {/* Job Interests */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Job Interests
          </h3>
          {isEditing ? (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.jobInterests?.map((interest: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {interest}
                    <button
                      onClick={() => {
                        const newInterests = profile.jobInterests.filter((s: string, i: number) => i !== index)
                        setEditedProfile({ ...editedProfile, jobInterests: newInterests })
                      }}
                      className="text-purple-700 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a job interest"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const newInterests = [...(profile.jobInterests || []), e.currentTarget.value]
                      setEditedProfile({ ...editedProfile, jobInterests: newInterests })
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.jobInterests && profile.jobInterests.length > 0 ? (
                profile.jobInterests.map((interest: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No job interests added yet</p>
              )}
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            Certificates
          </h3>
          {isEditing ? (
            <div>
              <div className="space-y-2 mb-4">
                {profile.certificates?.map((cert: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{cert}</span>
                    <button
                      onClick={() => {
                        const newCerts = profile.certificates.filter((s: string, i: number) => i !== index)
                        setEditedProfile({ ...editedProfile, certificates: newCerts })
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a certificate"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const newCerts = [...(profile.certificates || []), e.currentTarget.value]
                      setEditedProfile({ ...editedProfile, certificates: newCerts })
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {profile.certificates && profile.certificates.length > 0 ? (
                profile.certificates.map((cert: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No certificates added yet</p>
              )}
            </div>
          )}
        </div>

        {/* LinkedIn URL */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            LinkedIn Profile
          </h3>
          {isEditing ? (
            <input
              type="url"
              value={profile.linkedinUrl || ''}
              onChange={(e) => setEditedProfile({ ...editedProfile, linkedinUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          ) : (
            <div>
              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  {profile.linkedinUrl}
                </a>
              ) : (
                <p className="text-gray-500">No LinkedIn URL provided</p>
              )}
            </div>
          )}
        </div>

        {/* CV Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Resume/CV
          </h3>
          {profile.cvFile ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">CV uploaded successfully</span>
            </div>
          ) : (
            <p className="text-gray-500">No CV uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

