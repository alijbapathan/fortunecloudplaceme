import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuthStore } from '../../context/authContext'
import {
  recruiterService,
  authService,
} from '../../services/api'
export default function CompanyProfile() {

  const [loading, setLoading] = useState(true)

  const [companyId, setCompanyId] =
    useState(null)

  const [company, setCompany] = useState({
    name: '',
    website: '',
    industry: '',
    location: '',
    description: '',
    logo_url: '',
  })

  const [user, setUser] = useState({})

  const token = useAuthStore(
  (state) => state.token
)

useEffect(() => {

  console.log('TOKEN =', token)

  if (token) {
    loadData()
  }

}, [token])

  const loadData = async () => {

    try {

      const [
        companyRes,
        userRes,
      ] = await Promise.all([
        recruiterService.getMyCompany(),
        authService.getProfile(),
      ])

      const companyData = companyRes.data

console.log(
  'COMPANY DATA:',
  companyData
)

setCompanyId(companyData.id)

setCompany({
  name: companyData.name || '',
  website: companyData.website || '',
  industry: companyData.industry || '',
  location: companyData.location || '',
  description: companyData.description || '',
  logo_url: companyData.logo_url || '',
})

      setUser(userRes.data)

    } catch (error) {

  console.error(error)

  console.log(
    'UPDATE ERROR:',
    error.response?.data
  )

  toast.error(
    JSON.stringify(
      error.response?.data
    )
  )


    } finally {

      setLoading(false)
    }
  }

  const handleChange = (e) => {


    window.dispatchEvent(
  new Event(
    'companyUpdated'
  )
)
    setCompany({
      ...company,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSave = async () => {

    try {

      await recruiterService.updateCompany(
        companyId,
        company
      )

      toast.success(
        'Company profile updated'
      )

    } catch (error) {

      console.error(error)

      toast.error(
        'Failed to update profile'
      )
    }
  }

  if (loading) {

    return (
      <div className="p-10">
        Loading...
      </div>
    )
  }

  return (

    <div className="space-y-8">

      {/* Hero Section */}

      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          <div className="flex items-center gap-6">

            {company.logo_url ? (

              <img
                src={company.logo_url}
                alt={company.name}
                className="w-28 h-28 rounded-3xl bg-white p-2 object-cover"
              />

            ) : (

              <div className="w-28 h-28 rounded-3xl bg-white/20 flex items-center justify-center">

                <Icons.Building2
                  size={50}
                />

              </div>

            )}

            <div>

              <h1 className="text-4xl font-bold">
                {company.name}
              </h1>

              <p className="mt-2 text-lg">
                {company.industry}
              </p>

              <p className="text-indigo-100">
                {company.location}
              </p>

              <p className="text-indigo-100 mt-2">
                Recruiter:
                {' '}
                {user.username}
              </p>

            </div>

          </div>

          <button
            onClick={handleSave}
            className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

        </div>

      </div>

      {/* Company Information */}

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
              value={company.website}
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
              value={company.industry}
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
              value={company.location}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              Logo URL
            </label>

            <input
              name="logo_url"
              value={company.logo_url}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              About Company
            </label>

            <textarea
              rows="6"
              name="description"
              value={company.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

      </div>

      {/* Recruiter Information */}

      <div className="bg-white rounded-3xl border shadow-sm p-8">

        <h2 className="text-2xl font-bold mb-6">
          Recruiter Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">
              Username
            </p>

            <h3 className="font-semibold text-lg mt-1">
              {user.username}
            </h3>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">
              Email
            </p>

            <h3 className="font-semibold text-lg mt-1">
              {user.email}
            </h3>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">
              Phone
            </p>

            <h3 className="font-semibold text-lg mt-1">
              {user.phone}
            </h3>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-slate-500">
              Role
            </p>

            <h3 className="font-semibold text-lg mt-1 capitalize">
              {user.role}
            </h3>

          </div>

        </div>

      </div>

    </div>

  )
}