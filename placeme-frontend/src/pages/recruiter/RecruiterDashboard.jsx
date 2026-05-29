export default function RecruiterDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome Back 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Manage drives, applications and interviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <p className="text-slate-500 text-sm">Active Drives</p>
          <h2 className="text-3xl font-bold mt-2">12</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <p className="text-slate-500 text-sm">Applications</p>
          <h2 className="text-3xl font-bold mt-2">248</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <p className="text-slate-500 text-sm">Shortlisted</p>
          <h2 className="text-3xl font-bold mt-2">52</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <p className="text-slate-500 text-sm">Selected</p>
          <h2 className="text-3xl font-bold mt-2">18</h2>
        </div>

      </div>

      {/* Recent Drives */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Placement Drives
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-medium">
                Software Engineer
              </h3>
              <p className="text-sm text-slate-500">
                Google
              </p>
            </div>

            <span className="text-sm text-slate-500">
              120 Applications
            </span>
          </div>

          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-medium">
                Backend Developer
              </h3>
              <p className="text-sm text-slate-500">
                Microsoft
              </p>
            </div>

            <span className="text-sm text-slate-500">
              85 Applications
            </span>
          </div>

        </div>
      </div>

    </div>
  )
}