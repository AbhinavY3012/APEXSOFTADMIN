/**
 * Safely formats a date to a localized date string
 * @param {Date|Object|string|number} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or fallback
 */
export const formatDate = (date, options = {}) => {
  try {
    // Handle Firebase Timestamp objects
    if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString(undefined, options);
    }
    
    // Handle Date objects
    if (date instanceof Date) {
      return date.toLocaleDateString(undefined, options);
    }
    
    // Handle string or number timestamps
    if (date && (typeof date === 'string' || typeof date === 'number')) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString(undefined, options);
      }
    }
    
    return 'N/A';
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', date);
    return 'Invalid Date';
  }
};

/**
 * Safely formats a date to a localized time string
 * @param {Date|Object|string|number} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string or fallback
 */
export const formatTime = (date, options = {}) => {
  try {
    // Handle Firebase Timestamp objects
    if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleTimeString(undefined, options);
    }
    
    // Handle Date objects
    if (date instanceof Date) {
      return date.toLocaleTimeString(undefined, options);
    }
    
    // Handle string or number timestamps
    if (date && (typeof date === 'string' || typeof date === 'number')) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleTimeString(undefined, options);
      }
    }
    
    return 'N/A';
  } catch (error) {
    console.error('Error formatting time:', error, 'Date value:', date);
    return 'Invalid Time';
  }
};

/**
 * Safely formats a date to both date and time strings
 * @param {Date|Object|string|number} date - The date to format
 * @param {Object} dateOptions - Date formatting options
 * @param {Object} timeOptions - Time formatting options
 * @returns {Object} Object with date and time strings
 */
export const formatDateTime = (date, dateOptions = {}, timeOptions = {}) => {
  return {
    date: formatDate(date, dateOptions),
    time: formatTime(date, timeOptions),
    full: `${formatDate(date, dateOptions)} at ${formatTime(date, timeOptions)}`
  };
};
