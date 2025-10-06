import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for list pages with pagination, search, and sorting
 * @param {Function} fetchFunction - API function to fetch data
 * @param {Object} options - Configuration options
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.itemsPerPage - Items per page (default: 10)
 * @param {string} options.initialSortBy - Initial sort field
 * @param {string} options.initialSortOrder - Initial sort order ('asc' or 'desc')
 * @param {Object} options.initialFilters - Initial filter values
 * @returns {Object} - State and handlers for list page
 */
const useListPage = (fetchFunction, options = {}) => {
  const {
    initialPage = 1,
    itemsPerPage = 10,
    initialSortBy = '',
    initialSortOrder = 'asc',
    initialFilters = {},
    autoFetch = true,
  } = options;

  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [filters, setFilters] = useState(initialFilters);
  
  // Use ref to store fetchFunction to avoid re-creating fetchData
  const fetchFunctionRef = useRef(fetchFunction);
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params (only if needed)
      const params = {};
      
      // Only add params if they have values
      if (page > 1) params.page = page;
      if (itemsPerPage !== 10) params.limit = itemsPerPage;
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }

      // Add filters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params[key] = filters[key];
        }
      });

      // Call API with or without params
      const response = Object.keys(params).length > 0 
        ? await fetchFunctionRef.current(params)
        : await fetchFunctionRef.current();

      // Handle different response formats
      if (response?.data?.products) {
        // Format: { products: [], totalPages: 0, total: 0 }
        setData(response.data.products);
        setTotalPages(response.data.totalPages || 0);
        setTotal(response.data.total || response.data.products.length);
      } else if (Array.isArray(response?.data)) {
        // Format: [...] - Direct array response
        setData(response.data);
        setTotalPages(1);
        setTotal(response.data.length);
      } else if (Array.isArray(response)) {
        // Format: [...] - Response is array directly (for some APIs)
        setData(response);
        setTotalPages(1);
        setTotal(response.length);
      } else {
        // Generic format
        setData(response?.data?.data || response?.data || []);
        setTotalPages(response?.data?.totalPages || 0);
        setTotal(response?.data?.total || 0);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Lỗi tải dữ liệu';
      setError(errorMessage);
      toast.error(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage, searchQuery, sortBy, sortOrder]); // Removed fetchFunction and filters

  // Auto fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  // Reset to page 1 when search, sort, or filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, sortOrder]);

  // Handlers
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSort = useCallback((field, order = 'asc') => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery('');
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
    setPage(1);
  }, [initialFilters, initialSortBy, initialSortOrder]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // CRUD helpers
  const addItem = useCallback((item) => {
    setData((prev) => [item, ...prev]);
    setTotal((prev) => prev + 1);
  }, []);

  const updateItem = useCallback((id, updatedItem) => {
    setData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...updatedItem } : item))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setData((prev) => prev.filter((item) => item._id !== id));
    setTotal((prev) => prev - 1);
  }, []);

  return {
    // Data
    data,
    loading,
    error,
    total,
    totalPages,
    
    // Pagination
    page,
    itemsPerPage,
    handlePageChange,
    
    // Search
    searchQuery,
    handleSearch,
    
    // Sorting
    sortBy,
    sortOrder,
    handleSort,
    
    // Filtering
    filters,
    handleFilterChange,
    handleResetFilters,
    
    // Actions
    refresh,
    addItem,
    updateItem,
    removeItem,
    
    // Manual control
    setData,
    setPage,
  };
};

export default useListPage;
