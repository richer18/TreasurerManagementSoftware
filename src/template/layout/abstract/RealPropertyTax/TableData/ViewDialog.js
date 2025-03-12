import {
  Box,
  Button,
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

function ViewDialog({ open, onClose, data, setData,selectedDate, onDataUpdate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openCommentDialogs, setOpenCommentDialogs] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  

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

  // Prepare data for the view dialog
  const filteredData = useMemo(() => {
    if (!selectedDate) return [];
  
    return data
      .filter((row) => {
        if (!row.date) return false;
        return format(row.date, 'MM-dd-yyyy') === format(selectedDate, 'MM-dd-yyyy');
      })
      .map((row) => {
        const entry = {
          ...row,
          id: row.id, // Ensure id is included
          date: row.date,
          name: row.name || '',
          receipt_no: row.receipt || '', // Map backend's receipt_no field
          comments: row.comments || '',
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
          cashier: row.cashier || '',
          formattedDate: formatDate(row.date),
        };
  
        const amount = parseFloat(row.total) || 0;
        switch (row.status) {
          case 'LAND-COMML':
            entry.landComm = amount;
            break;
          case 'LAND-AGRI':
            entry.landAgri = amount;
            break;
          case 'LAND-RES':
            entry.landRes = amount;
            break;
          case 'BLDG-RES':
            entry.bldgRes = amount;
            break;
          case 'BLDG-COMML':
            entry.bldgComm = amount;
            break;
          case 'BLDG-AGRI':
            entry.bldgAgri = amount;
            break;
          case 'MACHINERIES':
            entry.machinery = amount;
            break;
          case 'BLDG-INDUS':
            entry.bldgIndus = amount;
            break;
          case 'SPECIAL':
            entry.special = amount;
            break;
          default:
            break;
        }
  
        return entry;
      });
  }, [data, selectedDate]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((total, row) => total + row.total, 0);
  }, [filteredData]);


  const handleCommentClick = () => {
    setCurrentComment(currentRow.comments || '');
    setOpenCommentDialogs(true);
    handleMenuClose();
  };

  const handleCommentClose = () => {
    setOpenCommentDialogs(false);
  };

  const handleSaveComment = async () => {
    try {
      // Save the comment in the `real_property_tax_data` table
      await axios.post('http://192.168.101.108:3001/api/updateComment', {
        receipt_no: currentRow.receipt, // Use receipt_no to identify the record
        comment: currentComment,       // Save the current comment
      });
  
      // Format the data to be saved in `rpt_comments`
      const formattedDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }); // Current time in hh:mm:ss AM/PM format
      const user = 'current_user'; // Replace this with the actual logged-in user's information
      const description = `${currentComment} - ${currentRow.receipt}`; // Combine comment and receipt
  
      // Insert the comment into the `rpt_comments` table
      await axios.post('http://192.168.101.108:3001/api/insertComment', {
        date: formattedDate,
        description: description,
        time: currentTime,
        user: user,
      });
  
      alert('Comment saved successfully');
      handleCommentClose(); // Close the dialog after saving
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to save comment');
    }
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
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
  <TextField
  label="OR NUMBER"
  variant="outlined"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{ marginBottom: '20px' }} // Add some spacing
/>

</Box>
<TableContainer component={Paper} sx={{ minWidth: '1500px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Receipt No</StyledTableCell>
                  <StyledTableCell>LAND-COMML</StyledTableCell>
                  <StyledTableCell>LAND-AGRI</StyledTableCell>
                  <StyledTableCell>LAND-RES</StyledTableCell>
                  <StyledTableCell>BLDG-RES</StyledTableCell>
                  <StyledTableCell>BLDG-COMML</StyledTableCell>
                  <StyledTableCell>BLDG-AGRI</StyledTableCell>
                  <StyledTableCell>MACHINERIES</StyledTableCell>
                  <StyledTableCell>BLDG-INDUS</StyledTableCell>
                  <StyledTableCell>SPECIAL</StyledTableCell>
                  <StyledTableCell>TOTAL</StyledTableCell>
                  <StyledTableCell>CASHIER</StyledTableCell>
                  <StyledTableCell>REMARKS</StyledTableCell>
                  <StyledTableCell>ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <CenteredTableCell>{row.formattedDate}</CenteredTableCell>
                    <CenteredTableCell>{row.name}</CenteredTableCell>
                    <CenteredTableCell>{row.receipt}</CenteredTableCell>
                    <CenteredTableCell>{row.landComm.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.landAgri.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.landRes.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.bldgRes.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.bldgComm.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.bldgAgri.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.machinery.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.bldgIndus.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.special.toFixed(2)}</CenteredTableCell>
                    <CenteredTableCell>{row.total.toFixed(2)}</CenteredTableCell>
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
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem onClick={handleEditClick}>EDIT</MenuItem>
                        <MenuItem onClick={handleCommentClick}>COMMENT</MenuItem>
                      </Menu>
                    </CenteredTableCell>
                  </StyledTableRow>
                ))}
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
