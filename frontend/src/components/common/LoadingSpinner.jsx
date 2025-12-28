import React from 'react';
import PremiumLoader, { PremiumLoadingOverlay, PremiumPageLoader, SkeletonCard, SkeletonTable } from './PremiumLoader';

const LoadingSpinner = ({ size = 'md', className = '', variant = 'default' }) => {
  return <PremiumLoader size={size} variant={variant} />;
};

export const LoadingOverlay = ({ message = 'Loading...', variant = 'ring' }) => {
  return <PremiumLoadingOverlay message={message} variant={variant} />;
};

export { PremiumLoader, PremiumPageLoader, SkeletonCard, SkeletonTable };

export default LoadingSpinner;
