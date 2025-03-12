import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Menu,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format, parse } from 'date-fns';

// Styled components for table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const CenteredTableCell = styled(TableCell)({
  textAlign: 'center',
});

// Define months and years for filters
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

  // Add the rest of the months...
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


  // Add more years...
];

// Helper function to format the date
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

function DailyTable({ onBack, setShowFilters }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [collectionData, setCollectionData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null); // Track the row clicked
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility
  const [viewData, setViewData] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filteredData = viewData.filter((row) =>
    (row['CTC NO'] ? row['CTC NO'].toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    (row.NAME ? row.NAME.toLowerCase().includes(searchQuery.toLowerCase()) : false)
  );

  // Fetch data when month or year changes
  useEffect(() => {
    const fetchCollectionData = async () => {
      const queryParams = new URLSearchParams();
      if (selectedMonth) queryParams.append('month', selectedMonth.value);
      if (selectedYear) queryParams.append('year', selectedYear.value);

      try {
        const response = await fetch(
          `http://192.168.101.108:3001/api/CedulaDailyCollection?${queryParams.toString()}`
        );
        const data = await response.json();
        setCollectionData(data);
      } catch (error) {
        console.error('Error fetching collection data:', error);
      }
    };

    fetchCollectionData();
  }, [selectedMonth, selectedYear]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row); // Store the row for later use
  };

  const handleViewClick = () => {
    if (currentRow) {
      try {
        // Parse date from "Jan 02, 2025" to Date object
        const parsedDate = parse(currentRow.DATE, 'MMM dd, yyyy', new Date());
        
        // Format to "YYYY-MM-DD" for MySQL
        const formattedDate = format(parsedDate, 'yyyy-MM-dd');
        
        fetch(`http://192.168.101.108:3001/api/viewDailyCollectionDetailsCedula?date=${formattedDate}`)
          .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
          })
          .then((data) => {
            setViewData(Array.isArray(data) ? data : []);
            setOpenDialog(true);
          })
          .catch((error) => {
            console.error('Error fetching detailed data:', error);
            setViewData([]);
          });
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
    handleClose();
  };

  const handleCommentClick = () => {
    if (currentRow) {
      console.log(`Add comment for: ${currentRow.DATE}`);
      // Handle adding a comment (e.g., open a modal)
    }
    handleClose();
  };

  const handleSaveComment = async (row) => {
    const formattedDate = new Date(row.DATE).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
  
    try {
      const response = await fetch('http://192.168.101.108:3001/api/saveCommentCedula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
          ctcNo: row['CTC NO'],
          comment: row.COMMENT || '',
        }),
      });
  
      if (!response.ok) throw new Error('Failed to save comment');
  
      console.log('Comment saved successfully');
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
        marginTop: 2,
      }}
    >
       {/* Month and Year selectors */}
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
      disablePortal
      id="month-selector"
      options={months}
      sx={{ width: 150, mr: 2 }}
      onChange={(e, value) => setSelectedMonth(value || null)}
      renderInput={(params) => <TextField {...params} label="Month" />}
    />
    <Autocomplete
      disablePortal
      id="year-selector"
      options={years}
      sx={{ width: 150 }}
      onChange={(e, value) => setSelectedYear(value || null)}
      renderInput={(params) => <TextField {...params} label="Year" />}
    />
      </Box>
    </Box>

      

      <TableContainer component={Paper}>
        <Table aria-label="daily data table">
          <TableHead>
            <TableRow>
              <StyledTableCell>DATE</StyledTableCell>
              <StyledTableCell>BASIC</StyledTableCell>
              <StyledTableCell>TAX DUE</StyledTableCell>
              <StyledTableCell>INTEREST</StyledTableCell>
              <StyledTableCell>TOTAL</StyledTableCell>
              <StyledTableCell>COMMENT</StyledTableCell>
              <StyledTableCell>ACTION</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionData.length > 0 ? (
              collectionData.map((row, index) => (
                <TableRow key={index}>
                  <CenteredTableCell>{row.DATE}</CenteredTableCell>
                  <CenteredTableCell>{row.BASIC}</CenteredTableCell>
                  <CenteredTableCell>{row.TAX_DUE}</CenteredTableCell>
                  <CenteredTableCell>{row.INTEREST}</CenteredTableCell>
                  <CenteredTableCell>{row.TOTAL}</CenteredTableCell>
                  <CenteredTableCell>{row.COMMENT || 'N/A'}</CenteredTableCell>
                  <CenteredTableCell>
                    <Button
                      onClick={(event) => handleClick(event, row)}
                      variant="contained"
                      color="primary"
                    >
                      Action
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleViewClick}>View</MenuItem>
                      <MenuItem onClick={handleCommentClick}>Comment</MenuItem>
                    </Menu>
                  </CenteredTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <CenteredTableCell colSpan={7}>No data available</CenteredTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
  <DialogContent>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      Detailed Data for {currentRow?.DATE}
    </Typography>

    {/* Search Field */}
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder="Search by CTC NO or Name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ mb: 2 }}
    />

    <TableContainer component={Paper}>
    <Table stickyHeader aria-label="detailed data table">
        <TableHead>
          <TableRow>
            <StyledTableCell>DATE</StyledTableCell>
            <StyledTableCell>CTC NO</StyledTableCell>
            <StyledTableCell>LOCAL TIN</StyledTableCell>
            <StyledTableCell>NAME</StyledTableCell>
            <StyledTableCell>BASIC</StyledTableCell>
            <StyledTableCell>TAX DUE</StyledTableCell>
            <StyledTableCell>INTEREST</StyledTableCell>
            <StyledTableCell>TOTAL</StyledTableCell>
            <StyledTableCell>CASHIER</StyledTableCell>
            <StyledTableCell>COMMENTS</StyledTableCell>
            <StyledTableCell>ACTION</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <TableRow key={`${row['CTC NO']}-${index}`}>
                <CenteredTableCell style={{ whiteSpace: 'nowrap' }}>
                  {formatDate(row.DATE)}
                </CenteredTableCell>
                <CenteredTableCell>{row['CTC NO']}</CenteredTableCell>
                <CenteredTableCell>{row.LOCAL}</CenteredTableCell>
                <CenteredTableCell>{row.NAME}</CenteredTableCell>
                <CenteredTableCell>{row.BASIC}</CenteredTableCell>
                <CenteredTableCell>{row.TAX_DUE}</CenteredTableCell>
                <CenteredTableCell>{row.INTEREST}</CenteredTableCell>
                <CenteredTableCell>{row.TOTAL}</CenteredTableCell>
                <CenteredTableCell>{row.CASHIER}</CenteredTableCell>
                <CenteredTableCell>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={row.COMMENT || ''}
                    onChange={(e) => {
                      const updatedData = [...viewData];
                      updatedData[index].COMMENT = e.target.value;
                      setViewData(updatedData);
                    }}
                  />
                </CenteredTableCell>
                <CenteredTableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleSaveComment(row)}
                  >
                    Save
                  </Button>
                </CenteredTableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <CenteredTableCell colSpan={11} align="center">
                No matching records found
              </CenteredTableCell>
            </TableRow>
          )}
        </TableBody>

        {/* Overall Total Row */}
        
        <TableFooter>
          <TableRow>
            <StyledTableCell colSpan={4} align="right"><b>Overall Total:</b></StyledTableCell>
            <StyledTableCell>
              <b>{filteredData.reduce((sum, row) => sum + (parseFloat(row.BASIC) || 0), 0).toFixed(2)}</b>
            </StyledTableCell>
            <StyledTableCell>
              <b>{filteredData.reduce((sum, row) => sum + (parseFloat(row.TAX_DUE) || 0), 0).toFixed(2)}</b>
            </StyledTableCell>
            <StyledTableCell>
              <b>{filteredData.reduce((sum, row) => sum + (parseFloat(row.INTEREST) || 0), 0).toFixed(2)}</b>
            </StyledTableCell>
            <StyledTableCell>
              <b>{filteredData.reduce((sum, row) => sum + (parseFloat(row.TOTAL) || 0), 0).toFixed(2)}</b>
            </StyledTableCell>
            <StyledTableCell colSpan={3}></StyledTableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}

export default DailyTable;
