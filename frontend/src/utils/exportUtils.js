// Utility functions for exporting data
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create worksheet from data
  const ws = XLSX.utils.json_to_sheet(data);

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Generate CSV and trigger download
  XLSX.writeFile(wb, filename.endsWith('.csv') ? filename : `${filename}.csv`, { bookType: 'csv' });
};

/**
 * Export data to Excel format
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create worksheet from data
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-size columns
  const cols = [];
  const keys = Object.keys(data[0]);
  keys.forEach((key) => {
    const maxLength = Math.max(
      key.toString().length,
      ...data.map(row => {
        const value = row[key];
        return value ? value.toString().length : 0;
      })
    );
    cols.push({ wch: Math.min(maxLength + 2, 50) });
  });
  ws['!cols'] = cols;

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
};

/**
 * Export data to PDF format (using jsPDF and autotable)
 */
export const exportToPDF = (data, filename = 'export.pdf', title = 'Export Report') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create new PDF document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(title, 14, 20);

  // Add metadata
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Total Records: ${data.length}`, 14, 34);

  doc.setTextColor(0);

  // Get headers and prepare table data
  const headers = Object.keys(data[0]);
  const tableData = data.map(row => headers.map(header => {
    const value = row[header];
    return value !== null && value !== undefined ? value.toString() : '';
  }));

  // Add table
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Save the PDF
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};

/**
 * Format transaction data for export
 */
export const formatTransactionsForExport = (transactions) => {
  return transactions.map(t => ({
    'Invoice #': t.invoice,
    'Date': t.date,
    'Time': t.time,
    'Cashier': t.cashier,
    'Customer': t.customer,
    'Items': t.items,
    'Subtotal': `$${t.subtotal.toFixed(2)}`,
    'Tax': `$${t.tax.toFixed(2)}`,
    'Discount': `$${t.discount.toFixed(2)}`,
    'Total': `$${t.total.toFixed(2)}`,
    'Payment Method': t.payment,
    'Status': t.status,
    'Notes': t.notes || 'N/A'
  }));
};

/**
 * Format sales report data for export
 */
export const formatSalesReportForExport = (salesData) => {
  return salesData.map(s => ({
    'Period': s.period,
    'Total Sales': `$${s.sales.toLocaleString()}`,
    'Transactions': s.transactions,
    'Average Sale': `$${s.avgSale.toFixed(2)}`,
    'Growth': s.growth
  }));
};

/**
 * Format product performance data for export
 */
export const formatProductPerformanceForExport = (productData) => {
  return productData.map(p => ({
    'Product': p.product,
    'Units Sold': p.sold,
    'Revenue': `$${p.revenue.toLocaleString()}`,
    'Profit': `$${p.profit.toLocaleString()}`,
    'Margin': p.margin
  }));
};

/**
 * Format daily sales data for export
 */
export const formatDailySalesForExport = (dailyData) => {
  return dailyData.map(d => ({
    'Day': d.day,
    'Sales': `$${d.sales.toLocaleString()}`,
    'Transactions': d.transactions
  }));
};

/**
 * Format monthly sales data for export
 */
export const formatMonthlySalesForExport = (monthlyData) => {
  return monthlyData.map(m => ({
    'Month': m.month,
    'Actual Sales': `$${m.sales.toLocaleString()}`,
    'Target': `$${m.target.toLocaleString()}`,
    'Difference': `$${(m.sales - m.target).toLocaleString()}`,
    'Achievement': `${((m.sales / m.target) * 100).toFixed(1)}%`
  }));
};

/**
 * Format category data for export
 */
export const formatCategoryDataForExport = (categoryData) => {
  return categoryData.map(c => ({
    'Category': c.category,
    'Sales': `$${c.sales.toLocaleString()}`,
    'Percentage': `${c.percentage}%`
  }));
};
