'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';

export const usePGSearch = () => {
  const api = useApi();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPGs = useCallback(
    async (filters) => {
      try {
        setLoading(true);
        const response = await api.pgApi.searchPGs(filters);
        setPGs(response.data);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const getPGDetails = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await api.pgApi.getPGDetails(id);
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

  return {
    pgs,
    loading,
    error,
    searchPGs,
    getPGDetails,
  };
};
