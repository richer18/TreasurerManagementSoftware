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
                console.log("Fetching data for month:", month.value, "and year:", year.value); // Debug log
          
                const response = await axios.get(`http://192.168.101.108:3001/api/allDataTrustFund`, {
                  params: { month: month.value, year: year.value },
                });
          
                if (response.data.length > 0) {
                  const filteredData = response.data.reduce(
  (acc, row) => ({
    building_local_80: acc.building_local_80 + (row.building_local_80 || 0),
    building_trust_15: acc.building_trust_15 + (row.building_trust_15 || 0),
    building_national_5: acc.building_national_5 + (row.building_national_5 || 0),
    electricalfee: acc.electricalfee + (row.electricalfee || 0),
    zoningfee: acc.zoningfee + (row.zoningfee || 0),
    livestock_local_80: acc.livestock_local_80 + (row.livestock_local_80 || 0),
    livestock_national_20: acc.livestock_national_20 + (row.livestock_national_20 || 0),
    diving_local_40: acc.diving_local_40 + (row.diving_local_40 || 0),
    diving_brgy_30: acc.diving_brgy_30 + (row.diving_brgy_30 || 0),
    diving_fishers_30: acc.diving_fishers_30 + (row.diving_fishers_30 || 0),
  }),
  {
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
  }
);
                  console.log('API Response:', response.data);
                  setData(filteredData);
                } else {
                  console.error('No data available for selected month and year');
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
                      <TableCell sx={{ border: '1px solid black' }} align="center">{(data.building_national_5 || 0) +(data.building_local_80 || 0) +(data.building_trust_15 || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.building_national_5}</TableCell> {/* NATIONAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.building_local_80}</TableCell> {/* MUNICIPAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.building_trust_15}</TableCell> {/* MUNICIPAL TRUST FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{(data.building_local_80 || 0) +(data.building_trust_15 || 0)}</TableCell> {/* MUNICIPAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
                    </TableRow>
                    {/* Electrical Permit Fee */}
                    <TableRow>
                      <TableCell align="left" sx={{ border: '1px solid black' }}>Electrical Permit Fee</TableCell>
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.electricalfee}</TableCell> {/* TOTAL COLLECTIONS */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.electricalfee}</TableCell> {/* MUNICIPAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.electricalfee}</TableCell> {/* MUNICIPAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
                    </TableRow>
                    {/* Zoning Fee */}
                    <TableRow>
                      <TableCell align="left" sx={{ border: '1px solid black' }}>Zoning Fee</TableCell>
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.zoningfee}</TableCell> {/* TOTAL COLLECTIONS */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.zoningfee}</TableCell> {/* MUNICIPAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.zoningfee}</TableCell> {/* MUNICIPAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
                    </TableRow>
                    {/*Livestock*/}
                    <TableRow>
                      <TableCell align="left" sx={{ border: '1px solid black' }}>Livestock</TableCell>
                      <TableCell sx={{ border: '1px solid black' }} align="center">{(data.livestock_national_20 || 0) +(data.livestock_local_80 || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.livestock_national_20}</TableCell> {/* NATIONAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.livestock_local_80}</TableCell> {/* MUNICIPAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.livestock_local_80}</TableCell> {/* MUNICIPAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* BARANGAY SHARE */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* FISHERIES */}
                    </TableRow>
                    <TableRow>
                      {/*Diving Fee */}
                      <TableCell align="left" sx={{ border: '1px solid black' }}>Diving Fee </TableCell>
                      <TableCell sx={{ border: '1px solid black' }} align="center">{(data.diving_local_40 || 0) +(data.diving_brgy_30 || 0)+(data.diving_fishers_30 || 0)}</TableCell> {/* TOTAL COLLECTIONS */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* NATIONAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* PROVINCIAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.diving_local_40}</TableCell> {/* MUNICIPAL GENERAL FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL SPECIAL EDUC. FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* MUNICIPAL TRUST FUND */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.diving_local_40}</TableCell> {/* MUNICIPAL TOTAL */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.diving_brgy_30}</TableCell> {/* BARANGAY SHARE */}
                      <TableCell sx={{ border: '1px solid black' }} align="center">{data.diving_fishers_30}</TableCell> {/* FISHERIES */}
                    </TableRow>

                    {/* OVERALL TOTAL */}
                      <TableRow>
                        <TableCell align="left" sx={{ border: '1px solid black' }}>TOTAL</TableCell>
                        <TableCell sx={{ border: '1px solid black' }} align="center">
                          {(data.building_local_80 || 0) +
                          (data.building_trust_15 || 0) +
                          (data.building_national_5 || 0) +
                          (data.electricalfee || 0) +
                          (data.zoningfee || 0) +
                          (data.livestock_local_80 || 0) +
                          (data.livestock_national_20 || 0) +
                          (data.diving_local_40 || 0) +
                          (data.diving_brgy_30 || 0) +
                          (data.diving_fishers_30 || 0)}
                          </TableCell> {/* TOTAL COLLECTIONS */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{(data.building_national_5|| 0)+(data.livestock_national_20|| 0)}</TableCell> {/* TOTAL NATIONAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL GENERAL FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL SPECIAL EDUC. FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL PROVINCIAL TOTAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{(data.building_local_80|| 0)+(data.electricalfee|| 0)+
                        (data.zoningfee|| 0)+(data.livestock_local_80|| 0)+(data.diving_local_40|| 0)}</TableCell> {/* TOTAL MUNICIPAL GENERAL FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center"></TableCell> {/* TOTAL MUNICIPAL SPECIAL EDUC. FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{data.building_trust_15}</TableCell> {/* TOTAL MUNICIPAL TRUST FUND */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{(data.building_local_80 || 0) +(data.building_trust_15 || 0) +(data.electricalfee || 0) +(data.zoningfee || 0) +(data.livestock_local_80 || 0) +(data.diving_local_40 || 0)}
                        </TableCell> {/* TOTAL MUNICIPAL TOTAL */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{data.diving_brgy_30}</TableCell> {/* TOTAL BARANGAY SHARE */}
                        <TableCell sx={{ border: '1px solid black' }} align="center">{data.diving_fishers_30}</TableCell> {/* TOTAL FISHERIES */}
                      </TableRow>

                      </TableBody>
              </Table>
              </TableContainer>


     </Box>
      
    </Box>
  )
}

ReportTable.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ReportTable
