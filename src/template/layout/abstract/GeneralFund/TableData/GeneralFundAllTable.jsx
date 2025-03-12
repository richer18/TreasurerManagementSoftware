
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

function GeneralFundAllTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ minWidth: '1500px' }}>
     <Table>
  <TableHead>
    <TableRow>
      <StyledTableCell>DATE</StyledTableCell>
      <StyledTableCell>NAME OF TAXPAYER</StyledTableCell>
      <StyledTableCell>RECEIPT NO. P.F. NO. 25(A)</StyledTableCell>
      <StyledTableCell>Manufacturing</StyledTableCell>
      <StyledTableCell>Distributor</StyledTableCell>
      <StyledTableCell>Retailing</StyledTableCell>
      <StyledTableCell>Financial</StyledTableCell>
      <StyledTableCell>Other</StyledTableCell>
      <StyledTableCell>Sand & Gravel</StyledTableCell>
      <StyledTableCell>Fines & Penalties</StyledTableCell>
      <StyledTableCell>Mayor's Permit</StyledTableCell>
      <StyledTableCell>Weighs And Measure</StyledTableCell>
      <StyledTableCell>Tricycle Operators</StyledTableCell>
      <StyledTableCell>Occu.</StyledTableCell>
      <StyledTableCell>Cert. of Ownership</StyledTableCell>
      <StyledTableCell>Cert. of Transfer</StyledTableCell>
      <StyledTableCell>Cockpit Prov. Share</StyledTableCell>
      <StyledTableCell>Cockpit Local Share</StyledTableCell>
      <StyledTableCell>Docking And Mooring Fee</StyledTableCell>
      <StyledTableCell>Sultadas</StyledTableCell>
      <StyledTableCell>MISCS.</StyledTableCell>
      <StyledTableCell>Reg. of Birth</StyledTableCell>
      <StyledTableCell>Marriage Fees</StyledTableCell>
      <StyledTableCell>Burial Fees</StyledTableCell>
      <StyledTableCell>Correction of Entry</StyledTableCell>
      <StyledTableCell>Fishing Permit Fee</StyledTableCell>
      <StyledTableCell>Sale of Agri. Prod.</StyledTableCell>
      <StyledTableCell>Sale of Acct. Form</StyledTableCell>
      <StyledTableCell>Water Fees</StyledTableCell>
      <StyledTableCell>Stall Fees</StyledTableCell>
      <StyledTableCell>Cash Tickets</StyledTableCell>
      <StyledTableCell>Slaughter House Fee</StyledTableCell>
      <StyledTableCell>Rental of Equipment</StyledTableCell>
      <StyledTableCell>Doc. Stamp</StyledTableCell>
      <StyledTableCell>Police Report/Clearance</StyledTableCell>
      <StyledTableCell>Cert.</StyledTableCell>
      <StyledTableCell>Med./Dent. & Lab. Fees</StyledTableCell>
      <StyledTableCell>Garbage Fees</StyledTableCell>
      <StyledTableCell>Cutting Tree</StyledTableCell>
      <StyledTableCell>TOTAL</StyledTableCell>
      <StyledTableCell>CASHIER</StyledTableCell>
      <StyledTableCell>TYPE OF RECEIPT</StyledTableCell>
      <StyledTableCell>COMMENTS</StyledTableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.length > 0 ? (
      data.map((row) => (
        <TableRow key={`${row.receiptNo}-${row.date}`}>
           <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                  {formatDate(row.date)}
                </TableCell>
          <TableCell align="center">{row.name}</TableCell>
          <TableCell align="center">{row.receipt_no}</TableCell>
          <TableCell align="center">{row.Manufacturing}</TableCell>
          <TableCell align="center">{row.Distributor}</TableCell>
          <TableCell align="center">{row.Retailing}</TableCell>
          <TableCell align="center">{row.Financial}</TableCell>
          <TableCell align="center">{row.Other_Business_Tax}</TableCell>
          <TableCell align="center">{row.Sand_Gravel}</TableCell>
          <TableCell align="center">{row.Fines_Penalties}</TableCell>
          <TableCell align="center">{row.Mayors_Permit}</TableCell>
          <TableCell align="center">{row.Weighs_Measure}</TableCell>
          <TableCell align="center">{row.Tricycle_Operators}</TableCell>
          <TableCell align="center">{row.Occupation_Tax}</TableCell>
          <TableCell align="center">{row.Cert_of_Ownership}</TableCell>
          <TableCell align="center">{row.Cert_of_Transfer}</TableCell>
          <TableCell align="center">{row.Cockpit_Prov_Share}</TableCell>
          <TableCell align="center">{row.Cockpit_Local_Share}</TableCell>
          <TableCell align="center">{row.Docking_Mooring_Fee}</TableCell>
          <TableCell align="center">{row.Sultadas}</TableCell>
          <TableCell align="center">{row.Miscellaneous_Fee}</TableCell>
          <TableCell align="center">{row.Reg_of_Birth}</TableCell>
          <TableCell align="center">{row.Marriage_Fees}</TableCell>
          <TableCell align="center">{row.Burial_Fees}</TableCell>
          <TableCell align="center">{row.Correction_of_Entry}</TableCell>
          <TableCell align="center">{row.Fishing_Permit_Fee}</TableCell>
          <TableCell align="center">{row.Sale_of_Agri_Prod}</TableCell>
          <TableCell align="center">{row.Sale_of_Acct_Form}</TableCell>
          <TableCell align="center">{row.Water_Fees}</TableCell>
          <TableCell align="center">{row.Stall_Fees}</TableCell>
          <TableCell align="center">{row.Cash_Tickets}</TableCell>
          <TableCell align="center">{row.Slaughter_House_Fee}</TableCell>
          <TableCell align="center">{row.Rental_of_Equipment}</TableCell>
          <TableCell align="center">{row.Doc_Stamp}</TableCell>
          <TableCell align="center">{row.Police_Report_Clearance}</TableCell>
          <TableCell align="center">{row.Com_Tax_Cert}</TableCell>
          <TableCell align="center">{row.Med_Dent_Lab_Fees}</TableCell>
          <TableCell align="center">{row.Garbage_Fees}</TableCell>
          <TableCell align="center">{row.Cutting_Tree}</TableCell>
          <TableCell align="center">{row.total}</TableCell>
          <TableCell align="center">{row.cashier}</TableCell>
          <TableCell align="center">{row.type_receipt}</TableCell>
          <TableCell align="center">{row.comments}</TableCell>
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

GeneralFundAllTable.propTypes = {
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

export default GeneralFundAllTable;
