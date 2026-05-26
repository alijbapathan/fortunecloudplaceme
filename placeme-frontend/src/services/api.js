import axios from 'axios'
import { useAuthStore } from '../context/authContext'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, setToken, logout } = useAuthStore.getState()
    
    if (error.response?.status === 401 && refreshToken) {
      try {
        const { data } = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        })
        setToken(data.access)
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${data.access}`
        return api(error.config)
      } catch {
        logout()
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth Services
export const authService = {
  register: (userData) =>
    api.post('/users/register/', userData),

  login: (username, password) =>
    api.post('/token/', { username, password }),

  getMe: () =>
    api.get('/users/me/'),

  updateProfile: (id, data) =>
    api.put(`/users/student-profiles/${id}/`, data),

  getProfile: () =>
    api.get('/users/student-profiles/me/'),
}

// Placement Services
export const placementService = {
  getDrives: (params) =>
    api.get('/placement/drives/', { params }),

  getUpcomingDrives: () =>
    api.get('/placement/drives/upcoming/'),

  getDriveById: (id) =>
    api.get(`/placement/drives/${id}/`),

  applyToDrive: (driveId) =>
    api.post(`/placement/drives/${driveId}/apply/`),

  getApplications: () =>
    api.get('/placement/applications/my_applications/'),

  getApplicationById: (id) =>
    api.get(`/placement/applications/${id}/`),

  getInterviews: () =>
    api.get('/placement/interview-schedules/my_interviews/'),

  getInterviewExperiences: () =>
    api.get('/placement/interview-experiences/my_experiences/'),

  shareExperience: (data) =>
    api.post('/placement/interview-experiences/', data),
}

// Training Services
export const trainingService = {
  getCourses: (params) =>
    api.get('/training/courses/', { params }),

  getCourseById: (id) =>
    api.get(`/training/courses/${id}/`),

  enrollCourse: (courseId) =>
    api.post(`/training/courses/${courseId}/enroll/`),

  getEnrollments: () =>
    api.get('/training/enrollments/my_enrollments/'),

  getMockTests: (params) =>
    api.get('/training/mock-tests/', { params }),

  getTestsByCategory: (category) =>
    api.get('/training/mock-tests/by_category/', { params: { category } }),

  getTestById: (id) =>
    api.get(`/training/mock-tests/${id}/`),

  startTest: (testId) =>
    api.post(`/training/mock-tests/${testId}/start_test/`),

  getTestAttempts: () =>
    api.get('/training/test-attempts/my_attempts/'),

  getTestStatistics: () =>
    api.get('/training/test-attempts/statistics/'),

  submitTestAnswers: (attemptId, answers) =>
    api.post(`/training/test-attempts/${attemptId}/submit/`, { answers }),
}

// Notification Services
export const notificationService = {
  getNotifications: () =>
    api.get('/notifications/notifications/'),

  getMyNotifications: () =>
    api.get('/notifications/student-notifications/my_notifications/'),

  getUnreadNotifications: () =>
    api.get('/notifications/student-notifications/unread/'),

  markAsRead: (id) =>
    api.post(`/notifications/student-notifications/${id}/mark_as_read/`),
}

export default api
