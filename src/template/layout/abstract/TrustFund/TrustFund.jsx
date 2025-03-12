import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Typography, InputAdornment, Menu, MenuItem, TextField, Tooltip, Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import FloraMyImg from '../../../../assets/images/Flora_My.jpg';
import RicardoImg from '../../../../assets/images/Ricardo_Enopia.jpg';
import RowenaImg from '../../../../assets/images/Rowena_Gaer.jpg';
import TrustFunds from '../../../../components/MD-Components/FillupForm/AbstractTF';
import PopupDialog from '../../../../components/MD-Components/Popup/PopupDialog';
import TrustFundDialog from '../../../../components/MD-Components/Popup/TrustFundDialog';
import ReportTable from './TableData/components/ReportTable';
import { BiSolidReport } from "react-icons/bi";
import { keyframes } from '@emotion/react';



import TrustFundDialogPopupBPF from '../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupBPF';
import TrustFundDialogPopupDF from '../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupDF';
import TrustFundDialogPopupEPF from '../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupEPF';
import TrustFundDialogPopupLDF from '../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupLDF';
import TrustFundDialogPopupTOTAL from '../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupTOTAL';
import TrustFundDialogPopupZF from '../../../../components/MD-Components/Popup/components/TrustFundPopup/TrustFundDialogPopupZF';

import DailyTable from './TableData/DailyTable';


// Custom styled table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',  // Ensures all headers are centered
}));

// Function to format date
const formatDate = (dateString) => {
  const DATE = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return DATE.toLocaleDateString('en-US', options);
};

// Map of cashier names to image paths
const cashierImages = {
  'FLORA MY': FloraMyImg,
  'ROWENA': RowenaImg,
  'RICARDO': RicardoImg,
};

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


function TrustFund() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [allTotal, setAllTotal] = useState(0);

    const [openBPF, setOpenBPF] = useState(false);
    const [openDF, setOpenDF] = useState(false);
    const [openEPF, setOpenEPF] = useState(false);
    const [openZF, setOpenZF] = useState(false);
    const [openLDF, setOpenLDF] = useState(false);
    const [openTOTAL, setOpenTOTAL] = useState(false);


    const [buildingPermitFee, setBuildingPermitFee] = useState(0);
    const [electricalFee, setElectricalFee] = useState(0);
    const [zoningFee, setZoningFee] = useState(0);
    const [livestockDevFund, setLivestockDevFund] = useState(0);
    const [divingFee, setDivingFee] = useState(0);

    const [showMainTable, setShowMainTable] = useState(true);
    const [showDailyTable, setShowDailyTable] = useState(false);
  const [dailyTableData, setDailyTableData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);

  const [showReportTable, setShowReportTable] = useState(false);
  const [showFilters, setShowFilters] = useState(true);


useEffect(() => {
  const fetchTotals = async () => {
    try {
      const fetchTotal = async (endpoint) => {
        const response = await fetch(`http://192.168.101.108:3001/api/${endpoint}`);
        if (!response.ok) throw new Error(`Network response was not ok ${endpoint}`);
        const data = await response.json();
        return data;
      };

      const [buildingPermitFeeData, electricalFeeData, zoningFeeData, livestockDevFundData, divingFeeData] = await Promise.all([
        fetchTotal('BuildingPermitFeeTotal'),
        fetchTotal('ElectricalFeeTotal'),
        fetchTotal('ZoningFeeTotal'),
        fetchTotal('LivestockDevFundTotal'),
        fetchTotal('DivingFeeTotal'),
      ]);

      setBuildingPermitFee(parseFloat(buildingPermitFeeData.building_permit_fee_total || 0));
      setElectricalFee(parseFloat(electricalFeeData.electrical_fee_total || 0));
      setZoningFee(parseFloat(zoningFeeData.zoning_fee_total || 0));
      setLivestockDevFund(parseFloat(livestockDevFundData.livestock_dev_fund_total || 0));
      setDivingFee(parseFloat(divingFeeData.diving_fee_total || 0));
      
    } catch (error) {
      console.error('Error fetching totals:', error);
    }
  };

  fetchTotals();
}, []);


