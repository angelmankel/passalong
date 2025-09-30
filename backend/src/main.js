const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { parseItems } = require('./items/itemParser');
const { getItems, refreshItems } = require('./api/items');
const { getConfig } = require('./api/config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images from items folder
app.use('/api/images', express.static(path.join(__dirname, '../../items')));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/items', getItems);
app.post('/api/refresh', refreshItems);
app.get('/api/config', getConfig);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Initialize items cache on startup
let itemsCache = [];
const ITEMS_DIR = path.join(__dirname, '../../items');

async function initializeItems() {
  try {
    console.log('Initializing items from:', ITEMS_DIR);
    itemsCache = await parseItems(ITEMS_DIR);
    console.log(`Loaded ${itemsCache.length} items`);
  } catch (error) {
    console.error('Error initializing items:', error);
  }
}

// Set items cache for API routes
app.locals.ITEMS_DIR = ITEMS_DIR;

// Initialize and start server
initializeItems().then(() => {
  // Update the cache after items are loaded
  app.locals.itemsCache = itemsCache;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
