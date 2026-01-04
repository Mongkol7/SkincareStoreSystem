import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader } from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const CloseBatch = () => {
  const navigate = useNavigate();
  const [closingCash, setClosingCash] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Auto-detect shift based on current time
  const getShiftType = () => {
    const hour = new Date().getHours();
    return hour < 16 ? 'Morning' : 'Afternoon'; // Before 4 PM = Morning, After = Afternoon
  };

  // Load batch and transaction data
  useEffect(() => {
    const loadData = async () => {
      try {
        const batchId = localStorage.getItem('currentBatchId');

        if (!batchId) {
          alert('No active batch found. Please open a new batch first.');
          navigate('/cashier/open-batch');
          return;
        }

        // Load current batch and all transactions
        const [batchResponse, transactionsResponse] = await Promise.all([
          api.get(`/batches/${batchId}`),
          api.get('/transactions')
        ]);

        setCurrentBatch(batchResponse.data);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load batch data. Please try again.');
        navigate('/cashier/dashboard');
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Calculate sales from transactions that occurred during this batch
  const calculateBatchSales = () => {
    if (!currentBatch || !transactions.length) {
      return {
        totalSales: 0,
        cashSales: 0,
        cardSales: 0,
        transactionCount: 0
      };
    }

    const batchOpenTime = new Date(currentBatch.openTime);

    // Filter transactions that occurred after batch was opened and are completed
    const batchTransactions = transactions.filter(t => {
      const txnDate = new Date(t.date);
      return txnDate >= batchOpenTime && t.status === 'Completed';
    });

    const totalSales = batchTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const cashSales = batchTransactions
      .filter(t => t.paymentMethod === 'Cash')
      .reduce((sum, t) => sum + (t.total || 0), 0);
    const cardSales = batchTransactions
      .filter(t => t.paymentMethod === 'Card')
      .reduce((sum, t) => sum + (t.total || 0), 0);

    return {
      totalSales: Math.round(totalSales * 100) / 100,
      cashSales: Math.round(cashSales * 100) / 100,
      cardSales: Math.round(cardSales * 100) / 100,
      transactionCount: batchTransactions.length
    };
  };

  const salesData = calculateBatchSales();

  const batchData = currentBatch ? {
    batch_code: currentBatch.batchNumber,
    opening_date: currentBatch.openTime,
    shift_type: getShiftType(),
    opening_cash: currentBatch.openingCash || 0,
    total_sales: salesData.totalSales,
    cash_sales: salesData.cashSales,
    card_sales: salesData.cardSales,
    transaction_count: salesData.transactionCount,
  } : null;

  const expectedCash = batchData ? batchData.opening_cash + batchData.cash_sales : 0;
  const actualCash = parseFloat(closingCash) || 0;
  const difference = actualCash - expectedCash;
  const hasDifference = closingCash && Math.abs(difference) >= 0.01;

  if (dataLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-8 text-center">
            <div className="text-white/60">Loading batch data...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (!batchData) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-8 text-center">
            <div className="text-white/60">No active batch found.</div>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show warning if there's a cash difference and user hasn't confirmed
    if (hasDifference && !showWarning) {
      setShowWarning(true);
      return;
    }

    setLoading(true);

    try {
      // Get batch ID from localStorage
      const batchId = localStorage.getItem('currentBatchId');

      if (!batchId) {
        alert('No active batch found. Please open a new batch first.');
        navigate('/cashier/open-batch');
        return;
      }

      // Get receipts from Sales page (if any were saved in localStorage during this batch)
      const receiptsKey = `batch_${batchId}_receipts`;
      const savedReceipts = localStorage.getItem(receiptsKey);
      const receipts = savedReceipts ? JSON.parse(savedReceipts) : [];

      // Close batch via API
      await api.put(`/batches/${batchId}/close`, {
        closingCash: parseFloat(closingCash),
        remarks,
        totalSales: salesData.totalSales,
        cashSales: salesData.cashSales,
        cardSales: salesData.cardSales,
        transactions: salesData.transactionCount,
        receipts: receipts
      });

      // Clear the current batch ID and receipts
      localStorage.removeItem('currentBatchId');
      localStorage.removeItem(receiptsKey);

      alert('✓ Batch closed successfully!');
      navigate('/cashier/dashboard');
    } catch (error) {
      setLoading(false);
      console.error('Error closing batch:', error);
      alert('Failed to close batch. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/cashier/dashboard')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Close Batch</h2>
          <p className="text-white/60 text-sm">End your shift and reconcile cash drawer</p>
        </div>
      </div>

      <Card>

        <form onSubmit={handleSubmit}>
          {/* Batch Info */}
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {batchData.batch_code}
                </h3>
                <p className="text-xs text-white/60">
                  {new Date(batchData.opening_date).toLocaleString()}
                </p>
              </div>
              <Badge variant="warning">{batchData.shift_type}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/60 mb-1">Transactions</p>
                <p className="text-xl font-bold text-white">{batchData.transaction_count}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Total Sales</p>
                <p className="text-xl font-bold text-white">${batchData.total_sales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Cash Summary */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-sm text-white/80">Opening Cash:</span>
              <span className="text-sm font-semibold text-white">
                ${batchData.opening_cash.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-sm text-white/80">Cash Sales:</span>
              <span className="text-sm font-semibold text-success-400">
                +${batchData.cash_sales.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between p-4 bg-primary-500/20 border border-primary-500/30 rounded-xl">
              <span className="text-sm font-semibold text-white">Expected Cash:</span>
              <span className="text-lg font-bold text-white">
                ${expectedCash.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Closing Cash Input */}
          <Input
            label="Actual Cash in Drawer"
            type="number"
            name="closing_cash"
            value={closingCash}
            onChange={(e) => setClosingCash(e.target.value)}
            placeholder="0.00"
            required
            step="0.01"
            min="0"
          />

          {/* Difference Alert */}
          {closingCash && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                Math.abs(difference) < 0.01
                  ? 'bg-success-500/20 border border-success-500/30'
                  : 'bg-warning-500/20 border border-warning-500/30'
              }`}
            >
              {Math.abs(difference) < 0.01 ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 text-success-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">
                      Cash Matches!
                    </p>
                    <p className="text-xs text-white/80">
                      Your cash drawer balances perfectly.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="w-5 h-5 text-warning-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">
                      Cash Difference: ${Math.abs(difference).toFixed(2)}{' '}
                      {difference > 0 ? 'Over' : 'Short'}
                    </p>
                    <p className="text-xs text-white/80">
                      Please recount and explain the difference in remarks.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Remarks */}
          <div className="mb-6">
            <label className="input-label">Remarks (Optional)</label>
            <textarea
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes about this batch..."
              rows="3"
              className="textarea"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => navigate('/cashier/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              disabled={loading || !closingCash}
            >
              {loading ? 'Closing Batch...' : showWarning ? 'Confirm & Close Batch' : 'Close Batch'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-warning-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Cash Difference Detected</h3>
                <p className="text-sm text-white/80 mb-2">
                  There is a difference of <span className="font-bold text-warning-500">${Math.abs(difference).toFixed(2)}</span> ({difference > 0 ? 'Over' : 'Short'}) between expected and actual cash.
                </p>
                <p className="text-sm text-white/60">
                  Are you sure you want to close this batch with a cash discrepancy?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowWarning(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={handleSubmit}
              >
                Yes, Close Batch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloseBatch;
