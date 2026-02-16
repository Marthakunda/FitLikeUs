import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import LandingPage from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import WorkoutDetailPage from './pages/WorkoutDetail';
import JournalPage from './pages/Journal';
import ResourcesPage from './pages/Resources';
import UpgradePage from './pages/Upgrade';
import { useAuth } from './hooks/useAuth';
import OfflineBanner from './components/OfflineBanner';

function App() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <OfflineBanner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={profile ? <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <LandingPage />} />
        <Route path="/login" element={profile ? <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <LoginPage />} />
        <Route path="/signup" element={profile ? <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <SignUpPage />} />
        <Route path="/forgot-password" element={profile ? <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <ForgotPasswordPage />} />
        <Route path="/reset-password" element={profile ? <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={profile?.role === 'client' ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/dashboard"
          element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Protected User Routes */}
        <Route
          path="/workout/:exercise"
          element={profile ? <WorkoutDetailPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/journal"
          element={profile ? <JournalPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/resources"
          element={profile ? <ResourcesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/upgrade"
          element={profile ? <UpgradePage /> : <Navigate to="/login" />}
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            profile ? (
              <Navigate to={profile.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
