import React from 'react';

const PremiumLoader = ({ size = 'md', message, variant = 'default' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce-subtle"
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        {message && (
          <p className="text-sm font-light text-white/60 animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`${sizes[size]} relative`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 animate-pulse-slow" />
          <div className="absolute inset-2 rounded-full bg-dark-950" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-300 animate-pulse" />
        </div>
        {message && (
          <p className="text-sm font-light text-white/60">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`${sizes[size]} relative`}>
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-primary-400 border-b-transparent animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        </div>
        {message && (
          <p className="text-sm font-light text-white/60 animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default: premium spinner
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} spinner`} />
      {message && (
        <p className="text-sm font-light text-white/60">{message}</p>
      )}
    </div>
  );
};

export const PremiumLoadingOverlay = ({ message = 'Loading...', variant = 'ring' }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in">
      <PremiumLoader size="lg" message={message} variant={variant} />
    </div>
  );
};

export const PremiumPageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 animate-float shadow-glow" />
          <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-300 animate-pulse opacity-50" />
        </div>

        {/* Loading Bar */}
        <div className="w-64">
          <div className="progress-bar">
            <div className="progress-fill w-2/3 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-light text-white/60">Loading</p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-white/40 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-4 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-4/6" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 glass-card">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/2" />
          </div>
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default PremiumLoader;
