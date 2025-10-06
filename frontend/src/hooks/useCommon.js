import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that calls a function on component mount
 * @param {Function} fn - Function to call
 * @param {Array} deps - Dependencies
 */
export const useMount = (fn, deps = []) => {
  useEffect(() => {
    fn();
  }, []);
};

/**
 * Custom hook that calls a function on component unmount
 * @param {Function} fn - Function to call
 */
export const useUnmount = (fn) => {
  useEffect(() => {
    return fn;
  }, []);
};

/**
 * Custom hook to get previous value
 * @param {*} value 
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

/**
 * Custom hook for debounced value
 * @param {*} value 
 * @param {number} delay 
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for local storage
 * @param {string} key 
 * @param {*} initialValue 
 * @returns {Array}
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook for media queries
 * @param {string} query 
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};
