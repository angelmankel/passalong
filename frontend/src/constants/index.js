// Categories for items
export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Kitchen',
  'Tools',
  'Sports',
  'Toys',
  'Home Decor',
  'Automotive',
  'Other'
];

// Item conditions
export const CONDITIONS = [
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
