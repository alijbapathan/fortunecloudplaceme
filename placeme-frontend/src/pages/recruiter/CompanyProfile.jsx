import { useState } from 'react'

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    name: 'Google',
    website: 'https://google.com',
    industry: 'Technology',
    location: 'Bangalore',
    description: 'Leading technology company'
  })

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Company Profile
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your company information
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-8 space-y-4">

        <div>
          <label className="block mb-2 font-medium">
            Company Name
          </label>

          <input
            value={company.name}
            className="w-full border rounded-xl p-3"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Website
          </label>

          <input
            value={company.website}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Industry
          </label>

          <input
            value={company.industry}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Location
          </label>

          <input
            value={company.location}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows="4"
            className="w-full border rounded-xl p-3"
            value={company.description}
          />
        </div>

        <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
          Save Changes
        </button>

      </div>

    </div>
  )
}