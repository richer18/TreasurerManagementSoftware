// Make sure you have all necessary imports installed and adjust the import paths to match your folder structure.

import { keyframes } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card, Dialog,
  DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { saveAs } from 'file-saver'; // npm install file-saver
import React, { useEffect, useState } from 'react';
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import * as XLSX from 'xlsx'; // npm install xlsx

// ---- Adjust these imports to your actual file paths ----
import axios from "axios";
import FloraMyImg from '../../../../assets/images/Flora_My.jpg';
import RicardoImg from '../../../../assets/images/Ricardo_Enopia.jpg';
import RowenaImg from '../../../../assets/images/Rowena_Gaer.jpg';
import AbstractGF from '../../../../components/MD-Components/FillupForm/AbstractGF';
import GeneralFundDialogPopupDAILY from '../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupDailyTable';
import GeneralFundDialogPopupRFEE from '../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupRFEE';
import GeneralFundDialogPopupSUC from '../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupSUC';
import GeneralFundDialogPopupTOTAL from '../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundDialogPopupTOTAL';
import GeneralFundDialogPopupRF from '../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundReportPopupRF';
import GeneralFundDialogPopupTOB from '../../../../components/MD-Components/Popup/components/GeneralFundPopup/GeneralFundReportPopupTOB';
import GeneralFundDialog from '../../../../components/MD-Components/Popup/GeneralFundDialog';
import PopupDialog from '../../../../components/MD-Components/Popup/PopupDialogGF_FORM';
import DailyTable from './TableData/DailyTable';
import ReportTable from './TableData/ReportTable';
// --------------------------------------------------------

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

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Map of cashier names to image paths
const cashierImages = {
  'FLORA MY': FloraMyImg,
  'ROWENA': RowenaImg,
  'RICARDO': RicardoImg,
};

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

const BASE_URL = "http://192.168.101.108:3001";

