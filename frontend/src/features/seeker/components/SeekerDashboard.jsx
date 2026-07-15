import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building, User, LogOut, Menu, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const menuItems = [
  { icon: Home, label: 'Find PG', path: '/seeker-dashboard/find-pg' },
  { icon: Building, label: 'My Bookings', path: '/seeker-dashboard/bookings' },
  { icon: User, label: 'Profile', path: '/seeker-dashboard/profile' },
  { icon: LogOut, label: 'Logout', isLogout: true }
];

const SeekerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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
          <h1 className="text-2xl font-bold text-white mb-6">Seeker Dashboard</h1>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.isLogout) {
                  handleLogout();
                } else {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-600 text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content + Overlay */}
      <div className="flex-1 relative">
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 backdrop-blur-sm bg-black/20 transition"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="relative z-20 p-6">
          <button
            onClick={toggleSidebar}
            className="mb-4 p-2 rounded bg-orange-600 text-white hover:bg-orange-500 transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="bg-black/80 rounded-xl p-6">
            {/* Added Welcome Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, {user?.name || 'User'}!</h2>
              <p className="text-gray-400 mb-6">Here's what's happening with your PG stays.</p>
            </div>

            {/* Original Dashboard Options (Filtered) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {menuItems.filter(item => !item.isLogout).map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="bg-black/50 p-6 rounded-lg border border-orange-600 hover:border-orange-500 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.label}</h3>
                  </div>
                  <p className="text-gray-400">Click to view {item.label.toLowerCase()}</p>
                </button>
              ))}
            </div>

            {/* Added Quick Tips Section */}
            <div className="bg-black/50 border border-orange-600 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">💡 Quick Tips</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Always check reviews before booking.</li>
                <li>• Verify amenities with the host.</li>
                <li>• Pay securely through the platform.</li>
              </ul>
            </div>

            {/* Added Why Choose Us Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-orange-600">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-white">Verified Hosts</h4>
                </div>
                <p className="text-gray-300 text-sm">All listings are carefully screened.</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-orange-600">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-white">Secure Payments</h4>
                </div>
                <p className="text-gray-300 text-sm">100% payment protection.</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-orange-600">
                <div className="flex items-center gap-3 mb-2">
                  <Headphones className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-white">24/7 Support</h4>
                </div>
                <p className="text-gray-300 text-sm">We're here to help anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;