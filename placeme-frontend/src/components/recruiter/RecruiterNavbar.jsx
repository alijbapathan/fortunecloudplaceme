import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'

import {
  authService,
  recruiterService,
} from '../../services/api'

import {
  useAuthStore,
} from '../../context/authContext'

export default function RecruiterNavbar() {

  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const logout =
    useAuthStore(
      state => state.logout
    )

  const [user, setUser] =
    useState(null)

  const [company, setCompany] =
    useState(null)

  const [searchTerm, setSearchTerm] =
    useState('')

  const [searchResults, setSearchResults] =
    useState([])

  const [isProfileOpen, setIsProfileOpen] =
    useState(false)

  useEffect(() => {

    loadProfile()

    const refresh = () => {
      loadProfile()
    }

    window.addEventListener(
      'companyUpdated',
      refresh
    )

    return () => {

      window.removeEventListener(
        'companyUpdated',
        refresh
      )

    }

  }, [])

  useEffect(() => {

    const handleOutside = (
      event
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setIsProfileOpen(false)

      }
    }

    document.addEventListener(
      'mousedown',
      handleOutside
    )

    return () =>

      document.removeEventListener(
        'mousedown',
        handleOutside
      )

  }, [])

  const loadProfile = async () => {

    try {

      const userRes =
        await authService.getProfile()

      setUser(userRes.data)

      try {

        const companyRes =
          await recruiterService.getMyCompany()

        setCompany(
          companyRes.data
        )

      } catch {

        setCompany(null)

      }

    } catch (error) {

      console.error(
        'Navbar Load Error',
        error
      )

    }
  }

  const handleLogout = () => {

    logout()

    navigate('/login')
  }

  const handleSearch = async (
    value
  ) => {

    setSearchTerm(value)

    if (!value.trim()) {

      setSearchResults([])

      return
    }

    try {

      const [
        drivesRes,
        appsRes,
      ] = await Promise.all([

        recruiterService.getDrives(),

        recruiterService.getApplications(),

      ])

      const drives =
        Array.isArray(
          drivesRes.data
        )
          ? drivesRes.data
          : drivesRes.data.results ||
            []

      const apps =
        Array.isArray(
          appsRes.data
        )
          ? appsRes.data
          : appsRes.data.results ||
            []

      const results = []

      drives.forEach(drive => {

        if (
          drive.position
            ?.toLowerCase()
            .includes(
              value.toLowerCase()
            )
        ) {

          results.push({

            type: 'Drive',

            title:
              drive.position,

            subtitle:
              drive.company?.name,

          })

        }

      })

      apps.forEach(app => {

        if (
          app.student_name
            ?.toLowerCase()
            .includes(
              value.toLowerCase()
            )
        ) {

          results.push({

            type:
              'Applicant',

            title:
              app.student_name,

            subtitle:
              app.status,

          })

        }

      })

      setSearchResults(
        results.slice(0, 8)
      )

    } catch (error) {

      console.error(error)

    }

  }

  const displayName =

    company?.name ||

    user?.username ||

    'Recruiter'

  const initials =
    displayName
      .split(' ')
      .map(
        word => word[0]
      )
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (

    <nav className="fixed top-0 left-72 right-0 h-20 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-8">

      {/* SEARCH */}

      <div className="relative w-full max-w-xl">

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          placeholder="Search drives, applicants..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <Icons.Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />

        {searchResults.length >
          0 && (

          <div className="absolute mt-2 w-full bg-white rounded-2xl border shadow-xl overflow-hidden">

            {searchResults.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="px-4 py-3 border-b hover:bg-slate-50"
                >

                  <h4 className="font-medium">

                    {item.title}

                  </h4>

                  <p className="text-xs text-slate-500">

                    {item.type}

                    {' • '}

                    {
                      item.subtitle
                    }

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <button className="relative p-2 rounded-lg hover:bg-slate-100">

          <Icons.Bell
            size={20}
          />

          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />

        </button>

        <div className="h-8 w-px bg-slate-300" />

        {/* Profile */}

        <div
          className="relative"
          ref={dropdownRef}
        >

          <button
            onClick={() =>
              setIsProfileOpen(
                !isProfileOpen
              )
            }
            className="flex items-center gap-3"
          >

            {company?.logo_url ? (

              <img
                src={
                  company.logo_url
                }
                alt="logo"
                className="w-11 h-11 rounded-full border object-cover"
              />

            ) : (

              <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">

                {initials}

              </div>

            )}

            <div className="hidden md:block text-left">

              <h4 className="font-semibold text-sm">

                {displayName}

              </h4>

              <p className="text-xs text-slate-500">

                {
                  user?.username
                }

              </p>

            </div>

            <Icons.ChevronDown
              size={16}
            />

          </button>

          {isProfileOpen && (

            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border shadow-xl overflow-hidden">

              <div className="p-5 border-b">

                <h3 className="font-bold text-lg">

                  {displayName}

                </h3>

                <p className="text-sm text-slate-500">

                  {
                    user?.email
                  }

                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    '/recruiter/company'
                  )
                }
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-50"
              >

                <Icons.Building2 size={18} />

                Company Profile

              </button>

              <button
                onClick={() =>
                  navigate(
                    '/recruiter/dashboard'
                  )
                }
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-50"
              >

                <Icons.LayoutDashboard size={18} />

                Dashboard

              </button>

              <button
                onClick={() =>
                  navigate(
                    '/recruiter/analytics'
                  )
                }
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-50"
              >

                <Icons.BarChart3 size={18} />

                Analytics

              </button>

              <button
                onClick={
                  handleLogout
                }
                className="w-full px-5 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50"
              >

                <Icons.LogOut size={18} />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </nav>

  )
}