function GeneralFund() {
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  // Table states

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu & selectedRow states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Totals
  const [allTotal, setAllTotal] = useState(0);
  const [taxOnBusinessTotal, setTaxOnBusinessTotal] = useState(0);
  const [regulatoryFeesTotal, setRegulatoryFeesTotal] = useState(0);
  const [serviceUserChargesTotal, setServiceUserChargesTotal] = useState(0);
  const [receiptsFromEconomicEnterprisesTotal, setReceiptsFromEconomicEnterprisesTotal] = useState(0);

  // Popup states
  // State for Popups
const [openTOTAL, setOpenTOTAL] = useState(false);
const [openTax, setOpenTax] = useState(false);
const [openRf, setOpenRf] = useState(false);
const [openSUC, setOpenSUC] = useState(false);
const [openRFEE, setOpenRFEE] = useState(false);
const [openDailyTable, setOpenDailyTable] = useState(false);


  

  // Show/hide different tables
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [showMainTable, setShowMainTable] = useState(true);
  const [showReportTable, setShowReportTable] = useState(false);
  const [dailyTableData, setDailyTableData] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [rows, setRows] = React.useState([]);
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "info",
    });

    const [loading, setLoading] = useState(true);


  // Fetch main table data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/generalFundDataAll`);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  


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

  // Fetch overall total
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/TotalGeneralFundS`);
        const totalListingsGFTOTAL = parseFloat(response.data[0]?.overall_total || 0);
        setAllTotal(totalListingsGFTOTAL);
      } catch (error) {
        console.error("Error fetching total general fund:", error);
      }
    };
  
    fetchAllData();
  }, []);


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

  // Fetch individual totals
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const endpoints = [
          "TaxOnBusinessTotal",
          "RegulatoryFeesTotal",
          "ServiceUserChargesTotal",
          "ReceiptsFromEconomicEnterprisesTotal",
        ];
  
        const responses = await axios.all(endpoints.map((endpoint) => axios.get(`${BASE_URL}/api/${endpoint}`)));
  
        setTaxOnBusinessTotal(parseFloat(responses[0].data.tax_on_business || 0));
        setRegulatoryFeesTotal(parseFloat(responses[1].data.regulatory_fees || 0));
        setServiceUserChargesTotal(parseFloat(responses[2].data.service_user_charges || 0));
        setReceiptsFromEconomicEnterprisesTotal(parseFloat(responses[3].data.receipts_from_economic_enterprises || 0));
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };
  
    fetchTotals();
  }, []);

  // Search logic
  


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
      <GeneralFundDialog
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

  // Generic “Add” button
  const handleClickOpen = (content) => {
    setDialogContent(content);
    setShowMainTable(true);
    setIsDialogOpen(true);
    setShowDailyTable(false);
  };

  // Close the popup
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // TOTAL POPUP
const handleClickTotal = () => {
  setOpenTOTAL(true);
};
const handleCloseTOTAL = () => {
  setOpenTOTAL(false);
};
const handleClickTax = () => {
  setOpenTax(true);
};
const handleCloseTax = () => {
  setOpenTax(false);
};
const handleClickRF = () => {
  setOpenRf(true);
};
const handleCloseRF = () => {  // Fixed name
  setOpenRf(false);
};
const handleClickSUC = () => {
  setOpenSUC(true);
};
const handleCloseSUC = () => {
  setOpenSUC(false);
};
const handleClickRFEE = () => {
  setOpenRFEE(true);
};
const handleCloseRFEE = () => {
  setOpenRFEE(false);
};

  // Daily table popup
  const handleCloseDailyTable = () => {
    setOpenDailyTable(false);
  };

  // Table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle sub-tables
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
    setShowFilters(false);
  };
  const handleBack = () => {
    setShowReportTable(false);
    setShowDailyTable(false);
    setShowMainTable(true);
    setShowFilters(true);
  };

  // “Download” logic
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
      const fileName = `GeneralFund_Report_${months.find((m) => m.value === month)?.label}_${year}.xlsx`;
      saveAs(blob, fileName);
    };

  const handleEditClick = () => {
    if (!selectedRow) return;
    setDialogContent(
      <AbstractGF
        // Pass the data from the selected row
        data={selectedRow}
        // If you want a custom prop to indicate "edit mode", you can do:
        mode="edit"
      />
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    
    try {
      const response = await fetch(`/api/deleteGF/${selectedId}`, {
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

  if (loading) return <p>Loading data...</p>;

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
              <Button
                variant="contained"
                size="large"
                startIcon={<IoMdAdd size={20} />}
                sx={{
                  px: 4,
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                  textTransform: "none",
                  fontSize: 16,
                }}
                onClick={() => handleClickOpen(<AbstractGF />)}
              >
                New Entry
              </Button>
            </Tooltip>

            <Tooltip title="Generate Daily Report">
              <Button
                variant="contained"
                color="success"
                onClick={toggleDailyTable}
                startIcon={<IoToday size={18} />}
                sx={{
                  px: 4,
                  textTransform: "none",
                  fontSize: 16,
                }}
              >
                Daily Report
              </Button>
            </Tooltip>
          </Box>

          <Box display="flex" gap={2}>
            <Tooltip title="Financial Reports">
              <AnimatedButton
                variant="contained"
                onClick={toggleReportTable}
                color="error"
                startIcon={<BiSolidReport size={18} />}
                sx={{
                  px: 4,
                  textTransform: "none",
                  fontSize: 16,
                }}
              >
                Financial Report
              </AnimatedButton>
            </Tooltip>

            <Tooltip title="Export Data">
              <AnimatedButton
                variant="contained"
                onClick={handleDownload}
                color="info"
                startIcon={<IoMdDownload size={18} />}
                sx={{
                  px: 4,
                  textTransform: "none",
                  fontSize: 16,
                }}
              >
                EXPORT
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
            {
              value: allTotal,
              text: "Total Revenue",
              onClick: handleClickTotal,
            },
            {
              value: taxOnBusinessTotal,
              text: "Tax on Business",
              onClick: handleClickTax,
            },
            {
              value: regulatoryFeesTotal,
              text: "Regulatory Fees",
              onClick: handleClickRF,
            },
            {
              value: receiptsFromEconomicEnterprisesTotal,
              text: "Receipts from Economic Enterprises",
              onClick: handleClickRFEE,
            },
            {
              value: serviceUserChargesTotal,
              text: "Service User Charges",
              onClick: handleClickSUC,
            },
          ].map(({ value, text, onClick }, index) => (
            <Card
              key={index}
              onClick={onClick}
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
                color: "white",
                boxShadow: "0 8px 24px rgba(63,81,181,0.15)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  cursor: "pointer",
                },
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
      {/* Sub-tables */}
      {showDailyTable && (
        <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />
      )}
      {showReportTable && <ReportTable onBack={handleBack} />}
      {/* Main table */}
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
                <StyledTableCell>NAME OF TAXPAYER</StyledTableCell>
                <StyledTableCell>RECEIPT NO.</StyledTableCell>
                <StyledTableCell>CASHIER</StyledTableCell>
                <StyledTableCell>TYPE OF RECEIPT</StyledTableCell>
                <StyledTableCell>TOTAL</StyledTableCell>
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{formatDate(row.date)}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.receipt_no}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <img
                          src={
                            cashierImages[row.cashier] || "default_image_path"
                          }
                          alt={row.cashier}
                          style={{ width: 40, height: 40, borderRadius: "50%" }}
                        />
                        <Box>{row.cashier}</Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{row.type_receipt}</TableCell>
                    <TableCell align="center">{row.total}</TableCell>
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

          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={1}
          >
            <TablePagination
              rowsPerPageOptions={[10, 15,20,30,50,100]}
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
      {/* Popup for "Add" or "View" content */}
      {isDialogOpen && (
        <PopupDialog open={isDialogOpen} onClose={handleClose}>
          {dialogContent}
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
      {/* Totals popups */}
      <GeneralFundDialogPopupTOB open={openTax} onClose={handleCloseTax} />
      <GeneralFundDialogPopupRF open={openRf} onClose={handleCloseRF} />{" "}
      {/* Fixed handler */}
      <GeneralFundDialogPopupSUC open={openSUC} onClose={handleCloseSUC} />
      <GeneralFundDialogPopupRFEE open={openRFEE} onClose={handleCloseRFEE} />
      <GeneralFundDialogPopupTOTAL
        open={openTOTAL}
        onClose={handleCloseTOTAL}
      />
      {/* Daily table popup (if needed) */}
      <GeneralFundDialogPopupDAILY
        open={openDailyTable}
        onClose={handleCloseDailyTable}
      />

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

      
    </Box>
  );
}

export default GeneralFund;
