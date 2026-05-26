import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuthStore } from './context/authContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import PlacementDrives from './pages/PlacementDrives'
import DriveDetails from './pages/DriveDetails'
import Applications from './pages/Applications'
import MockTests from './pages/MockTests'
import TestDetail from './pages/TestDetail'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

// Components
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        
        <main className={isAuthenticated ? 'pt-16' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              {/* Student Routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/placement-drives" element={<PlacementDrives />} />
              <Route path="/drives/:id" element={<DriveDetails />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/mock-tests" element={<MockTests />} />
              <Route path="/tests/:id" element={<TestDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <ToastContainer 
          position="bottom-right" 
          autoClose={3000}
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App
