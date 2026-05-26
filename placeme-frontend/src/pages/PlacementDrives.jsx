import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { placementService } from '../services/api'
import { BriefcaseIcon, MapPinIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline'

const PlacementDrives = () => {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDrives, setFilteredDrives] = useState([])

  useEffect(() => {
    fetchDrives()
  }, [])

  useEffect(() => {
    const filtered = drives.filter(drive =>
      drive.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDrives(filtered)
  }, [searchTerm, drives])

  const fetchDrives = async () => {
    try {
      const { data } = await placementService.getDrives()
      setDrives(data.results || data)
    } catch (error) {
      toast.error('Failed to load drives')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Placement Drives</h1>
        <p className="text-gray-600">Browse and apply to placement drives</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Drives List */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredDrives.map((drive) => (
            <div key={drive.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{drive.company.name}</h2>
                      <p className="text-gray-600">{drive.role}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Package</p>
                      <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                        <CurrencyRupeeIcon className="w-5 h-5" />
                        {drive.package}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Min CGPA</p>
                      <p className="text-lg font-bold text-gray-900">{drive.eligibility_cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Positions</p>
                      <p className="text-lg font-bold text-gray-900">{drive.total_positions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(drive.status)}`}>
                        {drive.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {drive.required_skills.split(',').map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/drives/${drive.id}`}
                    className="btn-primary py-2 text-center whitespace-nowrap"
                  >
                    View Details
                  </Link>
                  <button className="btn-secondary py-2 whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No drives found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search' : 'Check back later for new drives'}
          </p>
        </div>
      )}
    </div>
  )
}

export default PlacementDrives
