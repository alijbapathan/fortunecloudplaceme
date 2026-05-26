import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { placementService, trainingService, notificationService } from '../services/api'
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  CheckCircleIcon,
  BellIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    upcomingDrives: 0,
    applications: 0,
    enrolledCourses: 0,
    testAttempts: 0,
    unreadNotifications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentApps, setRecentApps] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [drives, apps, courses, notifs] = await Promise.all([
        placementService.getUpcomingDrives(),
        placementService.getApplications(),
        trainingService.getEnrollments(),
        notificationService.getUnreadNotifications(),
      ])

      setStats({
        upcomingDrives: drives.data?.length || 0,
        applications: apps.data?.length || 0,
        enrolledCourses: courses.data?.length || 0,
        testAttempts: 0,
        unreadNotifications: notifs.data?.length || 0,
      })

      setRecentApps(apps.data?.slice(0, 3) || [])
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Upcoming Drives',
      value: stats.upcomingDrives,
      icon: BriefcaseIcon,
      color: 'bg-blue-100 text-blue-600',
      link: '/placement-drives',
    },
    {
      title: 'Applications',
      value: stats.applications,
      icon: CheckCircleIcon,
      color: 'bg-green-100 text-green-600',
      link: '/applications',
    },
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses,
      icon: AcademicCapIcon,
      color: 'bg-purple-100 text-purple-600',
      link: '/mock-tests',
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      icon: BellIcon,
      color: 'bg-yellow-100 text-yellow-600',
      link: '/notifications',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's what's happening with your placements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Link
              key={idx}
              to={card.link}
              className="card hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Recent Applications */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <Link to="/applications" className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>

          {recentApps.length > 0 ? (
            <div className="space-y-4">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {app.drive?.company?.name} - {app.drive?.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: <span className={`font-semibold ${
                        app.status === 'selected' ? 'text-green-600' :
                        app.status === 'rejected' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No applications yet</p>
              <Link to="/placement-drives" className="btn-primary mt-4 inline-block">
                Browse Drives
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Quick Links</h3>
          <div className="space-y-3">
            <Link
              to="/placement-drives"
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-blue-900">Browse Drives</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/mock-tests"
              className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-green-900">Take Tests</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-purple-900">Update Profile</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/notifications"
              className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-yellow-900">Notifications</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
          <p className="text-blue-800 text-sm">
            Complete your profile and take practice tests to increase your chances of getting selected.
          </p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">✨ Success Tip</h3>
          <p className="text-green-800 text-sm">
            Check your profile score and interview experiences from successful candidates.
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
