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
// import MDTypography from '../../../../../../components/MDTypography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
// import { saveAs } from "file-saver";
// import { jsPDF } from "jspdf";
// import autoTable from 'jspdf-autotable';
// import * as XLSX from "xlsx";

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
              `http://192.168.101.108:3001/api/trustFundDataReport`,
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


// PDF Print Function
// const handlePrintPDF = () => {
//   const doc = new jsPDF("l", "mm", "a4");

//   // Dynamic filename
//   const now = new Date();
//   const formattedDateTime = now
//     .toISOString()
//     .replace(/T/, "_")
//     .replace(/\..+/, "")
//     .replace(/:/g, "-");

//   const fileName = `TrustFund_Summary_Report_${formattedDateTime}.pdf`;

//   // Title Section (Centered Text)
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(14);
//   doc.text("SUMMARY OF COLLECTIONS", 148.5, 15, { align: "center" });
//   doc.setFontSize(12);
//   doc.text("ZAMBOANGUITA, NEGROS ORIENTAL", 148.5, 25, { align: "center" });
//   doc.setFont("helvetica", "normal");
//   doc.text("LGU", 148.5, 32, { align: "center" });
//   doc.setFontSize(10);
//   doc.text(`Month of ${month?.label || "Unknown"} ${year?.label || "Year"}`, 148.5, 40, { align: "center" });

//   // Table Headers
//   const headers = [
//     [
//       { content: "SOURCES OF COLLECTIONS", rowSpan: 2 },
//       { content: "TOTAL COLLECTIONS", rowSpan: 2 },
//       { content: "NATIONAL", rowSpan: 2 },
//       { content: "PROVINCIAL", colSpan: 3 },
//       { content: "MUNICIPAL", colSpan: 4 },
//       { content: "BARANGAY SHARE", rowSpan: 2 },
//       { content: "FISHERIES", rowSpan: 2 },
//     ],
//     [
//       "GENERAL FUND", "SPECIAL EDUC. FUND", "TOTAL",
//       "GENERAL FUND", "SPECIAL EDUC. FUND", "TRUST FUND", "TOTAL",
//     ],
//   ];

//   // Table Data
//   const body = [
//     ["Com Tax Cert.",formatToPeso(data.TOTALAMOUNTPAID),"", "", "", "",formatToPeso(data.TOTALAMOUNTPAID), "", "",formatToPeso(data.TOTALAMOUNTPAID), "","",],
//     ["TOTAL",formatToPeso(data.TOTALAMOUNTPAID),"", "", "", "",formatToPeso(data.TOTALAMOUNTPAID), "", "",formatToPeso(data.TOTALAMOUNTPAID), "","",],
//                ];

//   // Calculate precise X position to center the table
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const tableWidth = 260; // Adjust based on column widths
//   const startX = (pageWidth - tableWidth) / 2; // Perfect Centering

//   // Generate Table (Centered)
//   autoTable(doc, {
//     startY: 50,
//     startX: startX, // Use the calculated position
//     head: headers,
//     body: body,
//     theme: "grid",
//     styles: {
//       font: "helvetica",
//       fontSize: 9,
//       cellPadding: 3,
//       halign: "center",
//       valign: "middle",
//       lineColor: [0, 0, 0],
//       lineWidth: 0.3,
//     },
//     headStyles: {
//       fillColor: [255, 255, 255],
//       textColor: [0, 0, 0],
//       fontStyle: "bold",
//       lineWidth: 0.3,
//     },
//     columnStyles: {
//       0: { halign: "left", cellWidth: "auto" },
//     },
//     didDrawPage: (data) => {
//       doc.setFontSize(8);
//       doc.text(
//         `Generated on: ${new Date().toLocaleDateString()}`,
//         10,
//         doc.internal.pageSize.height - 10
//       );
//     },
//   });

  // Save PDF
//   doc.save(fileName);
// };


  // 📊 Download to Excel Function
// const handleDownloadExcel = async (month, year) => {
//   const formatNumber = (num) => Number(num).toFixed(2);

//   try {
//     const response = await fetch("/CEDULA_TEMPLATE.xlsx");
//     if (!response.ok) throw new Error("Failed to fetch the Excel template.");

//     const arrayBuffer = await response.arrayBuffer();
//     const workbook = XLSX.read(arrayBuffer, { type: "array" });
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];

//     const totalAmount = formatNumber(data?.TOTALAMOUNTPAID || 0);

//     // ✅ Helper function to update cell while preserving styles
//     const updateCell = (cellRef, value) => {
//       worksheet[cellRef] = worksheet[cellRef] || {};
//       worksheet[cellRef].v = value;
//       worksheet[cellRef].s = {
//         font: { bold: true, sz: 12 },
//         alignment: { horizontal: "center", vertical: "center" },
//       };
//     };

//     // ✅ Update the red box (Row 3, spanning E3 to H3) with dynamic month and year
//     updateCell("E3", `Month of ${month?.label || "Unknown"} ${year?.label || "Year"}`);

