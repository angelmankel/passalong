// Quick debug script to test API URL configuration
// Run this in the browser console to check what URL is being used

console.log('API_BASE_URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');
console.log('Current location:', window.location.href);
console.log('Expected API calls to:', process.env.REACT_APP_API_URL || 'http://localhost:5000');

// Test the actual API call
fetch('/api/items')
  .then(response => {
    console.log('API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response Data:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });
