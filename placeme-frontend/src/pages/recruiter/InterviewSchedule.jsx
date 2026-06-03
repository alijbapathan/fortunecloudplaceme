import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { recruiterService } from '../../services/api'

export default function InterviewSchedule() {

  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    application: '',
    round_type: 'technical',
    scheduled_at: '',
    meeting_link: '',
    location: '',
    interviewer_name: '',
    notes: ''
  })

  useEffect(() => {
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    try {

      const response =
        await recruiterService.getInterviews()

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || []

      setInterviews(data)

    } catch (error) {

      console.error(error)

      toast.error(
        'Failed to load interviews'
      )

    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const payload = {
        application: Number(formData.application),
        round_type: formData.round_type,
        scheduled_at: formData.scheduled_at,
        meeting_link: formData.meeting_link,
        location: formData.location,
        interviewer_name:
          formData.interviewer_name,
        notes: formData.notes
      }

      console.log(
        'INTERVIEW PAYLOAD:',
        payload
      )

      await recruiterService.createInterview(
        payload
      )

      toast.success(
        'Interview scheduled successfully'
      )

      setFormData({
        application: '',
        round_type: 'technical',
        scheduled_at: '',
        meeting_link: '',
        location: '',
        interviewer_name: '',
        notes: ''
      })

      fetchInterviews()

    } catch (error) {

      console.error(error)

      console.log(
        'INTERVIEW ERROR:',
        error.response?.data
      )

      toast.error(
        JSON.stringify(
          error.response?.data
        )
      )
    }
  }

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        'Delete interview?'
      )
    ) return

    try {

      await recruiterService.deleteInterview(
        id
      )

      toast.success(
        'Interview deleted'
      )

      fetchInterviews()

    } catch (error) {

      console.error(error)

      toast.error(
        'Failed to delete interview'
      )
    }
  }

  const getStatusColor = (status) => {

    switch (status) {

      case 'selected':
        return 'bg-green-100 text-green-700'

      case 'rejected':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Interview Schedule
        </h1>

        <p className="text-slate-500 mt-2">
          Schedule and manage candidate interviews
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border p-5">

          <p className="text-slate-500">
            Total Interviews
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {interviews.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border p-5">

          <p className="text-slate-500">
            Selected
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">

            {
              interviews.filter(
                i => i.status === 'selected'
              ).length
            }

          </h2>

        </div>

        <div className="bg-white rounded-2xl border p-5">

          <p className="text-slate-500">
            Scheduled
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">

            {
              interviews.filter(
                i =>
                  i.status ===
                  'scheduled'
              ).length
            }

          </h2>

        </div>

      </div>

      <div className="bg-white rounded-3xl border p-8">

        <h2 className="text-2xl font-bold mb-6">
          Schedule New Interview
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            type="number"
            name="application"
            value={formData.application}
            onChange={handleChange}
            placeholder="Application ID"
            className="border rounded-xl p-3"
            required
          />

          <select
            name="round_type"
            value={formData.round_type}
            onChange={handleChange}
            className="border rounded-xl p-3"
          >

            <option value="technical">
              Technical Round
            </option>

            <option value="hr">
              HR Round
            </option>

            <option value="managerial">
              Managerial Round
            </option>

            <option value="final">
              Final Round
            </option>

          </select>

          <input
            type="datetime-local"
            name="scheduled_at"
            value={formData.scheduled_at}
            onChange={handleChange}
            className="border rounded-xl p-3"
            required
          />

          <input
            type="url"
            name="meeting_link"
            value={formData.meeting_link}
            onChange={handleChange}
            placeholder="Meeting Link"
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            name="interviewer_name"
            value={formData.interviewer_name}
            onChange={handleChange}
            placeholder="Interviewer Name"
            className="border rounded-xl p-3"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Interview Location"
            className="border rounded-xl p-3"
          />

          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Interview Notes"
            className="border rounded-xl p-3 md:col-span-2"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
          >
            Schedule Interview
          </button>

        </form>

      </div>

      <div className="grid gap-5">

        {loading && (
          <div className="text-center py-10">
            Loading...
          </div>
        )}

        {!loading &&
          interviews.map(item => (

            <div
              key={item.id}
              className="bg-white border rounded-2xl p-6"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="text-xl font-bold">
                    {item.student_name}
                  </h3>

                  <p className="text-slate-500">
                    {item.round_type}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>

              </div>

              <div className="mt-4 space-y-2">

                <p>
                  📅 {' '}
                  {new Date(
                    item.scheduled_at
                  ).toLocaleString()}
                </p>

                {item.meeting_link && (

                  <a
                    href={item.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600"
                  >
                    Join Meeting
                  </a>

                )}

                {item.notes && (

                  <p className="text-slate-600">
                    {item.notes}
                  </p>

                )}

              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

      </div>

    </div>
  )
}