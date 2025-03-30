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
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.manufacturing}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.manufacturing}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.manufacturing}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  {/* Distributor */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Distributor</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.distributor}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.distributor}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.distributor}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  {/* Retailing */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Retailing</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.retailing}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.retailing}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.retailing}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  {/*Banks & Other Financial Int. */}
  <TableRow>
    <TableCell align="left" sx={{ border: '1px solid black' }}>Banks & Other Financial Int.</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.financial}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.financial}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.financial}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  <TableRow>
    {/*Other Business Tax */}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Other Business Tax</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.otherBusinessTax}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.otherBusinessTax}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.otherBusinessTax}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>
  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sand & Gravel</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.sandGravel}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.sandGravel}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.sandGravel}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Fines & Penalties</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.finesPenalties}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.finesPenalties}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.finesPenalties}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Mayor's Permit</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.mayorsPermit}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.mayorsPermit}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.mayorsPermit}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Weight & Measure</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.weighsMeasure}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.weighsMeasure}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.weighsMeasure}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Tricycle Permit Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.tricycleOperators}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.tricycleOperators}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.tricycleOperators}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Occupation Tax</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.occupationTax}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.occupationTax}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.occupationTax}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cert. of Ownership</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.certOfOwnership}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.certOfOwnership}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.certOfOwnership}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cert. of Transfer</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.certOfTransfer}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.certOfTransfer}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.certOfTransfer}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>Cockpit Share</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {(data.cockpitProvShare || 0) + (data.cockpitLocalShare || 0)} {/* TOTAL COLLECTIONS */}
  </TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{data.cockpitProvShare}</TableCell> {/* PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{data.cockpitLocalShare}</TableCell> {/* MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{data.cockpitLocalShare}</TableCell> {/* MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
</TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Docking and Mooring Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.dockingMooringFee}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.dockingMooringFee}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.dockingMooringFee}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sultadas</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.sultadas}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.sultadas}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.sultadas}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Miscellaneous</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.miscellaneousFee}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.miscellaneousFee}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.miscellaneousFee}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Registration of Birth</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.regOfBirth}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.regOfBirth}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.regOfBirth}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Marriage Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.marriageFees}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.marriageFees}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.marriageFees}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Burial Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.burialFees}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.burialFees}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.burialFees}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Correction of Entry</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.correctionOfEntry}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.correctionOfEntry}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.correctionOfEntry}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Fishing Permit Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.fishingPermitFee}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.fishingPermitFee}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.fishingPermitFee}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sale of Agri. Prod.</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.saleOfAgriProd}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.saleOfAgriProd}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.saleOfAgriProd}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Sale of Acct. Forms</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.saleOfAcctForm}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.saleOfAcctForm}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.saleOfAcctForm}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Water Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.waterFees}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.waterFees}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.waterFees}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Market Stall Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.stallFees}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.stallFees}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.stallFees}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cash Tickets</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.cashTickets}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.cashTickets}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.cashTickets}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>SlaughterHouse Fee</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.slaughterHouseFee}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.slaughterHouseFee}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.slaughterHouseFee}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Rental of Equipment</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.rentalOfEquipment}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.rentalOfEquipment}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.rentalOfEquipment}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Doc Stamp Tax</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.docStamp}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.docStamp}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.docStamp}</TableCell> {/* MUNICIPAL TOTAL */}
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
    <TableCell sx={{ border: '1px solid black' }} align="center"> {(data.policeReportClearance || 0) +(data.secretaryfee || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{(data.policeReportClearance || 0) +(data.secretaryfee || 0)}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{(data.policeReportClearance || 0) +(data.secretaryfee || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Med./Lab. Fees</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.medDentLabFees}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.medDentLabFees}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.medDentLabFees}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Garbage Fees</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.garbageFees}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.garbageFees}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.garbageFees}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  <TableRow>
    {/*Fines & Penalties*/}
    <TableCell align="left" sx={{ border: '1px solid black' }}>Cutting Tree</TableCell>
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.cuttingTree}</TableCell> {/* TOTAL COLLECTIONS */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.cuttingTree}</TableCell> {/* MUNICIPAL GENERAL FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
    <TableCell sx={{ border: '1px solid black' }} align="center">{data.cuttingTree}</TableCell> {/* MUNICIPAL TOTAL */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
    <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
  </TableRow>

  {/* OVERALL TOTAL */}
<TableRow>
  <TableCell align="left" sx={{ border: '1px solid black' }}>TOTAL</TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {(data.manufacturing || 0) +
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
      (data.cuttingTree || 0)}
  </TableCell>
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL NATIONAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">{data.cockpitProvShare}</TableCell> {/* TOTAL PROVINCIAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {calculateTotal([
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
    ])}
  </TableCell> {/* TOTAL MUNICIPAL GENERAL FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL SPECIAL EDUC. FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL TRUST FUND */}
  <TableCell sx={{ border: '1px solid black' }} align="center">
    {calculateTotal([
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
    ])}
  </TableCell> {/* TOTAL MUNICIPAL TOTAL */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL BARANGAY SHARE */}
  <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL FISHERIES */}
</TableRow>

</TableBody>
  </Table>
</TableContainer>
      </Box>
    </>
  );
}

ReportTable.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ReportTable;