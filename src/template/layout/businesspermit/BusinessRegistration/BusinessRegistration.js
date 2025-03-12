import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import ModalBusiness from './components/Modal';

const months = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const years = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
];

const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    registrationType: 'Individual',
    organizationType: 'Sole Proprietorship',
    businessType: 'Retail',
    totalFee: 500,
  },
  {
    id: 2,
    name: 'Jane Smith',
    registrationType: 'Corporate',
    organizationType: 'LLC',
    businessType: 'Service',
    totalFee: 300,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    registrationType: 'Individual',
    organizationType: 'Partnership',
    businessType: 'Wholesale',
    totalFee: 450,
  },
  {
    id: 4,
    name: 'Bob Brown',
    registrationType: 'Corporate',
    organizationType: 'Corporation',
    businessType: 'Manufacturing',
    totalFee: 700,
  },
  {
    id: 5,
    name: 'Sarah Wilson',
    registrationType: 'Individual',
    organizationType: 'Sole Proprietorship',
    businessType: 'Retail',
    totalFee: 400,
  },
  {
    id: 6,
    name: 'Mike Green',
    registrationType: 'Corporate',
    organizationType: 'LLC',
    businessType: 'Service',
    totalFee: 600,
  },
];

const BusinessRegistration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMonthChange = (event, value) => {
    setMonth(value ? value.value : null);
  };

  const handleYearChange = (event, value) => {
    setYear(value ? value.value : null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Search and Filters */}
      <Box display="flex" alignItems="center" gap={2} marginBottom={3}>
        <TextField
          id="search"
          label="Search"
          placeholder="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
        />
        <Autocomplete
          disablePortal
          id="month-selector"
          options={months}
          onChange={handleMonthChange}
          renderInput={(params) => <TextField {...params} label="Month" variant="outlined" />}
          sx={{ minWidth: '150px', backgroundColor: '#fff', borderRadius: '8px' }}
        />
        <Autocomplete
          disablePortal
          id="year-selector"
          options={years}
          onChange={handleYearChange}
          renderInput={(params) => <TextField {...params} label="Year" variant="outlined" />}
          sx={{ minWidth: '150px', backgroundColor: '#fff', borderRadius: '8px' }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenModal}
          sx={{
            background: 'linear-gradient(135deg, #42a5f5, #478ed1)',
            color: '#fff',
            borderRadius: '8px',
          }}
        >
          New
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
            color: '#fff',
            borderRadius: '8px',
          }}
        >
          Report
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #ffca28, #ffa000)',
            color: '#fff',
            borderRadius: '8px',
          }}
        >
          Download
        </Button>
      </Box>

      {/* Summary Boxes */}
      <Box display="flex" justifyContent="space-between" gap={2} marginBottom={3}>
        {['TOTAL', 'RFAC', 'FT', 'LT', 'NEW', 'RENEW'].map((text, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={2}
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #42a5f5, #478ed1)',
              color: '#fff',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              0
            </Typography>
            <Typography variant="body2">{text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Table Section */}
      <Card sx={{ padding: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #1976d2, #42a5f5)' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Registration Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Organization Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Business Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total Fee</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f4f4f4' },
                      '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                    }}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.registrationType}</TableCell>
                    <TableCell>{row.organizationType}</TableCell>
                    <TableCell>{row.businessType}</TableCell>
                    <TableCell>{row.totalFee}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, row)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => { console.log('View', selectedRow); handleMenuClose(); }}>View</MenuItem>
                        <MenuItem onClick={() => { console.log('Edit', selectedRow); handleMenuClose(); }}>Edit</MenuItem>
                        <MenuItem onClick={() => { console.log('Delete', selectedRow); handleMenuClose(); }}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={sampleData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {isModalOpen && <ModalBusiness onClose={handleCloseModal} />}
    </Box>
  );
};

export default BusinessRegistration;
