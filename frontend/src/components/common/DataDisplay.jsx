import React, { useCallback, useMemo } from 'react';
import { Pagination as MuiPagination } from '@mui/material';

/**
 * Pagination Component with page info
 */
export const Pagination = React.memo(({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  className = ''
}) => {
  const startItem = useMemo(() => {
    return totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  }, [page, itemsPerPage, totalItems]);

  const endItem = useMemo(() => {
    return Math.min(page * itemsPerPage, totalItems);
  }, [page, itemsPerPage, totalItems]);

  const handleChange = useCallback((event, value) => {
    onPageChange?.(value);
  }, [onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <p className="text-sm text-gray-700">
        Hiển thị <span className="font-medium">{startItem}</span> đến{' '}
        <span className="font-medium">{endItem}</span> trong tổng số{' '}
        <span className="font-medium">{totalItems}</span> kết quả
      </p>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </div>
  );
});

Pagination.displayName = 'Pagination';

/**
 * Search Input Component with debounce
 */
export const SearchInput = React.memo(({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
  debounceMs = 500
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
});

SearchInput.displayName = 'SearchInput';

/**
 * Price Display Component
 */
export const Price = React.memo(({ 
  value, 
  className = '',
  showCurrency = true,
  discountPrice
}) => {
  const formattedPrice = useMemo(() => {
    return value?.toLocaleString('vi-VN') || '0';
  }, [value]);

  const formattedDiscountPrice = useMemo(() => {
    return discountPrice?.toLocaleString('vi-VN');
  }, [discountPrice]);

  return (
    <div className={`${className}`}>
      {discountPrice && (
        <span className="text-gray-400 line-through mr-2">
          {formattedPrice}{showCurrency && 'đ'}
        </span>
      )}
      <span className={discountPrice ? 'text-red-500 font-semibold' : ''}>
        {discountPrice ? formattedDiscountPrice : formattedPrice}
        {showCurrency && 'đ'}
      </span>
    </div>
  );
});

Price.displayName = 'Price';

export default Pagination;
