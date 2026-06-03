import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'


// Student Pages
import { StudentDashboard } from './pages/StudentDashboard'
import { Profile } from './pages/Profile'
import { PlacementDrives } from './pages/PlacementDrives'
import { Applications } from './pages/Applications'
import { MockTests } from './pages/MockTests'
import { InterviewExperience } from './pages/InterviewExperience'
import { ResumeBuilder } from './pages/ResumeBuilder'
import { NotificationsPage } from './pages/Notifications'
import { Settings } from './pages/Settings'
import { Training } from './pages/Training'

// Recruiter Pages
import ViewDrive from './pages/recruiter/ViewDrive'
import EditDrive from './pages/recruiter/EditDrive'
import RecruiterLogin from './pages/recruiter/RecruiterLogin'
import RecruiterRegister from './pages/recruiter/RecruiterRegister'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import CreateDrive from './pages/recruiter/CreateDrive'
import ManageDrives from './pages/recruiter/ManageDrives'
import ApplicationsList from './pages/recruiter/ApplicationsList'
import InterviewSchedule from './pages/recruiter/InterviewSchedule'
import CompanyProfile from './pages/recruiter/CompanyProfile'
import Analytics from './pages/recruiter/Analytics'
import ApplicantProfile from './pages/recruiter/ApplicantProfile'

// Layouts
import { MainLayout } from './layouts/MainLayout'
import RecruiterLayout from './layouts/RecruiterLayout'

// Components
import PrivateRoute from './components/PrivateRoute'

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

<Route
  path="/login"
  element={
    hasToken ? (
      <Navigate to="/dashboard" />
    ) : (
      <Login />
    )
  }
/>

<Route
  path="/register"
  element={
    hasToken ? (
      <Navigate to="/dashboard" />
    ) : (
      <Register />
    )
  }
/>

{/* STUDENT ROUTES */}
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
    <Route path="/training" element={<Training />} />
  </Route>
</Route>

{/* RECRUITER ROUTES */}
<Route element={<PrivateRoute />}>
  <Route element={<RecruiterLayout />}>
    <Route
      path="/recruiter/dashboard"
      element={<RecruiterDashboard />}
    />
    <Route
      path="/recruiter/create-drive"
      element={<CreateDrive />}
    />
    <Route
      path="/recruiter/manage-drives"
      element={<ManageDrives />}
    />
    <Route
      path="/recruiter/applications"
      element={<ApplicationsList />}
    />
    <Route
      path="/recruiter/interviews"
      element={<InterviewSchedule />}
    />
    <Route
      path="/recruiter/company"
      element={<CompanyProfile />}
    />
    <Route
      path="/recruiter/analytics"
      element={<Analytics />}
    />
    <Route
      path="/recruiter/applicant/:id"
      element={<ApplicantProfile />}
    />
  </Route>

    <Route
  path="/recruiter/login"
  element={<RecruiterLogin />}
/>

<Route
  path="/recruiter/register"
  element={<RecruiterRegister />}
/>
</Route>

{/* 404 */}
<Route path="*" element={<NotFound />} />

              

          {/* =========================
              RECRUITER ROUTES
          ========================= */}
          <Route element={<PrivateRoute />}>
            <Route element={<RecruiterLayout />}>

              <Route
                path="/recruiter/dashboard"
                element={<RecruiterDashboard />}
              />

              <Route
                path="/recruiter/create-drive"
                element={<CreateDrive />}
              />

              <Route
                path="/recruiter/manage-drives"
                element={<ManageDrives />}
              />

              <Route
                path="/recruiter/applications"
                element={<ApplicationsList />}
              />

              <Route
                path="/recruiter/interviews"
                element={<InterviewSchedule />}
              />

              <Route
                path="/recruiter/company"
                element={<CompanyProfile />}
              />

              <Route
                path="/recruiter/analytics"
                element={<Analytics />}
              />
              
              <Route
  path="/recruiter/drives/:id"
  element={<ViewDrive />}
/>

<Route
  path="/recruiter/drives/edit/:id"
  element={<EditDrive />}
/>
              <Route
                path="/recruiter/applicant/:id"
                element={<ApplicantProfile />}
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