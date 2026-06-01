export default function ApplicationsList() {
  const applications = [
    {
      id: 1,
      name: 'John Doe',
      branch: 'CSE',
      cgpa: 8.7,
      status: 'Applied',
    },
    {
      id: 2,
      name: 'Jane Smith',
      branch: 'IT',
      cgpa: 9.1,
      status: 'Shortlisted',
    },
  ]

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Applications
        </h1>

        <p className="text-slate-500 mt-2">
          Review and manage student applications
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4">

        <input
          type="text"
          placeholder="Search applicant..."
          className="w-full border rounded-xl p-3 mb-4"
        />

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Branch</th>
              <th className="p-4 text-left">CGPA</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-4">{app.name}</td>
                <td className="p-4">{app.branch}</td>
                <td className="p-4">{app.cgpa}</td>
                <td className="p-4">{app.status}</td>

                <td className="p-4 flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-green-100 text-green-600">
                    Shortlist
                  </button>

                  <button className="px-3 py-1 rounded-lg bg-red-100 text-red-600">
                    Reject
                  </button>

                  <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600">
                    Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}