const FileStorage = require('../utils/fileStorage');

const transactionsStorage = new FileStorage('transactions');

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionsStorage.findAll();
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionsStorage.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { user } = req;

    // Generate transaction number
    const allTransactions = await transactionsStorage.findAll();
    const nextTxnNum = allTransactions.length + 1;
    const transactionNumber = `TXN-2025-${String(nextTxnNum).padStart(3, '0')}`;

    const newTransaction = {
      ...req.body,
      transactionNumber,
      cashier: user.username || user.name,
      date: new Date().toISOString()
    };

    const createdTransaction = await transactionsStorage.create(newTransaction);
    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get transactions by date range
const getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await transactionsStorage.findAll();

    let filtered = transactions;
    if (startDate && endDate) {
      filtered = transactions.filter(t => {
        const txnDate = new Date(t.date);
        return txnDate >= new Date(startDate) && txnDate <= new Date(endDate);
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Get transactions by date range error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  getTransactionsByDateRange
};
