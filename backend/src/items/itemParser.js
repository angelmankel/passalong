const fs = require('fs-extra');
const path = require('path');

const SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.heic'];

async function parseItems(itemsDir) {
  const items = [];
  
  try {
    // Check if items directory exists
    if (!await fs.pathExists(itemsDir)) {
      console.log('Items directory does not exist, creating...');
      await fs.ensureDir(itemsDir);
      return items;
    }

    // Get all subdirectories in items folder
    const subdirs = await fs.readdir(itemsDir, { withFileTypes: true });
    const itemDirs = subdirs.filter(dirent => dirent.isDirectory());

    for (const itemDir of itemDirs) {
      const itemPath = path.join(itemsDir, itemDir.name);
      const jsonFile = path.join(itemPath, 'item.json');
      
      try {
        // Check if item.json exists
        if (await fs.pathExists(jsonFile)) {
          const itemData = await fs.readJson(jsonFile);
          
          // Find all image files in the directory
          const files = await fs.readdir(itemPath);
          const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
          });
          
          // Add images array to item data
          itemData.images = imageFiles;
          
          // Validate required fields
          if (itemData.id && itemData.name && itemData.price !== undefined) {
            items.push(itemData);
            console.log(`Loaded item: ${itemData.name} (${imageFiles.length} images)`);
          } else {
            console.warn(`Skipping invalid item in ${itemDir.name}: missing required fields`);
          }
        } else {
          console.warn(`No item.json found in ${itemDir.name}`);
        }
      } catch (error) {
        console.error(`Error parsing item in ${itemDir.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error reading items directory:', error);
  }

  return items;
}

module.exports = { parseItems };
