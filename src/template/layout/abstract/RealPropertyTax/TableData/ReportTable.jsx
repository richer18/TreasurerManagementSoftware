import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import MDTypography from '../../../../../components/MDTypography';

const months = [
  { label: 'January', value: '1', days: 31 },
  { label: 'February', value: '2', days: 28 }, // Dynamically adjust for leap years
  { label: 'March', value: '3', days: 31 },
  { label: 'April', value: '4', days: 30 },
  { label: 'May', value: '5', days: 31 },
  { label: 'June', value: '6', days: 30 },
  { label: 'July', value: '7', days: 31 },
  { label: 'August', value: '8', days: 31 },
  { label: 'September', value: '9', days: 30 },
  { label: 'October', value: '10', days: 31 },
  { label: 'November', value: '11', days: 30 },
  { label: 'December', value: '12', days: 31 },
];

const years = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
];




function ReportTable({ onBack }) {
  const [month, setMonth] = useState({ label: 'January', value: '1' });
  const [year, setYear] = useState({ label: '2025', value: '2025' });

   // Memoize defaultFields to ensure it's stable across renders
   const defaultFields = useMemo(() => ({
    'Total Collections': 0,
    'National': 0,
    '35% Prov’l Share': 0,
    'Provincial Special Ed Fund': 0,
    'Provincial General Fund': 0,
    'Municipal General Fund': 0,
    'Municipal Special Ed Fund': 0,
    'Municipal Trust Fund': 0,
    'Barangay Share': 0,
    'Fisheries': 0,
  }), []); // Empty dependency array ensures this object is created once

   // Define the unified state object
  const [sharingData, setSharingData] = useState({
    LandSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
    sefLandSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
    buildingSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
    sefBuildingSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
  });

// Helper function to format currency
const formatCurrency = (value) => {
  return value > 0
    ? `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : '₱0.00'; // Changed to display '₱0.00' instead of empty string
};
  
 
    // Fetch data from all APIs on component mount
  useEffect(() => {
    // Define all API endpoints with their identification keys
    const apiEndpoints = [
      {
        key: "LandSharingData",
        url: "http://192.168.101.108:3001/api/LandSharingData",
      },
      {
        key: "sefLandSharingData",
        url: "http://192.168.101.108:3001/api/sefLandSharingData",
      },
      {
        key: "buildingSharingData",
        url: "http://192.168.101.108:3001/api/buildingSharingData",
      },
      {
        key: "sefBuildingSharingData",
        url: "http://192.168.101.108:3001/api/sefBuildingSharingData",
      },
    ];

    // Create an array of axios GET requests
    const requests = apiEndpoints.map(api => axios.get(api.url));

    // Use Promise.all to fetch all data concurrently
    Promise.all(requests)
      .then(responses => {
        // Initialize updatedSharingData without referencing current state
        const updatedSharingData = {
          LandSharingData: {
            Current: { ...defaultFields },
            Prior: { ...defaultFields },
            Penalties: { ...defaultFields },
            TOTAL: { ...defaultFields },
          },
          sefLandSharingData: {
            Current: { ...defaultFields },
            Prior: { ...defaultFields },
            Penalties: { ...defaultFields },
            TOTAL: { ...defaultFields },
          },
          buildingSharingData: {
            Current: { ...defaultFields },
            Prior: { ...defaultFields },
            Penalties: { ...defaultFields },
            TOTAL: { ...defaultFields },
          },
          sefBuildingSharingData: {
            Current: { ...defaultFields },
            Prior: { ...defaultFields },
            Penalties: { ...defaultFields },
            TOTAL: { ...defaultFields },
          },
        };

        responses.forEach((response, index) => {
          const apiKey = apiEndpoints[index].key;
          const data = response.data;

          // Ensure the data is an array
          if (Array.isArray(data)) {
            data.forEach(item => {
              switch (item.category) {
                case 'Current':
                  // Merge defaultFields with the fetched item
                  updatedSharingData[apiKey].Current = { ...defaultFields, ...item };
                  break;
                case 'Prior':
                  updatedSharingData[apiKey].Prior = { ...defaultFields, ...item };
                  break;
                case 'Penalties':
                  updatedSharingData[apiKey].Penalties = { ...defaultFields, ...item };
                  break;
                case 'TOTAL':
                  updatedSharingData[apiKey].TOTAL = { ...defaultFields, ...item };
                  break;
                default:
                  console.warn(`Unexpected category: ${item.category} in ${apiKey}`);
                  break;
              }
            });
          } else {
            console.error(`Invalid data format for ${apiKey}: Expected an array.`);
          }
        });

        // Update the state with all fetched data
        setSharingData(updatedSharingData);
        // setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sharing data:', err);
        // setError('Failed to fetch data.');
        // setIsLoading(false);
      });
  }, [defaultFields]); // Include defaultFields in the dependency array // Empty dependency array ensures this runs once on mount

  const handleMonthChange = (event, value) => {
    setMonth(value || { label: 'January', value: '1' });
  };

  const handleYearChange = (event, value) => {
    setYear(value || { label: '2024', value: '2024' });
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
    window.print();
  };

  const generateHeaders = () => {
    return [
      ['SOURCES OF COLLECTIONS', 'TOTAL COLLECTIONS', 'NATIONAL', 'PROVINCIAL', '', '', 'MUNICIPAL', '', '', '', 'BARANGAY SHARE', 'FISHERIES'],
      ['', '', '', 'GENERAL FUND', 'SPECIAL EDUC. FUND', 'TOTAL', 'GENERAL FUND', 'SPECIAL EDUC. FUND', 'TRUST FUND', 'TOTAL', '', '']
    ];
  };

  const handleDownloadExcel = () => {
    const headers = generateHeaders(); // Dynamically generate headers
  
    const dataToExport = [];
  
    Object.keys(sharingData).forEach((key) => {
      const categoryData = sharingData[key];
      dataToExport.push([key.replace(/([A-Z])/g, ' $1').trim()]); // Add category name
      Object.keys(categoryData).forEach((subKey) => {
        const rowData = categoryData[subKey];
        dataToExport.push([
          subKey,
          formatCurrency(rowData['Total Collections'] || 0),
          formatCurrency(rowData['National'] || 0),
          formatCurrency(rowData['35% Prov’l Share'] || 0),
          formatCurrency(rowData['Provincial Special Ed Fund'] || 0),
          formatCurrency(
            (rowData['35% Prov’l Share'] || 0) + (rowData['Provincial Special Ed Fund'] || 0)
          ),
          formatCurrency(rowData['40% Mun. Share'] || 0),
          formatCurrency(rowData['Municipal Special Ed Fund'] || 0),
          formatCurrency(rowData['Municipal Trust Fund'] || 0),
          formatCurrency(
            (rowData['40% Mun. Share'] || 0) +
            (rowData['Municipal Special Ed Fund'] || 0) +
            (rowData['Municipal Trust Fund'] || 0)
          ),
          formatCurrency(rowData['25% Brgy. Share'] || 0),
          formatCurrency(rowData['Fisheries'] || 0),
        ]);
      });
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...dataToExport]);
  
    worksheet['!merges'] = [
      { s: { r: 0, c: 3 }, e: { r: 0, c: 5 } },
      { s: { r: 0, c: 6 }, e: { r: 0, c: 9 } },
    ];
  
    worksheet['!cols'] = headers[0].map(() => ({ wpx: 150 }));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `Report_${month.label}_${year.label}.xlsx`);
  };


  return (
    <>
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Button sx={{ display: 'flex', alignItems: 'center', p: 2 }} onClick={onBack}>
            Back
          </Button>
        </Box>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Autocomplete
            disablePortal
            id="month-selector"
            options={months}
            sx={{ width: 150, mr: 2 }}
            onChange={handleMonthChange}
            value={month}
            renderInput={(params) => <TextField {...params} label="Month" />}
          />
          <Autocomplete
            disablePortal
            id="year-selector"
            options={years}
            sx={{ width: 150 }}
            onChange={handleYearChange}
            value={year}
            renderInput={(params) => <TextField {...params} label="Year" />}
          />
        </Box>
      </Box> */}
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



      {/* Printable Area Starts Here */}
      <div id="printableArea">
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
        <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}>  
        <TableContainer component={Paper}>
  <Table sx={{ border: '1px solid black', minWidth: '1200px' }}>
    <TableHead>
      {/* First Row */}
      <TableRow>
      <TableCell
  rowSpan={2} // Spans across two rows
  align="center" // Centers the text horizontally
  sx={{
    border: '1px solid black', // Adds border styling
    fontWeight: 'bold', // Makes the text bold
    padding: '8px 16px', // Adds spacing inside the cell
    verticalAlign: 'middle', // Aligns the text vertically in the middle
    width: '100px', // Sets a fixed width for consistent column sizing
  }}
>
  SOURCES OF COLLECTIONS
</TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '50px', // Sets a fixed width for consistent column sizing
          }}
        >
          TOTAL COLLECTIONS
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
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
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
        >
          BARANGAY SHARE
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
        >
          FISHERIES
        </TableCell>
      </TableRow>
      {/* Second Row */}
      <TableRow>
        <TableCell
         rowSpan={2} // Spans across two rows
         align="center" // Centers the text horizontally
         sx={{
           border: '1px solid black', // Adds border styling
           fontWeight: 'bold', // Makes the text bold
           padding: '8px 16px', // Adds spacing inside the cell
           verticalAlign: 'middle', // Aligns the text vertically in the middle
           width: '100px', // Sets a fixed width for consistent column sizing
         }}
        >
          GENERAL FUND
        </TableCell>
        <TableCell
         rowSpan={2} // Spans across two rows
         align="center" // Centers the text horizontally
         sx={{
           border: '1px solid black', // Adds border styling
           fontWeight: 'bold', // Makes the text bold
           padding: '8px 16px', // Adds spacing inside the cell
           verticalAlign: 'middle', // Aligns the text vertically in the middle
           width: '130px', // Sets a fixed width for consistent column sizing
         }}
        >
          SPECIAL EDUC. FUND
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
        >
          TOTAL
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
        >
          GENERAL FUND
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '130px', // Sets a fixed width for consistent column sizing
          }}
        >
          SPECIAL EDUC. FUND
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
        >
          TRUST FUND
        </TableCell>
        <TableCell
          rowSpan={2} // Spans across two rows
          align="center" // Centers the text horizontally
          sx={{
            border: '1px solid black', // Adds border styling
            fontWeight: 'bold', // Makes the text bold
            padding: '8px 16px', // Adds spacing inside the cell
            verticalAlign: 'middle', // Aligns the text vertically in the middle
            width: '100px', // Sets a fixed width for consistent column sizing
          }}
        >
          TOTAL
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
  {/* Real Property Tax-Basic/Land */}
  <TableRow>
    <TableCell
      align="left"
      sx={{ border: '1px solid black', fontWeight: 'bold' }}
    >
      Real Property Tax-Basic/Land
    </TableCell>
    {/* Empty cells for the rest of the columns */}
    {Array.from({ length: 11 }).map((_, index) => (
      <TableCell key={index} sx={{ border: '1px solid black' }} />
    ))}
  </TableRow>
  {/* Child items for Real Property Tax-Basic/Land */}
  <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Current Year
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
                (sharingData.LandSharingData.Current['35% Prov’l Share'] || 0) +
                  (sharingData.LandSharingData.Current['40% Mun. Share'] || 0) +
                  (sharingData.LandSharingData.Current['25% Brgy. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Current['35% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
          
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Current['35% Prov’l Share'])}
           
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            {formatCurrency(sharingData.LandSharingData.Current['40% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.LandSharingData.Current['40% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Current['25% Brgy. Share'])}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
          </TableRow> 

           {/* Previous Years */}
           <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Previous Years
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(
                (sharingData.LandSharingData.Prior['35% Prov’l Share'] || 0) +
                  (sharingData.LandSharingData.Prior['40% Mun. Share'] || 0) +
                  (sharingData.LandSharingData.Prior['25% Brgy. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Prior['35% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.LandSharingData.Prior['35% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Prior['40% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Prior['40% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.LandSharingData.Prior['25% Brgy. Share'])}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
          </TableRow>

          {/* Penalties */}
          <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Penalties
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(
                (sharingData.LandSharingData.Penalties['35% Prov’l Share'] || 0) +
                  (sharingData.LandSharingData.Penalties['40% Mun. Share'] || 0) +
                  (sharingData.LandSharingData.Penalties['25% Brgy. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Penalties['35% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Penalties['35% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Penalties['40% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Penalties['40% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.LandSharingData.Penalties['25% Brgy. Share'])}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
  </TableRow>

  {/* Real Property Tax-SEF/Land */}
  <TableRow>
    <TableCell
      align="left"
      sx={{ border: '1px solid black', fontWeight: 'bold' }}
    >
      Real Property Tax-SEF/Land
    </TableCell>
    {Array.from({ length: 11 }).map((_, index) => (
      <TableCell key={index} sx={{ border: '1px solid black' }} />
    ))}
  </TableRow>
  {/* Child items */}
  <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Current Year
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
                (sharingData.sefLandSharingData.Current['50% Prov’l Share'] || 0) +
                  (sharingData.sefLandSharingData.Current['50% Mun. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefLandSharingData.Current['50% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.sefLandSharingData.Current['50% Prov’l Share'])}
           
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.sefLandSharingData.Current['50% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.sefLandSharingData.Current['50% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
    
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
          </TableRow> 

           {/* Previous Years */}
           <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Previous Years
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(
                (sharingData.sefLandSharingData.Prior['50% Prov’l Share'] || 0) +
                  (sharingData.sefLandSharingData.Prior['50% Mun. Share'] || 0)
                )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            {formatCurrency(sharingData.sefLandSharingData.Prior['50% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefLandSharingData.Prior['50% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefLandSharingData.Prior['50% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefLandSharingData.Prior['50% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
          
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
          </TableRow>

          {/* Penalties */}
          <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Penalties
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
                (sharingData.sefLandSharingData.Penalties['50% Prov’l Share'] || 0) +
                  (sharingData.sefLandSharingData.Penalties['50% Mun. Share'] || 0)
                )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.sefLandSharingData.Penalties['50% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefLandSharingData.Penalties['50% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefLandSharingData.Penalties['50% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.sefLandSharingData.Penalties['50% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
  </TableRow>

  {/* Real Property Tax-Basic/Bldg. */}
  <TableRow>
    <TableCell
      align="left"
      sx={{ border: '1px solid black', fontWeight: 'bold' }}
    >
      Real Property Tax-Basic/Bldg.
    </TableCell>
    {Array.from({ length: 11 }).map((_, index) => (
      <TableCell key={index} sx={{ border: '1px solid black' }} />
    ))}
  </TableRow>
  {/* Child items */}
  <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Current Year
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
                (sharingData.buildingSharingData.Current['35% Prov’l Share'] || 0) +
                  (sharingData.buildingSharingData.Current['40% Mun. Share'] || 0) +
                  (sharingData.buildingSharingData.Current['25% Brgy. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Current['35% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
          
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Current['35% Prov’l Share'])}
           
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            {formatCurrency(sharingData.buildingSharingData.Current['40% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.buildingSharingData.Current['40% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Current['25% Brgy. Share'])}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
          </TableRow> 

           {/* Previous Years */}
           <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Previous Years
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(
                (sharingData.buildingSharingData.Prior['35% Prov’l Share'] || 0) +
                  (sharingData.buildingSharingData.Prior['40% Mun. Share'] || 0) +
                  (sharingData.buildingSharingData.Prior['25% Brgy. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Prior['35% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.buildingSharingData.Prior['35% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Prior['40% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Prior['40% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.buildingSharingData.Prior['25% Brgy. Share'])}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
          </TableRow>

          {/* Penalties */}
          <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Penalties
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(
                (sharingData.buildingSharingData.Penalties['35% Prov’l Share'] || 0) +
                  (sharingData.buildingSharingData.Penalties['40% Mun. Share'] || 0) +
                  (sharingData.buildingSharingData.Penalties['25% Brgy. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Penalties['35% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Penalties['35% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Penalties['40% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Penalties['40% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.buildingSharingData.Penalties['25% Brgy. Share'])}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
  </TableRow>

  {/* Real Property Tax-SEF/Bldg. */}
  <TableRow>
    <TableCell
      align="left"
      sx={{ border: '1px solid black', fontWeight: 'bold' }}
    >
      Real Property Tax-SEF/Bldg.
    </TableCell>
    {Array.from({ length: 11 }).map((_, index) => (
      <TableCell key={index} sx={{ border: '1px solid black' }} />
    ))}
  </TableRow>
  {/* Child items */}
  <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Current Year
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
                (sharingData.sefBuildingSharingData.Current['50% Prov’l Share'] || 0) +
                  (sharingData.sefBuildingSharingData.Current['50% Mun. Share'] || 0)
              )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefBuildingSharingData.Current['50% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.sefBuildingSharingData.Current['50% Prov’l Share'])}
           
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.sefBuildingSharingData.Current['50% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(sharingData.sefBuildingSharingData.Current['50% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
    
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            </TableCell>
          </TableRow> 

           {/* Previous Years */}
           <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Previous Years
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(
                (sharingData.sefBuildingSharingData.Prior['50% Prov’l Share'] || 0) +
                  (sharingData.sefBuildingSharingData.Prior['50% Mun. Share'] || 0)
                )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
            {formatCurrency(sharingData.sefBuildingSharingData.Prior['50% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefBuildingSharingData.Prior['50% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefBuildingSharingData.Prior['50% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefBuildingSharingData.Prior['50% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
          
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
          </TableRow>

          {/* Penalties */}
          <TableRow>
            <TableCell
              align="left"
              sx={{ border: '1px solid black', paddingLeft: 4 }}
            >
              Penalties
            </TableCell>
            {/* TOTAL COLLECTIONS */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
                (sharingData.sefBuildingSharingData.Penalties['50% Prov’l Share'] || 0) +
                  (sharingData.sefBuildingSharingData.Penalties['50% Mun. Share'] || 0)
                )}
            </TableCell>
            {/* NATIONAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.sefBuildingSharingData.Penalties['50% Prov’l Share'])}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefBuildingSharingData.Penalties['50% Prov’l Share'])}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(sharingData.sefBuildingSharingData.Penalties['50% Mun. Share'])}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(sharingData.sefBuildingSharingData.Penalties['50% Mun. Share'])}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
  </TableRow>

  {/* TOTAL */}
  <TableRow>
    <TableCell
      align="left"
      sx={{ border: '1px solid black', fontWeight: 'bold' }}
    >
      TOTAL
    </TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">
    {formatCurrency(
    (sharingData.LandSharingData.Current['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Current['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Current['25% Brgy. Share'] || 0) +
    (sharingData.LandSharingData.Prior['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Prior['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Prior['25% Brgy. Share'] || 0) +
    (sharingData.LandSharingData.Penalties['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Penalties['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Penalties['25% Brgy. Share'] || 0) +
    (sharingData.sefLandSharingData.Current['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Current['50% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Prior['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Prior['50% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Penalties['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Penalties['50% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Current['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Current['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Current['25% Brgy. Share'] || 0) +
    (sharingData.buildingSharingData.Prior['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Prior['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Prior['25% Brgy. Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['25% Brgy. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Current['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Current['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Prior['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Prior['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Penalties['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Penalties['50% Mun. Share'] || 0)
  )}
    </TableCell>
    {/* NATIONAL */}
    <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
            {/* PROVINCIAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(
    (sharingData.LandSharingData.Current['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Prior['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Penalties['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Current['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Prior['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['35% Prov’l Share'] || 0)
  )}
            </TableCell>
            {/* PROVINCIAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(
    (sharingData.sefLandSharingData.Current['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Prior['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Penalties['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Current['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Prior['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Penalties['50% Prov’l Share'] || 0)
  )}
            </TableCell>
            {/* PROVINCIAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              {formatCurrency(
    (sharingData.LandSharingData.Current['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Prior['35% Prov’l Share'] || 0) +
    (sharingData.LandSharingData.Penalties['35% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Current['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Prior['50% Prov’l Share'] || 0) +
    (sharingData.sefLandSharingData.Penalties['50% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Current['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Prior['35% Prov’l Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['35% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Current['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Prior['50% Prov’l Share'] || 0) +
    (sharingData.sefBuildingSharingData.Penalties['50% Prov’l Share'] || 0) 
  )}
            </TableCell>
            {/* MUNICIPAL GENERAL FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
                   {formatCurrency(
    (sharingData.LandSharingData.Current['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Prior['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Penalties['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Current['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Prior['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['40% Mun. Share'] || 0)
  )}
            </TableCell>
            {/* MUNICIPAL SPECIAL EDUC. FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(
    (sharingData.sefLandSharingData.Current['50% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Prior['50% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Penalties['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Current['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Prior['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Penalties['50% Mun. Share'] || 0)
  )}
            </TableCell>
            {/* MUNICIPAL TRUST FUND */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
              
            </TableCell>
            {/* MUNICIPAL TOTAL */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             {formatCurrency(
    (sharingData.LandSharingData.Current['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Prior['40% Mun. Share'] || 0) +
    (sharingData.LandSharingData.Penalties['40% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Current['50% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Prior['50% Mun. Share'] || 0) +
    (sharingData.sefLandSharingData.Penalties['50% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Current['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Prior['40% Mun. Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['40% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Current['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Prior['50% Mun. Share'] || 0) +
    (sharingData.sefBuildingSharingData.Penalties['50% Mun. Share'] || 0)
  )}
            </TableCell>
            {/* BARANGAY SHARE */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
               {formatCurrency(
    (sharingData.LandSharingData.Current['25% Brgy. Share'] || 0) +
    (sharingData.LandSharingData.Prior['25% Brgy. Share'] || 0) +
    (sharingData.LandSharingData.Penalties['25% Brgy. Share'] || 0) +
    (sharingData.buildingSharingData.Current['25% Brgy. Share'] || 0) +
    (sharingData.buildingSharingData.Prior['25% Brgy. Share'] || 0) +
    (sharingData.buildingSharingData.Penalties['25% Brgy. Share'] || 0)
  )}
            </TableCell>
            {/* FISHERIES */}
            <TableCell
              sx={{ border: '1px solid black' }}
              align="center"
            >
             
            </TableCell>
    
  </TableRow>
</TableBody>
  </Table>
</TableContainer>
</Box>
      </Box>
      </div>

        {/* Printable Area Ends Here */}
      {/* Print Button */}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          className="print-button" // This class is used to hide the button during printing
        >
          PRINT
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadExcel}
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
