import { formatIndianCurrency } from "./csvExport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportData {
  date: string | Date;
  category?: string;
  subCategory?: string;
  merchant?: string;
  amount: number;
  description?: string;
  source?: string;
}

// Export to PDF
export const exportToPDF = (data: ExportData[], filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare table data
  const headers = Object.keys(data[0] || {}).map(key => 
    key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  );
  
  const rows = data.map(item => 
    Object.values(item).map(val => {
      if (typeof val === 'number') return formatIndianCurrency(val);
      if (val instanceof Date) return val.toLocaleDateString();
      return String(val);
    })
  );
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  // Calculate total if amount exists
  if (data.length > 0 && 'amount' in data[0]) {
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(12);
    doc.text(`Total: ${formatIndianCurrency(total)}`, 14, finalY + 10);
  }
  
  doc.save(filename);
};

// Export to DOCX (using HTML conversion approach)
export const exportToDOCX = (data: ExportData[], filename: string, title: string) => {
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          .total { margin-top: 20px; font-weight: bold; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
  `;
  
  // Add headers
  const headers = Object.keys(data[0] || {});
  headers.forEach(key => {
    const header = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Add rows
  data.forEach(item => {
    html += '<tr>';
    Object.values(item).forEach(val => {
      let displayVal = '';
      if (typeof val === 'number') displayVal = formatIndianCurrency(val);
      else if (val instanceof Date) displayVal = val.toLocaleDateString();
      else displayVal = String(val);
      html += `<td>${displayVal}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  
  // Add total if amount exists
  if (data.length > 0 && 'amount' in data[0]) {
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    html += `<p class="total">Total: ${formatIndianCurrency(total)}</p>`;
  }
  
  html += '</body></html>';
  
  // Create and download
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
