import { NavLink } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  // Helper function to get user type without ROLE_ prefix
  const getUserType = (userType) => {
    return userType?.replace('ROLE_', '').toLowerCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-600 bg-black/90 backdrop-blur-lg shadow-md shadow-orange-600/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-orange-500 animate-pulse hover:animate-spin" />
          <NavLink
            to="/"
            className="text-xl font-bold text-white hover:text-orange-500 transition-colors duration-300 hover:scale-105 transform"
          >
            PG Made Eazy
          </NavLink>
        </div>

        {/* Center Links */}
        <div className="flex-grow hidden md:flex justify-center gap-6">
          {user ? (
            <NavLink
              to={
                getUserType(user.userType) === 'seeker' 
                  ? '/seeker-dashboard' 
                  : getUserType(user.userType) === 'provider'
                  ? '/provider-dashboard'
                  : '/admin-dashboard'
              }
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300"
            >
              {getUserType(user.userType) === 'seeker' 
                ? 'Seeker Dashboard' 
                : getUserType(user.userType) === 'provider'
                ? 'Provider Dashboard'
                : 'Admin Dashboard'}
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/"
                className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                Home Page
              </NavLink>
              <NavLink
                to="/how-it-works"
                className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                How it Works
              </NavLink>
              <NavLink
                to="/contact"
                className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
              >
                Contact
              </NavLink>
            </>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-transparent border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
              >
                Get Started
              </NavLink>
              <NavLink
                to="/login"
                className="px-4 py-2 bg-transparent border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors duration-300"
              >
                Sign In
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}