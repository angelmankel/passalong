const fs = require('fs-extra');
const path = require('path');

// Load categories and conditions from config.json
let CATEGORIES = [];
let CONDITIONS = [];

function loadConfig() {
  try {
    const configPath = path.join(__dirname, '../../../items/config.json');
    const config = fs.readJsonSync(configPath);
    CATEGORIES = config.categories || [];
    CONDITIONS = config.conditions || [];
    console.log('Loaded categories and conditions from config.json');
  } catch (error) {
    console.error('Error loading config.json, using defaults:', error);
    // Fallback to default values
    CATEGORIES = [
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
    CONDITIONS = [
      'New',
      'Like New',
      'Good',
      'Fair',
      'Poor',
      'Not Working'
    ];
  }
}

// Load config on startup
loadConfig();

module.exports = {
  CATEGORIES,
  CONDITIONS,
  loadConfig
};
