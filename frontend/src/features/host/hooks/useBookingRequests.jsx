'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';

export const useBookingRequests = () => {
  const api = useApi();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRequests = useCallback(
    async () => {
      try {
        setLoading(true);
        const response = await api.bookingApi.getBookings();
        setRequests(response.data.filter(
          request => request.property.ownerId === api.user?.id
        ));
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const approveBooking = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await api.bookingApi.updateBooking(id, { status: 'approved' });
        setRequests(prev => prev.map(
          request => request.id === id ? { ...request, status: 'approved' } : request
        ));
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const rejectBooking = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await api.bookingApi.updateBooking(id, { status: 'rejected' });
        setRequests(prev => prev.map(
          request => request.id === id ? { ...request, status: 'rejected' } : request
        ));
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  return {
    requests,
    loading,
    error,
    getRequests,
    approveBooking,
    rejectBooking,
  };
};
