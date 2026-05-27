import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'

export const Settings = () => {
  const settingsCategories = [
    {
      id: 1,
      title: 'Account Settings',
      icon: 'User',
      items: [
        { label: 'Email Address', value: 'student@example.com', type: 'email' },
        { label: 'Phone Number', value: '+91 98765 43210', type: 'phone' },
        { label: 'Password', value: '••••••••', type: 'password' }
      ]
    },
    {
      id: 2,
      title: 'Notification Preferences',
      icon: 'Bell',
      items: [
        { label: 'Email Notifications', value: true, type: 'toggle' },
        { label: 'Push Notifications', value: true, type: 'toggle' },
        { label: 'SMS Alerts', value: false, type: 'toggle' },
        { label: 'Interview Reminders', value: true, type: 'toggle' }
      ]
    },
    {
      id: 3,
      title: 'Privacy Settings',
      icon: 'Lock',
      items: [
        { label: 'Profile Visibility', value: 'Public', type: 'select', options: ['Public', 'Private', 'Recruiters Only'] },
        { label: 'Show Recent Activity', value: true, type: 'toggle' },
        { label: 'Allow Interview Invites', value: true, type: 'toggle' },
        { label: 'Data Sharing', value: false, type: 'toggle' }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  const IconComponent = ({ name, className = 'w-5 h-5' }) => {
    const icon = Icons[name]
    return icon ? icon({ className }) : null
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account, preferences, and privacy</p>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {settingsCategories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            className="rounded-2xl border border-slate-200 backdrop-blur-xl bg-white overflow-hidden"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 p-6 border-b border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                <IconComponent name={category.icon} className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
            </div>

            {/* Settings Items */}
            <div className="divide-y divide-slate-200">
              {category.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="p-6 flex items-center justify-between hover:transition-all"
                >
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    {item.type === 'email' || item.type === 'phone' || item.type === 'password' ? (
                      <p className="text-sm text-slate-600 mt-1">{item.value}</p>
                    ) : null}
                  </div>

                  {/* Toggle Switch */}
                  {item.type === 'toggle' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-6 rounded-full transition-all ${
                        item.value
                          ? 'bg-emerald-500'
                          : 'bg-slate-400'
                      }`}
                    >
                      <motion.div
                        animate={{ x: item.value ? 24 : 2 }}
                        className="w-5 h-5 rounded-full bg-white mt-0.5 ml-0.5"
                      />
                    </motion.button>
                  )}

                  {/* Select Dropdown */}
                  {item.type === 'select' && (
                    <select
                      defaultValue={item.value}
                      className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-400 cursor-pointer hover:border-slate-300 transition-all"
                    >
                      {item.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Edit Button for email/phone/password */}
                  {(item.type === 'email' || item.type === 'phone' || item.type === 'password') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all text-sm font-medium"
                    >
                      Edit
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-red-500/30 backdrop-blur-xl bg-red-500/10 p-6"
      >
        <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-slate-600 text-sm mb-4">Irreversible actions</p>
        <div className="flex flex-col gap-3">
          <Button variant="outline">
            <Icons.LogOut className="w-4 h-4" />
            Sign Out from All Devices
          </Button>
          <Button variant="danger">
            <Icons.Trash2 className="w-4 h-4" />
            Delete My Account
          </Button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 py-6 border-t border-slate-200"
      >
        <Button variant="primary">
          <Icons.Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button variant="secondary">
          Reset to Defaults
        </Button>
      </motion.div>
    </div>
  )
}
