import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/errorHandler';

/**
 * Custom hook for async operations with loading and error states
 * @param {Function} asyncFunction - Async function to execute
 * @returns {Object} { execute, loading, error, data }
 */
export const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction(...params);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error, data };
};

/**
 * Custom hook for form submission
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} { handleSubmit, isSubmitting, error }
 */
export const useFormSubmit = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (values, formikHelpers) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(values, formikHelpers);
    } catch (err) {
      setError(err);
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  return { handleSubmit, isSubmitting, error };
};

/**
 * Custom hook for pagination
 * @param {number} initialPage 
 * @param {number} initialLimit 
 * @returns {Object}
 */
export const usePagination = (initialPage = 1, initialLimit = 20) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    reset
  };
};
