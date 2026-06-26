const localStorageService = {
  setItem: (key, value) => {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },
  getItem: (key, parseJson = true) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      if (!parseJson) return serializedValue;
      
      try {
        return JSON.parse(serializedValue);
      } catch (err) {
        return serializedValue;
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
};

export default localStorageService;
