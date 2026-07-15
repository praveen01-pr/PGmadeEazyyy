'use client';

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigationBlocked = useRef(false);

  useEffect(() => {
    // If user is authenticated, prevent back navigation to login page
    if (isAuthenticated()) {
      const handlePopState = (e) => {
        if (navigationBlocked.current) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      };

      window.addEventListener('popstate', handlePopState);
      navigationBlocked.current = true;

      return () => {
        window.removeEventListener('popstate', handlePopState);
        navigationBlocked.current = false;
      };
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated and tries to access login/register pages, redirect to appropriate dashboard
  if (isAuthenticated() && ['/login', '/register', '/'].includes(location.pathname)) {
    const userData = Cookies.get('user');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      switch(userDataObj.userType) {
        case 'ROLE_ADMIN':
          return <Navigate to="/admin-dashboard" replace />;
        case 'ROLE_PROVIDER':
          return <Navigate to="/provider-dashboard" replace />;
        case 'ROLE_SEEKER':
          return <Navigate to="/seeker-dashboard" replace />;
        default:
          break;
      }
    }
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
