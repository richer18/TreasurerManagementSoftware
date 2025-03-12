import { keyframes } from '@emotion/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField,Tooltip,Card } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import { MdSummarize } from "react-icons/md";
import RealPropertyTaxAbstract from '../../../../components/MD-Components/FillupForm/AbstractRPT';
import PopupDialog from '../../../../components/MD-Components/Popup/PopupDialog';
import DailyTable from './TableData/DailyTable';
import SummaryTable from './TableData/Summary';

import ReportTable from './TableData/ReportTable';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: 'nowrap',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const AnimatedButton = styled(Button)`
  &:hover {
    animation: ${bounce} 1s ease;
  }
`;


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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    // Implement view action
    handleMenuClose();
  };

  const handleEdit = () => {
    // Implement edit action
    handleMenuClose();
  };

  const handleDelete = () => {
    // Implement delete action
    handleMenuClose();
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{formatDate(row.date)}</TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.receipt_no}</TableCell>
        <TableCell align="center">{row.current_year}</TableCell>
        <TableCell align="center">{row.current_penalties}</TableCell>
        <TableCell align="center">{row.current_discounts}</TableCell>
        <TableCell align="center">{row.prev_year}</TableCell>
        <TableCell align="center">{row.prev_penalties}</TableCell>
        <TableCell align="center">{row.prior_years}</TableCell>
        <TableCell align="center">{row.prior_penalties}</TableCell>
        <TableCell align="center">{row.total}</TableCell>
        <TableCell align="center">
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(event) => handleMenuClick(event)}
            variant="contained"
            color="primary"
          >
            ACTIONS
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleView}>View</MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Additional Information
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Barangay</TableCell>
                    <TableCell>25% Share</TableCell>
                    <TableCell>Current Year</TableCell>
                    <TableCell>Penalties</TableCell>
                    <TableCell>Discounts</TableCell>
                    <TableCell>Immediate Preceding Year</TableCell>
                    <TableCell>Penalties</TableCell>
                    <TableCell>Prior Years</TableCell>
                    <TableCell>Penalties</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>GF and SEF</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Cashier</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">{row.barangay}</TableCell>
                    <TableCell align="center">{row.share}</TableCell>
                    <TableCell align="center">{row.additional_current_year}</TableCell>
                    <TableCell align="center">{row.additional_penalties}</TableCell>
                    <TableCell align="center">{row.additional_discounts}</TableCell>
                    <TableCell align="center">{row.additional_prev_year}</TableCell>
                    <TableCell align="center">{row.additional_prev_penalties}</TableCell>
                    <TableCell align="center">{row.additional_prior_years}</TableCell>
                    <TableCell align="center">{row.additional_prior_penalties}</TableCell>
                    <TableCell align="center">{row.additional_total}</TableCell>
                    <TableCell align="center">{row.gf_total}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.cashier}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    receipt_no: PropTypes.string.isRequired,
    current_year: PropTypes.number.isRequired,
    current_penalties: PropTypes.number.isRequired,
    current_discounts: PropTypes.number.isRequired,
    prev_year: PropTypes.number.isRequired,
    prev_penalties: PropTypes.number.isRequired,
    prior_years: PropTypes.number.isRequired,
    prior_penalties: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    barangay: PropTypes.string.isRequired,
    share: PropTypes.number.isRequired,
    additional_current_year: PropTypes.number.isRequired,
    additional_penalties: PropTypes.number.isRequired,
    additional_discounts: PropTypes.number.isRequired,
    additional_prev_year: PropTypes.number.isRequired,
    additional_prev_penalties: PropTypes.number.isRequired,
    additional_prior_years: PropTypes.number.isRequired,
    additional_prior_penalties: PropTypes.number.isRequired,
    additional_total: PropTypes.number.isRequired,
    gf_total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    cashier: PropTypes.string.isRequired,
  }).isRequired,
};
 
