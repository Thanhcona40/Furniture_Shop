/**
 * LocalStorage utility functions
 * Provides type-safe localStorage operations with error handling
 */

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  JUST_LOGGED_OUT: 'justLoggedOut'
};

class StorageService {
  /**
   * Get item from localStorage
   * @param {string} key
   * @param {*} defaultValue 
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Auth specific methods
  getToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  setToken(token) {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  removeToken() {
    this.remove(STORAGE_KEYS.TOKEN);
  }

  getUser() {
    return this.get(STORAGE_KEYS.USER);
  }

  setUser(user) {
    this.set(STORAGE_KEYS.USER, user);
  }

  removeUser() {
    this.remove(STORAGE_KEYS.USER);
  }

  // Session management
  setJustLoggedOut(value = true) {
    try {
      if (value) {
        sessionStorage.setItem(STORAGE_KEYS.JUST_LOGGED_OUT, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.JUST_LOGGED_OUT);
      }
    } catch (error) {
      console.error('Error setting justLoggedOut:', error);
    }
  }

  getJustLoggedOut() {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.JUST_LOGGED_OUT) === 'true';
    } catch (error) {
      console.error('Error getting justLoggedOut:', error);
      return false;
    }
  }

  /**
   * Clear all auth data
   */
  clearAuth() {
    this.removeToken();
    this.removeUser();
    this.setJustLoggedOut(true);
  }
}

export const storage = new StorageService();
export { STORAGE_KEYS };
