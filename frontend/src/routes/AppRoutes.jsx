import { Route, Routes } from 'react-router-dom';
import LandingPage from '../features/landing/Hero';
import Footer from '../components/common/Footer';
import MultiStepRegistration from '../features/auth/components/SignUpForm';
import SignInForm from '../features/auth/components/SignInForm';
import ProtectedRoute from '../context/ProtectedRoute';
import ProviderDashboard from '../features/provider/components/ProviderDashboard';
import AddProperty from '../features/provider/components/AddProperty';
import MyProperties from '../features/provider/components/MyProperties';
import TenantsPage from '../features/provider/components/TenantsPage';
import PaymentsPage from '../features/provider/components/PaymentsPage';
import AdminDashboard from '../features/admin/components/AdminDashboard';
import Profile from '../features/seeker/components/Profile';
import ProviderProfile from '../features/provider/components/ProviderProfile';
import PropertyApproval from '../features/admin/components/PropertyApproval';
import RejectedProperties from '../features/provider/components/RejectedProperties';
import AdminRejectedProperties from '../features/admin/components/RejectedProperties';
import AvailableProperties from '../features/admin/components/AvailableProperties';
import Providers from '../features/admin/components/Providers';
import Seekers from '../features/admin/components/Seekers';
import SeekerDashboard from '../features/seeker/components/SeekerDashboard';
import FindPG from '../features/seeker/components/FindPG';
import MyBookings from '../features/seeker/components/MyBookings';
import PayPalSuccess from '../features/seeker/components/PayPalSuccess';
import PayPalCancel from '../features/seeker/components/PayPalCancel';
import HowItWorks from '../pages/HowItWorks';
import Contact from '../pages/Contact';
import SavedPGs from '../features/seeker/components/SavedPGs';
import Messages from '../features/seeker/components/Messages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<MultiStepRegistration />} />
      <Route path="/login" element={<SignInForm />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Seeker Routes */}
      <Route path="/seeker-dashboard" element={
        <ProtectedRoute>
          <SeekerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/seeker-dashboard/find-pg" element={
        <ProtectedRoute>
          <FindPG />
        </ProtectedRoute>
      } />

      <Route path="/seeker-dashboard/bookings" element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } />

      {/* PayPal Routes */}
      <Route path="/seeker/paypal-success" element={
        <ProtectedRoute>
          <PayPalSuccess />
        </ProtectedRoute>
      } />

      <Route path="/seeker/paypal-cancel" element={
        <ProtectedRoute>
          <PayPalCancel />
        </ProtectedRoute>
      } />

      <Route path="/seeker-dashboard/saved-pgs" element={
        <ProtectedRoute>
          <SavedPGs />
        </ProtectedRoute>
      } />

      <Route path="/seeker-dashboard/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/seeker-dashboard/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />

      {/* Provider Routes */}
      <Route path="/provider-dashboard" element={
        <ProtectedRoute>
          <ProviderDashboard />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/add-property" element={
        <ProtectedRoute>
          <AddProperty />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/my-properties" element={
        <ProtectedRoute>
          <MyProperties />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/tenants" element={
        <ProtectedRoute>
          <TenantsPage />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/payments" element={
        <ProtectedRoute>
          <PaymentsPage />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/profile" element={
        <ProtectedRoute>
          <ProviderProfile />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/rejected-properties" element={
        <ProtectedRoute>
          <RejectedProperties />
        </ProtectedRoute>
      } />

      <Route path="/provider-dashboard/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin-dashboard/approvals" element={
        <ProtectedRoute>
          <PropertyApproval />
        </ProtectedRoute>
      } />

      <Route path="/admin-dashboard/rejected-pgs" element={
        <ProtectedRoute>
          <AdminRejectedProperties />
        </ProtectedRoute>
      } />

      <Route path="/admin-dashboard/available-pgs" element={
        <ProtectedRoute>
          <AvailableProperties />
        </ProtectedRoute>
      } />

      <Route path="/admin-dashboard/providers" element={
        <ProtectedRoute>
          <Providers />
        </ProtectedRoute>
      } />

      <Route path="/admin-dashboard/seekers" element={
        <ProtectedRoute>
          <Seekers />
        </ProtectedRoute>
      } />
      
      <Route path="/find-pg" element={<FindPG />} />
      
      <Route path="/list-property" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto bg-black/80 p-8 rounded-xl shadow-xl border border-orange-600">
                <h1 className="text-3xl font-bold text-white mb-6">List Your Property</h1>
                
                {/* Add your list property content here */}
              </div>
            </div>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
