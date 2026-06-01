export default function InterviewSchedule() {
  const interviews = [
    {
      id: 1,
      student: 'John Doe',
      round: 'Technical Round',
      date: '10 Jun 2026',
      status: 'Scheduled',
    },
    {
      id: 2,
      student: 'Jane Smith',
      round: 'HR Round',
      date: '12 Jun 2026',
      status: 'Passed',
    },
  ]

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Interview Schedule
        </h1>

        <p className="text-slate-500 mt-2">
          Manage interview rounds and results
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Round</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {interviews.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.student}</td>
                <td className="p-4">{item.round}</td>
                <td className="p-4">{item.date}</td>
                <td className="p-4">{item.status}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}