function RealPropertyTax() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [gfTotal, setGfTotal] = useState(0);
  const [sefTotal, setSEFTotal] = useState(0);
  const [shareTotal, setShareTotal] = useState(0);
  const dailyButtonRef = useRef(null);
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [showMainTable, setShowMainTable] = useState(true);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [year, setYear] = useState(null);
  const [dailyTableData, setDailyTableData] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReportTable, setShowReportTable] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
   const [showFilters, setShowFilters] = useState(true);

    const handleMonthChange = (event, value) => {
    setMonth(value ? value.value : null);
  };

  const handleYearChange = (event, value) => {
    setYear(value ? value.value : null);
  };
  

const initialFormData = {
    date: '',
    barangay: '',
    cashier: '',
    currentYear: '',
    currentPenalties: '',
    currentDiscounts: '',
    prevYear: '',
    prevPenalties: '',
    priorYears: '',
    priorPenalties: '',
    total: 0,
    share: 0,
    additionalCurrentYear: '',
    additionalCurrentPenalties: '',
    additionalCurrentDiscounts: '',
    additionalPrevYear: '',
    additionalPrevPenalties: '',
    additionalPriorYears: '',
    additionalPriorPenalties: '',
    additionalTotal: 0,
    gfTotal: 0,
    name: '',
    receipt: '',
    status: '',
  };

  const [formData, setFormData] = useState(initialFormData);


