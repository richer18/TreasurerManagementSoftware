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
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import MDTypography from '../../../../../components/MDTypography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExcelJS from 'exceljs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

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

const years = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
];

const BASE_URL = "http://192.168.101.108:3001";

// Helper function to format currency
const formatCurrency = (value) => {
  return value > 0
    ? `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : '₱0.00'; // Changed to display '₱0.00' instead of empty string
};
function ReportTable({ onBack }) {
  const [month, setMonth] = useState({ label: 'January', value: '1' });
  const [year, setYear] = useState({ label: '2025', value: '2025' });

  const [data, setData] = useState({
    manufacturing: 0,
    distributor: 0,
    retailing: 0,
    financial: 0,
    otherBusinessTax: 0,
    sandGravel: 0,
    finesPenalties: 0,
    mayorsPermit: 0,
    weighsMeasure: 0,
    tricycleOperators: 0,
    occupationTax: 0,
    certOfOwnership: 0,
    certOfTransfer: 0,
    cockpitProvShare: 0,
    cockpitLocalShare: 0,
    dockingMooringFee: 0,
    sultadas: 0,
    miscellaneousFee: 0,
    regOfBirth: 0,
    marriageFees: 0,
    burialFees: 0,
    correctionOfEntry: 0,
    fishingPermitFee: 0,
    saleOfAgriProd: 0,
    saleOfAcctForm: 0,
    waterFees: 0,
    stallFees: 0,
    cashTickets: 0,
    slaughterHouseFee: 0,
    rentalOfEquipment: 0,
    docStamp: 0,
    policeReportClearance: 0,
    comTaxCert: 0,
    medDentLabFees: 0,
    garbageFees: 0,
    cuttingTree: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for month:", month.value, "and year:", year.value); // Debug log
  
        const response = await axios.get(`${BASE_URL}/api/generalFundDataReport`, {
          params: { month: month.value, year: year.value },
      });
  
        if (response.data.length > 0) {
          const filteredData = response.data.reduce(
            (acc, row) => ({
              manufacturing: acc.manufacturing + (row.Manufacturing || 0),
              distributor: acc.distributor + (row.Distributor || 0),
              retailing: acc.retailing + (row.Retailing || 0),
              financial: acc.financial + (row.Financial || 0),
              otherBusinessTax: acc.otherBusinessTax + (row.Other_Business_Tax || 0),
              sandGravel: acc.sandGravel + (row.Sand_Gravel || 0),
              finesPenalties: acc.finesPenalties + (row.Fines_Penalties || 0),
              mayorsPermit: acc.mayorsPermit + (row.Mayors_Permit || 0),
              weighsMeasure: acc.weighsMeasure + (row.Weighs_Measure || 0),
              tricycleOperators: acc.tricycleOperators + (row.Tricycle_Operators || 0),
              occupationTax: acc.occupationTax + (row.Occupation_Tax || 0),
              certOfOwnership: acc.certOfOwnership + (row.Cert_of_Ownership || 0),
              certOfTransfer: acc.certOfTransfer + (row.Cert_of_Transfer || 0),
              cockpitProvShare: acc.cockpitProvShare + (Number(row.Cockpit_Prov_Share) || 0),
              cockpitLocalShare: acc.cockpitLocalShare + (Number(row.Cockpit_Local_Share) || 0),
              dockingMooringFee: acc.dockingMooringFee + (row.Docking_Mooring_Fee || 0),
              sultadas: acc.sultadas + (row.Sultadas || 0),
              miscellaneousFee: acc.miscellaneousFee + (row.Miscellaneous_Fee || 0),
              regOfBirth: acc.regOfBirth + (row.Reg_of_Birth || 0),
              marriageFees: acc.marriageFees + (row.Marriage_Fees || 0),
              burialFees: acc.burialFees + (row.Burial_Fees || 0),
              correctionOfEntry: acc.correctionOfEntry + (row.Correction_of_Entry || 0),
              fishingPermitFee: acc.fishingPermitFee + (row.Fishing_Permit_Fee || 0),
              saleOfAgriProd: acc.saleOfAgriProd + (row.Sale_of_Agri_Prod || 0),
              saleOfAcctForm: acc.saleOfAcctForm + (row.Sale_of_Acct_Form || 0),
              waterFees: acc.waterFees + (row.Water_Fees || 0),
              stallFees: acc.stallFees + (row.Stall_Fees || 0),
              cashTickets: acc.cashTickets + (row.Cash_Tickets || 0),
              slaughterHouseFee: acc.slaughterHouseFee + (row.Slaughter_House_Fee || 0),
              rentalOfEquipment: acc.rentalOfEquipment + (row.Rental_of_Equipment || 0),
              docStamp: acc.docStamp + (row.Doc_Stamp || 0),
              policeReportClearance: acc.policeReportClearance + (row.Police_Report_Clearance || 0),
              secretaryfee: acc.secretaryfee + (row.Secretaries_Fee || 0),
              medDentLabFees: acc.medDentLabFees + (row.Med_Dent_Lab_Fees || 0),
              garbageFees: acc.garbageFees + (row.Garbage_Fees || 0),
              cuttingTree: acc.cuttingTree + (row.Cutting_Tree || 0),
            }),
            {
              manufacturing: 0,
              distributor: 0,
              retailing: 0,
              financial: 0,
              otherBusinessTax: 0,
              sandGravel: 0,
              finesPenalties: 0,
              mayorsPermit: 0,
              weighsMeasure: 0,
              tricycleOperators: 0,
              occupationTax: 0,
              certOfOwnership: 0,
              certOfTransfer: 0,
              cockpitProvShare: 0,
              cockpitLocalShare: 0,
              dockingMooringFee: 0,
              sultadas: 0,
              miscellaneousFee: 0,
              regOfBirth: 0,
              marriageFees: 0,
              burialFees: 0,
              correctionOfEntry: 0,
              fishingPermitFee: 0,
              saleOfAgriProd: 0,
              saleOfAcctForm: 0,
              waterFees: 0,
              stallFees: 0,
              cashTickets: 0,
              slaughterHouseFee: 0,
              rentalOfEquipment: 0,
              docStamp: 0,
              policeReportClearance: 0,
              secretaryfee: 0,
              medDentLabFees: 0,
              garbageFees: 0,
              cuttingTree: 0,
            }
            
          );
          console.log('API Response:', response.data);
          setData(filteredData);
        } else {
          console.error('No data available for selected month and year');
          setData({
            manufacturing: 0,
            distributor: 0,
            retailing: 0,
            financial: 0,
            otherBusinessTax: 0,
            sandGravel: 0,
            finesPenalties: 0,
            mayorsPermit: 0,
            weighsMeasure: 0,
            tricycleOperators: 0,
            occupationTax: 0,
            certOfOwnership: 0,
            certOfTransfer: 0,
            cockpitProvShare: 0,
            cockpitLocalShare: 0,
            dockingMooringFee: 0,
            sultadas: 0,
            miscellaneousFee: 0,
            regOfBirth: 0,
            marriageFees: 0,
            burialFees: 0,
            correctionOfEntry: 0,
            fishingPermitFee: 0,
            saleOfAgriProd: 0,
            saleOfAcctForm: 0,
            waterFees: 0,
            stallFees: 0,
            cashTickets: 0,
            slaughterHouseFee: 0,
            rentalOfEquipment: 0,
            docStamp: 0,
            policeReportClearance: 0,
            secretaryfee: 0,
            medDentLabFees: 0,
            garbageFees: 0,
            cuttingTree: 0,
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
    setYear(value || { label: '2024', value: '2024' });
  };

  const calculateTotal = (fields) => {
  return fields
    .map((value) => Number(value || 0)) // Ensure all values are numbers
    .reduce((sum, current) => sum + current, 0); // Sum up the values
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
  document.title = `SOC_GeneralFundReport_${month.label}_${year.label}`;
  window.print();
  document.title = originalTitle; // Restore original title
};

const handleDownloadExcel = () => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Collections Summary');

  // Add title and headers
  worksheet.addRow(['SUMMARY OF COLLECTIONS', '', '', '', '', '', '', '', '', '', '']);
  worksheet.addRow(['ZAMBOANGUITA, NEGROS ORIENTAL', '', '', '', '', '', '', '', '', '', '']);
  worksheet.addRow(['LGU', '', '', '', '', '', '', '', '', '', '']);
  worksheet.addRow(['Month of January 2025', '', '', '', '', '', '', '', '', '', '']);
  worksheet.addRow([]); // Empty row for spacing

  // Add column headers
  worksheet.addRow([
    'SOURCES OF COLLECTIONS',
    'TOTAL COLLECTIONS',
    'NATIONAL',
    'PROVINCIAL',
    '',
    '',
    'MUNICIPAL',
    '',
    '',
    '',
    'BARANGAY SHARE',
    'FISHERIES'
  ]);

  worksheet.addRow([
    '',
    '',
    '',
    'GENERAL FUND',
    'SPECIAL EDUC FUND',
    'TOTAL',
    'GENERAL FUND',
    'SPECIAL EDUC FUND',
    'TRUST FUND',
    'TOTAL',
    '',
    ''
  ]);

  // Format currency with P prefix and proper formatting
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'P0.00';
    if (typeof value === 'string' && value.includes('/')) return `P${value}`; // Handle values like "9.40/0.00"
    return `P${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  // Add data rows from your data object
  const addDataRow = (label, value, provincialValue = null) => {
    const municipalValue = provincialValue ? value - provincialValue : value;
    
    worksheet.addRow([
      label,
      formatCurrency(value),
      '', // National
      provincialValue !== null ? formatCurrency(provincialValue) : '', // Provincial General Fund
      '', // Provincial Special Educ Fund
      '', // Provincial Total
      provincialValue !== null ? formatCurrency(municipalValue) : formatCurrency(value), // Municipal General Fund
      '', // Municipal Special Educ Fund
      '', // Municipal Trust Fund
      provincialValue !== null ? formatCurrency(municipalValue) : formatCurrency(value), //Total
      '', // Barangay Share
      ''  // Fisheries
    ]);
  };

  // Add all data rows with proper formatting
  addDataRow('Manufacturing', data.manufacturing);
  addDataRow('Distributor', data.distributor);
  addDataRow('Retailing', data.retailing);
  addDataRow('Banks & Other Financial Int.', data.financial);
  addDataRow('Other Business Tax', data.otherBusinessTax);
  addDataRow('Sand & Gravel', data.sandGravel);
  addDataRow('Fines & Penalties', data.finesPenalties);
  addDataRow('Mayor\'s Permit', data.mayorsPermit);
  addDataRow('Weights & Measures', data.weighsMeasure);
  addDataRow('Tricycle Permit Fee', data.tricycleOperators);
  addDataRow('Occupation Tax', data.occupationTax);
  addDataRow('Cert. of Ownership', data.certOfOwnership);
  addDataRow('Cert. of Transfer', data.certOfTransfer);
  
  // Special handling for Cockpit Share (split between provincial and municipal)
  if (data.cockpitProvShare || data.cockpitLocalShare) {
    const totalCockpit = (data.cockpitProvShare || 0) + (data.cockpitLocalShare || 0);
    addDataRow('Cockpit Share', totalCockpit, data.cockpitProvShare);
  } else {
    addDataRow('Cockpit Share', 0);
  }
  
  addDataRow('Docking and Mooring Fee', data.dockingMooringFee);
  addDataRow('Sultadas', data.sultadas);
  addDataRow('Miscellaneous', data.miscellaneousFee);
  addDataRow('Registration of Birth', data.regOfBirth);
  addDataRow('Marriage Fees', data.marriageFees);
  addDataRow('Burial Fees', data.burialFees);
  addDataRow('Correction of Entry', data.correctionOfEntry);
  addDataRow('Fishing Permit Fee', data.fishingPermitFee);
  addDataRow('Sale of Agri. Prod.', data.saleOfAgriProd);
  addDataRow('Sale of Acc. Forms', data.saleOfAcctForm);
  addDataRow('Water Fees', data.waterFees);
  addDataRow('Market Stall Fee', data.stallFees);
  addDataRow('Cash Tickets', data.cashTickets);
  addDataRow('Slaughterhouse Fee', data.slaughterHouseFee);
  addDataRow('Rent of Equipment', data.rentalOfEquipment);
  addDataRow('Doc Stamp Tax', data.docStamp);
  addDataRow('Police Clearance', data.policeReportClearance);
  addDataRow('Secretariat Fees', data.secretaryfee);
  addDataRow('Med./Lab. Fees', data.medDentLabFees);
  addDataRow('Garbage Fees', data.garbageFees);
  addDataRow('Cutting Tree', data.cuttingTree);

  // Calculate totals
  const allValues = [
  data.manufacturing,
  data.distributor,
  data.retailing,
  data.financial,
  data.otherBusinessTax,
  data.sandGravel,
  data.finesPenalties,
  data.mayorsPermit,
  data.weighsMeasure,
  data.tricycleOperators,
  data.occupationTax,
  data.certOfOwnership,
  data.certOfTransfer,
  (data.cockpitLocalShare || 0) + (data.cockpitProvShare || 0),
  data.dockingMooringFee,
  data.sultadas,
  data.miscellaneousFee,
  data.regOfBirth,
  data.marriageFees,
  data.burialFees,
  data.correctionOfEntry,
  data.fishingPermitFee,
  data.saleOfAgriProd,
  data.saleOfAcctForm,
  data.waterFees,
  data.stallFees,
  data.cashTickets,
  data.slaughterHouseFee,
  data.rentalOfEquipment,
  data.docStamp,
  data.policeReportClearance,
  data.secretaryfee,
  data.medDentLabFees,
  data.garbageFees,
  data.cuttingTree
].filter(v => v !== undefined && v !== null);

  const total = allValues.reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
  const municipalTotal = total - (data.cockpitProvShare || 0);

  // Add totals row
  worksheet.addRow([
    'TOTAL',
    formatCurrency(total),
    '', // National
    formatCurrency(data.cockpitProvShare || 0), // Provincial General Fund
    '', // Provincial Special Educ Fund
    '', // Provincial Total
    formatCurrency(municipalTotal), // Municipal General Fund
    '', // Municipal Special Educ Fund
    '', // Municipal Trust Fund
    formatCurrency(municipalTotal), // Municipal Total
    '', // Barangay Share
    ''  // Fisheries
  ]);

  // Merge header cells
  worksheet.mergeCells('A1:L1');
  worksheet.mergeCells('A2:L2');
  worksheet.mergeCells('A3:L3');
  worksheet.mergeCells('A4:L4');
  worksheet.mergeCells('D5:F6'); // Provincial
  worksheet.mergeCells('G5:I6'); // Municipal

  // Style headers
  const headerStyles = {
    font: { bold: true },
    alignment: { horizontal: 'center' }
  };

  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(2).font = { bold: true, size: 14 };
  worksheet.getRow(5).eachCell(cell => Object.assign(cell, headerStyles));
  worksheet.getRow(6).eachCell(cell => Object.assign(cell, headerStyles));
  
  // Style totals row (last row)
  const lastRow = worksheet.lastRow;
  lastRow.eachCell(cell => {
    cell.font = { bold: true };
    if ([2, 4, 6, 7].includes(cell.col)) { // Columns with currency values
      cell.numFmt = '"P"#,##0.00';
    }
  });

  // Set column widths
  worksheet.columns = [
    { width: 30 }, // SOURCES OF COLLECTIONS
    { width: 15 }, // TOTAL COLLECTIONS
    { width: 12 }, // NATIONAL
    { width: 15 }, // PROVINCIAL GENERAL FUND
    { width: 15 }, // PROVINCIAL SPECIAL EDUC FUND
    { width: 12 }, // PROVINCIAL TOTAL
    { width: 15 }, // MUNICIPAL GENERAL FUND
    { width: 15 }, // MUNICIPAL SPECIAL EDUC FUND
    { width: 12 }, // MUNICIPAL TRUST FUND
    { width: 12 }, // MUNICIPAL TOTAL
    { width: 15 }, // BARANGAY SHARE
    { width: 12 }  // FISHERIES
  ];

  // Generate Excel file
workbook.xlsx.writeBuffer().then(buffer => {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  // Dynamic file name using selected month and year
  const fileName = `Summary_of_Collections_${month.label}_${year.value}.xlsx`;

  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
});
};

  return (
    <>
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
        <Grid container justifyContent="center" alignItems="center" spacing={0} direction="column" mb={2}>
          <Grid item>
            <MDTypography variant="h6" fontWeight="bold" align="center">
              SUMMARY OF COLLECTIONS
            </MDTypography>
          </Grid>
          <Grid item>
            <MDTypography variant="subtitle1" fontWeight="bold" align="center">
              ZAMBOANGUITA, NEGROS ORIENTAL
            </MDTypography>
          </Grid>
          <Grid item>
            <MDTypography variant="body1" fontStyle="bold" align="center">
              LGU
            </MDTypography>
          </Grid>
          <Grid item>
            <MDTypography variant="body2" fontStyle="bold" align="center">
              Month of {month.label} {year.label}
            </MDTypography>
          </Grid>
        </Grid>
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
  {/* Manufacturing */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Manufacturing</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.manufacturing || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.manufacturing || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.manufacturing || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  {/* Distributor */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Distributor</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.distributor || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.distributor || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.distributor || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  {/* Retailing */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Retailing</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.retailing || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.retailing || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.retailing || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  {/*Banks & Other Financial Int. */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Banks & Other Financial Int.</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.financial || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.financial || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.financial || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  <TableRow>
    {/*Other Business Tax */}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Other Business Tax</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.otherBusinessTax || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.otherBusinessTax || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.otherBusinessTax || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sand & Gravel</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.sandGravel || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.sandGravel || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.sandGravel || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Fines & Penalties</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.finesPenalties || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.finesPenalties || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.finesPenalties || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Mayor's Permit</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.mayorsPermit || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.mayorsPermit || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.mayorsPermit || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Weight & Measure</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.weighsMeasure || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.weighsMeasure || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.weighsMeasure || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Tricycle Permit Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.tricycleOperators || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.tricycleOperators || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.tricycleOperators || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Occupation Tax</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.occupationTax || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.occupationTax || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.occupationTax || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cert. of Ownership</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.certOfOwnership || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.certOfOwnership || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.certOfOwnership || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cert. of Transfer</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.certOfTransfer || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.certOfTransfer  || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.certOfTransfer || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Cockpit Share</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency((data.cockpitProvShare || 0) + (data.cockpitLocalShare || 0))} {/* TOTAL COLLECTIONS */}
  </TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cockpitProvShare || 0)}</TableCell> {/* PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cockpitLocalShare || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cockpitLocalShare || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
</TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Docking and Mooring Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.dockingMooringFee || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.dockingMooringFee || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.dockingMooringFee || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sultadas</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.sultadas || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.sultadas || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.sultadas || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Miscellaneous</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.miscellaneousFee || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.miscellaneousFee || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.miscellaneousFee || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Registration of Birth</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.regOfBirth || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.regOfBirth || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.regOfBirth || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Marriage Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.marriageFees || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.marriageFees || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.marriageFees || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Burial Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.burialFees || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.burialFees || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.burialFees || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Correction of Entry</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.correctionOfEntry || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.correctionOfEntry || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.correctionOfEntry || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Fishing Permit Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.fishingPermitFee || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.fishingPermitFee || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.fishingPermitFee}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sale of Agri. Prod.</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.saleOfAgriProd || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.saleOfAgriProd || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.saleOfAgriProd || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sale of Acct. Forms</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.saleOfAcctForm || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.saleOfAcctForm || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.saleOfAcctForm || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Water Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.waterFees || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.waterFees || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.waterFees || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Market Stall Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.stallFees || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.stallFees || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.stallFees || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cash Tickets</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cashTickets || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cashTickets || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cashTickets || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>SlaughterHouse Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.slaughterHouseFee || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.slaughterHouseFee || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.slaughterHouseFee || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Rental of Equipment</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.rentalOfEquipment || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.rentalOfEquipment || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.rentalOfEquipment || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Doc Stamp Tax</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.docStamp || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.docStamp || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.docStamp || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Police Clearance</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">0</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">0</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">0</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Secretaries Fees</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center"> {formatCurrency((data.policeReportClearance || 0) +(data.secretaryfee || 0))}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency((data.policeReportClearance || 0) +(data.secretaryfee || 0))}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency((data.policeReportClearance || 0) +(data.secretaryfee || 0))}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Med./Lab. Fees</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.medDentLabFees || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.medDentLabFees || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.medDentLabFees || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Garbage Fees</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.garbageFees || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.garbageFees || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.garbageFees || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cutting Tree</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cuttingTree || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cuttingTree || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cuttingTree || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  {/* OVERALL TOTAL */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>TOTAL</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency((data.manufacturing || 0) +
      (data.distributor || 0) +
      (data.retailing || 0) +
      (data.financial || 0) +
      (data.otherBusinessTax || 0) +
      (data.sandGravel || 0) +
      (data.finesPenalties || 0) +
      (data.mayorsPermit || 0) +
      (data.weighsMeasure || 0) +
      (data.tricycleOperators || 0) +
      (data.occupationTax || 0) +
      (data.certOfOwnership || 0) +
      (data.certOfTransfer || 0) +
      (data.cockpitProvShare || 0) +
      (data.cockpitLocalShare || 0) +
      (data.dockingMooringFee || 0) +
      (data.sultadas || 0) +
      (data.miscellaneousFee || 0) +
      (data.regOfBirth || 0) +
      (data.marriageFees || 0) +
      (data.burialFees || 0) +
      (data.correctionOfEntry || 0) +
      (data.fishingPermitFee || 0) +
      (data.saleOfAgriProd || 0) +
      (data.saleOfAcctForm || 0) +
      (data.waterFees || 0) +
      (data.stallFees || 0) +
      (data.cashTickets || 0) +
      (data.slaughterHouseFee || 0) +
      (data.rentalOfEquipment || 0) +
      (data.docStamp || 0) +
      (data.policeReportClearance || 0) +
      (data.secretaryfee || 0) +
      (data.medDentLabFees || 0) +
      (data.garbageFees || 0) +
      (data.cuttingTree || 0))}
  </TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{formatCurrency(data.cockpitProvShare || 0)}</TableCell> {/* TOTAL PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency(calculateTotal([
      data.manufacturing,
      data.distributor,
      data.retailing,
      data.financial,
      data.otherBusinessTax,
      data.sandGravel,
      data.finesPenalties,
      data.mayorsPermit,
      data.weighsMeasure,
      data.tricycleOperators,
      data.occupationTax,
      data.certOfOwnership,
      data.certOfTransfer,
      data.cockpitLocalShare,
      data.dockingMooringFee,
      data.sultadas,
      data.miscellaneousFee,
      data.regOfBirth,
      data.marriageFees,
      data.burialFees,
      data.correctionOfEntry,
      data.fishingPermitFee,
      data.saleOfAgriProd,
      data.saleOfAcctForm,
      data.waterFees,
      data.stallFees,
      data.cashTickets,
      data.slaughterHouseFee,
      data.rentalOfEquipment,
      data.docStamp,
      data.policeReportClearance,
      data.secretaryfee,
      data.medDentLabFees,
      data.garbageFees,
      data.cuttingTree,
    ]))}
  </TableCell> {/* TOTAL MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency(calculateTotal([
      data.manufacturing,
      data.distributor,
      data.retailing,
      data.financial,
      data.otherBusinessTax,
      data.sandGravel,
      data.finesPenalties,
      data.mayorsPermit,
      data.weighsMeasure,
      data.tricycleOperators,
      data.occupationTax,
      data.certOfOwnership,
      data.certOfTransfer,
      data.cockpitLocalShare,
      data.dockingMooringFee,
      data.sultadas,
      data.miscellaneousFee,
      data.regOfBirth,
      data.marriageFees,
      data.burialFees,
      data.correctionOfEntry,
      data.fishingPermitFee,
      data.saleOfAgriProd,
      data.saleOfAcctForm,
      data.waterFees,
      data.stallFees,
      data.cashTickets,
      data.slaughterHouseFee,
      data.rentalOfEquipment,
      data.docStamp,
      data.policeReportClearance,
      data.secretaryfee,
      data.medDentLabFees,
      data.garbageFees,
      data.cuttingTree,
    ]))}
  </TableCell> {/* TOTAL MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL FISHERIES */}
</TableRow>

</TableBody>
  </Table>
</TableContainer>
</Box>
      </Box>
      </div>
       {/* Printable Area Ends Here */}


            {/* Print Button */}
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
                PRINT
              </Button>
              
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
                Download to Excel
              </Button>
            </Box>
    </>
  );
}

ReportTable.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ReportTable;