'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';

export const useBooking = () => {
  const api = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(
    async (bookingData) => {
      try {
        setLoading(true);
        const response = await api.bookingApi.createBooking(bookingData);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const getBookings = useCallback(
    async () => {
      try {
        setLoading(true);
        const response = await api.bookingApi.getBookings();
        setBookings(response.data);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const cancelBooking = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await api.bookingApi.cancelBooking(id);
        setBookings(prev => prev.filter(booking => booking.id !== id));
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
    getBookings();
  }, [getBookings]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    getBookings,
    cancelBooking,
  };
};
