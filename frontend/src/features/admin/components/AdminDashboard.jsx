import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Building, User, Users, LogOut, Menu, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/admin-dashboard' },
  { icon: Building, label: 'Available PGs', path: '/admin-dashboard/available-pgs' },
  { icon: Building, label: 'PG Requests', path: '/admin-dashboard/approvals' },
  { icon: Building, label: 'Rejected PGs', path: '/admin-dashboard/rejected-pgs' },
  { icon: User, label: 'Providers', path: '/admin-dashboard/providers' },
  { icon: Users, label: 'Seekers', path: '/admin-dashboard/seekers' },
  { icon: LogOut, label: 'Logout', isLogout: true }
];

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="relative bg-black min-h-[calc(100vh-120px)] flex overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="z-40 w-64 bg-black/90 border-r border-orange-600 p-4 space-y-4">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
          
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.isLogout ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 text-white transition w-full"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-600 text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content + Overlay */}
      <div className="flex-1 relative">
        {/* Blur Overlay */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 backdrop-blur-sm bg-black/20 transition"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="relative z-20 p-6">
          {/* Hamburger Button */}
          <button
            id="hamburger-button"
            onClick={toggleSidebar}
            className="mb-4 p-2 rounded bg-orange-600 text-white hover:bg-orange-500 transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="bg-black/80 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome to Admin Dashboard</h2>
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Link
                to="/admin-dashboard/approvals"
                className="bg-black/50 p-6 rounded-lg border border-orange-600 hover:bg-orange-600/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Pending Approvals</h3>
                    <p className="text-orange-500">Review new property listings</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin-dashboard/available-pgs"
                className="bg-black/50 p-6 rounded-lg border border-green-600 hover:bg-green-600/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Available PGs</h3>
                    <p className="text-green-500">View approved properties</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin-dashboard/rejected-pgs"
                className="bg-black/50 p-6 rounded-lg border border-red-600 hover:bg-red-600/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Rejected Properties</h3>
                    <p className="text-red-500">Review rejected listings</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin-dashboard/providers"
                className="bg-black/50 p-6 rounded-lg border border-purple-600 hover:bg-purple-600/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <User className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Property Providers</h3>
                    <p className="text-purple-500">Manage property owners</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin-dashboard/seekers"
                className="bg-black/50 p-6 rounded-lg border border-blue-600 hover:bg-blue-600/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">PG Seekers</h3>
                    <p className="text-blue-500">View property seekers</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-black/50 p-6 rounded-lg border border-orange-600">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <p className="text-gray-300">No recent activity to display</p>
                <p className="text-gray-300">Check back later for updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
