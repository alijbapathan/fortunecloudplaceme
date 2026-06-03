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

  getDebug: () =>
    api.get('/users/debug/'),
}

export default api
