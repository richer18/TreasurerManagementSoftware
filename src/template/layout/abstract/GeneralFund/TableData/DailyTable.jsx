import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField, Typography
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import DailyTablev2 from './components/Table/DailyTable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Styled components for the table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const RightAlignedTableCell = styled(TableCell)({
  textAlign: 'right',
});

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

function DailyTable({ onDataFiltered, onBack }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [currentRow, setCurrentRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.101.108:3001/api/allDataGeneralFund?month=${selectedMonth}&year=${selectedYear}`
        );
        const result = await response.json();
        setData(result);
        if (onDataFiltered) {
          onDataFiltered(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, onDataFiltered]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row); // Set the current row correctly
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewClick = () => {
  const formattedDate = dayjs(currentRow?.DATE).format('YYYY-MM-DD');

  if (!formattedDate) {
    console.error('Current row or date is not defined.');
    return;
  }

  console.log(`Requesting data for date: ${formattedDate}`);

  axios
    .get(`http://192.168.101.108:3001/api/viewalldataGeneralFundTableView?date=${encodeURIComponent(formattedDate)}`)
    .then((response) => {
      console.log('Received data:', response.data);
      setViewData(response.data);
      setViewOpen(true);
    })
    .catch((error) => {
      console.error('Error fetching detailed data:', error);
    });
};

  const handleCommentClick = () => {
    setOpen(true);
    setCurrentComment(currentRow.comments || '');
    handleClose();
  };

  const handleMonthChange = (event, value) => {
    setSelectedMonth(value ? value.value : '');
  };

  const handleYearChange = (event, value) => {
    setSelectedYear(value ? value.value : '');
  };

  const handleSaveComment = () => {
  const date = currentRow?.DATE;

  if (!date) {
    console.error("No valid 'DATE' in currentRow");
    return;
  }

  // Convert the date to the desired format
  const formattedDate = dayjs(date).format('YYYY-MM-DD');

  const payload = {
    date: formattedDate,
    comment: currentComment,
    time: dayjs().format('HH:mm:ss'), // Current time
    user: 'John Doe', // Replace with actual user
  };

  // POST the new comment
  fetch('http://192.168.101.108:3001/api/dailyComments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to add comment');
      }
      return res.json();
    })
    .then((data) => {
      console.log('Comment saved successfully:', data);

      // Optionally refresh comments or update UI
      setOpen(false);
      setCurrentComment('');
    })
    .catch((error) => {
      console.error('Error saving comment:', error);
    });
};


  const handleViewClose = () => {
    setViewOpen(false);
  };

  const totalAmount = useMemo(() => {
    return data.reduce((total, row) => total + row['Overall Total'], 0);
  }, [data]);

  return (
    <>
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
      onChange={handleMonthChange}
      renderInput={(params) => <TextField {...params} label="Month" />}
    />
    <Autocomplete
      disablePortal
      id="year-selector"
      options={years}
      sx={{ width: 150 }}
      onChange={handleYearChange}
      renderInput={(params) => <TextField {...params} label="Year" />}
    />
      </Box>
    </Box>


      {/* Table display */}
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
      <Table aria-label="daily data table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>DATE</StyledTableCell>
            <StyledTableCell>Tax on Business</StyledTableCell>
            <StyledTableCell>Regulatory Fees</StyledTableCell>
            <StyledTableCell>Receipts From Economic Enterprise</StyledTableCell>
            <StyledTableCell>Service/User Charges</StyledTableCell>
            <StyledTableCell>TOTAL</StyledTableCell>
            <StyledTableCell>COMMENTS</StyledTableCell>
            <StyledTableCell>ACTION</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
  {data.map((row, index) => (
    <StyledTableRow key={row.id || row.DATE || index}>
      <CenteredTableCell>{dayjs(row.DATE).format('MMM D, YYYY')}</CenteredTableCell>
      <CenteredTableCell>{row['Tax on Business']}</CenteredTableCell>
      <CenteredTableCell>{row['Regulatory Fees']}</CenteredTableCell>
      <CenteredTableCell>{row['Receipts From Economic Enterprise']}</CenteredTableCell>
      <CenteredTableCell>{row['Service/User Charges']}</CenteredTableCell>
      <CenteredTableCell>{row['Overall Total']}</CenteredTableCell>
      <CenteredTableCell>{row.comments}</CenteredTableCell>
      <CenteredTableCell>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(event) => handleClick(event, row)}
          variant="contained"
          color="primary"
        >
          Action
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleViewClick}>View</MenuItem>
          
          <MenuItem onClick={handleCommentClick}>Comment</MenuItem>
        </Menu>
      </CenteredTableCell>
    </StyledTableRow>
  ))}
  <StyledTableRow>
              <RightAlignedTableCell colSpan={7}>
                <Typography fontWeight="bold">TOTAL</Typography>
              </RightAlignedTableCell>
              <RightAlignedTableCell colSpan={1}>
                <Typography fontWeight="bold">₱{totalAmount.toFixed(2)}</Typography>
              </RightAlignedTableCell>
            </StyledTableRow>
</TableBody>
      </Table>
    </TableContainer>

       {/* Comment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveComment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
     <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="xl">
  <DialogTitle>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h6">Detailed View</Typography>
      <IconButton edge="end" color="inherit" onClick={handleViewClose} aria-label="close">
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
  <DialogContent>
    <DailyTablev2 data={viewData} />
  </DialogContent>
</Dialog>
    </>
  );
}

DailyTable.propTypes = {
  onDataFiltered: PropTypes.func,
  onBack: PropTypes.func.isRequired,
};

export default DailyTable;
