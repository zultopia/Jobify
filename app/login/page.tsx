'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user has already completed onboarding
    const onboardingStatus = localStorage.getItem('onboardingStatus')
    let hasCompletedOnboarding = onboardingStatus 
      ? JSON.parse(onboardingStatus)[email] === true
      : false

    // Check if userProfile exists for this email (from userProfiles storage)
    const userProfiles = localStorage.getItem('userProfiles')
    let profileData = null
    if (userProfiles) {
      const profiles = JSON.parse(userProfiles)
      if (profiles[email]) {
        profileData = profiles[email]
        hasCompletedOnboarding = profileData.isOnboarded === true
        // Load profile for current session
        localStorage.setItem('userProfile', JSON.stringify(profileData))
      }
    }
    
    // Fallback: Check current userProfile if email matches
    if (!profileData) {
      const userProfile = localStorage.getItem('userProfile')
      if (userProfile) {
        const profile = JSON.parse(userProfile)
        if (profile.email === email) {
          profileData = profile
          if (profile.isOnboarded === true) {
            hasCompletedOnboarding = true
          }
        }
      }
    }

    // Save user data
    localStorage.setItem('user', JSON.stringify({ 
      email, 
      name: profileData?.name || '',
      isOnboarded: hasCompletedOnboarding 
    }))

    // If user has completed onboarding, go to dashboard
    // Otherwise, go to onboarding
    if (hasCompletedOnboarding) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to your Jobify account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

