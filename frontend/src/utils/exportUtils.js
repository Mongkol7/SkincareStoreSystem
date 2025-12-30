// Utility functions for exporting data

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

/**
 * Export data to Excel format (using HTML table method)
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);

  // Create HTML table
  let tableHTML = '<table><thead><tr>';
  headers.forEach(header => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += '</tr></thead><tbody>';

  data.forEach(row => {
    tableHTML += '<tr>';
    headers.forEach(header => {
      tableHTML += `<td>${row[header] || ''}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody></table>';

  // Create blob with Excel MIME type
  const blob = new Blob([tableHTML], {
    type: 'application/vnd.ms-excel'
  });

  downloadFile(blob, filename);
};

/**
 * Export data to PDF format (using jsPDF)
 */
export const exportToPDF = (data, filename = 'export.pdf', title = 'Export Report') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Simple PDF generation using browser print
  const printWindow = window.open('', '_blank');

  // Get headers
  const headers = Object.keys(data[0]);

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        h1 {
          text-align: center;
          color: #000;
          margin-bottom: 20px;
        }
        .meta {
          text-align: right;
          margin-bottom: 20px;
          color: #666;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          font-size: 11px;
        }
        th {
          background-color: #000;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 10px;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">
        Generated on: ${new Date().toLocaleString()}<br>
        Total Records: ${data.length}
      </div>
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        This is an automatically generated report.
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Trigger print dialog after content loads
  printWindow.onload = function() {
    printWindow.focus();
    printWindow.print();
    // Close window after printing or canceling
    setTimeout(() => {
      printWindow.close();
    }, 100);
  };
};

/**
 * Helper function to download a blob as a file
 */
const downloadFile = (blob, filename) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
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
