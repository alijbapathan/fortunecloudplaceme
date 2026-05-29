import { useState } from 'react'
import { recruiterService } from '../../services/api'

export default function CreateDrive() {
  const [formData, setFormData] = useState({
    position: '',
    package: '',
    eligibility: '',
    skills: '',
    location: '',
    deadline: '',
    description: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const response = await recruiterService.createDrive(formData)

    console.log(response.data)

    alert('Drive Created Successfully')
  } catch (error) {
  console.error(error.response?.data)
  alert('Failed to create drive')
}
}



  

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Create Placement Drive
        </h1>

        <p className="text-slate-500 mt-2">
          Post a new opportunity for students
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border shadow-sm p-8 space-y-6"
      >
        <div>
          <label className="block mb-2 font-medium">
            Position
          </label>

          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Package
          </label>

          <input
            type="text"
            name="package"
            value={formData.package}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            placeholder="12 LPA"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Eligibility
          </label>

          <select
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          >
            <option value="">Select</option>
            <option value="All">All</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Required Skills
          </label>

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            placeholder="React, Node.js, Django"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            placeholder="Bangalore"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Job Description
          </label>

          <textarea
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Create Drive
        </button>

      </form>
    </div>
  )
}