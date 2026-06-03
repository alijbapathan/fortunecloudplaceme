import * as Icons from 'lucide-react'

export default function TPONavbar() {
  return (
    <div className="fixed top-0 left-72 right-0 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      <div>
        <h2 className="text-xl font-semibold">
          Training & Placement Officer
        </h2>
      </div>

      <div className="flex items-center gap-5">

        <Icons.Bell />

        <div className="flex items-center gap-2">

          <div className="w-10 h-10 rounded-full bg-indigo-500" />

          <div>
            <p className="font-medium">
              TPO Admin
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}