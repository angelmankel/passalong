const { CATEGORIES, CONDITIONS } = require('../constants');

function getConfig(req, res) {
  try {
    res.json({
      categories: CATEGORIES,
      conditions: CONDITIONS
    });
  } catch (error) {
    console.error('Error getting config:', error);
    res.status(500).json({ error: 'Failed to load configuration' });
  }
}

module.exports = {
  getConfig
};
