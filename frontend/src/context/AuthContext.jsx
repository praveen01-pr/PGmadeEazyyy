'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for token in cookies on mount
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      const userDataObj = JSON.parse(userData);
      setUser(userDataObj);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, userType, id, name, email: userEmail } = response.data;
      
      if (token && userType && id) {
        // Store token and user data in cookies
        Cookies.set('token', token, { expires: 1 }); // 1 day expiry
        Cookies.set('user', JSON.stringify({
          id,
          userType: `ROLE_${userType.toUpperCase()}`, // Convert to uppercase once
          name,
          email: userEmail
        }), { expires: 1 });
        
        // Update user state immediately
        setUser({
          id,
          userType: `ROLE_${userType.toUpperCase()}`, // Convert to uppercase once
          name,
          email: userEmail
        });
        
        // Set the token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear token and user data from cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Clear user state
    setUser(null);
    setError(null);
    
    // Clear any auth tokens from axios
    axios.defaults.headers.common['Authorization'] = '';
  };

  const isAuthenticated = () => {
    const token = Cookies.get('token');
    return !!token;
  };

  // Add a useEffect to update user state when cookies change
  useEffect(() => {
    const checkUser = () => {
      const token = Cookies.get('token');
      const userData = Cookies.get('user');
      
      if (token && userData) {
        const userDataObj = JSON.parse(userData);
        setUser(userDataObj);
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkUser();

    // Listen for cookie changes
    const observer = new MutationObserver(checkUser);
    observer.observe(document, { subtree: true, childList: true });

    return () => observer.disconnect();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};