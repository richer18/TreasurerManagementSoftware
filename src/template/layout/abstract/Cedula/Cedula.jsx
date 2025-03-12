import { keyframes } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button, Card,
  InputAdornment,
  Menu, MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import { BiSolidReport } from 'react-icons/bi';
import { IoMdAdd, IoMdDownload } from 'react-icons/io';
import { IoToday } from 'react-icons/io5';

import Cedulas from '../../../../components/MD-Components/FillupForm/Cedula';
import PopupDialog from '../../../../components/MD-Components/Popup/PopupDialog';
import DailyTable from './TableData/DailyTable';
import ReportTable from './TableData/ReportTable';

import CedulaFundDialog from '../../../../components/MD-Components/Popup/CedulaFundDialog';

// ------------------------
//  Styled components
// ------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
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

// ------------------------
//  Month / Year Options
// ------------------------
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
];

// ------------------------
//  Helper: Format date
// ------------------------
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// ------------------------
//   Main Component
// ------------------------
function Cedula() {
  // 1. Full data from server
  const [data, setData] = useState([]);
  // 2. Filtered data for the table
  const [filteredData, setFilteredData] = useState([]);

  // 3. Search states:
  //    a) what user is typing
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  //    b) what we actually filter on
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Month/year filters
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  // Table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  // Toggle sub-tables
  const [showMainTable, setShowMainTable] = useState(true);
  const [showReportTable, setShowReportTable] = useState(false);
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [dailyTableData, setDailyTableData] = useState([]);


  // Menu & selectedRow states
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [showFilters, setShowFilters] = useState(true);

  // ------------------------
  //  1) Fetch data once
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cedula');
        setData(response.data);
        setFilteredData(response.data); // Initialize with the full dataset
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // ------------------------
  //  2) Filter data on searchQuery & month/year
  // ------------------------
  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let newFiltered = data;

    // (a) Filter by searchQuery
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      newFiltered = newFiltered.filter((row) => {
        const rowName = (row?.NAME ?? '').toLowerCase();
        const rowCtcNo = (row?.['CTC NO'] ?? '').toString().toLowerCase();
        // .includes() = partial substring match
        return rowName.includes(q) || rowCtcNo.includes(q);
      });
    }

    // (b) Filter by month/year
    if (month || year) {
      newFiltered = newFiltered.filter((row) => {
        if (!row.DATE) return false;
        const rowDate = new Date(row.DATE);
        const rowMonth = rowDate.getMonth() + 1;
        const rowYear = rowDate.getFullYear();

        const monthMatches = month ? rowMonth === parseInt(month) : true;
        const yearMatches = year ? rowYear === parseInt(year) : true;
        return monthMatches && yearMatches;
      });
    }

    setFilteredData(newFiltered);
    setPage(0); // reset pagination when filters change
  }, [data, searchQuery, month, year]);

  // ------------------------
  //  3) Table pagination
  // ------------------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // ------------------------
  //  4) Dialog / Form
  // ------------------------
  const handleClickOpen = (content) => {
    setDialogContent(content);
    setIsDialogOpen(true);
  };
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleEditClick = () => {
    if (!selectedRow) return;
  
    setDialogContent(
      <Cedulas
        data={{
          ...selectedRow,
          ctcno: selectedRow.CTCNO, // Use `CTCNO` instead of `CTC_ID`
        }}
        mode="edit"
      />
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  // Menu open
  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  // Menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

   // “View” from the menu
    const handleViewClick = () => {
      if (!selectedRow) return;
      setDialogContent(
        <CedulaFundDialog
          open={true}
          onClose={handleCloseDialog}
          data={selectedRow}
        />
      );
      setIsDialogOpen(true);
      handleMenuClose();
    };

    // Close the “View” dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  // ------------------------
  //  5) Subtable toggles
  // ------------------------
  const toggleReportTable = () => {
    setShowReportTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowFilters(false); 
  };
  const toggleDailyTable = () => {
    setShowDailyTable(true);
    setShowMainTable(false);
    setShowReportTable(false);
    setShowFilters(false); // Hide filters
  };
  
  const handleBack = () => {
    setShowReportTable(false);
    setShowDailyTable(false);
    setShowMainTable(true);
    setShowFilters(true);
  };

  // ------------------------
  //  6) Summations
  // ------------------------
  const totalBasic = '₱' + filteredData
    .reduce((acc, row) => acc + parseFloat(row.BASIC ?? 0), 0)
    .toFixed(2);

  const totalTaxDue = '₱' + filteredData
    .reduce((acc, row) => acc + parseFloat(row.TAX_DUE ?? 0), 0)
    .toFixed(2);

  const totalInterest = '₱' + filteredData
    .reduce((acc, row) => acc + parseFloat(row.INTEREST ?? 0), 0)
    .toFixed(2);

  const totalAmount = '₱' + filteredData
    .reduce((acc, row) => acc + parseFloat(row.TOTALAMOUNTPAID ?? 0), 0)
    .toFixed(2);

  // ------------------------
  //  7) Download logic
  // ------------------------
  const handleDownload = () => {
    if (dailyTableData.length === 0) {
      alert('No data available to download');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(dailyTableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Table Data');
    const file = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([file], { type: 'application/octet-stream' });
    saveAs(blob, 'DailyTableData.xlsx');
  };

  // ------------------------
  //  8) Handler for the Search button
  // ------------------------
  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  // ------------------------
  //  UI Rendering
  // ------------------------
  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
<Box sx={{ mb: 4 }}>
  {/* Toolbar Section */}
  <Box display="flex" flexDirection="column" gap={3}>
    {/* Search & Filters Row */}
    <Box display="flex" alignItems="center" gap={3} sx={{ py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      {showFilters && (
        <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Records"
            placeholder="Name or CTC Number"
            value={pendingSearchQuery}
            onChange={(e) => setPendingSearchQuery(e.target.value)}
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
              options={months}
              sx={{ width: 180 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Month" variant="outlined" />
              )}
              onChange={(e, v) => setMonth(v?.value)}
            />
            
            <Autocomplete
              disablePortal
              options={years}
              sx={{ width: 150 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Year" variant="outlined" />
              )}
              onChange={(e, v) => setYear(v?.value)}
            />
            
            <Button
              variant="contained"
              color="primary"
              sx={{ 
                px: 4,
                height: '56px',
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': { boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }
              }}
              onClick={handleSearchClick}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      )}
    </Box>

    {/* Action Buttons Row */}
    <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
      <Box display="flex" gap={2} flexGrow={1}>
        <Tooltip title="Add New Entry">
          <Button
            variant="contained"
            startIcon={<IoMdAdd size={20} />}
            sx={{
              px: 4,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              textTransform: 'none',
              fontSize: 16
            }}
            onClick={() => handleClickOpen(<Cedulas />)}
          >
            New Entry
          </Button>
        </Tooltip>

        <Tooltip title="Generate Daily Report">
          <Button
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
            Daily Summary
          </Button>
        </Tooltip>
      </Box>

      <Box display="flex" gap={2}>
      <Tooltip title="Financial Report">
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
          <Button
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
            Export
          </Button>
        </Tooltip>
      </Box>
    </Box>
  </Box>

  

  {/* Summary Cards */}
<Box display="flex" justifyContent="space-between" gap={3} sx={{ mt: 4 }}>
  {[
    { value: totalAmount, text: 'Total Revenue' },
    { value: totalBasic, text: 'Basic Income' },
    { value: totalTaxDue, text: 'Tax Liability' },
    { value: totalInterest, text: 'Accrued Interest' }
  ].map(({ value, text }) => (
    <Card
      key={text} // ✅ Use `text` as a unique key
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
          ? `₱ ${value.toLocaleString('en-PH', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          : value}
      </Typography>
    </Card>
  ))}
</Box>

</Box>


      {/* Sub-tables */}
      {showDailyTable && (
        <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} setShowFilters={setShowFilters}/>
      )}
      {showReportTable && (
        <ReportTable onBack={handleBack} setShowFilters={setShowFilters}/>
      )}

      {/* Main Table */}
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
          <Table stickyHeader>
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
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => (
                  <TableRow key={row['CTC NO'] || row.id || idx}>
                    <TableCell align="center">{formatDate(row.DATE)}</TableCell>
                    <TableCell align="center">{row['CTC NO']}</TableCell>
                    <TableCell align="center">{row.LOCAL}</TableCell>
                    <TableCell align="center">{row.NAME}</TableCell>
                    <TableCell align="center">
                      {parseFloat(row.BASIC).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {parseFloat(row.TAX_DUE).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {parseFloat(row.INTEREST).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {parseFloat(row.TOTALAMOUNTPAID).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">{row.CASHIER}</TableCell>
                    <TableCell align="center">
                      <Button
                                            aria-controls="simple-menu"
                                            aria-haspopup="true"
                                            onClick={(event) => handleMenuClick(event, row)}
                                            variant="contained"
                                            color="primary"
                                          >
                                            ACTIONS
                                          </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="flex-end" alignItems="center" m={1}>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </TableContainer>
      )}


       {/* Single menu for ACTIONS */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClick}>View</MenuItem>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={() => { console.log('Delete', selectedRow); handleMenuClose(); }}>Delete</MenuItem>
        <MenuItem onClick={() => { console.log('Download', selectedRow); handleMenuClose(); }}>Download</MenuItem>
      </Menu>

      {/* Dialog */}
      {isDialogOpen && (
        <PopupDialog open={isDialogOpen} onClose={handleClose}>
          {dialogContent}
        </PopupDialog>
      )}
    </Box>
  );
}

export default Cedula;
