'use client';

import { useState, useCallback } from 'react';
import api from '../services/api';
import { getErrorMessage, getErrorType, getErrorDetails } from '../services/api/errorHandler';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(
    async (promise) => {
      try {
        setLoading(true);
        setError(null);
        return await promise;
      } catch (err) {
        console.error('API Error:', err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(
    async (url, config = {}) => {
      return makeRequest(api.get(url, config));
    },
    [makeRequest]
  );

  const post = useCallback(
    async (url, data, config = {}) => {
      return makeRequest(api.post(url, data, config));
    },
    [makeRequest]
  );

  const put = useCallback(
    async (url, data, config = {}) => {
      return makeRequest(api.put(url, data, config));
    },
    [makeRequest]
  );

  const del = useCallback(
    async (url, config = {}) => {
      return makeRequest(api.delete(url, config));
    },
    [makeRequest]
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    getErrorMessage,
    getErrorType,
    getErrorDetails,
  };
};
