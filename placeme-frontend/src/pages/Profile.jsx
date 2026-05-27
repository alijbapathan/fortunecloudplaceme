import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { STUDENT_INFO } from '../constants/dummyData'

const ComingSoonSection = ({ title, icon: Icon }) => {
  return (
    <DashboardCard title={title} icon={Icon}>
      <div className="py-12 flex flex-col items-center justify-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          🚀
        </motion.div>
        <p className="text-slate-600 text-center">
          This feature is coming soon. We're building something amazing!
        </p>
      </div>
    </DashboardCard>
  )
}

export const Profile = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your personal information and portfolio</p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative z-10">
          <div className="flex items-start gap-6">
            <img
              src={STUDENT_INFO.avatar}
              alt={STUDENT_INFO.name}
              className="w-24 h-24 rounded-full border-4 border-indigo-500/50"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900">{STUDENT_INFO.name}</h2>
              <p className="text-slate-600 mt-1">{STUDENT_INFO.email}</p>
              <div className="flex gap-4 mt-4">
                <Badge variant="default">{STUDENT_INFO.branch}</Badge>
                <Badge variant="success">CGPA: {STUDENT_INFO.cgpa}</Badge>
                <Badge variant="purple">Member since {STUDENT_INFO.joinDate}</Badge>
              </div>
            </div>
            <Button variant="primary">Edit Profile</Button>
          </div>
        </div>
      </motion.div>

      {/* Profile Sections */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ComingSoonSection title="Skills" icon={Icons.Zap} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ComingSoonSection title="Projects" icon={Icons.Code} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ComingSoonSection title="Certifications" icon={Icons.Award} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ComingSoonSection title="Resume" icon={Icons.FileDown} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <ComingSoonSection title="Social Links" icon={Icons.Share2} />
        </motion.div>
      </motion.div>
    </div>
  )
}
