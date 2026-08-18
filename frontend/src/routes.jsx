import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Doctors from './pages/public/Doctors';
import Contact from './pages/public/Contact';
import AppointmentBooking from './pages/public/AppointmentBooking';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Patients from './pages/dashboard/Patients';
import Appointments from './pages/dashboard/Appointments';
import Treatments from './pages/dashboard/Treatments';
import Billing from './pages/dashboard/Billing';
import Financials from './pages/dashboard/Financials';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-appointment" element={<AppointmentBooking />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route 
            path="treatments" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'dentist']}>
                <Treatments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="billing" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant', 'receptionist']}>
                <Billing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="financials" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <Financials />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;