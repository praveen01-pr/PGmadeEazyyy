'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';

export const useProperty = () => {
  const api = useApi();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProperty = useCallback(
    async (propertyData) => {
      try {
        setLoading(true);
        const response = await api.pgApi.createPG(propertyData);
        setProperties(prev => [...prev, response.data]);
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

  const updateProperty = useCallback(
    async (id, propertyData) => {
      try {
        setLoading(true);
        const response = await api.pgApi.updatePG(id, propertyData);
        setProperties(prev => prev.map(
          property => property.id === id ? response.data : property
        ));
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

  const deleteProperty = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await api.pgApi.deletePG(id);
        setProperties(prev => prev.filter(property => property.id !== id));
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const getProperties = useCallback(
    async () => {
      try {
        setLoading(true);
        const response = await api.pgApi.searchPGs({ ownerId: api.user?.id });
        setProperties(response.data);
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
    getProperties();
  }, [getProperties]);

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    getProperties,
  };
};
