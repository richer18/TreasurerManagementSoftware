
import {
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Menu, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination,
  TableRow,
  TextField,
  styled
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

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
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const DailyTablev2 = ({ data, onClose }) => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const [currentComment, setCurrentComment] = useState('');
  const [currentRow, setCurrentRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

   const handleClose = () => {
    setAnchorEl(null);
  };

   const handleCommentClick = () => {
    setOpen(true);
    setCurrentComment(currentRow.comments || '');
    handleClose();
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

   const handleSaveComment = () => {
   
    console.log('COMMENT SAVE')
    
    setOpen(false);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  

   // Filter the data based on the search term
  const filteredData = paginatedData.filter((row) => {
    return Object.values(row).some((value) => 
      value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate total sum based on filtered data
  const totalSum = filteredData.reduce((acc, row) => acc + (parseFloat(row.TOTAL) || 0), 0);
  return (
  <>
 
 
  <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
   <TextField
          label="OR NUMBER"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
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
      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)} color="primary">
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
