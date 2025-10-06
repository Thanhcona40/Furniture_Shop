import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRICE_RANGES } from '../constants';

/**
 * Hook to manage product filters with URL sync
 */
export const useProductFilters = (initialFilters = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || initialFilters.category || '',
    minPrice: searchParams.get('minPrice') || initialFilters.minPrice || '',
    maxPrice: searchParams.get('maxPrice') || initialFilters.maxPrice || '',
    sortBy: searchParams.get('sortBy') || initialFilters.sortBy || 'name',
    search: searchParams.get('search') || initialFilters.search || '',
    priceRanges: [],
    brands: [],
    ...initialFilters
  });

  // Update filter and sync with URL
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Update multiple filters at once
  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({ ...prev, ...updates }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      search: '',
      priceRanges: [],
      brands: []
    });
    setSearchParams({});
  }, [setSearchParams]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.category ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.search ||
      filters.priceRanges?.length > 0 ||
      filters.brands?.length > 0
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters
  };
};

/**
 * Hook to filter products array based on criteria
 */
export const useFilterProducts = (products, filters) => {
  return useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(p => 
        p.category?.name === filters.category || 
        p.category === filters.category
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range (min/max)
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      filtered = filtered.filter(p => (p.price || 0) >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      filtered = filtered.filter(p => (p.price || 0) <= max);
    }

    // Filter by price ranges
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        return filters.priceRanges.some(rangeValue => {
          const range = PRICE_RANGES.find(r => r.value === rangeValue);
          if (!range) return false;
          return price >= range.min && price < range.max;
        });
      });
    }

    // Filter by brands
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => 
        filters.brands.includes(p.brand)
      );
    }

    // Sort products
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'price-asc':
            return (a.price || 0) - (b.price || 0);
          case 'price-desc':
            return (b.price || 0) - (a.price || 0);
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, filters]);
};

/**
 * Hook for price range filtering
 */
export const usePriceRangeFilter = () => {
  const [selectedRanges, setSelectedRanges] = useState([]);

  const toggleRange = useCallback((rangeValue) => {
    setSelectedRanges(prev => 
      prev.includes(rangeValue)
        ? prev.filter(v => v !== rangeValue)
        : [...prev, rangeValue]
    );
  }, []);

  const clearRanges = useCallback(() => {
    setSelectedRanges([]);
  }, []);

  const getMinMax = useMemo(() => {
    if (selectedRanges.length === 0) {
      return { min: null, max: null };
    }

    const ranges = selectedRanges
      .map(value => PRICE_RANGES.find(r => r.value === value))
      .filter(Boolean);

    const min = Math.min(...ranges.map(r => r.min));
    const max = Math.max(...ranges.map(r => 
      r.max === Infinity ? Number.MAX_SAFE_INTEGER : r.max
    ));

    return { 
      min, 
      max: max === Number.MAX_SAFE_INTEGER ? null : max 
    };
  }, [selectedRanges]);

  return {
    selectedRanges,
    toggleRange,
    clearRanges,
    getMinMax
  };
};

export default useProductFilters;
