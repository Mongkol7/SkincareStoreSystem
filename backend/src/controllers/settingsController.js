const path = require('path');
const fs = require('fs').promises;

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

// Get store settings
const getStoreSettings = async (req, res) => {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(data);
    res.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    // Return default settings if file doesn't exist
    res.json({
      store: {
        name: 'Skincare POS',
        email: 'contact@skincarepos.com',
        phone: '+1 234-567-8900',
        address: '123 Beauty Street, Wellness City',
        taxRate: '8.5',
        currency: 'USD'
      }
    });
  }
};

// Update store settings
const updateStoreSettings = async (req, res) => {
  try {
    const newSettings = {
      store: req.body
    };

    await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
    res.json(newSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

module.exports = {
  getStoreSettings,
  updateStoreSettings
};
