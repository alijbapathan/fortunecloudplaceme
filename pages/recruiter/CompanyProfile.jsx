import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import { toast } from 'react-toastify'

import {
  recruiterService,
  authService,
} from '../../services/api'

export default function CompanyProfile() {

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [companyId, setCompanyId] =
    useState(null)

  const [user, setUser] =
    useState(null)

  const [company, setCompany] =
    useState({
      name: '',
      website: '',
      industry: '',
      location: '',
      description: '',
      logo_url: '',
    })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {

    try {

      const [
        companyRes,
        userRes,
      ] = await Promise.all([
        recruiterService.getMyCompany(),
        authService.getProfile(),
      ])

      setCompanyId(
        companyRes.data.id
      )

      setCompany(
        companyRes.data
      )

      setUser(
        userRes.data
      )

    } catch (error) {

      console.error(error)

      toast.error(
        'Failed to load company profile'
      )

    } finally {

      setLoading(false)
    }
  }

  const handleChange = (e) => {

    setCompany({
      ...company,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSave = async () => {

    try {

      setSaving(true)

      await recruiterService.updateCompany(
        companyId,
        company
      )

      window.dispatchEvent(
        new Event(
          'companyUpdated'
        )
      )

      toast.success(
        'Company profile updated successfully'
      )

    } catch (error) {

      console.error(error)

      toast.error(
        'Failed to update profile'
      )

    } finally {

      setSaving(false)
    }
  }

  const initials =
    company.name
      ? company.name
          .split(' ')
          .map(
            word =>
              word[0]
          )
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'CO'

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[70vh]">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />

      </div>
    )
  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-lg">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          <div className="flex items-center gap-6">

            {company.logo_url ? (

              <img
                src={company.logo_url}
                alt={company.name}
                className="w-28 h-28 rounded-3xl object-cover bg-white p-2"
              />

            ) : (

              <div className="w-28 h-28 rounded-3xl bg-white/20 flex items-center justify-center text-3xl font-bold">

                {initials}

              </div>

            )}

            <div>

              <h1 className="text-4xl font-bold">

                {company.name || 'Company'}

              </h1>

              <p className="mt-2 text-lg text-indigo-100">

                {company.industry || 'Industry'}

              </p>

              <p className="text-indigo-100">

                {company.location || 'Location'}

              </p>

              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">

                <Icons.User size={16} />

                <span>

                  Recruiter: {user?.username}

                </span>

              </div>

            </div>

          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >

            {saving
              ? 'Saving...'
              : 'Save Changes'}

          </button>

        </div>

      </div>

      {/* COMPANY DETAILS */}

      <div className="bg-white rounded-3xl border shadow-sm p-8">

        <h2 className="text-2xl font-bold mb-6">

          Company Information

        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">

              Company Name

            </label>

            <input
              name="name"
              value={company.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Website

            </label>

            <input
              name="website"
              value={company.website || ''}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Industry

            </label>

            <input
              name="industry"
              value={company.industry || ''}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Location

            </label>

            <input
              name="location"
              value={company.location || ''}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">

              Company Logo URL

            </label>

            <input
              name="logo_url"
              value={company.logo_url || ''}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="https://..."
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">

              About Company

            </label>

            <textarea
              rows="6"
              name="description"
              value={
                company.description || ''
              }
              onChange={handleChange}
              className="w-full border rounded-xl p-3 resize-none"
            />

          </div>

        </div>

      </div>

      {/* RECRUITER INFO */}

      <div className="bg-white rounded-3xl border shadow-sm p-8">

        <h2 className="text-2xl font-bold mb-6">

          Recruiter Information

        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">

              Username

            </p>

            <h3 className="font-semibold text-lg mt-1">

              {user?.username}

            </h3>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">

              Email

            </p>

            <h3 className="font-semibold text-lg mt-1">

              {user?.email}

            </h3>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">

              Role

            </p>

            <h3 className="font-semibold text-lg mt-1 capitalize">

              {user?.role}

            </h3>

          </div>

        </div>

      </div>

    </div>
  )
}