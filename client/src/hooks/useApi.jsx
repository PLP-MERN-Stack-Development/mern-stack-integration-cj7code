// client/src/hooks/useApi.js
// A small hook to track loading / error for async actions
import { useState, useCallback } from 'react';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // run: accepts an async function and parameters, handles loading & error
  const run = useCallback(async (asyncFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unknown error');
      setLoading(false);
      throw err;
    }
  }, []);

  return { run, loading, error, setError };
}
