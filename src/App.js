import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Services from './components/Services';
import About from './components/About';
import JobOpenings from './components/JobOpenings';
import InternshipPrograms from './components/InternshipPrograms';
import Contact from './components/Contact';
import Settings from './components/Settings';
import Layout from './components/Layout';
import RoutingTest from './components/RoutingTest';
import ContactManagement from './components/ContactManagement';
import FirebaseTest from './components/FirebaseTest';
import authService from './authService.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage first for immediate authentication
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
      setIsAuthenticated(true);
    }

    // Check Firebase auth state
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        // Store user info in localStorage for persistence
        localStorage.setItem('authToken', 'firebase-token');
        localStorage.setItem('userEmail', user.email);
      } else {
        // Only set to false if no localStorage token exists
        if (!token) {
          setIsAuthenticated(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      // Try Firebase authentication first
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        // Fallback to hardcoded credentials for demo
        if (email === 'apexsofttechnology@gmail.com' && password === 'Apex@8899') {
          localStorage.setItem('authToken', 'dummy-token');
          localStorage.setItem('userEmail', email);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      
      // Redirect to main login page
      window.location.href = '../../index.html';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      window.location.href = '../../index.html';
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/job-openings" element={<JobOpenings />} />
          <Route path="/internship-programs" element={<InternshipPrograms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-management" element={<ContactManagement />} />
          <Route path="/firebase-test" element={<FirebaseTest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/routing-test" element={<RoutingTest />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
