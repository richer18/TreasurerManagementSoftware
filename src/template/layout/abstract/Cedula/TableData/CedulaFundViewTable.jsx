import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledTableCell = (props) => (
  <TableCell
    {...props}
    sx={{
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#1976d2',
      color: '#fff',
    }}
  />
);

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date'; // Handle invalid date cases
  return new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};


function CedulaFundViewTable({ data }) {
  return (
     <TableContainer component={Paper} sx={{ minWidth: '1500px' }}>
      <Table>
   <TableHead>
     <TableRow>
       <StyledTableCell>DATE</StyledTableCell>
       <StyledTableCell>CTC NO</StyledTableCell>
       <StyledTableCell>LOCAL TIN</StyledTableCell>
       <StyledTableCell>NAME</StyledTableCell>
       <StyledTableCell>BASIC</StyledTableCell>
       <StyledTableCell>TAX DUE	</StyledTableCell>
       <StyledTableCell>INTEREST</StyledTableCell>
       <StyledTableCell>TOTAL</StyledTableCell>
       <StyledTableCell>CASHIER</StyledTableCell>
       <StyledTableCell>COMMENTS</StyledTableCell>
       <StyledTableCell>LAST EDITED</StyledTableCell>
     </TableRow>
   </TableHead>
   <TableBody>
     {data.length > 0 ? (
       data.map((row) => (
         <TableRow key={`${row['CTC NO']}-${row.DATE}`}>
            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                   {formatDate(row.DATE)}
                 </TableCell>
           <TableCell align="center">{row['CTC NO']}</TableCell>
           <TableCell align="center">{row.LOCAL}</TableCell>
           <TableCell align="center">{row.NAME}</TableCell>
           <TableCell align="center">{row.BASIC}</TableCell>
           <TableCell align="center">{row.TAX_DUE}</TableCell>
           <TableCell align="center">{row.INTEREST}</TableCell>
           <TableCell align="center">{row.TOTALAMOUNTPAID}</TableCell>
           <TableCell align="center">{row.CASHIER}</TableCell>
           <TableCell align="center">{row.COMMENTS}</TableCell>
           <TableCell align="center">{row.DATALASTEDITED}</TableCell>
           
         </TableRow>
       ))
     ) : (
       <TableRow>
         <TableCell colSpan={42} align="center">
           No data available
         </TableCell>
       </TableRow>
     )}
   </TableBody>
 </Table>
     </TableContainer>
   );
}

CedulaFundViewTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    name: PropTypes.string,
    receiptNo: PropTypes.string,
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
    typeReceipt: PropTypes.string,
    comments: PropTypes.string,
  })).isRequired,
};

export default CedulaFundViewTable
