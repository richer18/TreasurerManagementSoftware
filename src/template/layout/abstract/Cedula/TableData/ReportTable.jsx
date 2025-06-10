import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
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
  TextField, Typography,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";


const BASE_URL = "http://192.168.101.108:3001";

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

  const formatToPeso = (amount) => `${(parseFloat(amount) || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

function ReportTable({ onBack }) {
    const [month, setMonth] = useState({ label: 'January', value: '1' });
      const [year, setYear] = useState({ label: '2025', value: '2025' });

     const [data, setData] = useState({
  TOTALAMOUNTPAID: 0,
});

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cedulaSummaryCollectionDataReport`, {
        params: { month: month.value, year: year.value },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Summing the TOTALAMOUNTPAID while ensuring row values are valid
        const totalAmountPaid = response.data.reduce(
          (sum, row) => sum + (Number(row.Totalamountpaid) || 0),
          0
        );

        setData({ TOTALAMOUNTPAID: totalAmountPaid });
      } else {
        console.warn("No data available for the selected month and year");
        setData({ TOTALAMOUNTPAID: 0 });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({ TOTALAMOUNTPAID: 0 });
    }
  };

  fetchData();
}, [month, year]); // Dependency array ensures re-fetching when month/year changes


 // PDF Print Function
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
  document.title = `SOC_cEDULAReport_${month.label}_${year.label}`;
  window.print();
  document.title = originalTitle; // Restore original title
};


  // 📊 Download to Excel Function
const handleDownloadExcel = async (month, year) => {
  const formatNumber = (num) => Number(num).toFixed(2);

  try {
    const response = await fetch("/CEDULA_TEMPLATE.xlsx");
    if (!response.ok) throw new Error("Failed to fetch the Excel template.");

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const totalAmount = formatNumber(data?.TOTALAMOUNTPAID || 0);

    // ✅ Helper function to update cell while preserving styles
    const updateCell = (cellRef, value) => {
      worksheet[cellRef] = worksheet[cellRef] || {};
      worksheet[cellRef].v = value;
      worksheet[cellRef].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    };

    // ✅ Update the red box (Row 3, spanning E3 to H3) with dynamic month and year
    updateCell("E3", `Month of ${month?.label || "Unknown"} ${year?.label || "Year"}`);

    // Ensure valid merge range (E3 to H3)
    worksheet["!merges"] = worksheet["!merges"] || [];
    worksheet["!merges"].push({ s: { r: 2, c: 4 }, e: { r: 2, c: 7 } });

    // ✅ Update other cells (example data)
    updateCell("A7", "Com Tax Cert.");
    updateCell("B7", totalAmount);
    updateCell("G7", totalAmount);
    updateCell("J7", totalAmount);

    updateCell("A8", "TOTAL");
    updateCell("B8", totalAmount);
    updateCell("G8", totalAmount);
    updateCell("J8", totalAmount);

    // ✅ Dynamic filename
    const now = new Date();
    const formattedDateTime = now.toISOString().replace(/:/g, "-").replace("T", "_").split(".")[0];
    const fileName = `Summary_of_Collections_${formattedDateTime}.xlsx`;

    // ✅ Write and download the updated Excel
    const updatedExcel = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([updatedExcel], { type: "application/octet-stream" }), fileName);

    console.log("✅ Excel successfully generated with dynamic Month & Year!");
  } catch (error) {
    console.error("❌ Error handling Excel template: ", error);
  }
};

      const handleMonthChange = (event, value) => {
        setMonth(value || { label: 'January', value: '1' });
      };
    
      const handleYearChange = (event, value) => {
        setYear(value || { label: '2024', value: '2024' });
      };
  return (
    <>
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
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { boxShadow: "0 4px 8px rgba(0,0,0,0.15)" },
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
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
            onChange={handleMonthChange}
            value={month}
            renderInput={(params) => (
              <TextField {...params} label="Select Month" variant="outlined" />
            )}
          />
          <Autocomplete
            disablePortal
            id="year-selector"
            options={years}
            sx={{
              width: 180,
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
            onChange={handleYearChange}
            value={year}
            renderInput={(params) => (
              <TextField {...params} label="Select Year" variant="outlined" />
            )}
          />
        </Box>
      </Box>
      <Box>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={0}
          direction="column"
          mb={2}
        >
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
        <TableContainer component={Paper}>
          <Table sx={{ border: "1px solid black" }}>
            <TableHead>
              {/* First Row */}
              <TableRow>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  SOURCES OF COLLECTIONS
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  TOTAL COLLECTIONS
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  NATIONAL
                </TableCell>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  PROVINCIAL
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  MUNICIPAL
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  BARANGAY SHARE
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  FISHERIES
                </TableCell>
              </TableRow>
              {/* Second Row */}
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  GENERAL FUND
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  SPECIAL EDUC. FUND
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  TOTAL
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  GENERAL FUND
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  SPECIAL EDUC. FUND
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  TRUST FUND
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold" }}
                >
                  TOTAL
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Community Tax Certification */}
              <TableRow>
                <React.Fragment>
                  <TableCell align="left" sx={{ border: "1px solid black" }}>
                    Com Tax Cert.
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }} align="center">
                    {formatToPeso(data.TOTALAMOUNTPAID)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell sx={{ border: "1px solid black" }} align="center">
                    {formatToPeso(data.TOTALAMOUNTPAID)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell sx={{ border: "1px solid black" }} align="center">
                    {formatToPeso(data.TOTALAMOUNTPAID)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                </React.Fragment>
              </TableRow>
              {/* OVERALL TOTAL */}
              <TableRow>
                <React.Fragment>
                  <TableCell align="left" sx={{ border: "1px solid black" }}>
                    TOTAL
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }} align="center">
                    {formatToPeso(data.TOTALAMOUNTPAID)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell sx={{ border: "1px solid black" }} align="center">
                    {formatToPeso(data.TOTALAMOUNTPAID)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell sx={{ border: "1px solid black" }} align="center">
                    {formatToPeso(data.TOTALAMOUNTPAID)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    align="center"
                  ></TableCell>
                </React.Fragment>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
          onClick={() => handleDownloadExcel(month, year)}
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
    </>
  );
}

ReportTable.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ReportTable
