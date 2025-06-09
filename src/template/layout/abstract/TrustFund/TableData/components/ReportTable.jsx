import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import ExcelJS from 'exceljs';

  const months = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];
  
  const years = Array.from({ length: 100 }, (_, i) => ({
    label: String(2050 - i),
    value: 2050 - i,
}));

// Helper function to format currency
const formatCurrency = (value) => {
  return value > 0
    ? `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : '₱0.00'; // Changed to display '₱0.00' instead of empty string
};

const BASE_URL = "http://192.168.101.108:3001"; // Define base URL

function ReportTable({ onBack }) {
    const [month, setMonth] = useState({ label: 'January', value: '1' });
      const [year, setYear] = useState({ label: '2025', value: '2025' });

      const [data, setData] = useState({
        building_local_80: 0,
        building_trust_15: 0,
        building_national_5: 0,
        electricalfee: 0,
        zoningfee: 0,
        livestock_local_80: 0,
        livestock_national_20: 0,
        diving_local_40: 0,
        diving_brgy_30: 0,
        diving_fishers_30: 0,
      });

      useEffect(() => {
        const fetchData = async () => {
          try {
            console.log("Fetching data for month:", month.value, "and year:", year.value);
      
            const response = await axios.get(
              `${BASE_URL}/api/trustFundDataReport`,
              {
                params: { month: month.value, year: year.value },
              }
            );
      
            if (response.data.length > 0) {
              const filteredData = response.data.reduce((acc, row) => ({
                building_local_80: acc.building_local_80 + (row.LOCAL_80_PERCENT || 0),
                building_trust_15: acc.building_trust_15 + (row.TRUST_FUND_15_PERCENT || 0),
                building_national_5: acc.building_national_5 + (row.NATIONAL_5_PERCENT || 0),
                electricalfee: acc.electricalfee + (row.ELECTRICAL_FEE || 0),
                zoningfee: acc.zoningfee + (row.ZONING_FEE || 0),
                livestock_local_80: acc.livestock_local_80 + (row.LOCAL_80_PERCENT_LIVESTOCK || 0),
                livestock_national_20: acc.livestock_national_20 + (row.NATIONAL_20_PERCENT || 0),
                diving_local_40: acc.diving_local_40 + (row.LOCAL_40_PERCENT_DIVE_FEE || 0),
                diving_brgy_30: acc.diving_brgy_30 + (row.BRGY_30_PERCENT || 0),
                diving_fishers_30: acc.diving_fishers_30 + (row.FISHERS_30_PERCENT || 0),
              }), {
                building_local_80: 0,
                building_trust_15: 0,
                building_national_5: 0,
                electricalfee: 0,
                zoningfee: 0,
                livestock_local_80: 0,
                livestock_national_20: 0,
                diving_local_40: 0,
                diving_brgy_30: 0,
                diving_fishers_30: 0,
              });
      
              console.log('Filtered Data:', filteredData);
              setData(filteredData);
            } else {
              console.warn('No data available for selected month and year');
              setData({
                building_local_80: 0,
                building_trust_15: 0,
                building_national_5: 0,
                electricalfee: 0,
                zoningfee: 0,
                livestock_local_80: 0,
                livestock_national_20: 0,
                diving_local_40: 0,
                diving_brgy_30: 0,
                diving_fishers_30: 0,
              });
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, [month, year]);

     const handleMonthChange = (event, value) => {
  setMonth(value || { label: 'January', value: '1' });
};

const handleYearChange = (event, value) => {
  setYear(value || { label: '2024', value: '2025' });
};


// Inject print-specific styles
React.useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      @page {
        size: 8.5in 13in portrait; /* Legal size, adjust to '8.5in 11in' for letter */
        margin: 10mm; /* Increased margin for better readability */
      }
      body * {
        visibility: hidden; /* Hide everything except the printable area */
      }
      #printableArea, #printableArea * {
        visibility: visible;
      }
      #printableArea {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%; /* Use full width of the page */
      }
      table {
        width: 100%; /* Ensure table spans the full width */
        border-collapse: collapse;
        font-family: Arial, sans-serif; /* Use a standard font */
        font-size: 10px; /* Adjust font size for readability */
      }
      th, td {
        border: 1px solid black;
        padding: 6px; /* Slightly increase padding for better spacing */
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
        font-size: 11px; /* Slightly larger for headers */
      }
      h6, .subtitle {
        font-size: 12px;
        text-align: center;
        font-weight: bold;
        margin: 6px 0;
        font-family: Arial, sans-serif;
      }
      tr {
        page-break-inside: avoid; /* Prevent rows from splitting across pages */
      }
      /* Adjust column widths */
      th:nth-child(1), td:nth-child(1) { width: 18%; }
      th:nth-child(2), td:nth-child(2) { width: 14%; }
      th:nth-child(3), td:nth-child(3) { width: 10%; }
      th:nth-child(4), td:nth-child(4) { width: 9%; }
      th:nth-child(5), td:nth-child(5) { width: 9%; }
      th:nth-child(6), td:nth-child(6) { width: 9%; }
      th:nth-child(7), td:nth-child(7) { width: 9%; }
      th:nth-child(8), td:nth-child(8) { width: 9%; }
      th:nth-child(9), td:nth-child(9) { width: 9%; }
      th:nth-child(10), td:nth-child(10) { width: 9%; }
      th:nth-child(11), td:nth-child(11) { width: 6%; }
      th:nth-child(12), td:nth-child(12) { width: 6%; }
    }
  `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}, []);

