import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Import all components
import Home from '../components/Home';
import Services from '../components/Services';
import About from '../components/About';
import JobOpenings from '../components/JobOpenings';
import InternshipPrograms from '../components/InternshipPrograms';
import Contact from '../components/Contact';
import ContactManagement from '../components/ContactManagement';
import Settings from '../components/Settings';
import UserManagement from '../components/UserManagement';
import Dashboard from '../components/Dashboard';
import FirebaseTest from '../components/FirebaseTest';
import RoutingTest from '../components/RoutingTest';
import AppDevelopmentRequests from '../components/AppDevelopmentRequests';

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      {/* Public routes (if any) */}
      <Route path="/login" element={<Navigate to="/home" replace />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Navigate to="/home" replace />
        </ProtectedRoute>
      } />
      
      <Route path="/home" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/services" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Services />
        </ProtectedRoute>
      } />
      
      <Route path="/about" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <About />
        </ProtectedRoute>
      } />
      
      
      <Route path="/job-openings" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <JobOpenings />
        </ProtectedRoute>
      } />
      
      <Route path="/internship-programs" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <InternshipPrograms />
        </ProtectedRoute>
      } />
      
      <Route path="/contact" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Contact />
        </ProtectedRoute>
      } />
      
      <Route path="/contact-management" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ContactManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/app-development-requests" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AppDevelopmentRequests />
        </ProtectedRoute>
      } />
      
      <Route path="/user-management" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UserManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Development/Testing routes */}
      <Route path="/firebase-test" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <FirebaseTest />
        </ProtectedRoute>
      } />
      
      <Route path="/routing-test" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <RoutingTest />
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Navigate to="/home" replace />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