const handleEditClick = () => {
    if (!selectedRow) return;
    setDialogContent(
      <TrustFunds
        // Pass the data from the selected row
        data={selectedRow}
        // If you want a custom prop to indicate "edit mode", you can do:
        mode="edit"
      />
    );
    setIsDialogOpen(true);
    handleMenuClose();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch('http://192.168.101.108:3001/api/table-trust-fund-all');
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

  useEffect(() => {
    const fetchAllData = async () => {
        try {
            const response = await fetch('http://192.168.101.108:3001/api/trust-fund-total');
            if (!response.ok) throw new Error('Network response was not ok total');
            const data = await response.json();
            if (data.length > 0) {
                const total = parseFloat(data[0].overall_total);
                setAllTotal(total);
            } else {
                console.log('No data received');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchAllData();
}, []);


const filteredData = rows.filter((item) =>
  (item.NAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.RECEIPT_NO || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClickOpen = (content) => {
        setDialogContent(content);
        setIsDialogOpen(true);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

   const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Close the “View” dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };


  const handleViewClick = () => {
    if (!selectedRow) return;

    setDialogContent(
        <TrustFundDialog
            open={true}
            onClose={handleCloseDialog}
            data={selectedRow || {}} // Fallback to an empty object
        />
    );
    setIsDialogOpen(true);
    handleMenuClose();
};

const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleCloseBPF = () => {
    setOpenBPF(false);
  };

  const handleCloseDF = () => {
    setOpenDF(false);
  };

  const handleCloseEPF = () => {
    setOpenEPF(false);
  };

  const handleCloseZF = () => {
    setOpenZF(false);
  };

  const handleCloseLDF = () => {
    setOpenLDF(false);
  };

  const handleCloseTOTAL = () => {
    setOpenTOTAL(false);
  };


const handleClickBPF = () => {
  setOpenBPF(true);
};

const handleClickDF = () => {
  setOpenDF(true);
};

const handleClickEPF = () => {
  setOpenEPF(true);
};

const handleClickZF = () => {
  setOpenZF(true);
};

const handleClickLDF = () => {
  setOpenLDF(true);
};

const handleClickTOTAL = () => {
  setOpenTOTAL(true);
};

const handleBack = () => {
  setShowReportTable(false);
  setShowDailyTable(false);
  setShowMainTable(true);
  setShowFilters(true); 
};

const toggleDailyTable = () => {
  setShowDailyTable(true);
  setShowMainTable(false);
  setShowReportTable(false);
  setShowFilters(false); 
 
};

// Toggle sub-tables
const toggleReportTable = () => {
  setShowReportTable(true);
  setShowMainTable(false);
  setShowDailyTable(false);
  setShowFilters(false); 
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
                  sx={{
                    px: 4,
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                    textTransform: 'none',
                    fontSize: 16
                  }}
                  onClick={() => handleClickOpen(<TrustFunds />)}
                >
                  <IoMdAdd style={{ marginRight: 8 }} />
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
                 
                  Daily Summary
                </Button>
                </Tooltip>
              </Box>
        
              <Box display="flex" gap={2}>
              <Tooltip title="Financial Report">
              <AnimatedButton
                variant="contained"
                color="error"
                onClick={toggleReportTable}
                startIcon={<BiSolidReport size={18} />}
                sx={{
                  px: 4,
                  textTransform: 'none',
                  fontSize: 16
                }}
              >
                Financial Report
              </AnimatedButton>
              </Tooltip>
        
                <Tooltip title="Export Data">
                <AnimatedButton
                  variant="contained"
                  size="large"
                  color="info"
                  // onClick={handleDownload}
                  startIcon={<IoMdDownload size={18} />}
                  sx={{
                    px: 4,
                    textTransform: 'none',
                    fontSize: 16
                  }}
                >
                  Export
                </AnimatedButton>
                </Tooltip>
              </Box>
            </Box>

             {/* Summary Cards */}
                     <Box display="flex" justifyContent="space-between" gap={3} sx={{ mt: 4 }}>
                     {[
                { value: allTotal, text: 'Total', onClick: handleClickTOTAL },
                { value: buildingPermitFee, text: 'Building Permit Fee', onClick: handleClickBPF },
                { value: electricalFee, text: 'Electrical Fee', onClick: handleClickEPF },
                { value: zoningFee, text: 'Zoning Fee', onClick: handleClickZF },
                { value: livestockDevFund, text: 'Livestock Dev Fund', onClick: handleClickLDF },
                { value: divingFee, text: 'Diving Fee', onClick: handleClickDF }
              ].map(({ value, text, onClick }, index) => ( // Destructure to avoid passing extra props
                <Card 
                key={index}
                onClick={onClick} // Ensure this is included
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



            {showDailyTable && <DailyTable onDataFiltered={setDailyTableData}  onBack={handleBack}/>}
            {showReportTable && <ReportTable onBack={handleBack} />}

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
        <StyledTableCell>Date</StyledTableCell>
        <StyledTableCell>Receipt No.</StyledTableCell>
        <StyledTableCell>Name of Taxpayer</StyledTableCell>
        <StyledTableCell>Cashier</StyledTableCell>
        <StyledTableCell>Type of Receipt</StyledTableCell>
        <StyledTableCell>Total</StyledTableCell>
        <StyledTableCell>Action</StyledTableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.id || row.RECEIPT_NO} hover>
          <TableCell align="center">{formatDate(row.DATE)}</TableCell>
          <TableCell align="center">{row.RECEIPT_NO}</TableCell>
          <TableCell align="center">{row.NAME}</TableCell>
          <TableCell align="center">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <img
                src={cashierImages[row.CASHIER] || 'default_image_path'}
                alt={row.CASHIER}
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
              <Box>{row.CASHIER}</Box>
            </Box>
          </TableCell>
          <TableCell align="center">{row.TYPE_OF_RECEIPT}</TableCell>
          <TableCell align="center">{row.TOTAL}</TableCell>
          <TableCell align="center">
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event) => handleMenuClick(event, row)}
              variant="contained"
              color="primary"
              size="small"
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
              <MenuItem onClick={handleViewClick}>View</MenuItem>
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={() => console.log('Delete')}>Delete</MenuItem>
            </Menu>
          </TableCell>
        </TableRow>
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

            {isDialogOpen && (
        <PopupDialog open={isDialogOpen} onClose={handleClose}>
          {dialogContent}
        </PopupDialog>
      )}



      <TrustFundDialogPopupBPF open={openBPF} onClose={handleCloseBPF} />
      <TrustFundDialogPopupDF open={openDF} onClose={handleCloseDF} />
      <TrustFundDialogPopupEPF open={openEPF} onClose={handleCloseEPF} />
      <TrustFundDialogPopupZF open={openZF} onClose={handleCloseZF} />
      <TrustFundDialogPopupLDF open={openLDF} onClose={handleCloseLDF} />
      <TrustFundDialogPopupTOTAL open={openTOTAL} onClose={handleCloseTOTAL} />


        </Box>
    );
}

export default TrustFund;
