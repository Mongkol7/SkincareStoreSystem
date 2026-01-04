const FileStorage = require('../utils/fileStorage');
const path = require('path');

const BATCHES_FILE = path.join(__dirname, '../data/batches.json');
const batchStorage = new FileStorage(BATCHES_FILE);

// Get all batches
const getBatches = async (req, res) => {
  try {
    const batches = await batchStorage.read();
    res.json(batches);
  } catch (error) {
    console.error('Error getting batches:', error);
    res.status(500).json({ message: 'Failed to get batches', error: error.message });
  }
};

// Get batch by ID
const getBatchById = async (req, res) => {
  try {
    const batches = await batchStorage.read();
    const batch = batches.find(b => b.id === parseInt(req.params.id));

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(batch);
  } catch (error) {
    console.error('Error getting batch:', error);
    res.status(500).json({ message: 'Failed to get batch', error: error.message });
  }
};

// Open new batch
const openBatch = async (req, res) => {
  try {
    const batches = await batchStorage.read();
    const { openingCash, cashier } = req.body;

    // Generate batch number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const batchCount = batches.filter(b =>
      b.date?.startsWith(new Date().toISOString().split('T')[0])
    ).length + 1;
    const batchNumber = `BATCH-${today}-${String(batchCount).padStart(3, '0')}`;

    const newBatch = {
      id: batches.length > 0 ? Math.max(...batches.map(b => b.id)) + 1 : 1,
      batchNumber,
      date: new Date().toISOString(),
      openTime: new Date().toISOString(),
      closeTime: null,
      openingCash: parseFloat(openingCash) || 0,
      closingCash: null,
      totalSales: 0,
      cashSales: 0,
      cardSales: 0,
      transactions: 0,
      status: 'Open',
      cashier: cashier || 'Unknown',
      remarks: '',
      createdAt: new Date().toISOString()
    };

    batches.push(newBatch);
    await batchStorage.write(batches);

    res.status(201).json(newBatch);
  } catch (error) {
    console.error('Error opening batch:', error);
    res.status(500).json({ message: 'Failed to open batch', error: error.message });
  }
};

// Close batch
const closeBatch = async (req, res) => {
  try {
    const batches = await batchStorage.read();
    const { id } = req.params;
    const { closingCash, remarks, totalSales, cashSales, cardSales, transactions } = req.body;

    const batchIndex = batches.findIndex(b => b.id === parseInt(id));

    if (batchIndex === -1) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batches[batchIndex] = {
      ...batches[batchIndex],
      closeTime: new Date().toISOString(),
      closingCash: parseFloat(closingCash) || 0,
      totalSales: parseFloat(totalSales) || 0,
      cashSales: parseFloat(cashSales) || 0,
      cardSales: parseFloat(cardSales) || 0,
      transactions: parseInt(transactions) || 0,
      status: 'Closed',
      remarks: remarks || '',
      updatedAt: new Date().toISOString()
    };

    await batchStorage.write(batches);

    res.json(batches[batchIndex]);
  } catch (error) {
    console.error('Error closing batch:', error);
    res.status(500).json({ message: 'Failed to close batch', error: error.message });
  }
};

module.exports = {
  getBatches,
  getBatchById,
  openBatch,
  closeBatch
};
