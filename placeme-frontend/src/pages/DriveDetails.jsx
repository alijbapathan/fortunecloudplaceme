import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { placementService } from '../services/api'
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const DriveDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [drive, setDrive] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    fetchDriveDetails()
  }, [id])

  const fetchDriveDetails = async () => {
    try {
      const { data } = await placementService.getDriveById(id)
      setDrive(data)
    } catch (error) {
      toast.error('Failed to load drive details')
      navigate('/placement-drives')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    setApplying(true)
    try {
      await placementService.applyToDrive(id)
      toast.success('Application submitted successfully!')
      fetchDriveDetails()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply to drive')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!drive) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Drive not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/placement-drives')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Drives</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{drive.role}</h1>
              <p className="text-blue-100 text-lg">{drive.company?.name}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              drive.status === 'upcoming' ? 'bg-blue-200 text-blue-900' :
              drive.status === 'ongoing' ? 'bg-green-200 text-green-900' :
              'bg-gray-200 text-gray-900'
            }`}>
              {drive.status?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-8">
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Base Salary</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{drive.salary_package?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {drive.location || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Drive Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(drive.drive_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Positions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {drive.positions_available || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span>Minimum CGPA: {drive.min_cgpa || 'Not specified'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span>Backlogs Allowed: {drive.backlogs_allowed ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span>Preferred Branches: {drive.preferred_branches || 'All'}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {drive.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{drive.description}</p>
            </div>
          )}

          {/* Application Button */}
          <div className="flex gap-4">
            <button
              onClick={handleApply}
              disabled={applying || drive.application_status === 'applied'}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                drive.application_status === 'applied'
                  ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${applying ? 'opacity-50' : ''}`}
            >
              {applying ? 'Applying...' : 
               drive.application_status === 'applied' ? '✓ Already Applied' : 
               'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriveDetails
