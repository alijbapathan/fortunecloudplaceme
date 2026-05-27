import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { UPCOMING_DRIVES } from '../constants/dummyData'

export const PlacementDrives = () => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Placement Drives</h1>
        <p className="text-slate-600">Browse and apply to active placement drives</p>
      </motion.div>

      {/* Filter & Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 flex-wrap"
      >
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all"
          />
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        </div>
        <Button variant="secondary">Filter</Button>
      </motion.div>

      {/* Drives Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {UPCOMING_DRIVES.map((drive) => (
          <motion.div
            key={drive.id}
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(59, 130, 246, 0.1)' }}
            className="group overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white hover:border-indigo-300 transition-all"
          >
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={drive.logo}
                alt={drive.company}
                className="absolute w-20 h-20 top-1/2 left-8 -translate-y-1/2 rounded-lg border-2 border-white shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{drive.company}</h3>
              <p className="text-slate-600 text-sm mt-2">{drive.position}</p>

              {/* Package */}
              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-xs text-emerald-300 font-medium">PACKAGE</p>
                <p className="text-2xl font-bold text-emerald-300 mt-1">{drive.package}</p>
              </div>

              {/* Requirements */}
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-slate-600 mb-2">ELIGIBILITY</p>
                  <Badge variant="default">{drive.eligibility}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">REQUIRED SKILLS</p>
                  <div className="flex flex-wrap gap-2">
                    {drive.skills.map((skill) => (
                      <Badge key={skill} variant="purple" size="xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Icons.Calendar className="w-4 h-4" />
                  Deadline: {drive.deadline}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button variant="primary" className="flex-1">
                  Apply Now
                </Button>
                <Button variant="secondary" size="md">
                  <Icons.Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No More Drives Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-12"
      >
        <p className="text-slate-600">
          Want to see more drives? <span className="text-indigo-600 cursor-pointer hover:underline">Explore archived drives</span>
        </p>
      </motion.div>
    </div>
  )
}
