'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Video, VideoOff, Clock, CheckCircle, XCircle, Mic, MicOff, Play, Volume2, VolumeX, RotateCw, TrendingUp, Target, Lightbulb, MessageSquare, Eye, AlertCircle, Award, BarChart3, ArrowRight, Sparkles, Zap, BookOpen, FileText } from 'lucide-react'

const INTERVIEW_QUESTIONS = [
  'Tell me about yourself.',
  'Why are you interested in this position?',
  'What are your greatest strengths?',
  'What are your weaknesses?',
  'Where do you see yourself in 5 years?',
  'Why should we hire you?',
  'Describe a challenging situation you faced and how you handled it.',
  'What motivates you?',
]

export default function InterviewPage() {
  const router = useRouter()
  const [isInterviewing, setIsInterviewing] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutes per question
  const [isRecording, setIsRecording] = useState(false)
  const [isAudioRecording, setIsAudioRecording] = useState(false)
  const [questionStarted, setQuestionStarted] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [streamReady, setStreamReady] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const readQuestion = useCallback((text: string) => {
    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel()
    }

    if (!ttsEnabled || !('speechSynthesis' in window)) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9 // Slightly slower for clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      speechSynthesisRef.current = null
    }

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error)
      setIsSpeaking(false)
      speechSynthesisRef.current = null
    }

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [ttsEnabled])

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    speechSynthesisRef.current = null
  }

  const stopAudioRecording = useCallback(() => {
    if (mediaRecorderRef.current && isAudioRecording) {
      mediaRecorderRef.current.stop()
      setIsAudioRecording(false)
    }
  }, [isAudioRecording])

  const stopCamera = useCallback(() => {
    stopAudioRecording()
    stopSpeaking()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsRecording(false)
    setStreamReady(false)
  }, [stopAudioRecording])

  const finishInterview = useCallback(() => {
    // Stop audio recording
    stopAudioRecording()
    
    // Save final answer
    setAnswers(prev => [...prev, 'Audio response recorded'])
    
    stopCamera()
    setIsInterviewing(false)
    setShowReport(true)
  }, [stopAudioRecording, stopCamera])

  const handleNextQuestion = useCallback(() => {
    // Stop current audio recording
    stopAudioRecording()
    
    // Save answer (audio was recorded)
    setAnswers(prev => [...prev, 'Audio response recorded'])
    
    setCurrentQuestionIndex(prev => {
      if (prev < INTERVIEW_QUESTIONS.length - 1) {
        return prev + 1
      } else {
        finishInterview()
        return prev
      }
    })
    setTimeRemaining(120)
    setCurrentAnswer('')
    setQuestionStarted(false)
  }, [stopAudioRecording, finishInterview])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      })
      streamRef.current = stream
      
      // Wait a bit for video element to be in DOM, then set stream
      // Audio recording will start when user clicks "Start Answering"
      const setVideoStream = () => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current
          videoRef.current.play()
            .then(() => {
              setIsRecording(true)
              setStreamReady(true)
            })
            .catch(err => {
              console.error('Error playing video:', err)
              setIsRecording(false)
              setStreamReady(false)
            })
        } else {
          // Retry if video element not ready yet
          setTimeout(setVideoStream, 50)
        }
      }
      
      setVideoStream()
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please allow camera permissions.')
      setIsRecording(false)
      setStreamReady(false)
    }
  }, [])

  const startAudioRecording = (stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Audio recording stopped
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        // In a real app, you would send this to a server for transcription
        console.log('Audio recorded:', audioBlob.size, 'bytes')
      }

      mediaRecorder.start()
      setIsAudioRecording(true)
    } catch (error) {
      console.error('Error starting audio recording:', error)
      // Try with default mimeType
      try {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }
        mediaRecorder.start()
        setIsAudioRecording(true)
      } catch (err) {
        console.error('Error with fallback recording:', err)
      }
    }
  }

  const replayQuestion = () => {
    if (INTERVIEW_QUESTIONS[currentQuestionIndex]) {
      readQuestion(INTERVIEW_QUESTIONS[currentQuestionIndex])
    }
  }

  useEffect(() => {
    if (isInterviewing && !streamRef.current) {
      // Small delay to ensure video element is rendered
      const timer = setTimeout(() => {
        startCamera()
      }, 200)
      return () => {
        clearTimeout(timer)
        stopCamera()
      }
    }
    return () => {
      if (!isInterviewing) {
        stopCamera()
      }
    }
  }, [isInterviewing, stopCamera, startCamera])

  // Update video element when stream is ready
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      const video = videoRef.current
      video.srcObject = streamRef.current
      
      // Ensure video plays
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Error playing video:', err)
        })
      }
    }
  }, [streamReady, isRecording])

  useEffect(() => {
    // Timer only runs when question is started
    if (isInterviewing && questionStarted && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isInterviewing && questionStarted && timeRemaining === 0) {
      handleNextQuestion()
    }
  }, [isInterviewing, questionStarted, timeRemaining, handleNextQuestion])

  // Read question aloud when it changes
  useEffect(() => {
    if (isInterviewing && INTERVIEW_QUESTIONS[currentQuestionIndex] && ttsEnabled) {
      // Small delay to ensure UI is updated
      const timer = setTimeout(() => {
        readQuestion(INTERVIEW_QUESTIONS[currentQuestionIndex])
      }, 500)
      return () => {
        clearTimeout(timer)
        window.speechSynthesis.cancel()
      }
    }
  }, [currentQuestionIndex, isInterviewing, ttsEnabled, readQuestion])

  const startInterview = () => {
    setIsInterviewing(true)
    setCurrentQuestionIndex(0)
    setTimeRemaining(120)
    setAnswers([])
    setCurrentAnswer('')
    setQuestionStarted(false)
    // Camera will start via useEffect when isInterviewing becomes true
  }

  const startQuestion = () => {
    setQuestionStarted(true)
    // Start audio recording when user clicks "Start Answering"
    if (streamRef.current) {
      // Stop any existing recording first
      stopAudioRecording()
      startAudioRecording(streamRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateReport = () => {
    const totalQuestions = INTERVIEW_QUESTIONS.length
    const answeredQuestions = answers.length
    const completionRate = (answeredQuestions / totalQuestions) * 100
    
    // Calculate time spent (simulated based on completion)
    const averageTimePerQuestion = 90 // seconds
    const totalTimeSpent = answeredQuestions * averageTimePerQuestion
    
    // Simulate detailed AI analysis with more comprehensive feedback
    const baseScore = 65
    const completionBonus = (completionRate / 100) * 20
    const randomVariation = Math.random() * 15
    const overallScore = Math.min(95, Math.round(baseScore + completionBonus + randomVariation))
    
    // Determine performance level
    let performanceLevel = 'Good'
    let performanceColor = 'text-blue-600'
    let performanceBg = 'bg-blue-100'
    if (overallScore >= 85) {
      performanceLevel = 'Excellent'
      performanceColor = 'text-green-600'
      performanceBg = 'bg-green-100'
    } else if (overallScore >= 70) {
      performanceLevel = 'Good'
      performanceColor = 'text-blue-600'
      performanceBg = 'bg-blue-100'
    } else if (overallScore >= 55) {
      performanceLevel = 'Fair'
      performanceColor = 'text-orange-600'
      performanceBg = 'bg-orange-100'
    } else {
      performanceLevel = 'Needs Improvement'
      performanceColor = 'text-red-600'
      performanceBg = 'bg-red-100'
    }
    
    // Detailed analysis based on score
    const analysis = {
      overallScore,
      performanceLevel,
      performanceColor,
      performanceBg,
      completionRate,
      totalTimeSpent,
      strengths: overallScore >= 75 ? [
        {
          title: 'Clear Communication',
          description: 'You demonstrated excellent verbal communication skills with clear articulation and appropriate pacing.',
          tip: 'Continue practicing to maintain this strength in high-pressure situations.'
        },
        {
          title: 'Professional Presence',
          description: 'Your professional demeanor and confidence came through clearly in your responses.',
          tip: 'Build on this by preparing more specific examples to showcase your achievements.'
        },
        {
          title: 'Structured Responses',
          description: 'Your answers showed good organization and logical flow of ideas.',
          tip: 'Consider using the STAR method (Situation, Task, Action, Result) for even better structure.'
        }
      ] : [
        {
          title: 'Willingness to Practice',
          description: 'Taking the initiative to practice interview skills shows strong commitment to growth.',
          tip: 'Regular practice will significantly improve your performance over time.'
        },
        {
          title: 'Clear Voice',
          description: 'Your voice was clear and audible, which is essential for effective communication.',
          tip: 'Focus on maintaining this clarity while adding more detail to your responses.'
        }
      ],
      areasForImprovement: [
        {
          title: 'Add Specific Examples',
          description: 'Your answers would be stronger with concrete examples from your experience.',
          action: 'Prepare 3-5 detailed stories using the STAR method that showcase your key achievements and problem-solving skills.',
          priority: 'High'
        },
        {
          title: 'Expand Technical Details',
          description: 'Consider providing more technical depth when discussing your skills and experiences.',
          action: 'Review the job description and prepare examples that align with the technical requirements.',
          priority: 'Medium'
        },
        {
          title: 'Time Management',
          description: 'Work on balancing thoroughness with conciseness in your responses.',
          action: 'Practice answering common questions in 60-90 seconds while covering all key points.',
          priority: 'High'
        },
        {
          title: 'Body Language & Eye Contact',
          description: 'Maintain consistent eye contact and confident posture throughout the interview.',
          action: 'Practice in front of a mirror or record yourself to observe and improve your non-verbal cues.',
          priority: 'Medium'
        }
      ],
      communicationScore: Math.round(overallScore * 0.9),
      contentScore: Math.round(overallScore * 0.85),
      confidenceScore: Math.round(overallScore * 1.1),
      questionAnalysis: INTERVIEW_QUESTIONS.map((question, index) => ({
        question,
        answered: index < answeredQuestions,
        score: index < answeredQuestions ? Math.round(overallScore + (Math.random() * 20 - 10)) : 0,
        feedback: index < answeredQuestions ? (
          index % 3 === 0 ? 'Good structure and relevant content. Consider adding more specific metrics or outcomes.' :
          index % 3 === 1 ? 'Clear communication. Could benefit from more concrete examples to strengthen your point.' :
          'Well-articulated response. Practice making it more concise while maintaining key details.'
        ) : 'Not answered'
      })),
      recommendations: [
        {
          title: 'Practice STAR Method',
          description: 'Structure your answers using Situation, Task, Action, and Result format.',
          resources: 'Prepare 5-7 STAR stories covering leadership, problem-solving, teamwork, and challenges.',
          icon: Target
        },
        {
          title: 'Research Company & Role',
          description: 'Thoroughly research the company culture, values, and specific role requirements.',
          resources: 'Review company website, LinkedIn, recent news, and job description thoroughly.',
          icon: BookOpen
        },
        {
          title: 'Prepare Questions to Ask',
          description: 'Have 3-5 thoughtful questions ready to ask the interviewer.',
          resources: 'Focus on questions about team dynamics, growth opportunities, and company culture.',
          icon: MessageSquare
        },
        {
          title: 'Record & Review Practice Sessions',
          description: 'Record yourself answering questions and review for areas of improvement.',
          resources: 'Use this platform regularly and focus on one improvement area at a time.',
          icon: Video
        },
        {
          title: 'Work on Non-Verbal Communication',
          description: 'Practice maintaining eye contact, confident posture, and natural gestures.',
          resources: 'Practice in front of a mirror and record yourself to observe body language.',
          icon: Eye
        }
      ],
      nextSteps: [
        'Complete 2-3 more practice sessions focusing on your identified improvement areas',
        'Prepare detailed STAR stories for common behavioral questions',
        'Research companies you\'re interested in and tailor your answers accordingly',
        'Practice answering questions within 60-90 second timeframes',
        'Schedule a follow-up practice session in 3-5 days to track improvement'
      ]
    }

    return {
      completionRate,
      answeredQuestions,
      totalQuestions,
      analysis
    }
  }

  const report = showReport ? generateReport() : null

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {!isInterviewing && !showReport && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
            <Video className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Practice Interview</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Practice your interview skills with AI-powered mock interviews. You'll be asked common interview questions 
              and receive detailed feedback on your performance.
            </p>
            <button
              onClick={startInterview}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Interview
            </button>
          </div>
        )}

        {isInterviewing && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Video Feed */}
              <div>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-3 sm:mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                      <VideoOff className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>
                  )}
                </div>
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-red-600 text-sm sm:text-base">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Recording</span>
                  </div>
                )}
              </div>

              {/* Question and Answer */}
              <div>
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Question {currentQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {isSpeaking && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                          <span className="text-xs">Reading...</span>
                        </div>
                      )}
                      {questionStarted && (
                        <div className="flex items-center gap-2 text-red-600">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-semibold text-sm sm:text-base">{formatTime(timeRemaining)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                      {INTERVIEW_QUESTIONS[currentQuestionIndex]}
                    </h2>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={replayQuestion}
                        className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Replay question"
                      >
                        <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setTtsEnabled(!ttsEnabled)
                          if (!ttsEnabled) {
                            replayQuestion()
                          } else {
                            stopSpeaking()
                          }
                        }}
                        className={`p-1.5 sm:p-2 rounded-lg transition ${
                          ttsEnabled
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={ttsEnabled ? 'Disable voice' : 'Enable voice'}
                      >
                        {ttsEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {!questionStarted ? (
                  <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                      Take a moment to prepare your answer. When you're ready, click "Start" to begin recording and start the timer.
                    </p>
                    <button
                      onClick={startQuestion}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Start Answering
                    </button>
                  </div>
                ) : (
                  <div className="mb-4 sm:mb-6">
                    <div className="p-4 sm:p-6 bg-green-50 rounded-lg border-2 border-green-200 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        {isAudioRecording ? (
                          <>
                            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 animate-pulse" />
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">Recording your answer...</span>
                          </>
                        ) : (
                          <>
                            <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            <span className="text-gray-600 text-sm sm:text-base">Microphone ready</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Speak clearly into your microphone. Your answer is being recorded.
                      </p>
                    </div>
                  </div>
                )}

                {questionStarted && (
                  <div className="flex gap-3 sm:gap-4">
                    {currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1 ? (
                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={finishInterview}
                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base"
                      >
                        Finish Interview
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showReport && report && (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">Interview Performance Report</h2>
                <p className="text-gray-600 text-base sm:text-lg">Detailed analysis of your interview performance</p>
              </div>

              {/* Performance Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Overall Score */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-600">Overall Score</span>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                      {report.analysis.overallScore}
                      <span className="text-2xl text-gray-500">/100</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${report.analysis.performanceBg} ${report.analysis.performanceColor}`}>
                      {report.analysis.performanceLevel}
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                          style={{ width: `${report.analysis.overallScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-600">Completion</span>
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                      {report.completionRate.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {report.answeredQuestions} of {report.totalQuestions} questions
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${report.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Time Spent */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-yellow-100/50 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-600">Time Spent</span>
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                      {Math.floor(report.analysis.totalTimeSpent / 60)}
                      <span className="text-2xl text-gray-500">m</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Average {Math.round(report.analysis.totalTimeSpent / report.answeredQuestions)}s per question
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Score Breakdown */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Performance Breakdown</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Communication</span>
                      <span className="text-lg font-bold text-blue-600">{report.analysis.communicationScore}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${report.analysis.communicationScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Content Quality</span>
                      <span className="text-lg font-bold text-green-600">{report.analysis.contentScore}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${report.analysis.contentScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Confidence</span>
                      <span className="text-lg font-bold text-purple-600">{Math.min(100, report.analysis.confidenceScore)}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, report.analysis.confidenceScore)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Key Strengths</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {report.analysis.strengths.map((strength, i) => (
                    <div key={i} className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{strength.title}</h4>
                          <p className="text-sm text-gray-700 mb-2">{strength.description}</p>
                          <div className="flex items-start gap-2 mt-3 p-2 bg-white/60 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-600">{strength.tip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Areas for Improvement</h3>
                </div>
                <div className="space-y-4">
                  {report.analysis.areasForImprovement.map((area, i) => (
                    <div key={i} className="p-5 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900">{area.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              area.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {area.priority} Priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{area.description}</p>
                          <div className="p-3 bg-white/80 rounded-lg border border-orange-200">
                            <p className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              <Zap className="w-3 h-3 text-orange-600" />
                              Action Item:
                            </p>
                            <p className="text-sm text-gray-700">{area.action}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recommendations & Next Steps</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {report.analysis.recommendations.map((rec, i) => {
                    const Icon = rec.icon
                    return (
                      <div key={i} className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all group">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">{rec.title}</h4>
                            <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                            <div className="p-3 bg-white/60 rounded-lg">
                              <p className="text-xs font-semibold text-gray-900 mb-1">Resources:</p>
                              <p className="text-xs text-gray-600">{rec.resources}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">Your Action Plan</h3>
                </div>
                <div className="space-y-3">
                  {report.analysis.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-sm sm:text-base flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question-by-Question Analysis */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Question Analysis</h3>
                </div>
                <div className="space-y-4">
                  {report.analysis.questionAnalysis.map((q, i) => (
                    <div key={i} className={`p-4 rounded-xl border-2 ${
                      q.answered 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-600">Q{i + 1}:</span>
                            <span className="text-sm font-medium text-gray-900">{q.question}</span>
                          </div>
                          {q.answered && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600">Score:</span>
                                <span className="text-sm font-bold text-blue-600">{q.score}/100</span>
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{ width: `${q.score}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        {q.answered ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      {q.answered && q.feedback && (
                        <div className="mt-3 p-3 bg-white/60 rounded-lg">
                          <p className="text-xs text-gray-700">{q.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowReport(false)
                    setAnswers([])
                    setCurrentQuestionIndex(0)
                    setIsInterviewing(false)
                  }}
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-5 h-5" />
                  Practice Again
                </button>
                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Save Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

