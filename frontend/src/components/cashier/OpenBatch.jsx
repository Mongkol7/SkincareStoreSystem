import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader } from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { CurrencyDollarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const OpenBatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    opening_cash: '',
    shift_type: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shiftOptions = [
    { value: 'Morning', label: 'Morning (6:00 AM - 2:00 PM)' },
    { value: 'Afternoon', label: 'Afternoon (2:00 PM - 10:00 PM)' },
    { value: 'Night', label: 'Night (10:00 PM - 6:00 AM)' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.opening_cash || parseFloat(formData.opening_cash) <= 0) {
      newErrors.opening_cash = 'Opening cash must be greater than 0';
    }
    if (!formData.shift_type) {
      newErrors.shift_type = 'Please select a shift type';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Create new batch via API
      const response = await api.post('/batches', {
        openingCash: parseFloat(formData.opening_cash),
        cashier: user?.name || 'Unknown'
      });

      // Store batch ID in localStorage for later closing
      localStorage.setItem('currentBatchId', response.data.id);

      alert('✓ Batch opened successfully!');
      navigate('/cashier/dashboard');
    } catch (error) {
      setLoading(false);
      console.error('Error opening batch:', error);
      alert('Failed to open batch. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/cashier/dashboard')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Open New Batch</h2>
          <p className="text-white/60 text-sm">Start your shift and begin processing sales</p>
        </div>
      </div>

      <Card>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 p-4 bg-primary-500/20 border border-primary-500/30 rounded-xl">
            <p className="text-sm text-white/80">
              Opening a new batch will start your shift and allow you to process sales transactions.
              Please count your opening cash carefully.
            </p>
          </div>

          <Select
            label="Shift Type"
            name="shift_type"
            value={formData.shift_type}
            onChange={handleChange}
            options={shiftOptions}
            required
            error={errors.shift_type}
          />

          <Input
            label="Opening Cash Amount"
            type="number"
            name="opening_cash"
            value={formData.opening_cash}
            onChange={handleChange}
            placeholder="0.00"
            required
            error={errors.opening_cash}
            step="0.01"
            min="0"
          />

          <div className="glass-card p-5 mb-6">
            <div className="flex items-center gap-4">
              <CurrencyDollarIcon className="w-10 h-10 text-success-400" />
              <div>
                <p className="text-xs text-white/60 mb-1">Opening Cash</p>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(formData.opening_cash || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

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
              variant="success"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Opening Batch...' : 'Open Batch'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OpenBatch;
