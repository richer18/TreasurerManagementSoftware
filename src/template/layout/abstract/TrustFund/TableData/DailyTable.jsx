import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle, IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import DailyTablev2 from './components/Table/DailyTable';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const CenteredTableCell = styled(TableCell)({
  textAlign: 'center',
});

// Month and Year options
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

const BASE_URL = "http://192.168.101.108:3001"; // Define base URL

function DailyTable({ onBack }) {
  
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(''); // Set default value
  const [selectedYear, setSelectedYear] = useState(''); // Set default value
  const [viewData, setViewData] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);

  // Fetch data on month/year change
useEffect(() => {
  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (selectedMonth) queryParams.append('month', selectedMonth.value);
      if (selectedYear) queryParams.append('year', selectedYear.value);

      const response = await fetch(
        `${BASE_URL}/api/allDataTrustFund?${queryParams.toString()}`
      );
      const result = await response.json();
      console.log('Fetched Data:', result);

      const aggregated = result.reduce((acc, row) => {
        const existing = acc.find((item) => item.DATE === row.DATE);
        if (existing) {
          existing.BUILDING_PERMIT_FEE += row.BUILDING_PERMIT_FEE || 0;
          existing.ELECTRICAL_FEE += row.ELECTRICAL_FEE || 0;
          existing.ZONING_FEE += row.ZONING_FEE || 0;
          existing.LIVESTOCK_DEV_FUND += row.LIVESTOCK_DEV_FUND || 0;
          existing.DIVING_FEE += row.DIVING_FEE || 0;
          existing.TOTAL += row.TOTAL || 0;
        } else {
          acc.push({ ...row });
        }
        return acc;
      }, []);

      console.log('Aggregated Data:', aggregated);

      setData(aggregated);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [selectedMonth, selectedYear]);


  const handleViewClick = async (date) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/viewalldataTrustFundTableView?date=${dayjs(date).format("YYYY-MM-DD")}`
    );

    // Transform numeric fields to strings
    const transformedData = response.data.map((item) => ({
      ...item,
      BUILDING_PERMIT_FEE: item.BUILDING_PERMIT_FEE.toString(),
      LOCAL_80_PERCENT: item.LOCAL_80_PERCENT.toString(),
      TRUST_FUND_15_PERCENT: item.TRUST_FUND_15_PERCENT.toString(),
      NATIONAL_5_PERCENT: item.NATIONAL_5_PERCENT.toString(),
      ELECTRICAL_FEE: item.ELECTRICAL_FEE.toString(),
      ZONING_FEE: item.ZONING_FEE.toString(),
      LIVESTOCK_DEV_FUND: item.LIVESTOCK_DEV_FUND.toString(),
      LOCAL_80_PERCENT_LIVESTOCK: item.LOCAL_80_PERCENT_LIVESTOCK.toString(),
      NATIONAL_20_PERCENT: item.NATIONAL_20_PERCENT.toString(),
      DIVING_FEE: item.DIVING_FEE.toString(),
      LOCAL_40_PERCENT_DIVE_FEE: item.LOCAL_40_PERCENT_DIVE_FEE.toString(),
      BRGY_30_PERCENT: item.BRGY_30_PERCENT.toString(),
      FISHERS_30_PERCENT: item.FISHERS_30_PERCENT.toString(),
      TOTAL: item.TOTAL.toString(),
    }));

    setViewData(transformedData);
    setViewOpen(true);
  } catch (error) {
    console.error('Error fetching detailed data:', error);
  }
};

  const handleViewClose = () => {
    setViewOpen(false);
  };

  // For number values (currency columns)
const MonetaryTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  fontFamily: 'monospace',
  fontWeight: 800,
  fontSize: '1.9rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '1rem'
  }
}));

  return (
    <>
    {/* Enhanced Header */}
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
      
      <Typography variant="h4" sx={{ 
        fontWeight: 700,
        color: 'primary.main',
        letterSpacing: 1
      }}>
        Daily Collections
      </Typography>
      
      <Box display="flex" gap={2} alignItems="center">
        <Autocomplete
          options={months}
          onChange={(_, value) => setSelectedMonth(value)}
          value={selectedMonth}
          sx={{ width: 180 }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Month"
              variant="outlined"
              size="small"
            />
          )}
        />
        <Autocomplete
          options={years}
          onChange={(_, value) => setSelectedYear(value)}
          value={selectedYear}
          sx={{ width: 150 }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Year"
              variant="outlined"
              size="small"
            />
          )}
        />
      </Box>
    </Box>
  
    {/* Enhanced Table */}
<TableContainer 
  component={Paper}
  sx={{
    borderRadius: 4,
    boxShadow: 3,
    '& .MuiTableCell-root': {
      py: 2
    }
  }}
>
  <Table>
    <TableHead>
      <StyledTableRow>
        {[
          'Date', 'Building', 'Electrical Fee', 
          'Zoning Fee', 'Livestock Dev. Fund', 
          'Diving Fee', 'Total', 'Action'
        ].map((header) => (
          <StyledTableCell 
            key={header}
            sx={{
              fontSize: '1rem',       // Reduced from 1.1rem
              fontWeight: 600,        // Added medium weight
              bgcolor: 'primary.dark',
              color: 'common.white',
              letterSpacing: '0.5px'  // Improved readability
            }}
          >
            {header}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>

    
    
    <TableBody>
      {data.length > 0 ? data.map((row, index) => (
        <StyledTableRow 
          key={`${row.DATE}-${index}`}
          sx={{
            '&:nth-of-type(even)': {
              bgcolor: 'action.hover'
            },
            '&:hover': {
              bgcolor: 'action.selected'
            }
          }}
        >
          <CenteredTableCell sx={{ fontSize: '0.9rem' }}>
            <Box fontWeight="500">
              {dayjs(row.DATE).format('MMM D, YYYY')}
            </Box>
          </CenteredTableCell>
          
          {[
        'BUILDING_PERMIT_FEE',
        'ELECTRICAL_FEE',
        'ZONING_FEE',
        'LIVESTOCK_DEV_FUND',
        'DIVING_FEE',
        'TOTAL'
      ].map((field) => (
        <MonetaryTableCell key={field}>
          ₱{Number(row[field]).toLocaleString()}
        </MonetaryTableCell>
      ))}
          
          <CenteredTableCell>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleViewClick(row.DATE)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 1,
                fontSize: '0.875rem',  // Button text size
                py: 0.5,                // Vertical padding
                px: 2                  // Horizontal padding
              }}
            >
              View Details
            </Button>
          </CenteredTableCell>
        </StyledTableRow>
      )) : (
        <StyledTableRow>
          <CenteredTableCell colSpan={8} sx={{ py: 6 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              color="text.secondary"
            >
              <InboxIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                No records found
              </Typography>
              <Typography variant="body2">
                Try adjusting your filters
              </Typography>
            </Box>
          </CenteredTableCell>
        </StyledTableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
  
    {/* Enhanced Dialog */}
    <Dialog 
      open={viewOpen} 
      onClose={handleViewClose} 
      fullWidth 
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'common.white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          Transaction Details - {dayjs(viewData?.[0]?.DATE).format('MMMM D, YYYY')}
        </Typography>
        <IconButton 
          onClick={handleViewClose}
          sx={{ color: 'common.white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <DailyTablev2 
          data={viewData} 
          onClose={handleViewClose}
          sx={{ border: 'none' }}
        />
      </DialogContent>
    </Dialog>
  </>
  );
}

export default DailyTable;