const handlePrint = () => {
  const originalTitle = document.title;
  document.title = `SOC_TrustFundReport_${month.label}_${year.label}`;
  window.print();
  document.title = originalTitle; // Restore original title
};


const handleDownloadExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Summary of Collection Trust Fund');

  // HEADER
  worksheet.addRow(['SUMMARY OF COLLECTIONS']);
  worksheet.addRow(['ZAMBOANGUITA, NEGROS ORIENTAL']);
  worksheet.addRow(['LGU']);
  worksheet.addRow(['Month of January 2025']);
  worksheet.addRow([]);

  // COLUMN HEADERS
  worksheet.addRow([
    'SOURCES OF COLLECTIONS', 'TOTAL COLLECTIONS', 'NATIONAL',
    'PROVINCIAL', '', '',
    'MUNICIPAL', '', '', '',
    'BARANGAY SHARE', 'FISHERIES'
  ]);

  worksheet.addRow([
    '', '', '',
    'GENERAL FUND', 'SPECIAL EDUC. FUND', 'TOTAL',
    'GENERAL FUND', 'SPECIAL EDUC. FUND', 'TRUST FUND', 'TOTAL',
    '', ''
  ]);

  // CURRENCY FORMATTER
  const formatCurrency = val => `₱${Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  // DATA ROWS FROM DATABASE STATE
  const rows = [
    [
      'Building Permit Fee',
      formatCurrency(data.building_local_80 + data.building_trust_15 + data.building_national_5),
      formatCurrency(data.building_national_5),
      '', '', '',
      formatCurrency(data.building_local_80),
      '', formatCurrency(data.building_trust_15),
      formatCurrency(data.building_local_80 + data.building_trust_15),
      '', ''
    ],
    [
      'Electrical Permit Fee',
      formatCurrency(data.electricalfee),
      '', '', '', '',
      formatCurrency(data.electricalfee),
      '', '', formatCurrency(data.electricalfee),
      '', ''
    ],
    [
      'Zoning Fee',
      formatCurrency(data.zoningfee),
      '', '', '', '',
      formatCurrency(data.zoningfee),
      '', '', formatCurrency(data.zoningfee),
      '', ''
    ],
    [
      'Livestock',
      formatCurrency(data.livestock_local_80 + data.livestock_national_20),
      formatCurrency(data.livestock_national_20),
      '', '', '',
      formatCurrency(data.livestock_local_80),
      '', '', formatCurrency(data.livestock_local_80),
      '', ''
    ],
    [
      'Diving Fee',
      formatCurrency(data.diving_local_40 + data.diving_brgy_30 + data.diving_fishers_30),
      '', '', '', '',
      formatCurrency(data.diving_local_40),
      '', '', formatCurrency(data.diving_local_40),
      formatCurrency(data.diving_brgy_30),
      formatCurrency(data.diving_fishers_30)
    ]
  ];

  rows.forEach(row => worksheet.addRow(row));

  // TOTALS
  const totalCollection = Object.values(data).reduce((sum, val) => sum + (val || 0), 0);
  worksheet.addRow([
    'TOTAL',
    formatCurrency(totalCollection),
    formatCurrency(data.building_national_5 + data.livestock_national_20),
    '', '', '',
    formatCurrency(data.building_local_80 + data.electricalfee + data.zoningfee + data.livestock_local_80 + data.diving_local_40),
    '', formatCurrency(data.building_trust_15),
    formatCurrency(data.building_local_80 + data.electricalfee + data.zoningfee + data.livestock_local_80 + data.diving_local_40 + data.building_trust_15),
    formatCurrency(data.diving_brgy_30),
    formatCurrency(data.diving_fishers_30)
  ]);

  // MERGE HEADER CELLS
  worksheet.mergeCells('A1:L1');
  worksheet.mergeCells('A2:L2');
  worksheet.mergeCells('A3:L3');
  worksheet.mergeCells('A4:L4');
  worksheet.mergeCells('D6:F6');
  worksheet.mergeCells('G6:J6');

  // STYLING
  for (let i = 1; i <= 4; i++) {
    worksheet.getRow(i).font = { bold: true };
    worksheet.getRow(i).alignment = { horizontal: 'center' };
  }

  worksheet.getRow(6).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  });

  worksheet.getRow(7).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  });

  // COLUMN WIDTHS
  worksheet.columns = Array(12).fill({ width: 18 });

  // EXPORT FILE
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Summary_of_Collections_TrustFund_${month.label}_${year.label}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};



  return (
    <Box sx={{ p: 2, backgroundColor: '#f8f9fa'}}>
      {/* Header Section */}
   <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
    <Button 
      variant="contained" 
      startIcon={<ArrowBackIcon />}
      onClick={onBack}
      sx={{ 
        borderRadius: '8px',
        textTransform: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
      }}
    >
      Back
    </Button>
    
    <Box display="flex" gap={2}>
      <Autocomplete
        disablePortal
        id="month-selector"
        options={months}
        sx={{ 
          width: 180,
          '& .MuiInputBase-root': { borderRadius: '8px' }
        }}
        onChange={handleMonthChange}
        value={month}
        renderInput={(params) => 
          <TextField {...params} label="Select Month" variant="outlined" />
        }
      />
      <Autocomplete
        disablePortal
        id="year-selector"
        options={years}
        sx={{ 
          width: 180,
          '& .MuiInputBase-root': { borderRadius: '8px' }
        }}
        onChange={handleYearChange}
        value={year}
        renderInput={(params) => 
          <TextField {...params} label="Select Year" variant="outlined" />
        }
      />
    </Box>
  </Box>
     

<div id="printableArea">
  <Box>

 
           <Box>
              {/* Title Section */}
  <Box textAlign="center" mb={4}>
  <Grid container justifyContent="center" alignItems="center" spacing={0} direction="column" mb={2}>
          <Grid item>
            <Typography variant="h6" fontWeight="bold" align="center">
              SUMMARY OF COLLECTIONS
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" fontWeight="bold" align="center">
              ZAMBOANGUITA, NEGROS ORIENTAL
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" fontStyle="bold" align="center">
              LGU
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" fontStyle="bold" align="center">
              Month of {month.label} {year.label}
            </Typography>
          </Grid>
        </Grid>
  </Box>

              <TableContainer component={Paper}>
              <Table sx={{ border: '1px solid black' }}>
              <TableHead>
                    {/* First Row */}
                    <TableRow>
                      <TableCell
                        rowSpan={2}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        SOURCES OF COLLECTIONS
                      </TableCell>
                      <TableCell
                        rowSpan={2}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        TOTAL COLLECTIONS
                      </TableCell>
                      <TableCell
                        rowSpan={2}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        NATIONAL
                      </TableCell>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        PROVINCIAL
                      </TableCell>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        MUNICIPAL
                      </TableCell>
                      <TableCell
                        rowSpan={2}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        BARANGAY SHARE
                      </TableCell>
                      <TableCell
                        rowSpan={2}
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        FISHERIES
                      </TableCell>
                    </TableRow>
                    {/* Second Row */}
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        GENERAL FUND
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        SPECIAL EDUC. FUND
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        TOTAL
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        GENERAL FUND
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        SPECIAL EDUC. FUND
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        TRUST FUND
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ border: '1px solid black', fontWeight: 'bold' }}
                      >
                        TOTAL
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {/* Building Permit Fee */}
                  <TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Building Permit Fee</TableCell>

  {/* TOTAL COLLECTIONS */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency((data.building_national_5 || 0) + (data.building_local_80 || 0) + (data.building_trust_15 || 0))}
  </TableCell>

  {/* NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency(data.building_national_5 || 0)}
  </TableCell>

  {/* PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency(data.building_local_80 || 0)}
  </TableCell>

  {/* MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency(data.building_trust_15 || 0)}
  </TableCell>

  {/* MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency((data.building_local_80 || 0) + (data.building_trust_15 || 0))}
  </TableCell>

  {/* BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* FISHERIES */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
</TableRow>
                    {/* Electrical Permit Fee */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Electrical Permit Fee</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.electricalfee || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.electricalfee || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.electricalfee || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
</TableRow>

{/* Zoning Fee */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Zoning Fee</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.zoningfee || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.zoningfee || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.zoningfee || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
</TableRow>

{/* Livestock */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Livestock</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency((data.livestock_national_20 || 0) + (data.livestock_local_80 || 0))}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.livestock_national_20 || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.livestock_local_80 || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.livestock_local_80 || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
</TableRow>

{/* Diving Fee */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Diving Fee</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency((data.diving_local_40 || 0) + (data.diving_brgy_30 || 0) + (data.diving_fishers_30 || 0))}
  </TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.diving_local_40 || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.diving_local_40 || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.diving_brgy_30 || 0)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.diving_fishers_30 || 0)}</TableCell>
</TableRow>

{/* OVERALL TOTAL */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>TOTAL</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency((data.building_local_80 || 0) +
    (data.building_trust_15 || 0) +
    (data.building_national_5 || 0) +
    (data.electricalfee || 0) +
    (data.zoningfee || 0) +
    (data.livestock_local_80 || 0) +
    (data.livestock_national_20 || 0) +
    (data.diving_local_40 || 0) +
    (data.diving_brgy_30 || 0) +
    (data.diving_fishers_30 || 0))}
    </TableCell> {/* TOTAL COLLECTIONS */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency((data.building_national_5|| 0)+(data.livestock_national_20|| 0))}</TableCell> {/* TOTAL NATIONAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL GENERAL FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL SPECIAL EDUC. FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL TOTAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency((data.building_local_80|| 0)+(data.electricalfee|| 0)+
                        (data.zoningfee|| 0)+(data.livestock_local_80|| 0)+(data.diving_local_40|| 0))}</TableCell> {/* TOTAL MUNICIPAL GENERAL FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL SPECIAL EDUC. FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.building_trust_15 || 0)}</TableCell> {/* TOTAL MUNICIPAL TRUST FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency((data.building_local_80 || 0) +(data.building_trust_15 || 0) +(data.electricalfee || 0) +(data.zoningfee || 0) +(data.livestock_local_80 || 0) +(data.diving_local_40 || 0))}
                        </TableCell> {/* TOTAL MUNICIPAL TOTAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.diving_brgy_30 || 0)}</TableCell> {/* TOTAL BARANGAY SHARE */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.diving_fishers_30)}</TableCell> {/* TOTAL FISHERIES */}
                      </TableRow>


                      </TableBody>
              </Table>
              </TableContainer>
     </Box>
      </Box>
</div>

     <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 2,
    mb: 4,
    p: 3,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 1,
  }}
>
  {/* Print PDF Button */}
  <Button
    variant="contained"
    color="primary"
    onClick={handlePrint}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      textTransform: "none",
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: 600,
      "&:hover": { backgroundColor: "secondary.main" },
    }}
    startIcon={<PrintIcon />}
  >
    Print PDF
  </Button>

  {/* Download Excel Button */}
  <Button
    variant="outlined"
    color="success"
    onClick={handleDownloadExcel}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      textTransform: "none",
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: 600,
      "&:hover": { backgroundColor: "success.light" },
    }}
    startIcon={<FileDownloadIcon />}
  >
    Download Excel
  </Button>
</Box>
      
    </Box>
  )
}

ReportTable.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ReportTable
