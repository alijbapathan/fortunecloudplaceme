import { useState } from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

const RECRUITER_INFO = {
  name: 'Messi Recruiter',
  company: 'Google',
  email: 'recruiter@google.com',
  avatar: 'https://i.pravatar.cc/150?img=12'
}

export const RecruiterNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-72 right-0 h-20 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-8"
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search candidates, drives..."
          className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:bg-white"
        />

        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-600 hover:text-slate-900">
          <Icons.Bell className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-slate-300" />

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3"
          >
            <img
              src={RECRUITER_INFO.avatar}
              alt={RECRUITER_INFO.name}
              className="w-9 h-9 rounded-full border border-indigo-500"
            />

            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {RECRUITER_INFO.name}
              </p>

              <p className="text-xs text-slate-500">
                {RECRUITER_INFO.company}
              </p>
            </div>

            <Icons.ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg">
              <div className="p-4 border-b border-slate-200">
                <p className="font-semibold">
                  {RECRUITER_INFO.name}
                </p>

                <p className="text-sm text-slate-500">
                  {RECRUITER_INFO.email}
                </p>
              </div>

              <div className="p-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2">
                  <Icons.Settings className="w-4 h-4" />
                  Settings
                </button>

                <button className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Icons.LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}