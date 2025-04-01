import React, { useState,useMemo } from "react";
import {
  Box,
  Table,Dialog,DialogTitle,DialogContent,DialogActions,
  TableBody,Card,
  TableCell,
  TableContainer,Menu,MenuItem,IconButton,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,Typography,TablePagination
} from "@mui/material";
import { styled } from "@mui/system";
import { format, parseISO, parse } from 'date-fns';
import axios from 'axios';
import Cedulas from "../../../../../components/MD-Components/FillupForm/Cedula";
import PopupDialog from "../../../../../components/MD-Components/Popup/PopupDialogCedula_FORM";
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: "bold",
  textAlign: "center",
  whiteSpace: "nowrap",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    cursor: "pointer",
  },
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

const CenteredTableCell = styled(TableCell)({
  textAlign: "center",
  whiteSpace: "nowrap",
});

const BASE_URL = "http://192.168.101.108:3001";

function Dailytablev2({ data, onClose,onDataUpdate }) {
  const [searchFrom, setSearchFrom] = useState(""); 
    const [searchTo, setSearchTo] = useState("");
    const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(5);
      const [currentRow, setCurrentRow] = useState(null);
      const [anchorEl, setAnchorEl] = useState(null);
      const [openCommentDialogs, setOpenCommentDialogs] = useState(false);
      const [currentComment, setCurrentComment] = useState("");

      const [editData, setEditData] = useState(null);
      const [openEditForm, setOpenEditForm] = useState(false);
      // const [commentOpen, setCommentOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  
  
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditData(currentRow); // currentRow should have camelCase field names
    setOpenEditForm(true);
  };

  const handleEditFormClose = () => {
    setOpenEditForm(false);
    setEditData(null);
  };

  const handleEditFormSave = (updatedEntry) => {
    const index = data.findIndex((item) => item.id === updatedEntry.id);
    if (index !== -1) {
      const updatedData = [...data];
      updatedData[index] = updatedEntry;
      onDataUpdate(updatedData);
    }
    handleEditFormClose();
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCommentClick = () => {
    setCurrentComment(currentRow.COMMENT || "");
    setOpenCommentDialogs(true);
    handleMenuClose();
  };

  const handleCommentClose = () => {
    setOpenCommentDialogs(false);
  };

  const handleSaveComment = async () => {
    if (!currentRow) {
        alert("No row selected!");
        return;
    }

    try {
        let formattedDate;

        if (!currentRow.DATE || currentRow.DATE.trim() === "") {
            console.error("Error: currentRow.DATE is missing or invalid", currentRow);
            alert("Invalid date value!");
            return;
        }

        // Check if the date is already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(currentRow.DATE)) {
            formattedDate = currentRow.DATE; // Use as is
        } else {
            try {
                formattedDate = format(parse(currentRow.DATE, "MMMM d, yyyy", new Date()), "yyyy-MM-dd");
            } catch (dateError) {
                console.error("Invalid date format:", currentRow.DATE, dateError);
                alert("Invalid date format!");
                return;
            }
        }

        console.log("Formatted date:", formattedDate);

        // Step 2: Update comment in `cedula`
        await axios.post(`${BASE_URL}/api/updateCedulaComment`, {
          CTCNO: currentRow['CTC NO'],
          COMMENT: currentComment,
        });

        // Step 3: Insert comment into `rpt_comment`
        const dateComment = new Date().toISOString(); // Full timestamp
        const user = "current_user"; // Replace with actual logged-in user

        await axios.post(`${BASE_URL}/api/insertCedulaComment`, {
            date: formattedDate, // Corrected Date
            receipt_no: currentRow['CTC NO'],
            date_comment: dateComment, // Current timestamp
            name_client: currentRow.NAME,
            description: currentComment,
            user: user,
        });

        alert("Comment saved successfully!");
        handleCommentClose(); // Close the dialog after saving
    } catch (error) {
        console.error("Error saving comment:", error);
        alert("Failed to save comment");
    }
};

