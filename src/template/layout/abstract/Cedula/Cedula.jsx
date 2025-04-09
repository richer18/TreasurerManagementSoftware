import { keyframes } from "@emotion/react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  InputAdornment,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,
  Menu,
  MenuItem,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import axios from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";

import Cedulas from "../../../../components/MD-Components/FillupForm/Cedula";
import PopupDialog from "../../../../components/MD-Components/Popup/PopupDialogCedula_FORM";
import DailyTable from "./TableData/DailyTable";
import ReportTable from "./TableData/ReportTable";

import CedulaFundDialog from "../../../../components/MD-Components/Popup/CedulaFundDialog";

import GenerateReport from './TableData/GenerateReport';
// ------------------------
//  Styled components
// ------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  textAlign: "center",
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
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const years = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
];

// ------------------------
//  Helper: Format date
// ------------------------
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const BASE_URL = "http://192.168.101.108:3001"; // Define base URL


// ------------------------
//   Main Component
// ------------------------
function Cedula({ ...props }) {
  // 1. Full data from server
  const [data, setData] = useState([]);
  // 2. Filtered data for the table
  const [filteredData, setFilteredData] = useState([]);

  // 3. Search states:
  //    a) what user is typing
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  //    b) what we actually filter on
  const [searchQuery, setSearchQuery] = useState("");

  // 4. Month/year filters
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [day, setDay] = useState(null);

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [rows, setRows] = React.useState([]);
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const [selectedId, setSelectedId] = useState(null);

      const [reportDialog, setReportDialog] = useState({
              open: false,
              status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
              progress: 0
            });
          
            const ChhandleCloseDialog = () => {
              setReportDialog({ ...reportDialog, open: false });
            };
        
            const handleGenerateReport = () => {
              // Open dialog in loading state
              setReportDialog({
                open: true,
                status: 'loading',
                progress: 0
              });
          
              // Simulate report generation
              const interval = setInterval(() => {
                setReportDialog(prev => {
                  const newProgress = prev.progress + 10;
                  if (newProgress >= 100) {
                    clearInterval(interval);
                    return { ...prev, status: 'success', progress: 100 };
                  }
                  return { ...prev, progress: newProgress };
                });
              }, 300);
            };

  // ------------------------
  //  1) Fetch data once
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/cedula`);
        setData(response.data);
        setFilteredData(response.data); // Initialize with the full dataset
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  // ------------------------
  //  2) Filter by Month , Day, & Year
  // ------------------------
  const getFilteredDataByMonthYear = () => {
    if (!month || !year) return filteredData;
  
    return filteredData.filter((row) => {
      if (!row.DATE) return false;
      const rowDate = new Date(row.DATE);
      
      const monthMatches = rowDate.getMonth() + 1 === Number(month);
      const yearMatches = rowDate.getFullYear() === Number(year);
      const dayMatches = day ? rowDate.getDate() === Number(day) : true;
  
      return monthMatches && yearMatches && dayMatches;
    });
  };

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
        const rowName = (row?.NAME ?? "").toLowerCase();
        const rowCtcNo = (row?.["CTC NO"] ?? "").toString().toLowerCase();
        return rowName.includes(q) || rowCtcNo.includes(q);
      });
    }
  
    // (b) Filter by month, day, and year
    if (month || year || day) {
      newFiltered = newFiltered.filter((row) => {
        if (!row.DATE) return false;
        const rowDate = new Date(row.DATE);
        const rowMonth = rowDate.getMonth() + 1;
        const rowDay = rowDate.getDate();
        const rowYear = rowDate.getFullYear();
  
        const monthMatches = month ? rowMonth === parseInt(month) : true;
        const dayMatches = day ? rowDay === parseInt(day) : true;
        const yearMatches = year ? rowYear === parseInt(year) : true;
  
        return monthMatches && dayMatches && yearMatches;
      });
    }
  
    setFilteredData(newFiltered);
    setPage(0); // reset pagination when filters change
  }, [data, searchQuery, month, day, year]);
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
  const totalBasic =
    "₱" +
    filteredData
      .reduce((acc, row) => acc + parseFloat(row.BASIC ?? 0), 0)
      .toFixed(2);

  const totalTaxDue =
    "₱" +
    filteredData
      .reduce((acc, row) => acc + parseFloat(row.TAX_DUE ?? 0), 0)
      .toFixed(2);

  const totalInterest =
    "₱" +
    filteredData
      .reduce((acc, row) => acc + parseFloat(row.INTEREST ?? 0), 0)
      .toFixed(2);

  const totalAmount =
    "₱" +
    filteredData
      .reduce((acc, row) => acc + parseFloat(row.TOTALAMOUNTPAID ?? 0), 0)
      .toFixed(2);

  // ------------------------
  //  7) Download logic
  // ------------------------
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
    const fileName = `Cedula_Report_${months.find((m) => m.value === month)?.label}_${year}.xlsx`;
    saveAs(blob, fileName);
  };

  // ------------------------
  //  8) Handler for the Search button
  // ------------------------
  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    
    try {
      const response = await fetch(`/api/deleteCedula/${selectedId}`, {
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

  // ------------------------
  //  UI Rendering
  // ------------------------
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
        {/* Toolbar Section */}
        <Box display="flex" flexDirection="column" gap={3}>
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
                  placeholder="Name or CTC Number"
                  value={pendingSearchQuery}
                  onChange={(e) => setPendingSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                    root: {
                      sx: { borderRadius: "8px" },
                    },
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
                  {/* Day Filter */}
                  
                  <Autocomplete
                  disablePortal
                  options={[...Array(31)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))}
                  sx={{ width: 140 }}
                  renderInput={(params) => (
                  <TextField {...params} label="Select Day" variant="outlined" />
                )}
                onChange={(e, v) => setDay(v?.value)}
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
                      "&:hover": {
                        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                      },
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
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                    textTransform: "none",
                    fontSize: 16,
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
                    textTransform: "none",
                    fontSize: 16,
                  }}
                  onClick={toggleDailyTable}
                >
                  Daily Summary
                </Button>
              </Tooltip>

              <Tooltip title="Generate Receipt Report">
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleGenerateReport}
                              startIcon={<IoToday size={18} />}
                              sx={{
                                px: 4,
                                textTransform: "none",
                                fontSize: 16,
                              }}
                            >
                              Check Receipt
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
                    textTransform: "none",
                    fontSize: 16,
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
                    textTransform: "none",
                    fontSize: 16,
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
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          sx={{ mt: 4 }}
        >
          {[
            { value: totalAmount, text: "Total Revenue" },
            { value: totalBasic, text: "Basic Income" },
            { value: totalTaxDue, text: "Tax Liability" },
            { value: totalInterest, text: "Accrued Interest" },
          ].map(({ value, text }) => (
            <Card
              key={text} // ✅ Use `text` as a unique key
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
                  ? `₱ ${value.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : value}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Sub-tables */}
      {showDailyTable && (
        <DailyTable
          onDataFiltered={setDailyTableData}
          onBack={handleBack}
          setShowFilters={setShowFilters}
        />
      )}
      {showReportTable && (
        <ReportTable onBack={handleBack} setShowFilters={setShowFilters} />
      )}

      {/* Main Table */}
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
                  <TableRow key={row?.["CTC NO"] || row?.id || idx}>
                    <TableCell align="center">{formatDate(row.DATE)}</TableCell>
                    <TableCell align="center">{row["CTC NO"]}</TableCell>
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

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={1}
          >
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
        <MenuItem onClick={(e) => {e.stopPropagation(); setSelectedId(rows.id);setOpenDeleteDialog(true);}}>
        Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Download", selectedRow);
            handleMenuClose();
          }}
        >
          Download
        </MenuItem>
      </Menu>

      {/* Dialog */}
      {isDialogOpen && (
        <PopupDialog open={isDialogOpen} onClose={handleClose}>
          {dialogContent}
        </PopupDialog>
      )}

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

      <Box {...props}>
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

      <GenerateReport 
                    open={reportDialog.open}
                    onClose={ChhandleCloseDialog}
                    status={reportDialog.status}
                    progress={reportDialog.progress}
                  />
    </Box>
  );
}

export default Cedula;
