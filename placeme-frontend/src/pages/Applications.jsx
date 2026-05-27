import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Badge } from '../components/Badge'
import { APPLICATIONS } from '../constants/dummyData'

const StageIndicator = ({ stages }) => {
  return (
    <div className="flex items-center justify-between gap-2 mt-4">
      {stages.map((stage, idx) => (
        <motion.div key={idx} className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              stage.completed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-200 text-slate-600 border border-slate-300'
            }`}
          >
            {stage.completed ? '✓' : idx + 1}
          </motion.div>
          <p className="text-xs text-slate-600 mt-2 text-center">{stage.name}</p>
          {idx < stages.length - 1 && (
            <div
              className={`absolute h-0.5 w-[calc(100%-2rem)] top-4 -right-[calc(50%+1rem)] ${
                stage.completed ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-white/10'
              }`}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

export const Applications = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'default'
      case 'Under Review':
        return 'warning'
      case 'Shortlisted':
        return 'success'
      case 'Interview Scheduled':
        return 'purple'
      case 'Selected':
        return 'success'
      default:
        return 'default'
    }
  }

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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-600">Track the status of your job applications</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Applied', value: APPLICATIONS.length, color: 'blue' },
          { label: 'Shortlisted', value: 1, color: 'emerald' },
          { label: 'Interviews', value: 1, color: 'purple' },
          { label: 'Rejected', value: 0, color: 'red' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2 }}
            className={`p-4 rounded-lg border bg-gradient-to-br backdrop-blur-xl ${
              stat.color === 'blue'
                ? 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/20'
                : stat.color === 'emerald'
                ? 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20'
                : stat.color === 'purple'
                ? 'from-purple-500/10 to-purple-600/10 border-purple-500/20'
                : 'from-red-500/10 to-red-600/10 border-red-500/20'
            }`}
          >
            <p className="text-xs text-slate-600">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Applications List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {APPLICATIONS.map((app, idx) => (
          <motion.div
            key={app.id}
            variants={itemVariants}
            className="overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white hover:border-indigo-300 transition-all p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{app.company}</h3>
                <p className="text-slate-600 text-sm mt-1">{app.position}</p>
                <p className="text-xs text-slate-500 mt-2">Applied on: {app.appliedDate}</p>
              </div>
              <Badge variant={getStatusColor(app.status)}>
                {app.status}
              </Badge>
            </div>

            {/* Progress Timeline */}
            <div className="relative">
              <StageIndicator stages={app.stages} />
            </div>

            {/* Timeline View */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(app.stages.filter(s => s.completed).length / app.stages.length) * 100}%`
                      }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {app.stages.filter(s => s.completed).length}/{app.stages.length}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium transition-all border border-slate-200"
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 text-sm font-medium transition-all border border-indigo-500/30 hover:border-indigo-500/50"
              >
                Follow Up
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
