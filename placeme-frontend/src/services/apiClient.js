import axios from 'axios'

const API_BASE_URL =
  'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    'Content-Type':
      'application/json',
  },

  withCredentials: true,
})

// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'access_token'
      )

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },

  (error) =>
    Promise.reject(error)
)

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config

    if (
      error.response?.status ===
      401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshToken =
        localStorage.getItem(
          'refresh_token'
        )

      if (refreshToken) {
        try {
          const response =
            await axios.post(
              `${API_BASE_URL}/token/refresh/`,
              {
                refresh:
                  refreshToken,
              }
            )

          const { access } =
            response.data

          localStorage.setItem(
            'access_token',
            access
          )

          originalRequest.headers.Authorization =
            `Bearer ${access}`

          return apiClient(
            originalRequest
          )

        } catch (
        refreshError
        ) {
          localStorage.removeItem(
            'access_token'
          )

          localStorage.removeItem(
            'refresh_token'
          )

          window.location.href =
            '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

// ============================================
// PLACEMENT API SERVICES
// ============================================

export const placement = {
  // Companies
  getCompanies: (params) =>
    apiClient.get(
      '/placement/companies/',
      { params }
    ),

  getCompanyById: (id) =>
    apiClient.get(
      `/placement/companies/${id}/`
    ),

  // Drives
  getDrives: (params) =>
    apiClient.get(
      '/placement/drives/',
      { params }
    ),

  getDriveById: (id) =>
    apiClient.get(
      `/placement/drives/${id}/`
    ),

  checkApplicationStatus: (
    driveId
  ) =>
    apiClient.get(
      `/placement/drives/${driveId}/check_application_status/`
    ),

  // Applications
  getMyApplications: (
    params
  ) =>
    apiClient.get(
      '/placement/applications/',
      { params }
    ),

  getApplicationById: (
    id
  ) =>
    apiClient.get(
      `/placement/applications/${id}/`
    ),

  createApplication: (
    data
  ) =>
    apiClient.post(
      '/placement/applications/',
      data
    ),

  updateApplicationStatus: (
    id,
    status
  ) =>
    apiClient.patch(
      `/placement/applications/${id}/update_status/`,
      {
        status,
      }
    ),

  uploadResume: (
    id,
    resumeUrl
  ) =>
    apiClient.patch(
      `/placement/applications/${id}/upload_resume/`,
      {
        resume_url:
          resumeUrl,
      }
    ),
}

// ============================================
// TRAINING API SERVICES
// ============================================

export const training = {
  // Courses
  getCourses: (params) =>
    apiClient.get(
      '/training/courses/',
      { params }
    ),

  getCourseById: (id) =>
    apiClient.get(
      `/training/courses/${id}/`
    ),

  checkEnrollment: (
    courseId
  ) =>
    apiClient.get(
      `/training/courses/${courseId}/check_enrollment/`
    ),

  // Enrollments
  getMyEnrollments: (
    params
  ) =>
    apiClient.get(
      '/training/enrollments/',
      { params }
    ),

  getEnrollmentById: (
    id
  ) =>
    apiClient.get(
      `/training/enrollments/${id}/`
    ),

  enrollCourse: (
    courseId
  ) =>
    apiClient.post(
      '/training/enrollments/',
      {
        course_id:
          courseId,
      }
    ),

  updateProgress: (
    id,
    progressPercentage
  ) =>
    apiClient.patch(
      `/training/enrollments/${id}/update_progress/`,
      {
        progress_percentage:
          progressPercentage,
      }
    ),

  // Mock Tests
  getTests: (params) =>
    apiClient.get(
      '/training/tests/',
      { params }
    ),

  getTestById: (id) =>
    apiClient.get(
      `/training/tests/${id}/`
    ),

  getTestAttempts: (
    testId
  ) =>
    apiClient.get(
      `/training/tests/${testId}/attempts/`
    ),

  // Attempts
  getMyAttempts: (
    params
  ) =>
    apiClient.get(
      '/training/attempts/',
      { params }
    ),

  getAttemptById: (
    id
  ) =>
    apiClient.get(
      `/training/attempts/${id}/`
    ),

  submitTestAttempt: (
    data
  ) =>
    apiClient.post(
      '/training/attempts/',
      data
    ),

  getTestStatistics: () =>
    apiClient.get(
      '/training/attempts/statistics/'
    ),
}

// ============================================
// NOTIFICATIONS API SERVICES
// ============================================

export const notifications = {
  // Notifications
  getMyNotifications: (
    params
  ) =>
    apiClient.get(
      '/notifications/notifications/',
      { params }
    ),

  markAsRead: (id) =>
    apiClient.patch(
      `/notifications/notifications/${id}/mark_as_read/`
    ),

  markAllAsRead: () =>
    apiClient.patch(
      '/notifications/notifications/mark_all_as_read/'
    ),

  getUnreadCount: () =>
    apiClient.get(
      '/notifications/notifications/unread_count/'
    ),

  deleteNotification: (
    id
  ) =>
    apiClient.delete(
      `/notifications/notifications/${id}/delete_notification/`
    ),

  // Experiences
  getExperiences: (
    params
  ) =>
    apiClient.get(
      '/notifications/experiences/',
      { params }
    ),

  getExperienceById: (
    id
  ) =>
    apiClient.get(
      `/notifications/experiences/${id}/`
    ),

  createExperience: (
    data
  ) =>
    apiClient.post(
      '/notifications/experiences/',
      data
    ),

  updateExperience: (
    id,
    data
  ) =>
    apiClient.patch(
      `/notifications/experiences/${id}/`,
      data
    ),

  deleteExperience: (
    id
  ) =>
    apiClient.delete(
      `/notifications/experiences/${id}/`
    ),

  upvoteExperience: (
    id
  ) =>
    apiClient.post(
      `/notifications/experiences/${id}/upvote/`
    ),

  getTrendingExperiences:
    () =>
      apiClient.get(
        '/notifications/experiences/trending/'
      ),

  getMyExperiences: () =>
    apiClient.get(
      '/notifications/experiences/my_experiences/'
    ),
}

// ============================================
// AUTHENTICATION SERVICES
// ============================================

export const auth = {
  login: (
    username,
    password
  ) =>
    axios.post(
      `${API_BASE_URL}/token/`,
      {
        username,
        password,
      }
    ),

  changePassword: (data) =>
    apiClient.post(
      '/users/change_password/',
      data
    ),

  updateProfile: (data) =>
    apiClient.put(
      '/users/me/',
      data
    ),
  refresh: (
    refreshToken
  ) =>
    axios.post(
      `${API_BASE_URL}/token/refresh/`,
      {
        refresh:
          refreshToken,
      }
    ),

  register: (data) =>
    axios.post(
      `${API_BASE_URL}/users/register/`,
      data
    ),

  getProfile: () =>
    apiClient.get(
      '/users/me/'
    ),

  // ========================================
  // RESUME APIs
  // ========================================

  getResume: () =>
    apiClient.get(
      '/users/resume/'
    ),

  updateResume: (
    data
  ) =>
    apiClient.put(
      '/users/resume/',
      data
    ),
}