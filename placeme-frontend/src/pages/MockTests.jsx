import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { trainingService } from '../services/api'
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const MockTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const { data } = await trainingService.getMockTests()
      setTests(data.results || data)
    } catch (error) {
      toast.error('Failed to load mock tests')
    } finally {
      setLoading(false)
    }
  }

  const getCategory = test => test.category || 'General'

  const filteredTests = tests.filter(test => {
    const matchesCategory = filterCategory === 'all' || getCategory(test) === filterCategory
    const matchesSearch = test.title?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['all', ...new Set(tests.map(getCategory))]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Tests</h1>
        <p className="text-gray-600">Prepare for placements with our comprehensive mock tests</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full input-field"
        />

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h2>
          <p className="text-gray-600">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <Link key={test.id} to={`/tests/${test.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition h-full overflow-hidden hover:scale-105 transform">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{test.title}</h3>
                      <p className="text-sm text-gray-600">{getCategory(test)}</p>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-blue-600">{test.difficulty || 'Medium'}</span>
                    </div>
                  </div>

                  {test.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
                  )}

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{test.duration || 60} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="w-4 h-4" />
                      <span>{test.questions_count || 0} Questions</span>
                    </div>
                    {test.is_attempted && (
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      {test.is_attempted ? 'Retake Test' : 'Start Test'} →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MockTests
