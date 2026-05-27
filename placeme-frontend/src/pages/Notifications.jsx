import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { NOTIFICATIONS } from '../constants/dummyData'

export const NotificationsPage = () => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'placement':
        return 'Briefcase'
      case 'training':
        return 'BookOpen'
      case 'interview':
        return 'Users'
      case 'achievement':
        return 'Trophy'
      case 'message':
        return 'MessageSquare'
      default:
        return 'Bell'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'placement':
        return 'blue'
      case 'training':
        return 'purple'
      case 'interview':
        return 'yellow'
      case 'achievement':
        return 'emerald'
      case 'message':
        return 'cyan'
      default:
        return 'gray'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length
  const readNotifications = NOTIFICATIONS.filter(n => n.read)
  const unreadNotifications = NOTIFICATIONS.filter(n => !n.read)

  const IconComponent = ({ name, className = 'w-5 h-5' }) => {
    const icon = Icons[name]
    return icon ? icon({ className }) : null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Notifications</h1>
            <p className="text-slate-600">Stay updated with placement & training opportunities</p>
          </div>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/50 text-red-600 text-sm font-semibold"
            >
              {unreadCount} New
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filter & Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <Button variant="primary" size="sm">All</Button>
        <Button variant="secondary" size="sm">Placement</Button>
        <Button variant="secondary" size="sm">Training</Button>
        <Button variant="secondary" size="sm">Interviews</Button>
        <div className="ms-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Settings className="w-4 h-4" />
            Preferences
          </Button>
          <Button variant="ghost" size="sm">
            <Icons.MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">📌 New Notifications</h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {unreadNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className="group rounded-xl border border-indigo-500/30 backdrop-blur-xl bg-gradient-to-r from-indigo-500/15 to-indigo-500/5 hover:border-indigo-500/50 transition-all p-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mt-1">
                    <IconComponent name={getNotificationIcon(notif.type)} className="w-6 h-6 text-indigo-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-slate-900">{notif.title}</h4>
                      <span className="text-xs text-slate-600 flex-shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                    {notif.actionLink && (
                      <motion.button
                        whileHover={{ x: 3 }}
                        className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors mt-2 flex items-center gap-1"
                      >
                        {notif.actionText || 'View'} <Icons.ArrowRight className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all"
                  >
                    <Icons.X className="w-4 h-4 text-slate-600" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Previous</h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {readNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="group rounded-xl border border-slate-200 backdrop-blur-xl bg-slate-50 hover:border-indigo-300 hover:bg-slate-100 transition-all p-4 cursor-pointer opacity-75 hover:opacity-100"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                    <IconComponent name={getNotificationIcon(notif.type)} className="w-5 h-5 text-slate-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                      <span className="text-xs text-slate-600 flex-shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{notif.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {unreadNotifications.length === 0 && readNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-slate-200 backdrop-blur-xl bg-white"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4"
          >
            <Icons.Bell className="w-8 h-8 text-slate-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-slate-600 text-center max-w-md">
            No notifications right now. Check back later for new opportunities and updates.
          </p>
          <Button variant="primary" className="mt-6">
            <Icons.Settings className="w-4 h-4" />
            Notification Settings
          </Button>
        </motion.div>
      )}
    </div>
  )
}