const handleDeleteComment = async () => {
  if (!currentRow) {
    alert("No row selected!");
    return;
  }

  if (!window.confirm("Are you sure you want to permanently delete this comment?")) {
    return;
  }

  setIsDeleting(true);
  try {
    // Delete comment from both tables
    await Promise.all([
      axios.post(`${BASE_URL}/api/deleteCedulaComment`, {
        receipt_no: currentRow['CTC NO'],
      }),
      axios.post(`${BASE_URL}/api/clearCedulaComment`, {
        CTCNO: currentRow['CTC NO'],
      })
    ]);

    // Option 1: Notify parent to refresh data
    if (onDataUpdate) onDataUpdate();

    // Option 2: If you want to update locally (uncomment if needed)
    // const updatedData = data.map(item => 
    //   item['CTC NO'] === currentRow['CTC NO'] 
    //     ? {...item, COMMENT: ''} 
    //     : item
    // );
    // if (onDataUpdate) onDataUpdate(updatedData);

    setCurrentComment("");
    setOpenCommentDialogs(false);
  } catch (error) {
    console.error("Error deleting comment:", error);
    alert(`Failed to delete comment: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsDeleting(false);
  }
};



   // Filter the data based on the search term
   const filteredData = useMemo(() => {
    return data.filter((entry) => {
      const ctcNoStr = entry['CTC NO']?.toString().trim() || '';
      const receiptNo = ctcNoStr ? parseInt(ctcNoStr, 10) : NaN;
      if (isNaN(receiptNo)) return true;
  
      const from = searchFrom ? parseInt(searchFrom.toString().trim(), 10) : null;
      const to = searchTo ? parseInt(searchTo.toString().trim(), 10) : null;
  
      const validFrom = !isNaN(from) ? from : null;
      const validTo = !isNaN(to) ? to : null;
  
      // Strict mode - exact matches when single field provided
      if (validFrom !== null && validTo !== null) {
        return receiptNo >= validFrom && receiptNo <= validTo;
      } else if (validFrom !== null) {
        return receiptNo === validFrom;
      } else if (validTo !== null) {
        return receiptNo === validTo;
      }
  
      return true;
    });
  }, [data, searchFrom, searchTo]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row); // Set the current row correctly
  };

  const totalCollectionByCashier = useMemo(() => {
      const totals = {
        "ricardo": 0,
        "flora": 0,
        "angelique": 0,
        "agnes": 0,
      };
    
      filteredData.forEach((row) => {
        const cashierName = row.CASHIER?.trim().toLowerCase(); // Normalize spaces & case
        const totalAmount = parseFloat(row.TOTAL) || 0; // Ensure TOTAL is a number
      
    
        if (totals.hasOwnProperty(cashierName)) {
          totals[cashierName] += totalAmount;
        }
      });
    
    
      return totals;
    }, [filteredData]);


    // Calculate total sum based on filtered data
const totalSum = filteredData.reduce((acc, row) => acc + (parseFloat(row.TOTAL) || 0), 0);

const handleDownload = () => {
   
};

const handlePrint = () => {
  window.print();
};


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
      { value: totalCollectionByCashier["ricardo"], text: "RICARDO ENOPIA" },
      { value: totalCollectionByCashier["flora"], text: "FLORA MY FERRER" },
      { value: totalCollectionByCashier["angelique"], text: "IRIS RAFALES" },
      { value: totalCollectionByCashier["agnes"], text: "AGNES ELLO" },
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
    <StyledTableCell>DATE</StyledTableCell>
            <StyledTableCell>CTC NO</StyledTableCell>
            <StyledTableCell>LOCAL TIN</StyledTableCell>
            <StyledTableCell>NAME</StyledTableCell>
            <StyledTableCell>BASIC</StyledTableCell>
            <StyledTableCell>TAX DUE</StyledTableCell>
            <StyledTableCell>INTEREST</StyledTableCell>
            <StyledTableCell>TOTAL</StyledTableCell>
            <StyledTableCell>CASHIER</StyledTableCell>
            <StyledTableCell>COMMENTS</StyledTableCell>
            <StyledTableCell>ACTION</StyledTableCell>
    </StyledTableRow>
  </TableHead>
  <TableBody>
  {filteredData.map((row, index) => (
    <StyledTableRow key={`${row['CTC NO']}-${index}`}>
    <CenteredTableCell>{formatDate(row.DATE)}</CenteredTableCell>
    <CenteredTableCell>{row['CTC NO']}</CenteredTableCell>
    <CenteredTableCell>{row.LOCAL}</CenteredTableCell>
    <CenteredTableCell>{row.NAME}</CenteredTableCell>
    <CenteredTableCell>{row.BASIC}</CenteredTableCell>
    <CenteredTableCell>{row.TAX_DUE}</CenteredTableCell>
    <CenteredTableCell>{row.INTEREST}</CenteredTableCell>
    <CenteredTableCell>{row.TOTAL}</CenteredTableCell>
    <CenteredTableCell>{row.CASHIER}</CenteredTableCell>
    <CenteredTableCell>{row.COMMENT}</CenteredTableCell>
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

      {/* Edit Form using PopupDialog */}
          {openEditForm && (
      <PopupDialog onClose={handleEditFormClose}>
        <Cedulas
          data={editData}
          onSave={handleEditFormSave}
          onClose={handleEditFormClose}
        />
      </PopupDialog>
    )}


 {/* Comment Dialog */}

<Dialog
  open={openCommentDialogs}
  onClose={handleCommentClose}
  maxWidth="sm"
  fullWidth
>
<DialogTitle sx={{
    bgcolor: "primary.main",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 2,
    px: 3
  }}>
    <Typography 
      variant="h6" 
      component="span"
      sx={{ fontWeight: 600 }}
    >
  {currentRow ? `Comment for ${currentRow['CTC NO']}` : 'Add Comment'}
    </Typography>
    <IconButton 
      onClick={handleCommentClose} 
      sx={{ 
        color: "white",
        p: 0.5,
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)'
        }
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
    </DialogTitle>
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
  <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteComment}
            disabled={isDeleting || !currentRow?.COMMENT}
            sx={{ mr: 1 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Comment'}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleCommentClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveComment}
          >
            Save
          </Button>
        </DialogActions>
</Dialog>


    </>
  );
}

export default Dailytablev2;
