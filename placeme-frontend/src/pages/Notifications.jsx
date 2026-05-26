import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { notificationService } from '../services/api'
import {
  BellIcon,
  CheckIcon,
  EnvelopeOpenIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [markingRead, setMarkingRead] = useState(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationService.getMyNotifications()
      setNotifications(data || [])
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    setMarkingRead(id)
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      )
      toast.success('Marked as read')
    } catch (error) {
      toast.error('Failed to mark as read')
    } finally {
      setMarkingRead(null)
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.is_read
    if (filter === 'read') return notif.is_read
    return true
  })

  const getTypeColor = (type) => {
    switch (type) {
      case 'placement':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'training':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'application':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your placement journey</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {['all', 'unread', 'read'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterType === 'all' ? 'All' : filterType === 'unread' ? 'Unread' : 'Read'}
            {filterType === 'unread' && (
              <span className="ml-2 bg-red-500 text-white px-2 py-0 rounded-full text-xs">
                {notifications.filter(n => !n.is_read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h2>
          <p className="text-gray-600">
            {filter === 'unread'
              ? 'You have no unread notifications'
              : 'Come back later to see updates'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl shadow-md p-6 border-l-4 transition hover:shadow-lg ${
                notif.is_read ? 'border-l-gray-300 opacity-75' : 'border-l-blue-600'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Type Badge */}
                  {notif.notification?.type && (
                    <div className="mb-3 inline-block">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTypeColor(notif.notification.type)}`}>
                        {notif.notification.type.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {notif.notification?.title}
                  </h3>

                  {/* Message */}
                  <p className="text-gray-700 mb-3">
                    {notif.notification?.message}
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Action Button */}
                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    disabled={markingRead === notif.id}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition whitespace-nowrap disabled:opacity-50"
                  >
                    <EnvelopeOpenIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Mark read</span>
                  </button>
                )}

                {notif.is_read && (
                  <CheckIcon className="w-5 h-5 text-green-600 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
