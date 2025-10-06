import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  cloudinaryTransform = 'w_400,h_400,c_fill,q_auto,f_auto', // Default optimization
  fallbackSrc = '/placeholder-image.png',
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Optimize Cloudinary URLs
  const getOptimizedUrl = (url) => {
    if (!url) return fallbackSrc;
    
    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com')) {
      // Insert transformation parameters
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/${cloudinaryTransform}/${parts[1]}`;
      }
    }
    return url;
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const optimizedSrc = error ? fallbackSrc : getOptimizedUrl(src);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <CircularProgress size={24} />
        </div>
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        width={width}
        height={height}
        {...props}
      />

      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Ảnh không tải được
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
