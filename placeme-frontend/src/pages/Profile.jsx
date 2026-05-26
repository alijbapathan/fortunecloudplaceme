import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '../context/authContext'
import { authService } from '../services/api'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  FireIcon,
} from '@heroicons/react/24/outline'

const Profile = () => {
  const { user, setUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    cgpa: '',
    skills: '',
    resume: '',
    bio: '',
    phone: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await authService.getProfile()
      setProfile(data)
      setFormData({
        cgpa: data?.cgpa || '',
        skills: data?.skills || '',
        resume: data?.resume || '',
        bio: data?.bio || '',
        phone: data?.phone || '',
      })
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await authService.updateProfile(profile?.id, formData)
      setProfile(data)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>

        <div className="px-8 py-8 -mt-16 relative">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-32 h-32 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-white" />
            </div>

            <div className="flex-1 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-600">{user?.role?.toUpperCase()}</p>
            </div>

            <button
              onClick={() => {
                if (editing) {
                  handleSave()
                } else {
                  setEditing(true)
                }
              }}
              disabled={saving}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                editing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-gray-900 font-medium">{user?.username}</p>
              </div>
            </div>

            {!editing && user?.phone && (
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{user?.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Academic & Professional Info */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* CGPA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4" />
              CGPA
            </label>
            {editing ? (
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="input-field"
                placeholder="3.50"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{profile?.cgpa || 'Not specified'}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+91 XXXXX XXXXX"
              />
            ) : (
              <p className="text-gray-900">{profile?.phone || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FireIcon className="w-4 h-4" />
            Skills (comma-separated)
          </label>
          {editing ? (
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="input-field"
              placeholder="Python, JavaScript, React, Django..."
              rows="3"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.split(',').map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.trim()}
                </span>
              )) || <p className="text-gray-600">No skills added</p>}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          {editing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
              placeholder="Tell us about yourself..."
              rows="4"
            />
          ) : (
            <p className="text-gray-700">{profile?.bio || 'No bio added'}</p>
          )}
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
          {editing ? (
            <textarea
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              className="input-field"
              placeholder="Paste your resume content or link..."
              rows="4"
            />
          ) : (
            <p className="text-gray-700">{profile?.resume || 'No resume uploaded'}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Applications</p>
          <p className="text-3xl font-bold text-blue-600">-</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Tests Completed</p>
          <p className="text-3xl font-bold text-green-600">-</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Courses Enrolled</p>
          <p className="text-3xl font-bold text-purple-600">-</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
