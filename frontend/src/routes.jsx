import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/ui/LoadingSpinner';
import NotFound from './components/NotFound';

// Layouts (loaded eagerly as they're always needed)
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Services = lazy(() => import('./pages/public/Services'));
const Doctors = lazy(() => import('./pages/public/Doctors'));
const Contact = lazy(() => import('./pages/public/Contact'));
const AppointmentBooking = lazy(() => import('./pages/public/AppointmentBooking'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Patients = lazy(() => import('./pages/dashboard/Patients'));
const PatientProfile = lazy(() => import('./pages/dashboard/PatientProfile'));
const Appointments = lazy(() => import('./pages/dashboard/Appointments'));
const AppointmentCalendar = lazy(() => import('./pages/dashboard/AppointmentCalendar'));
const Treatments = lazy(() => import('./pages/dashboard/Treatments'));
const TreatmentRecords = lazy(() => import('./pages/dashboard/TreatmentRecords'));
const Dentists = lazy(() => import('./pages/dashboard/Dentists'));
const ServicesManagement = lazy(() => import('./pages/dashboard/Services'));
const Billing = lazy(() => import('./pages/dashboard/Billing'));
const InvoiceDetails = lazy(() => import('./pages/dashboard/InvoiceDetails'));
const Expenses = lazy(() => import('./pages/dashboard/Expenses'));
const Financials = lazy(() => import('./pages/dashboard/Financials'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const AuditLogs = lazy(() => import('./pages/dashboard/AuditLogs'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

const PageLoader = () => (
  <div style={{ 
    minHeight: '400px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <LoadingSpinner size="lg" />
  </div>
);

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
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
      <Suspense fallback={<PageLoader />}>
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
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/calendar" element={<AppointmentCalendar />} />
            <Route path="treatments" element={<ProtectedRoute allowedRoles={['admin', 'dentist']}><Treatments /></ProtectedRoute>} />
            <Route path="treatments/:treatmentId/records" element={<ProtectedRoute allowedRoles={['admin', 'dentist']}><TreatmentRecords /></ProtectedRoute>} />
            <Route path="dentists" element={<ProtectedRoute allowedRoles={['admin']}><Dentists /></ProtectedRoute>} />
            <Route path="services" element={<ProtectedRoute allowedRoles={['admin']}><ServicesManagement /></ProtectedRoute>} />
            <Route path="billing" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'receptionist']}><Billing /></ProtectedRoute>} />
            <Route path="billing/:invoiceId" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'receptionist']}><InvoiceDetails /></ProtectedRoute>} />
            <Route path="expenses" element={<ProtectedRoute allowedRoles={['admin', 'accountant']}><Expenses /></ProtectedRoute>} />
            <Route path="financials" element={<ProtectedRoute allowedRoles={['admin', 'accountant']}><Financials /></ProtectedRoute>} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="audit-logs" element={<ProtectedRoute allowedRoles={['admin']}><AuditLogs /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;