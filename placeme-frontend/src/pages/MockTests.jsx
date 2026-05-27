import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { MOCK_TESTS } from '../constants/dummyData'

export const MockTests = () => {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Mock Tests</h1>
        <p className="text-slate-600">Practice and improve your test-taking skills</p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: 'Tests Completed', value: '8', icon: Icons.CheckCircle2, color: 'emerald' },
          { label: 'Average Score', value: '74%', icon: Icons.TrendingUp, color: 'blue' },
          { label: 'Best Score', value: '92%', icon: Icons.Award, color: 'purple' }
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl border backdrop-blur-xl bg-gradient-to-br ${
                stat.color === 'emerald'
                  ? 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20'
                  : stat.color === 'blue'
                  ? 'from-blue-500/10 to-blue-600/10 border-blue-500/20'
                  : 'from-purple-500/10 to-purple-600/10 border-purple-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-slate-100 ${
                  stat.color === 'emerald' ? 'text-emerald-600' :
                  stat.color === 'blue' ? 'text-indigo-600' : 'text-purple-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Tests Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {MOCK_TESTS.map((test) => (
          <motion.div
            key={test.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white hover:border-indigo-300 transition-all p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{test.name}</h3>
                <p className="text-slate-600 text-sm mt-1">{test.category}</p>
              </div>
              {test.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="p-2 rounded-lg bg-emerald-500/20"
                >
                  <Icons.CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </motion.div>
              )}
            </div>

            {/* Test Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-slate-100 border border-slate-200">
              <div>
                <p className="text-xs text-slate-600">Questions</p>
                <p className="text-lg font-bold text-slate-900">{test.questions}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Duration</p>
                <p className="text-lg font-bold text-slate-900">{test.duration}m</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Best Score</p>
                <p className="text-lg font-bold text-indigo-600">{test.bestScore}/{test.questions}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Attempts</p>
                <p className="text-lg font-bold text-purple-600">{test.totalAttempts}</p>
              </div>
            </div>

            {/* Performance Bar */}
            {test.completed && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-slate-600">Performance</p>
                  <p className="text-sm font-semibold text-indigo-600">
                    {Math.round((test.bestScore / test.questions) * 100)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(test.bestScore / test.questions) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Status */}
            <div className="mb-6">
              {test.completed ? (
                <Badge variant="success">Completed</Badge>
              ) : (
                <Badge variant="warning">Not Started</Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {test.completed ? (
                <>
                  <Button variant="primary" className="flex-1">
                    Retake Test
                  </Button>
                  <Button variant="secondary">
                    <Icons.Eye className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button variant="primary" className="w-full">
                  Start Test
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
