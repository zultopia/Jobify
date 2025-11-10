'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/assets/Jobify.png" 
            alt="Jobify Logo" 
            width={280} 
            height={280}
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto"
            priority
          />
        </Link>
        <div className="flex gap-2 sm:gap-4">
          <Link href="/login" className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 transition">
            Login
          </Link>
          <Link href="/signup" className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Find Your Perfect
            <span className="text-blue-600"> Career Match</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
            AI-powered job matching platform that helps you discover careers aligned with your personality, skills, and aspirations
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/signup" className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="/login" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-50 transition">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto px-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">AI-Powered Matching</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get personalized job recommendations based on your personality test and skills
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Practice Interviews</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Prepare for real interviews with AI-powered mock interviews and detailed feedback
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Career Coaching</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get personalized career advice and track your progress toward your goals
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

