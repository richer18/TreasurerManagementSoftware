import React from "react";
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, TablePagination } from "@mui/material";
import { styled } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
  },
}));

const CenteredTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));

function DailyTableView2({  filteredData, formatDate, viewData, setViewData, handleSaveComment, searchFrom, setSearchFrom, searchTo, setSearchTo, handleDownload, handlePrint, totalCollectionByCashier, totalSum, data, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage, openCommentDialogs, handleCommentClose, currentComment, setCurrentComment }) {
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField label="OR Number From" variant="outlined" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} sx={{ minWidth: 200, flex: 1 }} />
          <TextField label="OR Number To" variant="outlined" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} sx={{ minWidth: 200, flex: 1 }} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleDownload}>Download CSV</Button>
          <Button variant="contained" color="secondary" startIcon={<PrintIcon />} onClick={handlePrint}>Print</Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
          {Object.entries(totalCollectionByCashier).map(([key, value]) => (
            <Card key={key} sx={{ flex: "1 1 250px", p: 3, borderRadius: "12px", background: "linear-gradient(135deg, #3f51b5, #5c6bc0)", color: "white", boxShadow: "0 8px 24px rgba(63,81,181,0.15)", transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 30px rgba(40,62,81,0.3)" } }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5 }}>{key}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
            </Card>
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="detailed data table">
          <TableHead>
            <TableRow>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
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
                  <CenteredTableCell>
                    <TextField fullWidth variant="outlined" size="small" value={row.COMMENT || ''} onChange={(e) => {
                      const updatedData = [...viewData];
                      updatedData[index].COMMENT = e.target.value;
                      setViewData(updatedData);
                    }} />
                  </CenteredTableCell>
                  <CenteredTableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleSaveComment(row)}>Save</Button>
                  </CenteredTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <CenteredTableCell colSpan={11} align="center">No matching records found</CenteredTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DailyTableView2;
