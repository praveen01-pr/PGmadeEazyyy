import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SearchFilters } from '../components/SearchFilters';
import { PGListingCard } from '../components/PGListingCard';
import { BookingForm } from '../components/BookingForm';
import { ReviewsSection } from '../components/ReviewsSection';
import { useApi } from '../../../hooks/useApi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  const [pgs, setPGs] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedPG, setSelectedPG] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = async (newFilters) => {
    setFilters(newFilters);
    try {
      const response = await api.pgApi.searchPGs(newFilters);
      setPGs(response.data);
    } catch (error) {
      console.error('Error searching PGs:', error);
    }
  };

  const handlePGSelect = (pg) => {
    setSelectedPG(pg);
  };

  const handleCloseBooking = () => {
    setSelectedPG(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-black/80 p-8 rounded-xl shadow-xl border border-orange-600">
          <h1 className="text-3xl font-bold text-white mb-6">Welcome, {user?.name}</h1>
          
          <div className="mb-8">
            <SearchFilters onSearch={handleSearch} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {pgs.map((pg) => (
              <PGListingCard
                key={pg.id}
                pg={pg}
                onSelect={() => handlePGSelect(pg)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/50 p-6 rounded-lg border border-orange-600">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <ul className="space-y-2">
                <li className="text-gray-300">• Find PG</li>
                <li className="text-gray-300">• View Bookings</li>
                <li className="text-gray-300">• Update Profile</li>
                <li className="text-gray-300">• Messages</li>
              </ul>
            </div>
            <div className="bg-black/50 p-6 rounded-lg border border-orange-600">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <ul className="space-y-2">
                <li className="text-gray-300">• No recent activity</li>
              </ul>
            </div>
          </div>

          {selectedPG && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-black/80 p-8 rounded-xl shadow-xl border border-orange-600 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Book PG</h2>
                  <button
                    onClick={handleCloseBooking}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Close
                  </button>
                </div>
                <BookingForm pg={selectedPG} onClose={handleCloseBooking} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