//     // Ensure valid merge range (E3 to H3)
//     worksheet["!merges"] = worksheet["!merges"] || [];
//     worksheet["!merges"].push({ s: { r: 2, c: 4 }, e: { r: 2, c: 7 } });

//     // ✅ Update other cells (example data)
//     updateCell("A7", "Com Tax Cert.");
//     updateCell("B7", totalAmount);
//     updateCell("G7", totalAmount);
//     updateCell("J7", totalAmount);

//     updateCell("A8", "TOTAL");
//     updateCell("B8", totalAmount);
//     updateCell("G8", totalAmount);
//     updateCell("J8", totalAmount);

//     // ✅ Dynamic filename
//     const now = new Date();
//     const formattedDateTime = now.toISOString().replace(/:/g, "-").replace("T", "_").split(".")[0];
//     const fileName = `Summary_of_Collections_${formattedDateTime}.xlsx`;

//     // ✅ Write and download the updated Excel
//     const updatedExcel = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([updatedExcel], { type: "application/octet-stream" }), fileName);

//     console.log("✅ Excel successfully generated with dynamic Month & Year!");
//   } catch (error) {
//     console.error("❌ Error handling Excel template: ", error);
//   }
// };

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
    {((data.building_national_5 || 0) + (data.building_local_80 || 0) + (data.building_trust_15 || 0)).toFixed(2)}
  </TableCell>

  {/* NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {(data.building_national_5 || 0).toFixed(2)}
  </TableCell>

  {/* PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {(data.building_local_80 || 0).toFixed(2)}
  </TableCell>

  {/* MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {(data.building_trust_15 || 0).toFixed(2)}
  </TableCell>

  {/* MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {((data.building_local_80 || 0) + (data.building_trust_15 || 0)).toFixed(2)}
  </TableCell>

  {/* BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>

  {/* FISHERIES */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
</TableRow>
                    {/* Electrical Permit Fee */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Electrical Permit Fee</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.electricalfee || 0).toFixed(2)}</TableCell> {/* TOTAL COLLECTIONS */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.electricalfee || 0).toFixed(2)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.electricalfee || 0).toFixed(2)}</TableCell> {/* MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
</TableRow>

{/* Zoning Fee */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Zoning Fee</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.zoningfee || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.zoningfee || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.zoningfee || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
</TableRow>

{/* Livestock */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Livestock</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{((data.livestock_national_20 || 0) + (data.livestock_local_80 || 0)).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.livestock_national_20 || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.livestock_local_80 || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.livestock_local_80 || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
</TableRow>

{/* Diving Fee */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Diving Fee</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {((data.diving_local_40 || 0) + (data.diving_brgy_30 || 0) + (data.diving_fishers_30 || 0)).toFixed(2)}
  </TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_local_40 || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_local_40 || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_brgy_30 || 0).toFixed(2)}</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_fishers_30 || 0).toFixed(2)}</TableCell>
</TableRow>

{/* OVERALL TOTAL */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>TOTAL</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {((data.building_local_80 || 0) +
    (data.building_trust_15 || 0) +
    (data.building_national_5 || 0) +
    (data.electricalfee || 0) +
    (data.zoningfee || 0) +
    (data.livestock_local_80 || 0) +
    (data.livestock_national_20 || 0) +
    (data.diving_local_40 || 0) +
    (data.diving_brgy_30 || 0) +
    (data.diving_fishers_30 || 0)).toFixed(2)}
    </TableCell> {/* TOTAL COLLECTIONS */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{((data.building_national_5|| 0)+(data.livestock_national_20|| 0)).toFixed(2)}</TableCell> {/* TOTAL NATIONAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL GENERAL FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL SPECIAL EDUC. FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL TOTAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{((data.building_local_80|| 0)+(data.electricalfee|| 0)+
                        (data.zoningfee|| 0)+(data.livestock_local_80|| 0)+(data.diving_local_40|| 0)).toFixed(2)}</TableCell> {/* TOTAL MUNICIPAL GENERAL FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL SPECIAL EDUC. FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{(data.building_trust_15 || 0).toFixed(2)}</TableCell> {/* TOTAL MUNICIPAL TRUST FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{((data.building_local_80 || 0) +(data.building_trust_15 || 0) +(data.electricalfee || 0) +(data.zoningfee || 0) +(data.livestock_local_80 || 0) +(data.diving_local_40 || 0)).toFixed(2)}
                        </TableCell> {/* TOTAL MUNICIPAL TOTAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_brgy_30 || 0).toFixed(2)}</TableCell> {/* TOTAL BARANGAY SHARE */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_fishers_30).toFixed(2)}</TableCell> {/* TOTAL FISHERIES */}
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
    // onClick={handlePrintPDF}
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
    // onClick={() => handleDownloadExcel(month, year)}
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
