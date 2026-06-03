import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import apiClient from '../../services/apiClient'

const Students = () => {
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
        try {
    setLoading(true)

    const res = await apiClient.get('/users/')

    console.log("USERS API RESPONSE:", res.data)

    // ✅ FIX: extract array properly
    const usersArray =
      Array.isArray(res.data)
        ? res.data
        : res.data.results
        ? res.data.results
        : res.data.data
        ? res.data.data
        : []

    const onlyStudents = usersArray.filter(
      (u) => u.role === 'student'
    )

    setStudents(onlyStudents)
    setFiltered(onlyStudents)

  } catch (err) {
    console.log("API ERROR:", err)
  } finally {
    setLoading(false)
  }
}

  const handleSearch = (value) => {
    setSearch(value)

    const filteredData = students.filter((student) =>
      student.username.toLowerCase().includes(value.toLowerCase()) ||
      student.email.toLowerCase().includes(value.toLowerCase())
    )

    setFiltered(filteredData)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Students
          </h1>
          <p className="text-slate-500">
            Manage registered students
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl border">
        <div className="flex items-center gap-2">

          <Icons.Search size={18} className="text-slate-400" />

          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full outline-none"
          />

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  Loading students...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  No students found
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
  <tr key={student.id} className="border-t">

    <td className="p-4 font-medium">
      {student.first_name || student.username}
    </td>

    <td className="p-4">
      {student.email}
    </td>

    <td className="p-4">
      {student.role}
    </td>

    <td className="p-4">
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
        Active
      </span>
    </td>

  </tr>
))
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Students