import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PaymentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/provider-dashboard')}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Payment management features will be implemented here.</p>
      </div>
    </div>
  );
};

export default PaymentsPage;