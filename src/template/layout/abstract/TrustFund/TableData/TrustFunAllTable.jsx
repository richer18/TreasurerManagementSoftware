import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';

// Define table columns with headers and minimum widths
const columns = [
  { id: 'DATE', label: 'Date', minWidth: 100 },
  { id: 'RECEIPT_NO', label: 'Receipt', minWidth: 100 },
  { id: 'NAME', label: 'Names', minWidth: 150 },
  { id: 'BUILDING_PERMIT_FEE', label: 'Building Permit', minWidth: 120 },
  { id: 'LOCAL_80_PERCENT', label: '80% (Local)', minWidth: 120 },
  { id: 'TRUST_FUND_15_PERCENT', label: '15% (T. F.)', minWidth: 120 },
  { id: 'NATIONAL_5_PERCENT', label: '5% (Nat\'l)', minWidth: 120 },
  { id: 'TOTAL', label: 'Total', minWidth: 120 },
  { id: 'CASHIER', label: 'Cashier', minWidth: 100 },
  { id: 'TYPE_OF_RECEIPT', label: 'Type of Receipt', minWidth: 120 },
  { id: 'COMMENT', label: 'Comment', minWidth: 200 },
];

// Utility function to format dates to "January 2, 2025"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

// Custom styling for header cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
}));

function TrustFund({ data }) {
  const [page, setPage] = React.useState(0); // Pagination current page
  const [rowsPerPage, setRowsPerPage] = React.useState(10); // Rows per page in the table

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const renderCellContent = (columnId, value) => {
    if (columnId === 'DATE') {
      return formatDate(value);
    } else if (columnId === 'COMMENT') {
      return <input type="checkbox" disabled checked={!!value} aria-label="Comment Checkbox" />;
    } else {
      return value;
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', border: '1px solid #ddd', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
      {/* Table container for scrollable view */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          {/* Table header section */}
          <TableHead>
            <TableRow>
              {/* Group headers */}
              <StyledTableCell align="center" colSpan={3}>
                General Info
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={3}>
                Building Permit Fee
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={4}>
                Additional Info
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={1}>
                Remarks
              </StyledTableCell>
            </TableRow>
            <TableRow>
              {/* Individual column headers */}
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table body section */}
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginated data
              .map((row) => (
                <TableRow key={row.RECEIPT_NO} hover>
                  {/* Render each column's value */}
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align="center">
                        {renderCellContent(column.id, value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'center',
          },
        }}
      />
    </Paper>
  );
}

TrustFund.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      DATE: PropTypes.string.isRequired, // ISO format date string
      RECEIPT_NO: PropTypes.string.isRequired,
      NAME: PropTypes.string.isRequired,
      BUILDING_PERMIT_FEE: PropTypes.number,
      LOCAL_80_PERCENT: PropTypes.number,
      TRUST_FUND_15_PERCENT: PropTypes.number,
      NATIONAL_5_PERCENT: PropTypes.number,
      TOTAL: PropTypes.number.isRequired,
      CASHIER: PropTypes.string.isRequired,
      TYPE_OF_RECEIPT: PropTypes.string.isRequired,
      COMMENT: PropTypes.string, // Comment field
    })
  ).isRequired,
};

export default TrustFund;
