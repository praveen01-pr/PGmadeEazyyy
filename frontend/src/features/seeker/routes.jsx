import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SeekerDashboard from './components/SeekerDashboard';
import FindPG from './components/FindPG';

const SeekerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SeekerDashboard />} />
      <Route path="/find-pg" element={<FindPG />} />
    </Routes>
  );
};

export default SeekerRoutes; 