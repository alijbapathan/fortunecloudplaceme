import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { placementService } from '../services/api'
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const { data } = await placementService.getApplications()
      setApplications(data || [])
    } catch (error) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true
    return app.status === filterStatus
  })

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track your placement drive applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {['all', 'pending', 'shortlisted', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No applications</h2>
          <p className="text-gray-600 mb-4">
            {filterStatus === 'all'
              ? "You haven't applied to any drives yet."
              : `No ${filterStatus} applications yet.`}
          </p>
          <Link to="/placement-drives" className="btn-primary inline-block">
            Browse Placement Drives
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{app.drive?.role}</h3>
                    <p className="text-gray-600">{app.drive?.company?.name}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-4 h-4" />
                    <span>{app.drive?.positions_available} positions</span>
                  </div>
                  {app.status !== 'pending' && (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(app.status)}
                      <span>
                        {app.status === 'accepted' && 'Congratulations!'}
                        {app.status === 'rejected' && 'Better luck next time'}
                        {app.status === 'shortlisted' && 'Keep preparing!'}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/drives/${app.drive?.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View Drive Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Applications
