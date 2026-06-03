import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { StudentDashboard } from './pages/StudentDashboard'
import { Profile } from './pages/Profile'
import { PlacementDrives } from './pages/PlacementDrives'
import { Applications } from './pages/Applications'
import { MockTests } from './pages/MockTests'
import { InterviewExperience } from './pages/InterviewExperience'
import { ResumeBuilder } from './pages/ResumeBuilder'
import { NotificationsPage } from './pages/Notifications'
import { Settings } from './pages/Settings'

// Components & Layouts
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import { MainLayout } from './layouts/MainLayout'


//rr tpo api services
import TPOLayout from './layouts/TPOLayout'
import Students from './pages/tpo/Students'
import TPODashboard from './pages/tpo/TPODashboard'
import TPOCompanies from './pages/tpo/Companies'
import TPODrives from './pages/tpo/Drives'
import TPOApplications from './pages/tpo/Applications'
import CompanyForm from './pages/tpo/CompanyForm'
import DriveForm from './pages/tpo/DriveForm'
import EditDrive from './pages/tpo/EditDrive'
import EditCompany from './pages/tpo/EditCompany'
import ApplicationDetails from './pages/tpo/ApplicationDetails'
import TPOCourses from './pages/tpo/TPOCourses'
import CourseForm from './pages/tpo/CourseForm'
import TPOMockTests from './pages/tpo/TPOMockTests'
import MockTestForm from './pages/tpo/MockTestForm'

////////////////////////////////////////////////////

function App() {
  // Check localStorage directly for login status
  // Auth store might not be hydrated on first load
  const hasToken = localStorage.getItem('access_token')

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={hasToken ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={hasToken ? <Navigate to="/dashboard" /> : <Register />} />

          {/* Protected Routes with MainLayout */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/drives" element={<PlacementDrives />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/mock-tests" element={<MockTests />} />
              <Route path="/interviews" element={<InterviewExperience />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

             {/* TPO */}

             <Route element={<TPOLayout />}>

              <Route path="/tpo/dashboard" element={<TPODashboard />} />
              <Route path="/tpo/companies" element={<TPOCompanies />} />
              <Route path="/tpo/drives" element={<TPODrives />} />
              <Route path="/tpo/applications" element={<TPOApplications />} />
              <Route path="/tpo/students" element={<Students />} />
              <Route path="/tpo/companies/create" element={<CompanyForm />} />
              <Route path="/tpo/drives/create" element={<DriveForm />} />
              <Route path="/tpo/drives/edit/:id" element={<EditDrive />} />
              <Route path="/tpo/companies/edit/:id" element={<EditCompany />} />
              <Route path="/tpo/applications/:id" element={<ApplicationDetails />} />
              <Route
  path="/tpo/courses"
  element={<TPOCourses />}/>
  <Route
  path="/tpo/courses/create"
  element={<CourseForm />}
/>
<Route
  path="/tpo/courses/edit/:id"
  element={<CourseForm />}
/>

<Route
  path="/tpo/mock-tests"
  element={<TPOMockTests />}
/>

<Route
  path="/tpo/mock-tests/create"
  element={<MockTestForm />}
/>

<Route
  path="/tpo/mock-tests/edit/:id"
  element={<MockTestForm />}
/>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        theme="dark"
      />
    </Router>
  )
}

export default App