useEffect(() => {
    const fetchListings = async () => {
      try {
        const gfResponse = await fetch('http://192.168.101.108:3001/api/TotalGeneralFund');
        if (!gfResponse.ok) throw new Error('Network response was not ok');
        const gfData = await gfResponse.json();
        const totalGF = gfData.reduce((sum, entry) => sum + parseFloat(entry.total || 0), 0);
        setGfTotal(totalGF);

        const sefResponse = await fetch('http://192.168.101.108:3001/api/TotalSEFFund');
        if (!sefResponse.ok) throw new Error('Network response was not ok');
        const sefData = await sefResponse.json();
        const totalSEF = sefData.reduce((sum, entry) => sum + parseFloat(entry.additional_total || 0), 0);
        setSEFTotal(totalSEF);

        const sharesResponse = await fetch('http://192.168.101.108:3001/api/TotalShareFund');
        if (!sharesResponse.ok) throw new Error('Network response was not ok share');
        const sharesData = await sharesResponse.json();
        const totalShares = sharesData.reduce((sum, entry) => sum + parseFloat(entry.share || 0), 0);
        setShareTotal(totalShares);

        const listingsResponse = await fetch('http://192.168.101.108:3001/api/TotalFund');
        if (!listingsResponse.ok) throw new Error('Network response was not ok total');
        const listingsData = await listingsResponse.json();
        const totalListingsGF = listingsData.reduce((sum, listing) => sum + parseFloat(listing.gf_total || 0), 0);
        setTotal(totalListingsGF);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();

    const parseNumber = (value) => parseFloat(value) || 0;

    const computedTotal =
      parseNumber(formData.currentYear) +
      parseNumber(formData.currentPenalties) -
      parseNumber(formData.currentDiscounts) +
      parseNumber(formData.prevYear) +
      parseNumber(formData.prevPenalties) +
      parseNumber(formData.priorYears) +
      parseNumber(formData.priorPenalties);

    const computedAdditionalTotal =
      parseNumber(formData.additionalCurrentYear) +
      parseNumber(formData.additionalCurrentPenalties) -
      parseNumber(formData.additionalCurrentDiscounts) +
      parseNumber(formData.additionalPrevYear) +
      parseNumber(formData.additionalPrevPenalties) +
      parseNumber(formData.additionalPriorYears) +
      parseNumber(formData.additionalPriorPenalties);

    setFormData((prevData) => ({
      ...prevData,
      total: computedTotal,
      additionalTotal: computedAdditionalTotal,
      share: computedTotal * 0.25,
      gfTotal: computedTotal + computedAdditionalTotal,
    }));
  }, [
    formData.currentYear, formData.currentPenalties, formData.currentDiscounts,
    formData.prevYear, formData.prevPenalties, formData.priorYears, formData.priorPenalties,
    formData.additionalCurrentYear, formData.additionalCurrentPenalties, formData.additionalCurrentDiscounts,
    formData.additionalPrevYear, formData.additionalPrevPenalties, formData.additionalPriorYears, formData.additionalPriorPenalties
  ]);


useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch('http://192.168.101.108:3001/api/allData');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, [showDailyTable, showSummaryTable, showMainTable]);
  
useEffect(() => {
  const fetchAllData = async () => {
    try {
      const response = await fetch('http://192.168.101.108:3001/api/allData');
      if (!response.ok) {
        throw new Error('Failed to fetch data. Please check the network response.');
      }
      const data = await response.json();
      setRows(data);
    } catch (error) {
      handleFetchError(error);
    } finally {
      console.log('fetchAllData executed');
    }
  };

  fetchAllData();
}, []); // Empty dependency array to fetch data on component mount

const handleFetchError = (error) => {
  console.error('Error occurred during data fetch:', error.message);
};

  const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
  console.log('Search Term:', event.target.value);
};

  const toggleDailyTable = () => {
    setShowDailyTable(true);
    setShowMainTable(false);
    setShowSummaryTable(false);
    setShowReportTable(false);
    setShowFilters(false);
  };
  
  const toggleSummaryTable = () => {
    setShowSummaryTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowReportTable(false);
    setShowFilters(false);
  };

  const toggleReportTable = () => {
    setShowReportTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowSummaryTable(false);
    setShowFilters(false);
  };

  const handleSave = async (savedData) => {
    // Implement your save logic here
    console.log('Saved data:', savedData);
    // Close the dialog after saving
    setIsDialogOpen(false);
    // Optionally, refresh data or update UI
    // fetchData(); // If you have a fetchData function to refresh the data
  };


  const handleDownload = async () => {
    try {
      if (showDailyTable) {
        // Code for downloading daily table data
        const response = await axios.post('http://192.168.101.108:3001/api/downloadDailyData', dailyTableData, {
          responseType: 'blob',
        });

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // Get YYYY-MM-DD format
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Get HH-MM-SS format
        const filename = `DailyTable-${dateStr}-${timeStr}.csv`;

        saveAs(response.data, filename);
      } else {
        const params = { month, day, year };
        const response = await axios.get('http://192.168.101.108:3001/api/downloadData', {
          params,
          responseType: 'blob',
        });

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // Get YYYY-MM-DD format
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Get HH-MM-SS format
        const filename = `SummaryReport-${dateStr}-${timeStr}.csv`;

        saveAs(response.data, filename);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      setSnackbarMessage('Error downloading data');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleClickOpen = (content) => {
      
        setIsDialogOpen(true);
        setShowMainTable(true);
        setShowDailyTable(false);
        setShowSummaryTable(false);
        setShowFilters(false);
    };
    
    const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


const filteredRows = rows.filter(row =>
  row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  row.receipt_no.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleBack = () => {
  setShowReportTable(false);
  setShowDailyTable(false);
  setShowSummaryTable(false);
  setShowMainTable(true); 
  setShowFilters(true);
};


  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
<Box sx={{ mb: 4 }}>

{/* Search & Filters Row */}
    <Box display="flex" alignItems="center" gap={3} sx={{ py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
    {showFilters && (
        <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Records"
          placeholder="Name or Receipt Number"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
              </InputAdornment>
              ),
              sx: { borderRadius: '8px' }
            }}
            />
          
          <Box display="flex" gap={2}>
          <Autocomplete
                    disablePortal
                    id="month-selector"
                    options={months}
                    onChange={handleMonthChange}
                    renderInput={(params) => <TextField {...params} label="Month" variant="outlined" />}
                    sx={{ minWidth: '150px', backgroundColor: '#fff', borderRadius: '8px' }}
                  />
                  <Autocomplete
                    disablePortal
                    id="year-selector"
                    options={years}
                    onChange={handleYearChange}
                    renderInput={(params) => <TextField {...params} label="Year" variant="outlined" />}
                    sx={{ minWidth: '150px', backgroundColor: '#fff', borderRadius: '8px' }}
                  />
          </Box>
        </Box>
        )}
    </Box>

    {/* Action Buttons Row */}
        <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
          <Box display="flex" gap={2} flexGrow={1}>
            <Tooltip title="Add New Entry">
            <AnimatedButton
            variant="contained"
            startIcon={<IoMdAdd size={20} />}
            sx={{
              px: 4,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              textTransform: 'none',
              fontSize: 16
            }}
            onClick={handleClickOpen}
          >
            New Entry
          </AnimatedButton>
            </Tooltip>
    
            <Tooltip title="Generate Daily Report">
            <AnimatedButton
            ref={dailyButtonRef}
            variant="contained"
            color="success"
            startIcon={<IoToday size={18} />}
            sx={{
              px: 4,
              textTransform: 'none',
              fontSize: 16
            }}
            onClick={toggleDailyTable}
          >
            Daily Report
          </AnimatedButton>
            </Tooltip>
          </Box>
    
          <Box display="flex" gap={2}>
          <Tooltip title="Summary Reports">
          <AnimatedButton
            variant="contained"
            startIcon={<MdSummarize size={18} />}
            sx={{
              px: 4,
              textTransform: 'none',
              fontSize: 16
            }}
            onClick={toggleSummaryTable}
          >
            Summary Report
          </AnimatedButton>
          </Tooltip>


          <Tooltip title="Financial Reports">
          <AnimatedButton
            variant="contained"
            color="error"
            startIcon={<BiSolidReport size={18} />}
            sx={{
              px: 4,
              textTransform: 'none',
              fontSize: 16
            }}
            onClick={toggleReportTable}
          >
            Financial Report
          </AnimatedButton>
          </Tooltip>
    
            <Tooltip title="Export Data">
            <AnimatedButton
            variant="contained"
            color="info"
            startIcon={<IoMdDownload size={18} />}
            sx={{
              px: 4,
              textTransform: 'none',
              fontSize: 16
            }}
            onClick={handleDownload}
          >
            Download
          </AnimatedButton>
            </Tooltip>
          </Box>
        </Box>

{/* Summary Cards */}
  <Box display="flex" justifyContent="space-between" gap={3} sx={{ mt: 4 }}>
    {[
      { value: total, text: 'Total Revenue' },
      { value: shareTotal, text: '25% Share Inome' },
      { value: gfTotal, text: 'General Fund' },
      { value: sefTotal, text: 'SEF' }
    ].map(({ value, text }, index) => (
      <Card 
        key={index}
        sx={{
          flex: 1,
          p: 2.5,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(63,81,181,0.15)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
          '&:hover': { transform: 'translateY(-4px)' }
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5 }}>
          {text}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {typeof value === 'number' 
            ? new Intl.NumberFormat('en-PH', { 
                style: 'currency', 
                currency: 'PHP',
                minimumFractionDigits: 2
              }).format(value)
            : value}
        </Typography>
      </Card>
    ))}
  </Box>

</Box>
       

      {showSummaryTable && <SummaryTable setMonth={setMonth} setDay={setDay} setYear={setYear} onBack={handleBack} />}
      {showReportTable && <ReportTable onBack={handleBack} />}
      {showDailyTable && <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />}
      {showMainTable && (
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
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>DATE</StyledTableCell>
                <StyledTableCell>NAME OF TAXPAYER</StyledTableCell>
                <StyledTableCell>RECEIPT NO.</StyledTableCell>
                <StyledTableCell>Current Year</StyledTableCell>
                <StyledTableCell>Penalties</StyledTableCell>
                <StyledTableCell>Discounts</StyledTableCell>
                <StyledTableCell>Immediate Preceding Year</StyledTableCell>
                <StyledTableCell>Penalties</StyledTableCell>
                <StyledTableCell>Prior Years</StyledTableCell>
                <StyledTableCell>Penalties</StyledTableCell>
                <StyledTableCell>TOTAL</StyledTableCell>
                <StyledTableCell>ACTIONS</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="flex-end" alignItems="center" m={1}>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </TableContainer>
      )}
      {/* DIALOG OPENER */}
      {isDialogOpen && (
        <PopupDialog onClose={handleClose}>
          <RealPropertyTaxAbstract onSave={handleSave} onClose={handleClose} />
        </PopupDialog>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}


export default RealPropertyTax;
