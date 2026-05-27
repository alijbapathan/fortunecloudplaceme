import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

export const ResumeBuilder = () => {
  const resumeSections = [
    { id: 1, title: 'Personal Information', icon: 'User', status: 'completed', fields: ['Name', 'Email', 'Phone'] },
    { id: 2, title: 'Education', icon: 'BookOpen', status: 'completed', fields: ['Degree', 'College', 'CGPA'] },
    { id: 3, title: 'Experience', icon: 'Briefcase', status: 'pending', fields: ['Company', 'Position', 'Duration'] },
    { id: 4, title: 'Skills', icon: 'Zap', status: 'pending', fields: ['Technical', 'Soft Skills'] },
    { id: 5, title: 'Projects', icon: 'Code2', status: 'pending', fields: ['Project Name', 'Description', 'Link'] },
    { id: 6, title: 'Certifications', icon: 'Award', status: 'pending', fields: ['Certification', 'Authority', 'Date'] }
  ]

  const IconComponent = ({ name, className = 'w-5 h-5' }) => {
    const icon = Icons[name]
    return icon ? icon({ className }) : null
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Resume Builder</h1>
        <p className="text-slate-600">Create an ATS-optimized resume to impress recruiters</p>
      </motion.div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 backdrop-blur-xl bg-white p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Resume Completion</h3>
          <span className="text-2xl font-bold text-indigo-600">50%</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
        <p className="text-sm text-slate-600 mt-3">Complete 3 more sections to unlock recommendations</p>
      </motion.div>

      {/* Sections Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {resumeSections.map((section) => (
          <motion.div
            key={section.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`rounded-2xl border backdrop-blur-xl transition-all p-6 cursor-pointer group ${
              section.status === 'completed'
                ? 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            {/* Icon & Title */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                section.status === 'completed'
                  ? 'bg-emerald-500/20'
                  : 'bg-slate-100'
              }`}>
                <IconComponent name={section.icon} className={`w-6 h-6 ${
                  section.status === 'completed'
                    ? 'text-emerald-400'
                    : 'text-slate-600 group-hover:text-indigo-600 transition-colors'
                }`} />
              </div>
              {section.status === 'completed' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <Icons.Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{section.title}</h3>

            {/* Fields Preview */}
            <div className="space-y-2 mb-4">
              {section.fields.map((field, idx) => (
                <p key={idx} className="text-xs text-slate-600">
                  ✓ {field}
                </p>
              ))}
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all text-sm font-medium flex items-center justify-center gap-2 group"
            >
              <span>{section.status === 'completed' ? 'Edit' : 'Complete'}</span>
              <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200 backdrop-blur-xl bg-white p-8"
      >
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Resume Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: 'Check', text: 'ATS-Optimized Templates' },
            { icon: 'FileJson', text: 'One-Click Export' },
            { icon: 'Zap', text: 'AI Content Suggestions' },
            { icon: 'Eye', text: 'Live Preview' },
            { icon: 'Share2', text: 'Easy Sharing' },
            { icon: 'TrendingUp', text: 'Performance Analytics' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <IconComponent name={feature.icon} className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-slate-900">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="primary">
          <Icons.Download className="w-4 h-4" />
          Download Resume
        </Button>
        <Button variant="secondary">
          <Icons.Share2 className="w-4 h-4" />
          Share Profile
        </Button>
      </motion.div>
    </div>
  )
}
