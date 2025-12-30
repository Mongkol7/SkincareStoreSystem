import React from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';

const StoreNameDisplay = () => {
  const { storeSettings } = useStoreSettings();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <div className="font-bold mb-1">Debug: Store Name</div>
      <div>Current: {storeSettings.name}</div>
      <div className="text-white/50 mt-2">
        localStorage: {localStorage.getItem('storeSettings') ?
          JSON.parse(localStorage.getItem('storeSettings')).name :
          'Not set'}
      </div>
    </div>
  );
};

export default StoreNameDisplay;
