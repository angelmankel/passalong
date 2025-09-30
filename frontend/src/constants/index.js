// Categories and conditions will be loaded dynamically from the API
// These are fallback values in case the API is not available
export const DEFAULT_CATEGORIES = [
  'Cables',
  'Computer Cases',
  'Computer Parts',
  'Graphics Card',
  'Networking',
  'Other',
  'Server'
];

export const DEFAULT_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
  'Not Working'
];

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get full image URL
export const getImageUrl = (itemId, imageName) => {
  return `${API_BASE_URL}/api/images/${itemId}/${imageName}`;
};
