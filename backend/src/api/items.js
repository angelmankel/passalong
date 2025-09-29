const { parseItems } = require('../items/itemParser');

function getItems(req, res) {
  try {
    const items = req.app.locals.itemsCache || [];
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ error: 'Failed to get items' });
  }
}

async function refreshItems(req, res) {
  try {
    const ITEMS_DIR = req.app.locals.ITEMS_DIR;
    const newItems = await parseItems(ITEMS_DIR);
    req.app.locals.itemsCache = newItems;
    
    console.log(`Refreshed items cache: ${newItems.length} items`);
    res.json({ 
      message: 'Items refreshed successfully', 
      count: newItems.length 
    });
  } catch (error) {
    console.error('Error refreshing items:', error);
    res.status(500).json({ error: 'Failed to refresh items' });
  }
}

module.exports = { getItems, refreshItems };
