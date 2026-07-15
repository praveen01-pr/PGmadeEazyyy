import React from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import PayPalSuccess from './features/seeker/components/PayPalSuccess';
import PayPalCancel from './features/seeker/components/PayPalCancel';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;