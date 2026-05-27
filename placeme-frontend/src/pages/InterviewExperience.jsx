import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { INTERVIEW_EXPERIENCES } from '../constants/dummyData'

export const InterviewExperience = () => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'success'
      case 'Medium':
        return 'warning'
      case 'Hard':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getResultColor = (result) => {
    return result === 'Selected' ? 'success' : 'danger'
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Interview Experiences</h1>
        <p className="text-slate-600">Learn from others and share your experiences</p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4"
      >
        <Button variant="primary">
          <Icons.Plus className="w-4 h-4" />
          Share My Experience
        </Button>
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all"
          />
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        </div>
      </motion.div>

      {/* Experiences Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {INTERVIEW_EXPERIENCES.map((exp) => (
          <motion.div
            key={exp.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white hover:border-indigo-300 transition-all p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{exp.company}</h3>
                <p className="text-slate-600 text-sm mt-1">{exp.position}</p>
              </div>
              <Badge variant={getResultColor(exp.result)}>
                {exp.result === 'Selected' ? '✓ Selected' : '✗ Rejected'}
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="default">{exp.difficulty} Difficulty</Badge>
              <Badge variant="purple">{exp.rounds}</Badge>
              <Badge variant="secondary" size="xs">
                {exp.date}
              </Badge>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-200 mb-6" />

            {/* Content */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-2">Interview Rounds</h4>
                <p className="text-sm text-slate-600">{exp.rounds}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-2">Questions Asked</h4>
                <p className="text-sm text-slate-600">{exp.questionsAsked}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">💡 Tips</h4>
                <p className="text-sm text-yellow-300/80 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                  {exp.tips}
                </p>
              </div>
            </div>

            {/* Author & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-600">Shared by</p>
                <p className="text-sm font-semibold text-slate-900">{exp.author}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-indigo-600 transition-all"
              >
                <Icons.MessageSquare className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
