import React from 'react';

const StatsCard = ({ icon, label, value, trend, trendValue, className = '' }) => {
  return (
    <div className={`stats-card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="stats-label">{label}</p>
          <p className="stats-value">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs ${trend === 'up' ? 'text-success-400' : 'text-danger-400'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-white/50">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-white/10 rounded-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
