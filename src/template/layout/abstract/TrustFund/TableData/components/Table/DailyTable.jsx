
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import {
  Box,
  Button, Card,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Menu, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.1)', // Row background with opacity
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Hover effect with opacity
    cursor: 'pointer',
  },
}));

const CenteredTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));

// Function to format date
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

const BASE_URL = "http://192.168.101.108:3001";

const DailyTablev2 = ({ data, onClose }) => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentRow, setCurrentRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchFrom, setSearchFrom] = useState(""); 
  const [searchTo, setSearchTo] = useState("");
  const [openCommentDialogs, setOpenCommentDialogs] = useState(false);
  const [currentComment, setCurrentComment] = useState('');


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

   const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentClick = () => {
    setCurrentComment(currentRow.comments || '');
    setOpenCommentDialogs(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    console.log("EDIT THIS");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row); // Set the current row correctly
  };

  const handleSaveComment = async () => {
    if (!currentRow) {
        alert("No row selected!");
        return;
    }

    try {
        // ✅ Convert to UTC before saving to prevent timezone shift
        const formatDate = format(new Date(currentRow.DATE), "yyyy-MM-dd");

        // ✅ Get the current timestamp in UTC format
        const dateComment = new Date().toISOString();

        // ✅ Replace this with the actual logged-in user
        const user = "current_user"; 

        // 🔹 Step 1: Update the comment in `real_property_tax_data`
        await axios.post(`${BASE_URL}/api/updateTFComment`, {
          
          RECEIPT_NO: currentRow.RECEIPT_NO,
          COMMENTS: currentComment,
        });

        // 🔹 Step 2: Insert comment into `rpt_comment`
        await axios.post(`${BASE_URL}/api/insertTFComment`, {
            date: formatDate, // Ensuring proper UTC date
            receipt_no: currentRow.RECEIPT_NO,
            date_comment: dateComment, // UTC timestamp
            name_client: currentRow.NAME,
            description: currentComment,
            user: user,
        });

        console.log("Inserting comment:", {
          date: formatDate,
          receipt_no: currentRow.RECEIPT_NO,
          date_comment: dateComment,
          name_client: currentRow.NAME,
          description: currentComment,
          user: user,
      });

        alert("Comment saved successfully!");
        handleCommentClose();
    } catch (error) {
        console.error("Error saving comment:", error);
        alert("Failed to save comment");
    }
};

 // Filter the data based on the search term
 const filteredData = useMemo(() => {
  return data.filter((entry) => {
    const receiptNo = parseInt(entry.RECEIPT_NO, 10);
    const from = searchFrom ? parseInt(searchFrom, 10) : null;
    const to = searchTo ? parseInt(searchTo, 10) : null;

    if (from !== null && to !== null) {
      return receiptNo >= from && receiptNo <= to; // **Range Match**
    } else if (from !== null) {
      return receiptNo === from; // **Exact Match for 'From'**
    } else if (to !== null) {
      return receiptNo === to; // **Exact Match for 'To'**
    }

    return true; // If both fields are empty, return all
  });
}, [data, searchFrom, searchTo]);


const handleCommentClose = () => {
  setOpenCommentDialogs(false);
};


  const handleDownload = () => {
   
  };

  const handlePrint = () => {
    window.print();
  };


  const totalCollectionByCashier = useMemo(() => {
    const totals = {
      "RICARDO": 0,
      "FLORA MY": 0,
      "IRIS": 0,
      "AGNES": 0,
    };
  
    console.log("Filtered Data:", filteredData); // ✅ Debugging: Check if data exists
  
    filteredData.forEach((row) => {
      const cashierName = row.CASHIER?.trim().toUpperCase(); // Normalize spaces & case
      const totalAmount = parseFloat(row.TOTAL) || 0; // Ensure TOTAL is a number
  
      console.log(`Processing row: ${cashierName} - ${totalAmount}`); // ✅ Debugging
  
      if (totals.hasOwnProperty(cashierName)) {
        totals[cashierName] += totalAmount;
      }
    });
  
    console.log("Computed Totals:", totals); // ✅ Debugging
  
    return totals;
  }, [filteredData]);


