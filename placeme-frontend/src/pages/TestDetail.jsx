import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { trainingService } from '../services/api'
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const TestDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [testActive, setTestActive] = useState(false)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetchTestDetails()
  }, [id])

  useEffect(() => {
    if (!testActive || !timeRemaining) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testActive, timeRemaining])

  const fetchTestDetails = async () => {
    try {
      const { data } = await trainingService.getTestById(id)
      setTest(data)
    } catch (error) {
      toast.error('Failed to load test')
      navigate('/mock-tests')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = async () => {
    setStarting(true)
    try {
      await trainingService.startTest(id)
      setTestActive(true)
      setTimeRemaining((test.duration || 60) * 60)
      setAnswers({})
    } catch (error) {
      toast.error('Failed to start test')
    } finally {
      setStarting(false)
    }
  }

  const handleAnswerSelect = (optionId) => {
    setAnswers(prev => ({
      ...prev,
      [test.questions[currentQuestion]?.id]: optionId
    }))
  }

  const handleSubmitTest = async () => {
    if (Object.keys(answers).length === 0) {
      toast.warning('Please answer at least one question')
      return
    }

    try {
      await trainingService.submitTestAnswers(id, answers)
      toast.success('Test submitted successfully!')
      setTestActive(false)
      fetchTestDetails()
    } catch (error) {
      toast.error('Failed to submit test')
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours ? hours + 'h ' : ''}${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
        </div>
      </div>
    )
  }

  const currentQ = test.questions?.[currentQuestion]
  const isAnswered = answers[currentQ?.id] !== undefined

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!testActive ? (
        <>
          {/* Back Button */}
          <button
            onClick={() => navigate('/mock-tests')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Tests</span>
          </button>

          {/* Test Info */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
              <h1 className="text-3xl font-bold mb-4">{test.title}</h1>
              <p className="text-blue-100">{test.description}</p>
            </div>

            <div className="px-8 py-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Duration</p>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{test.duration || 60}</span>
                    <span className="text-gray-600">minutes</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{test.questions?.length || 0}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Difficulty</p>
                  <p className="text-2xl font-bold text-gray-900">{test.difficulty || 'Medium'}</p>
                </div>
              </div>

              {/* Instructions */}
              {test.instructions && (
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{test.instructions}</p>
                </div>
              )}

              {/* Start Button */}
              <button
                onClick={handleStartTest}
                disabled={starting}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                  starting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {starting ? 'Starting...' : 'Start Test'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Test Active */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-white flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{test.title}</h1>
                <p className="text-blue-100">
                  Question {currentQuestion + 1} of {test.questions?.length}
                </p>
              </div>
              <div className={`text-lg font-bold ${timeRemaining < 300 ? 'text-red-300' : ''}`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${((currentQuestion + 1) / test.questions?.length) * 100}%` }}
              ></div>
            </div>

            <div className="px-8 py-8">
              {/* Question */}
              {currentQ && (
                <>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQ.text}</h2>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQ.options?.map(option => (
                        <label
                          key={option.id}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition ${
                            answers[currentQ.id] === option.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQ.id}`}
                            value={option.id}
                            checked={answers[currentQ.id] === option.id}
                            onChange={() => handleAnswerSelect(option.id)}
                            className="mr-3"
                          />
                          {option.text}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-8 border-t">
                    <button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      Previous
                    </button>

                    {/* Question Status */}
                    <div className="flex gap-2">
                      {test.questions?.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            answers[q.id]
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          } ${currentQuestion === idx ? 'ring-2 ring-blue-600' : ''}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {currentQuestion === test.questions?.length - 1 ? (
                      <button
                        onClick={handleSubmitTest}
                        className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2"
                      >
                        Next
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TestDetail
