import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,Badge,
  Dialog,
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
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import DailyTablev2 from './components/Table/DailyTable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentsDialog from '../../RealPropertyTax/TableData/CommentsDialog';
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

const BASE_URL = "http://localhost:3001";

 const formatDate = (dateInput) => {
    if (!dateInput) return 'Invalid Date';
    let date;
    if (typeof dateInput === 'string') {
      date = parseISO(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return 'Invalid Date';
    }
    if (isNaN(date)) return 'Invalid Date';
    return format(date, 'MMMM d, yyyy');
  };

function DailyTable({ onDataFiltered, onBack }) {
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [openCommentDialog, setOpenCommentDialog] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/allDataGeneralFund`,
          { params: { month: selectedMonth, year: selectedYear } } // ✅ Axios automatically formats query params
        );
  
        setData(response.data);
  
        if (onDataFiltered) {
          onDataFiltered(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
    if (!currentRow?.DATE) {
      console.error("Current row or date is not defined.");
      return;
    }
  
    const formattedDate = dayjs(currentRow.DATE).format("YYYY-MM-DD");
    console.log(`Requesting data for date: ${formattedDate}`);
  
    axios
      .get(`${BASE_URL}/api/viewalldataGeneralFundTableView`, {
        params: { date: formattedDate }, // ✅ Cleaner way to add query parameters
      })
      .then((response) => {
        console.log("Received data:", response.data);
        setViewData(response.data);
        setViewOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching detailed data:", error);
      });
  };

  

  const handleMonthChange = (event, value) => {
    setSelectedMonth(value ? value.value : '');
  };

  const handleYearChange = (event, value) => {
    setSelectedYear(value ? value.value : '');
  };

  const handleViewComments = async (date) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getGFComments/${date}`);
      console.log("Fetched Comments from API:", response.data); // Debugging
  
      if (response.status === 200 && response.data.length > 0) {
        setComments(response.data); // Set comments
        setOpenCommentDialog(true);
      } else {
        console.warn("No comments found for this date.");
        setComments([]); // Clear comments
        // setOpenCommentDialog(true);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  useEffect(() => {
    axios.get(`${BASE_URL}/api/commentGFCounts`)
      .then((response) => {
        setCommentCounts(response.data); // Store comment counts in state
      })
      .catch((error) => {
        console.error("Error fetching comment counts:", error);
      });
  }, []);



  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleCommentDialogClose = () => {
    setOpenCommentDialog(false);
    setComments([]); // Clear comments when closing
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
      <CenteredTableCell>
      <Badge
  badgeContent={commentCounts[dayjs(row.DATE).format("YYYY-MM-DD")]}
  color="error"
  overlap="circular"
  invisible={!commentCounts[dayjs(row.DATE).format("YYYY-MM-DD")]}
>
  <IconButton onClick={() => handleViewComments(dayjs(row.DATE).format("YYYY-MM-DD"))}>
    <VisibilityIcon color="primary" />
  </IconButton>
</Badge>
</CenteredTableCell>
      <CenteredTableCell>
        <Button
        variant="contained"
        color="primary"
        onClick={(event) => handleClick(event, row)}
        sx={{ textTransform: 'none' }}
        >
          Action
          </Button>
          <Menu
  id="simple-menu"
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={handleClose}
  slotProps={{
    paper: {
      elevation: 0, // Removes shadow
      sx: { boxShadow: 'none' }, // Ensures no shadow
    },
  }}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>
  <MenuItem onClick={handleViewClick}>View</MenuItem>
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
     

      {/* View Dialog */}
      
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
      <DialogTitle
  sx={{
    bgcolor: "primary.main",
    color: "common.white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Typography variant="h6" component="span">
    Transaction Details - {dayjs(viewData?.[0]?.date).format("MMMM D, YYYY")}
  </Typography>
  <IconButton onClick={handleViewClose} sx={{ color: "common.white" }}>
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


 <CommentsDialog
        open={openCommentDialog}
        onClose={handleCommentDialogClose}
        comments={comments}
        formatDate={formatDate}
      />
    </>
  );
}

DailyTable.propTypes = {
  onDataFiltered: PropTypes.func,
  onBack: PropTypes.func.isRequired,
};

export default DailyTable;
