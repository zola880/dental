import { useState, useEffect } from 'react';

export const useFetch = (fetchFunction, deps = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFunction(...args);
      setData(response.data || response);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error, refetch: execute };
};