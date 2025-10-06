import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ size = 40, color = 'primary', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <CircularProgress size={size} color={color} />
    </div>
  );
};

/**
 * Full Page Loading Overlay
 */
export const LoadingOverlay = ({ message = 'Đang tải...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <CircularProgress size={50} />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

/**
 * Button with Loading State
 */
export const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  className = '',
  loadingText = 'Đang xử lý...',
  ...props
}) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 ${className} ${
        loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <CircularProgress size={16} color="inherit" />}
      {loading ? loadingText : children}
    </button>
  );
};

/**
 * Skeleton Loader
 */
export const Skeleton = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
      style={{ width, height }}
    />
  );
};

/**
 * Card Skeleton
 */
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <Skeleton height="200px" />
          <Skeleton width="70%" />
          <Skeleton width="50%" />
          <Skeleton width="30%" />
        </div>
      ))}
    </>
  );
};

export default LoadingSpinner;
