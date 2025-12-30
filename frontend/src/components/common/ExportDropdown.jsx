import React from 'react';
import Button from './Button';
import { DocumentArrowDownIcon, ChevronDownIcon, PrinterIcon } from '@heroicons/react/24/outline';

const ExportDropdown = ({
  isOpen,
  onToggle,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  buttonRef,
  menuRef,
  variant = 'primary',
  size = 'sm'
}) => {
  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        onClick={onToggle}
      >
        <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
        Export
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 glass-card p-2 z-50 animate-scale-in"
        >
          <button
            onClick={onExportCSV}
            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export as CSV
          </button>
          <button
            onClick={onExportExcel}
            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export as Excel
          </button>
          <button
            onClick={onExportPDF}
            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
