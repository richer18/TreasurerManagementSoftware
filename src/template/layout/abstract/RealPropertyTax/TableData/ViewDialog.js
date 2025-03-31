import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography
} from '@mui/material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import AbstractRPT from '../../../../../components/MD-Components/FillupForm/AbstractRPT'; // Adjust the path as needed
import PopupDialog from '../../../../../components/MD-Components/Popup/PopupDialog'; // Adjust the path as needed

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  textAlign: 'center',
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CenteredTableCell = styled(TableCell)({
  textAlign: 'center',
});

const RightAlignedTableCell = styled(TableCell)({
  textAlign: 'right',
});

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

function ViewDialog({ open, onClose, data, setData,selectedDate, onDataUpdate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openCommentDialogs, setOpenCommentDialogs] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [searchFrom, setSearchFrom] = useState(""); 
  const [searchTo, setSearchTo] = useState("");

  

  const handleClose = () => {
    onClose();
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
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

 

  const filteredData = useMemo(() => {
    if (!selectedDate) return [];

    return data
      .filter((row) => {
        if (!row.date) return false;
        return format(row.date, "MM-dd-yyyy") === format(selectedDate, "MM-dd-yyyy");
      })
      .map((row) => {
        const entry = {
          ...row,
          id: row.id,
          date: row.date,
          name: row.name || "",
          receipt_no: row.receipt || "",
          comments: row.comments || "",
          landComm: 0,
          landAgri: 0,
          landRes: 0,
          bldgRes: 0,
          bldgComm: 0,
          bldgAgri: 0,
          machinery: 0,
          bldgIndus: 0,
          special: 0,
          total: parseFloat(row.total) || 0,
          cashier: row.cashier || "",
          formattedDate: formatDate(row.date),
        };

        // Assign amounts based on status
        const amount = parseFloat(row.total) || 0;
        switch (row.status) {
          case "LAND-COMML":
            entry.landComm = amount;
            break;
          case "LAND-AGRI":
            entry.landAgri = amount;
            break;
          case "LAND-RES":
            entry.landRes = amount;
            break;
          case "BLDG-RES":
            entry.bldgRes = amount;
            break;
          case "BLDG-COMML":
            entry.bldgComm = amount;
            break;
          case "BLDG-AGRI":
            entry.bldgAgri = amount;
            break;
          case "MACHINERIES":
            entry.machinery = amount;
            break;
          case "BLDG-INDUS":
            entry.bldgIndus = amount;
            break;
          case "SPECIAL":
            entry.special = amount;
            break;
          default:
            break;
        }

        return entry;
      })
      // 🔹 Apply search filter for exact match
      .filter((entry) => {
        const receiptNo = parseInt(entry.receipt_no, 10);
        const from = searchFrom ? parseInt(searchFrom, 10) : null;
        const to = searchTo ? parseInt(searchTo, 10) : null;

        if (from !== null && to !== null) {
          return receiptNo >= from && receiptNo <= to;
        } else if (from !== null) {
          return receiptNo === from; // **EXACT MATCH**
        } else if (to !== null) {
          return receiptNo === to; // **EXACT MATCH**
        }

        return true; // If both fields are empty, return all
      });
  }, [data, selectedDate, searchFrom, searchTo]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((total, row) => total + row.total, 0);
  }, [filteredData]);

  const totalCollectionByCashier = useMemo(() => {
    const totals = {
      "RICARDO ENOPIA": 0,
      "FLORA MY FERRER": 0,
      "IRIS RAFALES": 0,
      "SEF": 0, // SEF total (modify as needed)
    };
  
    filteredData.forEach((row) => {
      if (totals.hasOwnProperty(row.cashier)) {
        totals[row.cashier] += row.total;
      }
    });
  
    return totals;
  }, [filteredData]); // Recalculates when filteredData changes


  const handleCommentClick = () => {
    setCurrentComment(currentRow.comments || '');
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
        // Step 1: Ensure date format is correct
        let formattedDate;
        if (typeof currentRow.date === "string") {
            formattedDate = currentRow.date; // Use as is
        } else {
            formattedDate = format(new Date(currentRow.date), "yyyy-MM-dd"); // Convert Date object to string
        }

        // Step 2: Insert comment in `real_property_tax_data`
        await axios.post(`${BASE_URL}/api/updateComment`, {
            receipt_no: currentRow.receipt_no,
            comment: currentComment,
        });

        // Step 3: Insert comment into `rpt_comment`
        const dateComment = new Date().toISOString(); // Full timestamp
        const user = "current_user"; // Replace with actual logged-in user

        await axios.post(`${BASE_URL}/api/insertComment`, {
            date: formattedDate, // Corrected Date
            receipt_no: currentRow.receipt_no,
            date_comment: dateComment, // Current timestamp
            name_client: currentRow.name,
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

const handleDownload = () => {

  const options = { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(new Date());
  
  const formattedDateTime = `${parts[4].value}-${parts[2].value}-${parts[0].value}_${parts[6].value}-${parts[8].value}-${parts[10].value}`;
  const fileName = `real_property_tax_abstract_${formattedDateTime}.csv`;

  const headers = [
    "Date", "Name", "Receipt No", "LAND-COMML", "LAND-AGRI", "LAND-RES",
    "BLDG-RES", "BLDG-COMML", "BLDG-AGRI", "MACHINERIES", "BLDG-INDUS",
    "SPECIAL", "TOTAL", "CASHIER", "REMARKS"
  ];

  const csvRows = [headers.join(",")]; // Add headers

  // Convert table data to CSV format
  filteredData.forEach((row) => {
    const values = [
      `"${row.formattedDate}"`, 
      `"${row.name}"`,
      `"${row.receipt}"`,
      row.landComm.toFixed(2), 
      row.landAgri.toFixed(2), 
      row.landRes.toFixed(2),
      row.bldgRes.toFixed(2), 
      row.bldgComm.toFixed(2), 
      row.bldgAgri.toFixed(2),
      row.machinery.toFixed(2), 
      row.bldgIndus.toFixed(2), 
      row.special.toFixed(2),
      row.total.toFixed(2), // No currency symbol
      `"${row.cashier}"`,
      `"${row.comments}"`
    ];
    csvRows.push(values.join(",")); 
  });

  // Add properly formatted total row
  csvRows.push(`"TOTAL",,,,,,,,,,,,"${totalAmount.toFixed(2)}",,`); 

  // Convert array to CSV string
  const csvContent = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(csvContent);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const handlePrint = () => {
  window.print();
};




  return (
    <>
      {/* Existing ViewDialog using Material-UI Dialog */}
      <Dialog 
  onClose={handleClose} 
  open={open} 
  maxWidth={false} 
  fullWidth
  PaperProps={{
    sx: { width: '90vw', maxWidth: 'none' }
  }}
>
<DialogTitle>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="h6">
      Details for {selectedDate ? formatDate(selectedDate) : 'Unknown Date'}
    </Typography>
    <Button onClick={handleClose} color="primary" variant="contained">
      X
    </Button>
  </Box>
  
</DialogTitle>

<DialogContent sx={{ overflowX: 'auto' }}>
  
  
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
      { value: totalCollectionByCashier["RICARDO ENOPIA"], text: "RICARDO ENOPIA" },
      { value: totalCollectionByCashier["FLORA MY FERRER"], text: "FLORA MY FERRER" },
      { value: totalCollectionByCashier["IRIS RAFALES"], text: "IRIS RAFALES" },
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

<Box id="printableTable">
  {/* Table */}
  <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
    <Table>
      <TableHead>
        <TableRow>
          {[
            "Date", "Name", "Receipt No", "LAND-COMML", "LAND-AGRI", "LAND-RES",
            "BLDG-RES", "BLDG-COMML", "BLDG-AGRI", "MACHINERIES", "BLDG-INDUS",
            "SPECIAL", "TOTAL", "CASHIER", "REMARKS", "ACTION"
          ].map((header) => (
            <StyledTableCell key={header} sx={{ textAlign: 'center' }}>
              {header}
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {filteredData.map((row, index) => (
          <StyledTableRow key={index}>
            <CenteredTableCell>{row.formattedDate}</CenteredTableCell>
            <CenteredTableCell>{row.name}</CenteredTableCell>
            <CenteredTableCell>{row.receipt}</CenteredTableCell>
            {[row.landComm, row.landAgri, row.landRes, row.bldgRes, row.bldgComm, row.bldgAgri,
              row.machinery, row.bldgIndus, row.special, row.total
            ].map((value, i) => (
              <RightAlignedTableCell key={i}>{value.toFixed(2)}</RightAlignedTableCell>
            ))}
            <CenteredTableCell>{row.cashier}</CenteredTableCell>
            <CenteredTableCell>{row.comments}</CenteredTableCell>
            <CenteredTableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => handleMenuClick(event, row)}
                sx={{ textTransform: 'none' }}
              >
                Action
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && currentRow === row}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleCommentClick}>Comment</MenuItem>
              </Menu>
            </CenteredTableCell>
          </StyledTableRow>
        ))}

        {/* Total Row */}
        <StyledTableRow>
          <RightAlignedTableCell colSpan={14}>
            <Typography fontWeight="bold">TOTAL</Typography>
          </RightAlignedTableCell>
          <RightAlignedTableCell colSpan={4}>
            <Typography fontWeight="bold">₱{totalAmount.toFixed(2)}</Typography>
          </RightAlignedTableCell>
        </StyledTableRow>
      </TableBody>
    </Table>
  </TableContainer>
  </Box>
</DialogContent>

       
      </Dialog>

      {/* Edit Form using PopupDialog */}
      {openEditForm && (
  <PopupDialog onClose={handleEditFormClose}>
    <AbstractRPT
      data={editData}
      onSave={handleEditFormSave}
      onClose={handleEditFormClose}
    />
  </PopupDialog>
)}

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
}

ViewDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDataUpdate: PropTypes.func.isRequired,
};

export default ViewDialog;
