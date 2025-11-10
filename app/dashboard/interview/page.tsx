'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Video, VideoOff, Clock, CheckCircle, XCircle, Mic, MicOff, Play, Volume2, VolumeX, RotateCw } from 'lucide-react'

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
    
    // Simulate AI analysis
    const analysis = {
      overallScore: Math.min(85, 60 + Math.random() * 25),
      strengths: [
        'Good communication skills demonstrated',
        'Clear articulation of thoughts',
        'Professional demeanor maintained',
      ],
      areasForImprovement: [
        'Could provide more specific examples',
        'Consider elaborating on technical skills',
        'Practice more concise answers',
      ],
      movementAnalysis: 'Maintained good eye contact and posture throughout the interview',
      answerQuality: 'Answers were relevant but could be more detailed',
      recommendations: [
        'Practice more interview questions',
        'Prepare specific examples using STAR method',
        'Work on time management for answers',
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
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Interview Report</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Completion Rate</h3>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{report.completionRate.toFixed(0)}%</div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {report.answeredQuestions} of {report.totalQuestions} questions answered
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Overall Score</h3>
                <div className="text-3xl sm:text-4xl font-bold text-green-600">{report.analysis.overallScore.toFixed(0)}/100</div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">AI Analysis Score</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {report.analysis.strengths.map((strength, i) => (
                    <li key={i} className="text-sm sm:text-base text-gray-700 pl-6 sm:pl-8">• {strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {report.analysis.areasForImprovement.map((area, i) => (
                    <li key={i} className="text-sm sm:text-base text-gray-700 pl-6 sm:pl-8">• {area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Movement Analysis</h3>
                <p className="text-sm sm:text-base text-gray-700">{report.analysis.movementAnalysis}</p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Answer Quality</h3>
                <p className="text-sm sm:text-base text-gray-700">{report.analysis.answerQuality}</p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {report.analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm sm:text-base text-gray-700 pl-6 sm:pl-8">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setShowReport(false)
                  setAnswers([])
                  setCurrentQuestionIndex(0)
                }}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Practice Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

