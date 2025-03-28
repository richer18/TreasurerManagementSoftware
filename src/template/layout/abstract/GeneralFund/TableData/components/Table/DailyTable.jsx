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

const DailyTable_v2 = ({ data, onClose }) => {
  
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
  const totalSum = filteredData.reduce((acc, row) => acc + (parseFloat(row.total) || 0), 0);
  return (
  <>
 
 
  <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
  <TextField
  label="OR NUMBER"
  variant="outlined"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{ marginBottom: '20px' }} // Add some spacing
/>
</Box>
    <TableContainer component={Paper} style={{ maxHeight: '600px' }}>
      <Table aria-label="daily data table">
  <TableHead>
    <StyledTableRow>
      <StyledTableCell>Date</StyledTableCell>
      <StyledTableCell>Name</StyledTableCell>
      <StyledTableCell>OR Number</StyledTableCell>
      <StyledTableCell>Manufacturing</StyledTableCell>
      <StyledTableCell>Distributor</StyledTableCell>
      <StyledTableCell>Retailing</StyledTableCell>
      <StyledTableCell>Financial</StyledTableCell>
      <StyledTableCell>Other Business Tax</StyledTableCell>
      <StyledTableCell>Sand & Gravel</StyledTableCell>
      <StyledTableCell>Fines & Penalties</StyledTableCell>
      <StyledTableCell>Mayor's Permit</StyledTableCell>
      <StyledTableCell>Weighs & Measure</StyledTableCell>
      <StyledTableCell>Tricycle Operators</StyledTableCell>
      <StyledTableCell>Occupation Tax</StyledTableCell>
      <StyledTableCell>Cert. of Ownership</StyledTableCell>
      <StyledTableCell>Cert. of Transfer</StyledTableCell>
      <StyledTableCell>Cockpit Prov. Share</StyledTableCell>
      <StyledTableCell>Cockpit Local Share</StyledTableCell>
      <StyledTableCell>Docking & Mooring Fee</StyledTableCell>
      <StyledTableCell>Sultadas</StyledTableCell>
      <StyledTableCell>Miscellaneous Fee</StyledTableCell>
      <StyledTableCell>Reg. of Birth</StyledTableCell>
      <StyledTableCell>Marriage Fees</StyledTableCell>
      <StyledTableCell>Burial Fees</StyledTableCell>
      <StyledTableCell>Correction of Entry</StyledTableCell>
      <StyledTableCell>Fishing Permit Fee</StyledTableCell>
      <StyledTableCell>Sale of Agri Prod</StyledTableCell>
      <StyledTableCell>Sale of Acct Form</StyledTableCell>
      <StyledTableCell>Water Fees</StyledTableCell>
      <StyledTableCell>Stall Fees</StyledTableCell>
      <StyledTableCell>Cash Tickets</StyledTableCell>
      <StyledTableCell>Slaughter House Fee</StyledTableCell>
      <StyledTableCell>Rental of Equipment</StyledTableCell>
      <StyledTableCell>Doc Stamp</StyledTableCell>
      <StyledTableCell>Police Report Clearance</StyledTableCell>
      <StyledTableCell>Com Tax Cert</StyledTableCell>
      <StyledTableCell>Med/Dent Lab Fees</StyledTableCell>
      <StyledTableCell>Garbage Fees</StyledTableCell>
      <StyledTableCell>Cutting Tree</StyledTableCell>
      <StyledTableCell>Total</StyledTableCell>
      <StyledTableCell>Cashier</StyledTableCell>
      <StyledTableCell>Comments</StyledTableCell>
      <StyledTableCell>Actions</StyledTableCell>
    </StyledTableRow>
  </TableHead>
  <TableBody>
    {filteredData.map((row) => (
      <StyledTableRow key={row.id}>
        <CenteredTableCell align="center">{formatDate(row.date)}</CenteredTableCell>
        <CenteredTableCell>{row.name}</CenteredTableCell>
        <CenteredTableCell>{row.receipt_no}</CenteredTableCell>
        <CenteredTableCell>{row.Manufacturing}</CenteredTableCell>
        <CenteredTableCell>{row.Distributor}</CenteredTableCell>
        <CenteredTableCell>{row.Retailing}</CenteredTableCell>
        <CenteredTableCell>{row.Financial}</CenteredTableCell>
        <CenteredTableCell>{row.Other_Business_Tax}</CenteredTableCell>
        <CenteredTableCell>{row.Sand_Gravel}</CenteredTableCell>
        <CenteredTableCell>{row.Fines_Penalties}</CenteredTableCell>
        <CenteredTableCell>{row.Mayors_Permit}</CenteredTableCell>
        <CenteredTableCell>{row.Weighs_Measure}</CenteredTableCell>
        <CenteredTableCell>{row.Tricycle_Operators}</CenteredTableCell>
        <CenteredTableCell>{row.Occupation_Tax}</CenteredTableCell>
        <CenteredTableCell>{row.Cert_of_Ownership}</CenteredTableCell>
        <CenteredTableCell>{row.Cert_of_Transfer}</CenteredTableCell>
        <CenteredTableCell>{row.Cockpit_Prov_Share}</CenteredTableCell>
        <CenteredTableCell>{row.Cockpit_Local_Share}</CenteredTableCell>
        <CenteredTableCell>{row.Docking_Mooring_Fee}</CenteredTableCell>
        <CenteredTableCell>{row.Sultadas}</CenteredTableCell>
        <CenteredTableCell>{row.Miscellaneous_Fee}</CenteredTableCell>
        <CenteredTableCell>{row.Reg_of_Birth}</CenteredTableCell>
        <CenteredTableCell>{row.Marriage_Fees}</CenteredTableCell>
        <CenteredTableCell>{row.Burial_Fees}</CenteredTableCell>
        <CenteredTableCell>{row.Correction_of_Entry}</CenteredTableCell>
        <CenteredTableCell>{row.Fishing_Permit_Fee}</CenteredTableCell>
        <CenteredTableCell>{row.Sale_of_Agri_Prod}</CenteredTableCell>
        <CenteredTableCell>{row.Sale_of_Acct_Form}</CenteredTableCell>
        <CenteredTableCell>{row.Water_Fees}</CenteredTableCell>
        <CenteredTableCell>{row.Stall_Fees}</CenteredTableCell>
        <CenteredTableCell>{row.Cash_Tickets}</CenteredTableCell>
        <CenteredTableCell>{row.Slaughter_House_Fee}</CenteredTableCell>
        <CenteredTableCell>{row.Rental_of_Equipment}</CenteredTableCell>
        <CenteredTableCell>{row.Doc_Stamp}</CenteredTableCell>
        <CenteredTableCell>{row.Police_Report_Clearance}</CenteredTableCell>
        <CenteredTableCell>{row.Com_Tax_Cert}</CenteredTableCell>
        <CenteredTableCell>{row.Med_Dent_Lab_Fees}</CenteredTableCell>
        <CenteredTableCell>{row.Garbage_Fees}</CenteredTableCell>
        <CenteredTableCell>{row.Cutting_Tree}</CenteredTableCell>
        <CenteredTableCell>{row.total}</CenteredTableCell>
        <CenteredTableCell>{row.cashier}</CenteredTableCell>
        <CenteredTableCell>{row.comments}</CenteredTableCell>
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

DailyTable_v2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    name: PropTypes.string,
    receipt_no: PropTypes.string,
    manufacturing: PropTypes.string,
    distributor: PropTypes.string,
    retailing: PropTypes.string,
    financial: PropTypes.string,
    other: PropTypes.string,
    sandGravel: PropTypes.string,
    finesPenalties: PropTypes.string,
    mayorsPermit: PropTypes.string,
    weighsMeasure: PropTypes.string,
    tricycleOperators: PropTypes.string,
    occu: PropTypes.string,
    certOwnership: PropTypes.string,
    certTransfer: PropTypes.string,
    cockpitProvShare: PropTypes.string,
    cockpitLocalShare: PropTypes.string,
    dockingMooringFee: PropTypes.string,
    sultadas: PropTypes.string,
    miscs: PropTypes.string,
    regOfBirth: PropTypes.string,
    marriageFees: PropTypes.string,
    burialFees: PropTypes.string,
    correctionEntry: PropTypes.string,
    fishingPermitFee: PropTypes.string,
    saleAgriProd: PropTypes.string,
    saleAcctForm: PropTypes.string,
    waterFees: PropTypes.string,
    stallFees: PropTypes.string,
    cashTickets: PropTypes.string,
    slaughterHouseFee: PropTypes.string,
    rentalEquipment: PropTypes.string,
    docStamp: PropTypes.string,
    policeReport: PropTypes.string,
    cert: PropTypes.string,
    medDentLabFees: PropTypes.string,
    garbageFees: PropTypes.string,
    cuttingTree: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cashier: PropTypes.string,
    comments: PropTypes.string,
  })),
  onClose: PropTypes.func,
};

export default DailyTable_v2;
