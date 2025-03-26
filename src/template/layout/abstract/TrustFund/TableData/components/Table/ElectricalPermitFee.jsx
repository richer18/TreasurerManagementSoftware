import { Autocomplete, Box, Button, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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

const days = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
}));

const years = Array.from({ length: 100 }, (_, i) => ({
    label: String(2050 - i),
    value: 2050 - i,
}));

const BASE_URL = "http://192.168.101.108:3001"; // Define base URL

function RegulatoryFees() {
   const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);
    const [year, setYear] = useState(null);
    const [availableDays, setAvailableDays] = useState(days);
    const [taxData, setTaxData] = useState([]);
    
    const handleMonthChange = (event, newValue) => setMonth(newValue);
    const handleDayChange = (event, newValue) => setDay(newValue);
    const handleYearChange = (event, newValue) => setYear(newValue);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/api/trust-fund-electrical-permit-fees`, {
              params: {
                month: month?.value, // Optional chaining for cleaner syntax
                day: day?.value,
                year: year?.value,
              },
            });
      
            setTaxData(response.data);
          } catch (error) {
            console.error(
              "Error fetching tax data:",
              error.response?.data || error.message
            );
          }
        };
      
        fetchData();
      }, [month, day, year]); // Dependencies ensure the function runs when values change

useEffect(() => {
    if (month && year) {
        const daysInMonth = new Date(year.value, month.value, 0).getDate();
        setAvailableDays(
        Array.from({ length: daysInMonth }, (_, i) => ({
            label: String(i + 1),
            value: i + 1,
        }))
    );
    }
}, [month, year]);



const handleDownload = () => {
    // Convert table data to CSV
    const csvData = [];
    csvData.push(['Taxes', 'Total']); // Headers
    
    taxData.forEach(row => {
        csvData.push([row.Taxes, row.Total]);
    });

    const csvContent = csvData.map(e => e.join(",")).join("\n");

    // Get the current date and time for the file name
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const fileName = `TOB-${formattedDate}-${formattedTime}.csv`;

    // Create a blob and download it as a CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName); // Use the dynamic file name
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  return (
     <Box
    sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
            width: '100%',
        }}
        >
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
            >
                <Grid2 container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Grid2 item sx={{ ml: 'auto' }}>
                <Autocomplete
                disablePortal
                id="month-selector"
                options={months}
                sx={{ width: 150, mr: 2 }}
                onChange={handleMonthChange}
                renderInput={(params) => <TextField {...params} label="Month" />}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                />
                </Grid2>

                <Grid2 item sx={{ ml: 'auto' }}>
                <Autocomplete
                disablePortal
                id="day-selector"
                options={availableDays}
                sx={{ width: 150, mr: 2 }}
                onChange={handleDayChange}
                renderInput={(params) => <TextField {...params} label="Day" />}
                value={day ? { label: String(day.value), value: day.value } : null}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={!availableDays.length}
                />
                </Grid2>
                <Grid2 item sx={{ ml: 'auto' }}>
                <Autocomplete
                disablePortal
                id="year-selector"
                options={years}
                sx={{ width: 150 }}
                onChange={handleYearChange}
                renderInput={(params) => <TextField {...params} label="Year" />}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                />
                </Grid2>
                <Grid2 item sx={{ ml: 'auto' }}>
                <Button 
                variant="contained"
                color="primary"
                onClick={handleDownload}
                sx={{ height: '40px' }} // Ensure consistent height with TextField components
                >
                    Download
                </Button>
                </Grid2>
                </Grid2>
                </Box>
                
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Taxes</TableCell>
                                <TableCell align="right">Total</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taxData.length > 0 ? (
                                        taxData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.Taxes}</TableCell>
                                            <TableCell align="right">{row.Total}</TableCell>
                                            </TableRow>
                                            ))
                                        ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">No data available</TableCell>
                                            </TableRow>
                                        )}
                                        </TableBody>
                                        </Table>
                                        </TableContainer>
                                        </Box>
                                        );
                                    }

export default RegulatoryFees