// Calculate total sum based on filtered data
const totalSum = filteredData.reduce((acc, row) => acc + (parseFloat(row.TOTAL) || 0), 0);

  return (
  <>
 
 
 <Box sx={{ p: 3 }}>
    
    {/* Search Fields */}
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
    <TextField
      label="OR Number From"
      variant="outlined"
      value={searchFrom}
      onChange={(e) => setSearchFrom(e.target.value)}
      sx={{ minWidth: 200, flex: 1 }}
    />
    <TextField
      label="OR Number To"
      variant="outlined"
      value={searchTo}
      onChange={(e) => setSearchTo(e.target.value)}
      sx={{ minWidth: 200, flex: 1 }}
    />
    </Box>
    
    {/* Download & Print Buttons */}
    
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
      <Button
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      >
        Download CSV
        </Button>
        
        
        <Button
        variant="contained"
        color="secondary"
        startIcon={<PrintIcon />}
        onClick={handlePrint}
        >
          Print
          </Button>
          
    </Box>

  {/* Cashier Collection Cards */}
   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
      {[
        { value: totalCollectionByCashier["RICARDO"], text: "RICARDO ENOPIA" },
        { value: totalCollectionByCashier["FLORA MY"], text: "FLORA MY FERRER" },
        { value: totalCollectionByCashier["IRIS"], text: "IRIS RAFALES" },
        { value: totalCollectionByCashier["AGNES"], text: "AGNES ELLO" },
      ].map(({ value, text }) => (
        <Card
          key={text}
          sx={{
            flex: "1 1 250px",
            p: 3,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
            color: "white",
            boxShadow: "0 8px 24px rgba(63,81,181,0.15)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 30px rgba(40,62,81,0.3)",
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

    <TableContainer component={Paper} style={{ maxHeight: '600px' }}>
      <Table aria-label="daily data table">
  <TableHead>
    <StyledTableRow>
      <StyledTableCell>Date</StyledTableCell>
      <StyledTableCell>OR Number</StyledTableCell>
      <StyledTableCell>NAME</StyledTableCell>
      <StyledTableCell>BUILDING PERMIT FEE</StyledTableCell>
      <StyledTableCell>BUILDING PERMIT FEE NATIONAL</StyledTableCell>
      <StyledTableCell>BUILDING PERMIT FEE LOCAL</StyledTableCell>
      <StyledTableCell>BUILDING PERMIT FEE TRUST</StyledTableCell>
      <StyledTableCell>ELECTRICAL FEE</StyledTableCell>
      <StyledTableCell>ZONING FEE</StyledTableCell>
      <StyledTableCell>LIVESTOCK DEV FUND</StyledTableCell>
      <StyledTableCell>LIVESTOCK DEV FUND LOCAL</StyledTableCell>
      <StyledTableCell>LIVESTOCK DEV FUND TRUST</StyledTableCell>
      <StyledTableCell>DIVING FEE</StyledTableCell>
      <StyledTableCell>DIVING FEE LOCAL</StyledTableCell>
      <StyledTableCell>DIVING FEE BRGY</StyledTableCell>
      <StyledTableCell>DIVING FEE FISHER</StyledTableCell>
      <StyledTableCell>Total</StyledTableCell>
      <StyledTableCell>Cashier</StyledTableCell>
      <StyledTableCell>Comments</StyledTableCell>
      <StyledTableCell>Actions</StyledTableCell>
    </StyledTableRow>
  </TableHead>
  <TableBody>
  {filteredData.map((row, index) => (
    <StyledTableRow key={row.id || `${row.RECEIPT_NO}-${index}`}>
      <CenteredTableCell align="center">{formatDate(row.DATE)}</CenteredTableCell>
      <CenteredTableCell>{row.RECEIPT_NO}</CenteredTableCell>
      <CenteredTableCell>{row.NAME}</CenteredTableCell>
      <CenteredTableCell>{row.BUILDING_PERMIT_FEE}</CenteredTableCell>
      <CenteredTableCell>{row.NATIONAL_5_PERCENT}</CenteredTableCell>
      <CenteredTableCell>{row.LOCAL_80_PERCENT}</CenteredTableCell>
      <CenteredTableCell>{row.TRUST_FUND_15_PERCENT}</CenteredTableCell>
      <CenteredTableCell>{row.ELECTRICAL_FEE}</CenteredTableCell>
      <CenteredTableCell>{row.ZONING_FEE}</CenteredTableCell>
      <CenteredTableCell>{row.LIVESTOCK_DEV_FUND}</CenteredTableCell>
      <CenteredTableCell>{row.LOCAL_80_PERCENT_LIVESTOCK}</CenteredTableCell>
      <CenteredTableCell>{row.NATIONAL_20_PERCENT}</CenteredTableCell>
      <CenteredTableCell>{row.DIVING_FEE}</CenteredTableCell>
      <CenteredTableCell>{row.LOCAL_40_PERCENT_DIVE_FEE}</CenteredTableCell>
      <CenteredTableCell>{row.BRGY_30_PERCENT}</CenteredTableCell>
      <CenteredTableCell>{row.FISHERS_30_PERCENT}</CenteredTableCell>
      <CenteredTableCell>{row.TOTAL}</CenteredTableCell>
      <CenteredTableCell>{row.CASHIER}</CenteredTableCell>
      <CenteredTableCell>{row.COMMENTS}</CenteredTableCell>
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
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={handleCommentClick}>Comment</MenuItem>
        </Menu>
      </CenteredTableCell>
    </StyledTableRow>
  ))}
</TableBody>
</Table>
    </TableContainer>
     {/* Total Sum aligned to the LEFT */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box sx={{ fontWeight: 'bold' }}>
          Total Sum: {totalSum.toFixed(2)}
        </Box>
  {/* Pagination aligned to the RIGHT */}
  <Box sx={{ flexGrow: 1 }}>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
</Box>


 {/* Comment Dialog */}
  <Dialog open={openCommentDialogs} onClose={handleCommentClose}>
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
           <Button onClick={handleCommentClose} color="primary">
             Cancel
           </Button>
           <Button onClick={handleSaveComment} color="primary">
             Save
           </Button>
         </DialogActions>
       </Dialog>
   
      
</>
  );
};

DailyTablev2.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      DATE: PropTypes.string,
      RECEIPT_NO: PropTypes.string,
      NAME: PropTypes.string,
      BUILDING_PERMIT_FEE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      LOCAL_80_PERCENT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      TRUST_FUND_15_PERCENT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      NATIONAL_5_PERCENT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ELECTRICAL_FEE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ZONING_FEE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      LIVESTOCK_DEV_FUND: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      LOCAL_80_PERCENT_LIVESTOCK: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      NATIONAL_20_PERCENT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      DIVING_FEE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      LOCAL_40_PERCENT_DIVE_FEE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      BRGY_30_PERCENT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      FISHERS_30_PERCENT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      TOTAL: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      CASHIER: PropTypes.string,
      COMMENTS: PropTypes.string,
    })
  ),
  onClose: PropTypes.func,
};

export default DailyTablev2;
