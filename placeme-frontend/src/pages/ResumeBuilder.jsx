import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'

import { auth } from '../services/apiClient'

export const ResumeBuilder = () => {
  // ============================================
  // STATE
  // ============================================

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [resumeData, setResumeData] =
    useState({
      headline: '',
      summary: '',
      skills: '',
      education: '',
      experience: '',
      projects: '',
      linkedin_url: '',
      github_url: '',
      portfolio_url: '',
    })

  // ============================================
  // FETCH RESUME
  // ============================================

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    try {
      setLoading(true)

      const response =
        await auth.getResume()

      setResumeData({
        headline:
          response.data.headline ||
          '',

        summary:
          response.data.summary ||
          '',

        skills:
          response.data.skills ||
          '',

        education:
          response.data.education ||
          '',

        experience:
          response.data.experience ||
          '',

        projects:
          response.data.projects ||
          '',

        linkedin_url:
          response.data.linkedin_url ||
          '',

        github_url:
          response.data.github_url ||
          '',

        portfolio_url:
          response.data.portfolio_url ||
          '',
      })

    } catch (error) {
      console.error(
        'Error fetching resume:',
        error
      )

    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // HANDLE CHANGE
  // ============================================

  const handleChange = (e) => {
    const { name, value } =
      e.target

    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ============================================
  // SAVE RESUME
  // ============================================

  const handleSaveResume =
    async () => {
      try {
        setSaving(true)

        await auth.updateResume(
          resumeData
        )

        alert(
          'Resume saved successfully 😎🔥'
        )

      } catch (error) {
        console.error(
          'Error saving resume:',
          error.response?.data ||
            error
        )

        alert(
          'Failed to save resume'
        )

      } finally {
        setSaving(false)
      }
    }

  // ============================================
  // CALCULATE COMPLETION
  // ============================================

  const fields = Object.values(
    resumeData
  )

  const completedFields =
    fields.filter(
      (field) =>
        field &&
        field.trim() !== ''
    ).length

  const completionPercentage =
    Math.round(
      (completedFields /
        fields.length) *
        100
    )

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-600">
            Loading resume...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <h1 className="text-4xl font-bold text-slate-900 mb-2">

          Resume Builder
        </h1>

        <p className="text-slate-600">
          Build your professional
          resume for placements
        </p>
      </motion.div>

      {/* PROGRESS */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >

        <div className="flex items-center justify-between mb-4">

          <h3 className="text-lg font-bold text-slate-900">

            Resume Completion
          </h3>

          <span className="text-2xl font-bold text-indigo-600">

            {
              completionPercentage
            }
            %
          </span>
        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${completionPercentage}%`,
            }}
            transition={{
              duration: 0.8,
            }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
      </motion.div>

      {/* FORM */}
      <DashboardCard
        title="Resume Details"
        icon={Icons.FileText}
      >

        <div className="space-y-6">

          {/* HEADLINE */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">

              Professional Headline
            </label>

            <input
              type="text"
              name="headline"
              value={
                resumeData.headline
              }
              onChange={
                handleChange
              }
              placeholder="Frontend Developer | MERN Stack | Problem Solver"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SUMMARY */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">

              Professional Summary
            </label>

            <textarea
              rows={4}
              name="summary"
              value={
                resumeData.summary
              }
              onChange={
                handleChange
              }
              placeholder="Write a short professional summary..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SKILLS */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">

              Skills
            </label>

            <textarea
              rows={3}
              name="skills"
              value={
                resumeData.skills
              }
              onChange={
                handleChange
              }
              placeholder="React, Django, Python, SQL, JavaScript..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EDUCATION */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">

              Education
            </label>

            <textarea
              rows={4}
              name="education"
              value={
                resumeData.education
              }
              onChange={
                handleChange
              }
              placeholder="Your education details..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EXPERIENCE */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">

              Experience
            </label>

            <textarea
              rows={4}
              name="experience"
              value={
                resumeData.experience
              }
              onChange={
                handleChange
              }
              placeholder="Internships, work experience..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PROJECTS */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">

              Projects
            </label>

            <textarea
              rows={4}
              name="projects"
              value={
                resumeData.projects
              }
              onChange={
                handleChange
              }
              placeholder="Your major projects..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                LinkedIn URL
              </label>

              <input
                type="text"
                name="linkedin_url"
                value={
                  resumeData.linkedin_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://linkedin.com/..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                GitHub URL
              </label>

              <input
                type="text"
                name="github_url"
                value={
                  resumeData.github_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Portfolio URL
              </label>

              <input
                type="text"
                name="portfolio_url"
                value={
                  resumeData.portfolio_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://portfolio.com/..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center pt-4">

            <Button
              variant="primary"
              onClick={
                handleSaveResume
              }
              disabled={saving}
            >

              {saving ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icons.Save className="w-4 h-4" />
                  Save Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}