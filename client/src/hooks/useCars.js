import { useState } from 'react';
import { carAPI } from '../services/api';

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchCars = async (params = {}) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = {
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...params
      };
      
      const response = await carAPI.getAll(queryParams);
      
      setCars(response.data.data);
      setPagination(prev => ({
        ...prev,
        page: params.page || prev.page,
        limit: params.limit || prev.limit,
        total: response.data.count,
        pages: Math.ceil(response.data.count / (params.limit || prev.limit))
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const changeLimit = (limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  return {
    cars,
    loading,
    error,
    pagination,
    fetchCars,
    changePage,
    changeLimit
  };
};