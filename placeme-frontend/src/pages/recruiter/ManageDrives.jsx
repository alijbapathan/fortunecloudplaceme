export default function ManageDrives() {
  const drives = [
    {
      id: 1,
      position: 'Software Engineer',
      company: 'Google',
      applications: 120,
      deadline: '10 Jun 2026',
    },
    {
      id: 2,
      position: 'Backend Developer',
      company: 'Microsoft',
      applications: 85,
      deadline: '15 Jun 2026',
    },
  ]

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Manage Drives
        </h1>

        <p className="text-slate-500 mt-2">
          View, edit and manage placement drives
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4">Position</th>
              <th className="text-left p-4">Company</th>
              <th className="text-left p-4">Applications</th>
              <th className="text-left p-4">Deadline</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drives.map((drive) => (
              <tr
                key={drive.id}
                className="border-t"
              >
                <td className="p-4">
                  {drive.position}
                </td>

                <td className="p-4">
                  {drive.company}
                </td>

                <td className="p-4">
                  {drive.applications}
                </td>

                <td className="p-4">
                  {drive.deadline}
                </td>

                <td className="p-4 flex gap-2">

                  <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600">
                    Edit
                  </button>

                  <button className="px-3 py-1 rounded-lg bg-green-100 text-green-600">
                    Applications
                  </button>

                  <button className="px-3 py-1 rounded-lg bg-red-100 text-red-600">
                    Delete
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