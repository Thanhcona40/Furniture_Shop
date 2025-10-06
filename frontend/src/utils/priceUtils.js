/**
 * Price filter utilities
 */

export const PRICE_RANGES = [
  { label: "Dưới 100.000₫", value: "under-100", min: 0, max: 100000 },
  { label: "100.000₫ - 200.000₫", value: "100-200", min: 100000, max: 200000 },
  { label: "200.000₫ - 300.000₫", value: "200-300", min: 200000, max: 300000 },
  { label: "300.000₫ - 500.000₫", value: "300-500", min: 300000, max: 500000 },
  { label: "500.000₫ - 1.000.000₫", value: "500-1000", min: 500000, max: 1000000 },
  { label: "Trên 1.000.000₫", value: "over-1000", min: 1000000, max: Infinity },
];

/**
 * Get price range by value
 */
export const getPriceRange = (value) => {
  return PRICE_RANGES.find(range => range.value === value);
};

/**
 * Check if price is in range
 */
export const isPriceInRange = (price, rangeValue) => {
  const range = getPriceRange(rangeValue);
  if (!range) return false;
  return price >= range.min && price < range.max;
};

/**
 * Filter products by price ranges
 */
export const filterByPriceRanges = (products, selectedRanges) => {
  if (!selectedRanges || selectedRanges.length === 0) {
    return products;
  }

  return products.filter(product => {
    const price = product.price || 0;
    return selectedRanges.some(rangeValue => isPriceInRange(price, rangeValue));
  });
};

/**
 * Format price to Vietnamese currency
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0₫';
  return `${price.toLocaleString('vi-VN')}₫`;
};

/**
 * Parse price from formatted string
 */
export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0;
};

/**
 * Get min and max prices from selected ranges
 */
export const getPriceMinMax = (selectedRanges) => {
  if (!selectedRanges || selectedRanges.length === 0) {
    return { min: null, max: null };
  }

  const ranges = selectedRanges.map(getPriceRange).filter(Boolean);
  
  const min = Math.min(...ranges.map(r => r.min));
  const max = Math.max(...ranges.map(r => r.max === Infinity ? Number.MAX_SAFE_INTEGER : r.max));

  return { 
    min, 
    max: max === Number.MAX_SAFE_INTEGER ? null : max 
  };
};

export default {
  PRICE_RANGES,
  getPriceRange,
  isPriceInRange,
  filterByPriceRanges,
  formatPrice,
  parsePrice,
  getPriceMinMax
};
