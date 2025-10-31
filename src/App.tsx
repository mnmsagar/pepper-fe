// React import not needed with new JSX transform
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginScreen from './components/auth/LoginScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import PartnerDashboard from './components/partner/PartnerDashboard';
import MemberPortal from './components/member/MemberPortal';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router future={{ v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-dark-bg-primary dark:to-dark-bg-secondary transition-colors duration-200">
              <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/partner/*" element={
                  <ProtectedRoute requiredRole="partner">
                    <PartnerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/member/*" element={
                  <ProtectedRoute requiredRole="member">
                    <MemberPortal />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;