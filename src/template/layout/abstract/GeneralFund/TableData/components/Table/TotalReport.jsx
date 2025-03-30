import { Autocomplete, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
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
    label: String(2030 - i),
    value: 2030 - i,
}));

const BASE_URL = "http://192.168.101.108:3001";

function TotalReport({ item, ...rest }) {
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
                const response = await axios.get(`${BASE_URL}/api/general-fund-total-tax-report`, {
                    params: {
                        month: month ? month.value : undefined,
                        day: day ? day.value : undefined,
                        year: year ? year.value : undefined,
                    },
                });
                setTaxData(response.data);
            } catch (error) {
                console.error('Error fetching tax data:', error.response ? error.response.data : error.message);
            }
        };

        fetchData();
    }, [month, day, year]);

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
        const csvData = [['Taxes', 'Total']]; // Headers
        taxData.forEach(row => csvData.push([row.Taxes, row.Total]));
        const csvContent = csvData.map(e => e.join(",")).join("\n");

        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const fileName = `TOB-${formattedDate}-${formattedTime}.csv`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
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
            {...rest}
        >
            {/* Input Fields & Download Button */}
            <Box 
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2
                }}
            >
                <Autocomplete
                    disablePortal
                    id="month-selector"
                    options={months}
                    sx={{ width: 150 }}
                    onChange={handleMonthChange}
                    renderInput={(params) => <TextField {...params} label="Month" />}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                />
                <Autocomplete
                    disablePortal
                    id="day-selector"
                    options={availableDays}
                    sx={{ width: 150 }}
                    onChange={handleDayChange}
                    renderInput={(params) => <TextField {...params} label="Day" />}
                    value={day ? { label: String(day.value), value: day.value } : null}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    disabled={!availableDays.length}
                />
                <Autocomplete
                    disablePortal
                    id="year-selector"
                    options={years}
                    sx={{ width: 150 }}
                    onChange={handleYearChange}
                    renderInput={(params) => <TextField {...params} label="Year" />}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    sx={{ height: '40px' }}
                >
                    Download
                </Button>
            </Box>

            {/* Tax Data Table */}
            <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
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
                                    <TableCell align="right"> {formatToPeso(row.Total)}</TableCell>
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

const formatToPeso = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value || 0));
  };

export default TotalReport;
