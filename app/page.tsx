'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/assets/Jobify.png" 
            alt="Jobify Logo" 
            width={280} 
            height={280}
            className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            priority
          />
        </Link>
        <div className="flex gap-2 sm:gap-3">
          <Link href="/login" className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 transition font-medium">
            Login
          </Link>
          <Link href="/signup" className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-4 md:py-6 lg:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Text content */}
          <div className={`text-center lg:text-left space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Find Your Perfect
              <span className="text-blue-600 block mt-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Career Match
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              AI-powered job matching platform that helps you discover careers aligned with your personality, skills, and aspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link 
                href="/signup" 
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className={`flex items-center justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative w-full max-w-2xl group">
              {/* Animated background glow effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-blue-300/20 rounded-3xl blur-3xl transform rotate-6 animate-pulse-slow group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/30 to-blue-400/20 rounded-3xl blur-2xl transform -rotate-6 animate-pulse-slow delay-500 group-hover:scale-110 transition-transform duration-700"></div>
              
              {/* Main image container with interactive effects */}
              <div className="relative transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 ease-out">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
                <Image 
                  src="/assets/Hero.png" 
                  alt="Career Match Hero" 
                  width={800} 
                  height={800}
                  className="w-full h-auto object-contain drop-shadow-2xl animate-float relative z-10"
                  priority
                />
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute top-10 right-10 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-float-delay-1"></div>
              <div className="absolute bottom-20 left-10 w-2 h-2 bg-blue-300 rounded-full opacity-50 animate-float-delay-2"></div>
              <div className="absolute top-1/2 right-5 w-2.5 h-2.5 bg-blue-500 rounded-full opacity-40 animate-float-delay-3"></div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">Jobify?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find and land your dream job
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-blue-100/50 hover:border-blue-200">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/assets/ai-powered.png" 
                  alt="AI-Powered Matching" 
                  width={100} 
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center text-gray-900 group-hover:text-blue-600 transition-colors">AI-Powered Matching</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center leading-relaxed">
                Get personalized job recommendations based on your personality test and skills
              </p>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-blue-100/50 hover:border-blue-200">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/assets/practice-interview.png" 
                  alt="Practice Interviews" 
                  width={100} 
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center text-gray-900 group-hover:text-blue-600 transition-colors">Practice Interviews</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center leading-relaxed">
                Prepare for real interviews with AI-powered mock interviews and detailed feedback
              </p>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-blue-100/50 hover:border-blue-200 sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/assets/career-coaching.png" 
                  alt="Career Coaching" 
                  width={100} 
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center text-gray-900 group-hover:text-blue-600 transition-colors">Career Coaching</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center leading-relaxed">
                Get personalized career advice and track your progress toward your goals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(1deg);
          }
          50% {
            transform: translateY(-25px) rotate(0deg);
          }
          75% {
            transform: translateY(-15px) rotate(-1deg);
          }
        }
        @keyframes float-delay-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
        }
        @keyframes float-delay-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-15px) translateX(-8px);
            opacity: 0.8;
          }
        }
        @keyframes float-delay-3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-18px) translateX(5px);
            opacity: 0.7;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay-1 {
          animation: float-delay-1 4s ease-in-out infinite;
        }
        .animate-float-delay-2 {
          animation: float-delay-2 5s ease-in-out infinite;
        }
        .animate-float-delay-3 {
          animation: float-delay-3 4.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  )
}
