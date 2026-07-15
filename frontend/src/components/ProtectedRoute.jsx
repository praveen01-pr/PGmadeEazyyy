import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    // If user is logged in and tries to access login page, redirect to appropriate dashboard
    if (userId && ['/login', '/register', '/'].includes(location.pathname)) {
      switch (userRole) {
        case 'SEEKER':
          navigate('/seeker-dashboard');
          break;
        case 'OWNER':
          navigate('/owner-dashboard');
          break;
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        default:
          break;
      }
    }

    // If user is not logged in and tries to access protected routes, redirect to login
    if (!userId && !location.pathname.includes('login') && !location.pathname.includes('register')) {
      navigate('/login');
    }

    // Prevent browser back button from navigating to login page when logged in
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location]);

  return children;
};

export default ProtectedRoute; 