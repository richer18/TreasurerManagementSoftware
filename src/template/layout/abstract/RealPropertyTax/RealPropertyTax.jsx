import { keyframes } from '@emotion/react';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Card, TextField, Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
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
import { format, parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import { MdSummarize } from "react-icons/md";
import * as XLSX from "xlsx";
import RealPropertyTaxAbstract from '../../../../components/MD-Components/FillupForm/AbstractRPT';
import { default as PopupDialog, default as PopupDialogView } from '../../../../components/MD-Components/Popup/PopupDialogRPT_FORM';
import DailyTable from './TableData/DailyTable';
import ReportTable from './TableData/ReportTable';
import SummaryTable from './TableData/Summary';


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

const baseUrl = "http://192.168.101.108:3001/api";

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

function Row({ row }) {
  // 🟢 State Management
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const [selectedRowView, setSelectedRowView] = React.useState(null);
  // const [openDialog, setOpenDialog] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const [rows, setRows] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialogView, setOpenDialogView] = React.useState(false);

  // 🟢 Menu Handlers
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);



  // 🟢 View Dialog Handlers
  const handleView = (row) => {
    setSelectedRowView(row);
    setOpenDialogView(true);
    handleMenuClose();
  };
  

  const handleClose = () => {
    setOpenDialogView(false);
    setSelectedRowView(null);
  };

  // 🟢 Edit Dialog Handlers
  const handleEdit = (row) => {
    // ✅ Convert ISO date to yyyy-MM-dd format
    const formattedDate = format(parseISO(row.date), 'yyyy-MM-dd');
  
    // ✅ Map snake_case keys to camelCase keys
    const formattedRow = {
      id: row.id,
      date: formattedDate,
      barangay: row.barangay,
      cashier: row.cashier,
      currentYear: row.current_year,
      currentPenalties: row.current_penalties,
      currentDiscounts: row.current_discounts,
      prevYear: row.prev_year,
      prevPenalties: row.prev_penalties,
      priorYears: row.prior_years,
      priorPenalties: row.prior_penalties,
      total: row.total,
      share: row.share,
      additionalCurrentYear: row.additional_current_year,
      additionalCurrentPenalties: row.additional_penalties,
      additionalCurrentDiscounts: row.additional_discounts,
      additionalPrevYear: row.additional_prev_year,
      additionalPrevPenalties: row.additional_prev_penalties,
      additionalPriorYears: row.additional_prior_years,
      additionalPriorPenalties: row.additional_prior_penalties,
      additionalTotal: row.additional_total,
      gfTotal: row.gf_total,
      name: row.name,
      receipt: row.receipt_no, // ✅ Match `receipt_no` to `receipt`
      status: row.status,
      comments: row.comments,
    };
  
    console.log("Formatted Row for Edit:", formattedRow); // Debugging
  
    setSelectedRow(formattedRow);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  const handleUpdate = (updatedData) => {
    console.log("Updated Data:", updatedData);
    setEditDialogOpen(false);
  };

  // 🟢 Delete Function
  // Delete handler
  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    
    try {
      const response = await fetch(`/api/deleteRPT/${selectedId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert("Record deleted successfully");
        setRows(prev => prev.filter(row => row.id !== selectedId));
      } else {
        alert(result.error || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedId(null);
    }
  };


  return (
    <>
      {/* 🟢 Table Row */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
            onClick={handleMenuClick}
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
            <MenuItem onClick={() => handleView(row)}>View</MenuItem>
            <MenuItem onClick={() => handleEdit(row)}>Edit</MenuItem>
            <MenuItem 
        onClick={(e) => {
          e.stopPropagation(); // Prevent event propagation
          setSelectedId(rows.id);
          setOpenDeleteDialog(true);
        }}
      >
        Delete
      </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>

      {/* 🟢 View Dialog */}
      <Dialog open={openDialogView} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle>Receipt Details</DialogTitle>
        <DialogContent>
          {selectedRowView && (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                maxHeight: "70vh",
                overflowY: "auto",
                width: "100%",
                "& .MuiTableCell-root": { py: 2, px: 3 },
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    {[
                      "Date", "Name of Taxpayer", "Receipt No.", "Current Year",
                      "Penalties", "Discounts", "Immediate Preceding Year", "Penalties",
                      "Prior Years", "Penalties", "Total", "Barangay", "25% Share",
                      "Additional Current Year", "Additional Penalties",
                      "Additional Discounts", "Additional Prev Year",
                      "Additional Prev Penalties", "Additional Prior Years",
                      "Additional Prior Penalties", "Additional Total",
                      "GF and SEF", "Status", "Cashier"
                    ].map((header) => (
                      <StyledTableCell key={header} align="center" sx={{ fontWeight: "bold" }}>
                        {header}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">{formatDate(selectedRowView.date)}</TableCell>
                    <TableCell align="center">{selectedRowView.name}</TableCell>
                    <TableCell align="center">{selectedRowView.receipt_no}</TableCell>
                    <TableCell align="center">{selectedRowView.current_year}</TableCell>
                    <TableCell align="center">{selectedRowView.current_penalties}</TableCell>
                    <TableCell align="center">{selectedRowView.current_discounts}</TableCell>
                    <TableCell align="center">{selectedRowView.prev_year}</TableCell>
                    <TableCell align="center">{selectedRowView.prev_penalties}</TableCell>
                    <TableCell align="center">{selectedRowView.prior_years}</TableCell>
                    <TableCell align="center">{selectedRowView.prior_penalties}</TableCell>
                    <TableCell align="center">{selectedRowView.total}</TableCell>
                    <TableCell align="center">{selectedRowView.barangay}</TableCell>
                    <TableCell align="center">{selectedRowView.share}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_current_year}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_penalties}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_discounts}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_prev_year}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_prev_penalties}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_prior_years}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_prior_penalties}</TableCell>
                    <TableCell align="center">{selectedRowView.additional_total}</TableCell>
                    <TableCell align="center">{selectedRowView.gf_total}</TableCell>
                    <TableCell align="center">{selectedRowView.status}</TableCell>
                    <TableCell align="center">{selectedRowView.cashier}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    

{/* Confirmation Dialog */}
<Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

        {/* 🟢 Edit Dialog (Only Render When selectedRow Exists) */}
{/* 🟢 Edit Dialog */}
{selectedRow && (
  <PopupDialogView open={editDialogOpen} onClose={handleCloseEdit} title="Edit Record">
    <RealPropertyTaxAbstract data={selectedRow} onSave={handleUpdate} onCancel={handleCloseEdit} />
  </PopupDialogView>
)}
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
  const [total, setTotal] = useState(0);
  const [gfTotal, setGfTotal] = useState(0);
  const [sefTotal, setSEFTotal] = useState(0);
  const [shareTotal, setShareTotal] = useState(0);
  const dailyButtonRef = useRef(null);
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [showMainTable, setShowMainTable] = useState(true);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [dailyTableData, setDailyTableData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReportTable, setShowReportTable] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");


  const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
      });



  const [formData, setFormData] = useState(initialFormData);


useEffect(() => {
  const fetchListings = async () => {
    try {
        const gfResponse = await fetch(`${baseUrl}/TotalGeneralFund`);
        if (!gfResponse.ok) throw new Error('Network response was not ok');
        const gfData = await gfResponse.json();
        const totalGF = gfData.reduce((sum, entry) => sum + parseFloat(entry.total || 0), 0);
        setGfTotal(totalGF);

        const sefResponse = await fetch(`${baseUrl}/TotalSEFFund`);
        if (!sefResponse.ok) throw new Error('Network response was not ok');
        const sefData = await sefResponse.json();
        const totalSEF = sefData.reduce((sum, entry) => sum + parseFloat(entry.additional_total || 0), 0);
        setSEFTotal(totalSEF);

        const sharesResponse = await fetch(`${baseUrl}/TotalShareFund`);
        if (!sharesResponse.ok) throw new Error('Network response was not ok share');
        const sharesData = await sharesResponse.json();
        const totalShares = sharesData.reduce((sum, entry) => sum + parseFloat(entry.share || 0), 0);
        setShareTotal(totalShares);

        const listingsResponse = await fetch(`${baseUrl}/TotalFund`);
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
    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/allData`);
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData();
}, [showDailyTable, showSummaryTable, showMainTable]);

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
            const rowName = (row?.name ?? "").toLowerCase();
            const rowCtcNo = (row?.receipt_no ?? "").toString().toLowerCase();
            // .includes() = partial substring match
            return rowName.includes(q) || rowCtcNo.includes(q);
          });
        }
    
        // (b) Filter by month/year
        if (month || year) {
          newFiltered = newFiltered.filter((row) => {
            if (!row.date) return false;
            const rowDate = new Date(row.date);
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
  
  const getFilteredDataByMonthYear = () => {
    if (!month || !year) return filteredData;
    
    return filteredData.filter((row) => {
      if (!row.date) return false;
      const rowDate = new Date(row.date);
      return (
        rowDate.getMonth() + 1 === Number(month) &&
        rowDate.getFullYear() === Number(year)
      );
    });
  };

  


  const handleDownload = () => {
        if (!month || !year) {
          setSnackbar({
            open: true,
            message: "Please select both month and year before downloading.",
            severity: "warning",
          });
          return;
        }
    
        const filteredExportData = getFilteredDataByMonthYear();
    
        if (filteredExportData.length === 0) {
          setSnackbar({
            open: true,
            message:
              "No data available to download for the selected month and year.",
            severity: "info",
          });
          return;
        }
    
        // Convert date to Philippine Time and human-readable format
        const formattedData = filteredExportData.map((item) => {
          return {
            ...item,
            DATE: new Date(item.DATE).toLocaleString("en-US", {
              timeZone: "Asia/Manila", // Set timezone to PHT
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
          };
        });
    
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    
        const file = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([file], { type: "application/octet-stream" });
        const fileName = `RealPropertyTax_Report_${months.find((m) => m.value === month)?.label}_${year}.xlsx`;
        saveAs(blob, fileName);
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



const handleBack = () => {
  setShowReportTable(false);
  setShowDailyTable(false);
  setShowSummaryTable(false);
  setShowMainTable(true); 
  setShowFilters(true);
};

const handleSearchClick = () => {
  // Move whatever is typed in pendingSearchQuery into searchQuery
  // This triggers the filter in the useEffect
  setSearchQuery(pendingSearchQuery);
};


  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Search & Filters Row */}
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          sx={{ py: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          {showFilters && (
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Records"
                placeholder="Name or Receipt Number"
                value={pendingSearchQuery}
                onChange={(e) => setPendingSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "8px" },
                }}
              />
              <Box display="flex" gap={2}>
                <Autocomplete
                  disablePortal
                  options={months}
                  sx={{ width: 180 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Month"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setMonth(v?.value)}
                />

                <Autocomplete
                  disablePortal
                  options={years}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Year"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setYear(v?.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 4,
                    height: "56px",
                    borderRadius: "8px",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)" },
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
              <AnimatedButton
                variant="contained"
                startIcon={<IoMdAdd size={20} />}
                sx={{
                  px: 4,
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                  textTransform: "none",
                  fontSize: 16,
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
                  textTransform: "none",
                  fontSize: 16,
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
                  textTransform: "none",
                  fontSize: 16,
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
                  textTransform: "none",
                  fontSize: 16,
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
                  textTransform: "none",
                  fontSize: 16,
                }}
                onClick={handleDownload}
              >
                Download
              </AnimatedButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          sx={{ mt: 4 }}
        >
          {[
            { value: total, text: "Total Revenue" },
            { value: shareTotal, text: "25% Share Income" },
            { value: gfTotal, text: "General Fund" },
            { value: sefTotal, text: "SEF" },
          ].map(({ value, text }) => (
            <Card
              key={text}
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
                color: "white",
                boxShadow: "0 8px 24px rgba(63,81,181,0.15)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5 }}>
                {text}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {typeof value === "number"
                  ? new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      minimumFractionDigits: 2,
                    }).format(value)
                  : value}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      {showSummaryTable && (
        <SummaryTable
          setMonth={setMonth}
          setYear={setYear}
          onBack={handleBack}
        />
      )}
      {showReportTable && <ReportTable onBack={handleBack} />}
      {showDailyTable && (
        <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />
      )}
      {showMainTable && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            "& .MuiTableCell-root": {
              py: 2,
            },
          }}
        >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
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
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.id} row={row} />
                ))}
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={1}
          >
            <TablePagination
              rowsPerPageOptions={[10,15,20,50,100]}
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
      {/* DIALOG OPENER */}
      {isDialogOpen && (
        <PopupDialog onClose={handleClose}>
          <RealPropertyTaxAbstract onSave={handleSave} onClose={handleClose} />
        </PopupDialog>
      )}

      

      <Box>
        {/*Snackbar Component (with prop fixes)*/}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}


export default RealPropertyTax;