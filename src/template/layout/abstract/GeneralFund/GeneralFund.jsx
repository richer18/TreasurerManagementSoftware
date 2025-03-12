// Make sure you have all necessary imports installed and adjust the import paths to match your folder structure.

import { keyframes } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Typography,
  InputAdornment,
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
  TextField,
  Tooltip,Card
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { saveAs } from 'file-saver'; // npm install file-saver
import React, { useEffect, useState } from 'react';
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import * as XLSX from 'xlsx'; // npm install xlsx
// import AbstractGF from '../../../../components/MD-Components/FillupForm/AbstractGF';

// ---- Adjust these imports to your actual file paths ----
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
import PopupDialog from '../../../../components/MD-Components/Popup/PopupDialog';
import DailyTable from './TableData/DailyTable';
// import ListingBoxTotalGF from './TableData/ListingBox_Total';
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

function GeneralFund() {
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  // Table states
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Fetch main table data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch('http://192.168.101.108:3001/api/generalFundDataAll');
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
  }, []);

  // Fetch overall total
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const listingsResponse = await fetch('http://192.168.101.108:3001/api/TotalGeneralFundS');
        if (!listingsResponse.ok) throw new Error('Network response was not ok total');
        const listingsData = await listingsResponse.json();
        const totalListingsGFTOTAL = parseFloat(listingsData[0]?.overall_total || 0);
        setAllTotal(totalListingsGFTOTAL);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAllData();
  }, []);

  // Fetch individual totals
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const fetchTotal = async (endpoint) => {
          const response = await fetch(`http://192.168.101.108:3001/api/${endpoint}`);
          if (!response.ok) throw new Error(`Network response was not ok ${endpoint}`);
          return await response.json();
        };

        const [
          taxOnBusinessData,
          regulatoryFeesData,
          serviceUserChargesData,
          receiptsFromEconomicEnterprisesData
        ] = await Promise.all([
          fetchTotal('TaxOnBusinessTotal'),
          fetchTotal('RegulatoryFeesTotal'),
          fetchTotal('ServiceUserChargesTotal'),
          fetchTotal('ReceiptsFromEconomicEnterprisesTotal')
        ]);

        setTaxOnBusinessTotal(parseFloat(taxOnBusinessData.tax_on_business || 0));
        setRegulatoryFeesTotal(parseFloat(regulatoryFeesData.regulatory_fees || 0));
        setServiceUserChargesTotal(parseFloat(serviceUserChargesData.service_user_charges || 0));
        setReceiptsFromEconomicEnterprisesTotal(
          parseFloat(receiptsFromEconomicEnterprisesData.receipts_from_economic_enterprises || 0)
        );
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };
    fetchTotals();
  }, []);

  // Search logic
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredData = rows.filter((item) =>
    (item.receipt_no || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  // Render
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
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                textTransform: 'none',
                fontSize: 16
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
                textTransform: 'none',
                fontSize: 16
              }}
            >
              DAILY REPORT
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
              textTransform: 'none',
              fontSize: 16
            }}
          >
            SUMMARY REPORT
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
                textTransform: 'none',
                fontSize: 16
              }}
            >
              DOWNLOAD
            </AnimatedButton>
            </Tooltip>
          </Box>
        </Box>

       {/* Summary Cards */}
       <Box display="flex" justifyContent="space-between" gap={3} sx={{ mt: 4 }}>
  {[
    { value: allTotal, text: 'Total Revenue', onClick: handleClickTotal },
    { value: taxOnBusinessTotal, text: 'Tax on Business', onClick: handleClickTax },
    { value: regulatoryFeesTotal, text: 'Regulatory Fees', onClick: handleClickRF },
    { value: receiptsFromEconomicEnterprisesTotal, text: 'Receipts from Economic Enterprises', onClick: handleClickRFEE },
    { value: serviceUserChargesTotal, text: 'Service User Charges', onClick: handleClickSUC }
  ].map(({ value, text, onClick }, index) => (
    <Card 
      key={index}
      onClick={onClick}
      sx={{
        flex: 1,
        p: 2.5,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)',
        color: 'white',
        boxShadow: '0 8px 24px rgba(63,81,181,0.15)',
        transition: 'transform 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)',
          cursor: 'pointer'
        }
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

      

      {/* Sub-tables */}
      {showDailyTable && <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />}
      {showReportTable && <ReportTable onBack={handleBack} />}

      {/* Main table */}
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
                <StyledTableCell>NAME OF TAXPAYER</StyledTableCell>
                <StyledTableCell>RECEIPT NO.</StyledTableCell>
                <StyledTableCell>CASHIER</StyledTableCell>
                <StyledTableCell>TYPE OF RECEIPT</StyledTableCell>
                <StyledTableCell>TOTAL</StyledTableCell>
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{formatDate(row.date)}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.receipt_no}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <img
                        src={cashierImages[row.cashier] || 'default_image_path'}
                        alt={row.cashier}
                        style={{ width: 40, height: 40, borderRadius: '50%' }}
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

      {/* Popup for "Add" or "View" content */}
      {isDialogOpen && (
        <PopupDialog open={isDialogOpen} onClose={handleClose}>
          {dialogContent}
        </PopupDialog>
      )}

      {/* Totals popups */}
      <GeneralFundDialogPopupTOB open={openTax} onClose={handleCloseTax} />
      <GeneralFundDialogPopupRF open={openRf} onClose={handleCloseRF} />  {/* Fixed handler */}
      <GeneralFundDialogPopupSUC open={openSUC} onClose={handleCloseSUC} />
      <GeneralFundDialogPopupRFEE open={openRFEE} onClose={handleCloseRFEE} />
      <GeneralFundDialogPopupTOTAL open={openTOTAL} onClose={handleCloseTOTAL} />

      {/* Daily table popup (if needed) */}
      <GeneralFundDialogPopupDAILY open={openDailyTable} onClose={handleCloseDailyTable} />
    </Box>
  );
}

export default GeneralFund;
