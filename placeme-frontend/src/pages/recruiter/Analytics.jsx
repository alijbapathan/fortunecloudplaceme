export default function Analytics() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Recruitment Analytics
        </h1>

        <p className="text-slate-500 mt-2">
          Track recruitment performance
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-slate-500">
            Applications
          </p>

          <h2 className="text-4xl font-bold mt-3">
            248
          </h2>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-slate-500">
            Shortlist Rate
          </p>

          <h2 className="text-4xl font-bold mt-3">
            21%
          </h2>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <p className="text-slate-500">
            Selection Rate
          </p>

          <h2 className="text-4xl font-bold mt-3">
            7%
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-8">

        <h2 className="text-xl font-semibold mb-4">
          Recruitment Overview
        </h2>

        <div className="h-72 flex items-center justify-center text-slate-400">
          Analytics Chart Placeholder
        </div>

      </div>

    </div>
  )
}