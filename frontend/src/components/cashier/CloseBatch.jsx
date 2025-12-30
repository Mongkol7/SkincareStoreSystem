import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader } from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CloseBatch = () => {
  const navigate = useNavigate();
  const [closingCash, setClosingCash] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock batch data
  const batchData = {
    batch_code: 'BTH-20231228-001',
    opening_date: new Date().toISOString(),
    shift_type: 'Morning',
    opening_cash: 500.00,
    total_sales: 2450.50,
    cash_sales: 1850.30,
    card_sales: 600.20,
    transaction_count: 15,
  };

  const expectedCash = batchData.opening_cash + batchData.cash_sales;
  const actualCash = parseFloat(closingCash) || 0;
  const difference = actualCash - expectedCash;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // await batchService.closeBatch({ closing_cash: closingCash, remarks });

      setTimeout(() => {
        setLoading(false);
        navigate('/cashier/dashboard');
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Error closing batch:', error);
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
            <div className="flex justify-between p-4 bg-white/5 rounded-xl">
              <span className="text-sm text-white/80">Card Sales:</span>
              <span className="text-sm font-semibold text-primary-400">
                ${batchData.card_sales.toFixed(2)}
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
              {loading ? 'Closing Batch...' : 'Close Batch'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CloseBatch;
