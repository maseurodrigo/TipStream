import * as XLSX from 'xlsx-js-style';
import { Bet } from './types';

export const exportBetsToExcel = (bets: Bet[]) => {
  if (bets.length === 0) {
    alert('No bets to export!');
    return;
  }

  // Prepare data for Excel with better structure
  const excelData = bets.flatMap((bet) => {
    if (bet.type === 'single') {
      return [{
        'Type': 'Single',
        'Time': bet.timestamp,
        'Teams': bet.teams,
        'Tip': bet.tip,
        'Odds': parseFloat(bet.odds) || bet.odds,
        'Balance': parseFloat(bet.balance) || bet.balance,
        'Balance Type': bet.balanceType === 'units' ? 'Units' : 'Money',
        'Betting Site': bet.site.toUpperCase(),
        'Status': bet.status.toUpperCase(),
        'Total Odds': parseFloat(bet.odds) || bet.odds,
      }];
    } else {
      // For multiple bets, create a row for each tip with proper grouping
      return bet.tips.map((tip, index) => ({
        'Type': index === 0 ? 'Multiple' : '',
        'Time': index === 0 ? bet.timestamp : '',
        'Teams': tip.teams,
        'Tip': tip.tip,
        'Odds': parseFloat(tip.odds) || tip.odds,
        'Balance': index === 0 ? (parseFloat(bet.balance) || bet.balance) : '',
        'Balance Type': index === 0 ? (bet.balanceType === 'units' ? 'Units' : 'Money') : '',
        'Betting Site': index === 0 ? bet.site.toUpperCase() : '',
        'Status': index === 0 ? bet.status.toUpperCase() : '',
        'Total Odds': index === 0 ? (parseFloat(bet.totalOdds) || bet.totalOdds) : '',
      }));
    }
  });

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 10 },  // Type
    { wch: 10 },  // Time
    { wch: 35 },  // Teams
    { wch: 35 },  // Tip
    { wch: 8 },   // Odds
    { wch: 10 },  // Balance
    { wch: 13 },  // Balance Type
    { wch: 15 },  // Betting Site
    { wch: 10 },  // Status
    { wch: 12 },  // Total Odds
  ];

  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // Define styles
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
    fill: { fgColor: { rgb: "2D3748" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  const borderStyle = {
    top: { style: "thin", color: { rgb: "E2E8F0" } },
    bottom: { style: "thin", color: { rgb: "E2E8F0" } },
    left: { style: "thin", color: { rgb: "E2E8F0" } },
    right: { style: "thin", color: { rgb: "E2E8F0" } }
  };

  // Apply styling to header row (row 0)
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = headerStyle;
  }

  // Apply styling to data rows
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    // Get status from Status column (column H, index 8)
    const statusCellAddress = XLSX.utils.encode_cell({ r: row, c: 8 });
    const status = worksheet[statusCellAddress]?.v?.toString().toLowerCase();

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!worksheet[cellAddress]) continue;

      // Alternate row colors for better readability
      const bgColor = row % 2 === 0 ? "F7FAFC" : "FFFFFF";

      // Apply status-based colors
      let fillColor = bgColor;
      if (col === 8) { // Status column
        if (status === 'green') {
          fillColor = "C6F6D5"; // Light green
        } else if (status === 'red') {
          fillColor = "FED7D7"; // Light red
        } else if (status === 'pending') {
          fillColor = "FEF3C7"; // Light yellow
        }
      }

      // Base style for all data cells
      const cellStyle: any = {
        font: { sz: 11 },
        fill: { fgColor: { rgb: fillColor } },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true
        },
        border: borderStyle
      };

      // Bold font for Type, Status, and Total Odds columns
      if (col === 0 || col === 8 || col === 9) {
        cellStyle.font.bold = true;
      }

      worksheet[cellAddress].s = cellStyle;
    }
  }

  // Set row heights
  worksheet['!rows'] = Array(range.e.r + 1).fill({ hpt: 25 });
  worksheet['!rows'][0] = { hpt: 30 }; // Header row slightly taller

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Betting Tips');

  // Add workbook properties
  workbook.Props = {
    Title: "TipStream Betting Tips Export",
    Subject: "Betting Tips",
    Author: "TipStream",
    CreatedDate: new Date()
  };

  // Generate filename with timestamp
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 10);
  const filename = `TipStream_Export_${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);
};
