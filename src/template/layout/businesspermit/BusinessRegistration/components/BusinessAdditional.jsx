import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
// import DatePicker from 'react-bootstrap-date-picker';
import React, { useEffect, useState,useMemo } from 'react';


/** Add months to a Date object (+3, +7, +11) for quarterly auto-fill. */
function addMonths(baseDate, monthsToAdd) {
  const d = new Date(baseDate.getTime());
  const currentDay = d.getDate();
  d.setMonth(d.getMonth() + monthsToAdd);
  if (d.getDate() < currentDay) {
    d.setDate(0);
  }
  return d;
}

/** Format a date to YYYY-MM-DD for <TextField type="date"> */
function formatDateYMD(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function BusinessAdditional({ handleNext, handleBack }) {
  // Basic states
  const [businessActivity, setBusinessActivity] = useState('Main Office');
  const [otherActivity, setOtherActivity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addedKeywords, setAddedKeywords] = useState([]);
  const [productsServices, setProductsServices] = useState('');
  const [numUnits, setNumUnits] = useState('');
  const [totalCap, setTotalCap] = useState('');
  

  // Payment & Registration
  const [registrationType, setRegistrationType] = useState('new');
  const [paymentMode, setPaymentMode] = useState('annual');

  // Local/Fixed Taxes arrays
  const [localTaxes, setLocalTaxes] = useState([]);
  const [fixedTaxes, setFixedTaxes] = useState([]);

  // ANNUAL
  const [annualDate, setAnnualDate] = useState('');
  const [annualORNo, setAnnualORNo] = useState('');
  const [annualPay, setAnnualPay] = useState('');

  // BI-ANNUAL
  const [biFirstDate, setBiFirstDate] = useState('');
  const [biFirstORNo, setBiFirstORNo] = useState('');
  const [biFirstPay, setBiFirstPay] = useState('');

  const [biSecondDate, setBiSecondDate] = useState('');
  const [biSecondORNo, setBiSecondORNo] = useState('');
  const [biSecondPay, setBiSecondPay] = useState('');

  // QUARTERLY
  const [q1Date, setQ1Date] = useState('');
  const [q1OR, setQ1OR] = useState('');
  const [q1Pay, setQ1Pay] = useState(''); // EXCLUDED from Local Taxes

  const [q2Date, setQ2Date] = useState('');
  const [q2OR, setQ2OR] = useState('');
  const [q2Pay, setQ2Pay] = useState(''); // INCLUDED

  const [q3Date, setQ3Date] = useState('');
  const [q3OR, setQ3OR] = useState('');
  const [q3Pay, setQ3Pay] = useState(''); // INCLUDED

  const [q4Date, setQ4Date] = useState('');
  const [q4OR, setQ4OR] = useState('');
  const [q4Pay, setQ4Pay] = useState(''); // INCLUDED

  // Regulatory Fees
  const [regulatoryFees, setRegulatoryFees] = useState([]);

  /** Safely parse a string to float */
function toFloat(val) {
  return parseFloat(val) ? parseFloat(val) : 0;
}

const biannualPartialSum = useMemo(() => {
  // Only include the second payment in the sum
  return toFloat(biSecondPay);
}, [biSecondPay]);


/** getBiannualPartialSum: Biannual payments */



  // baseLocalTaxes: sum from the localTaxes array
  const baseLocalTaxes = localTaxes.reduce((acc, curr) => acc + toFloat(curr.total), 0);

  const handleActivityChange = (event) => {
    setBusinessActivity(event.target.value);
  };

  // const handleDateChange = (date, setDateFn) => {
  //   setDateFn(date);
  // };

  const onSubmit = (event) => {
    event.preventDefault();
    if (handleNext) handleNext();
  };

  /** Sum "total" in any array of {total: <string|number>} */
  function calculateTotal(list) {
    return list.reduce((sum, item) => sum + toFloat(item.total), 0).toFixed(2);
  }

  const quarterlyPartialSum = useMemo(() => {
    return toFloat(q2Pay) + toFloat(q3Pay) + toFloat(q4Pay);
  }, [q2Pay, q3Pay, q4Pay]);

  /** getQuarterlyPartialSum: Q2 + Q3 + Q4 only */
  function getQuarterlyPartialSum() {
    return toFloat(q2Pay) + toFloat(q3Pay) + toFloat(q4Pay);
  }

  // finalLocalTaxes: If "quarterly", add Q2+Q3+Q4
  const finalLocalTaxes = paymentMode === 'quarterly'
  ? baseLocalTaxes + quarterlyPartialSum
  : paymentMode === 'biannual'
  ? baseLocalTaxes + biannualPartialSum // This now includes only the second payment
  : baseLocalTaxes;

  // Auto-fill Q2, Q3, Q4 dates when Q1 changes (only in "quarterly" mode)
  useEffect(() => {
    if (paymentMode === 'quarterly' && q1Date) {
      const d = new Date(q1Date);
      if (!isNaN(d.getTime())) {  // Check if date is valid
        setQ2Date(formatDateYMD(addMonths(d, 3)));
        setQ3Date(formatDateYMD(addMonths(d, 6))); // Fixed typo (should be +6, not +7)
        setQ4Date(formatDateYMD(addMonths(d, 9))); // Fixed typo (should be +9, not +11)
      }
    }
  }, [paymentMode, q1Date]);

  // Auto-fill for biannual dates when Q1 changes (only in "biannual" mode)
  useEffect(() => {
    if (paymentMode === 'biannual' && q1Date) {
      const d = new Date(q1Date);
      if (!isNaN(d.getTime())) {  // Check if date is valid
        setBiFirstDate(formatDateYMD(addMonths(d, 6)));  // Biannual starts 6 months after Q1
        setBiSecondDate(formatDateYMD(addMonths(d, 12)));  // Second payment 12 months after Q1
      }
    }
  }, [paymentMode, q1Date]);

  // Generic field changes for localTaxes, fixedTaxes, etc.
  const handleFieldChange = (index, field, value, setFn, arrayData) => {
    const updated = [...arrayData];
    updated[index][field] = field === 'total' ? parseFloat(value) || '' : value;
    setFn(updated);
  };

  const handleRemoveField = (index, setFn, arrayData) => {
    const updated = arrayData.filter((_, i) => i !== index);
    setFn(updated);
  };

  // Add row for local/fixed/reg fees
  const handleAddLocalTax = () => setLocalTaxes([...localTaxes, { name: '', total: '' }]);
  const handleAddFixedTax = () => setFixedTaxes([...fixedTaxes, { name: '', total: '' }]);
  const handleAddRegulatoryFee = () =>
    setRegulatoryFees([...regulatoryFees, { name: '', total: '', isDefault: false }]);

  // Remove row from reg fees if not default
  const handleRemoveRegulatoryFee = (index) => {
    setRegulatoryFees((prev) => prev.filter((_, i) => i !== index));
  };

  // Example: Searching logic for line of business (unchanged)
  useEffect(() => {
    if (searchTerm) {
      fetch('http://192.168.101.108:3001/api/datapsic')
        .then((res) => res.json())
        .then((data) => {
          const results = [];
          data.forEach((section) => {
            section.Divisions.forEach((division) => {
              division.Groups.forEach((group) => {
                group.Classes.forEach((classData) => {
                  classData.Subclasses.forEach((subclass) => {
                    if (
                      subclass.subclass_description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      const cleanDescription = subclass.subclass_description
                        .split('This class includes')[0]
                        .trim();
                      results.push({
                        fullDescription: subclass.subclass_description,
                        description: cleanDescription,
                        subclass_code: subclass.subclass_code,
                      });
                    }
                  });
                });
              });
            });
          });
          // Remove duplicates
          const unique = [...new Set(results.map(JSON.stringify))].map(JSON.parse);
          setSearchResults(unique);
        })
        .catch((err) => console.error('Error fetching data:', err));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Add or remove keywords
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddKeyword = (keyword) => {
    const exists = addedKeywords.find(
      (k) => k.description === keyword.description && k.subclass_code === keyword.subclass_code
    );
    if (!exists) {
      setAddedKeywords([...addedKeywords, { ...keyword }]);
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setAddedKeywords(addedKeywords.filter((k) => k !== keyword));
  };

  

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
          Business Activity
        </Typography>
        <Typography variant="body2" sx={{ color: 'red', mb: 1 }}>
          (Please check one) Required
        </Typography>

        {/* MAIN FORM */}
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            {/* SELECT ACTIVITY */}
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Select Activity</FormLabel>
                <RadioGroup
                  row
                  name="businessActivity"
                  value={businessActivity}
                  onChange={handleActivityChange}
                >
                  <FormControlLabel value="Main Office" control={<Radio />} label="Main Office" />
                  <FormControlLabel value="Branch Office" control={<Radio />} label="Branch Office" />
                  <FormControlLabel
                    value="Admin Office Only"
                    control={<Radio />}
                    label="Admin Office Only"
                  />
                  <FormControlLabel value="Warehouse" control={<Radio />} label="Warehouse" />
                  <FormControlLabel value="Others" control={<Radio />} label="Others" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* SPECIFY OTHERS */}
            {businessActivity === 'Others' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specify Others"
                  variant="outlined"
                  value={otherActivity}
                  onChange={(e) => setOtherActivity(e.target.value)}
                />
              </Grid>
            )}

            {/* SEARCH LINE OF BUSINESS */}
            <Grid item xs={12}>
              <Typography variant="h6">Line of Business</Typography>
              <TextField
                fullWidth
                label="Search Field"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Search Results:</Typography>
                  {searchResults.map((resItem, idx) => (
                    <Box key={idx} display="flex" alignItems="center" my={1}>
                      <Typography sx={{ flex: 1 }}>
                        {resItem.fullDescription} - {resItem.subclass_code}
                      </Typography>
                      <Button variant="contained" size="small" onClick={() => handleAddKeyword(resItem)}>
                        Add
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* ADDED KEYWORDS */}
            {addedKeywords.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Added Keywords:</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Line of Business</TableCell>
                        <TableCell>PSIC Code</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {addedKeywords.map((kw, index) => (
                        <TableRow key={index}>
                          <TableCell>{kw.description}</TableCell>
                          <TableCell>{kw.subclass_code}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleRemoveKeyword(kw)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            {/* PRODUCTS, UNITS, TOTAL CAP, GROSS SALES */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Products / Services"
                variant="outlined"
                value={productsServices}
                onChange={(e) => setProductsServices(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="No. of Units"
                variant="outlined"
                value={numUnits}
                onChange={(e) => setNumUnits(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Capitalization (PH) For New"
                variant="outlined"
                value={totalCap}
                onChange={(e) => setTotalCap(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Year's Gross Sales/Receipts"
                variant="outlined"
                value={totalCap}
                onChange={(e) => setTotalCap(e.target.value)}
              />
            </Grid>

            {/* ASSESSMENTS */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                Assessments
              </Typography>
            </Grid>

            {/* LOCAL TAXES TABLE */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Local Taxes
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                  onClick={handleAddLocalTax}
                >
                  ADD LOCAL TAX
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {localTaxes.map((tax, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={tax.name}
                            onChange={(e) =>
                              handleFieldChange(i, 'name', e.target.value, setLocalTaxes, localTaxes)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={tax.total}
                            onChange={(e) =>
                              handleFieldChange(i, 'total', e.target.value, setLocalTaxes, localTaxes)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveField(i, setLocalTaxes, localTaxes)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* TOTAL ROW (includes partial payments if QUARTERLY) */}
                    <TableRow>
                      <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }} colSpan={1}>
                        TOTAL
                      </TableCell>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                        {finalLocalTaxes.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* FIXED TAXES TABLE */}
            <Grid item xs={12}>
              <Box sx={{ mt: 4, mb: 1 }} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Fixed Taxes
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                  onClick={handleAddFixedTax}
                >
                  ADD FIXED TAX
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fixedTaxes.map((tax, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={tax.name}
                            onChange={(e) =>
                              handleFieldChange(i, 'name', e.target.value, setFixedTaxes, fixedTaxes)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={tax.total}
                            onChange={(e) =>
                              handleFieldChange(i, 'total', e.target.value, setFixedTaxes, fixedTaxes)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveField(i, setFixedTaxes, fixedTaxes)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* TOTAL row */}
                    <TableRow>
                      <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }} colSpan={1}>
                        TOTAL
                      </TableCell>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                        {calculateTotal(fixedTaxes)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* REGULATORY FEES TABLE */}
            <Grid item xs={12}>
              <Box sx={{ mt: 4, mb: 1 }} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Regulatory Fees & Charges
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                  onClick={handleAddRegulatoryFee}
                >
                  ADD
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fee Name</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regulatoryFees.map((fee, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {fee.isDefault ? (
                            <Typography>{fee.name}</Typography>
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              value={fee.name}
                              onChange={(e) =>
                                handleFieldChange(idx, 'name', e.target.value, setRegulatoryFees, regulatoryFees)
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            value={fee.total}
                            onChange={(e) =>
                              handleFieldChange(idx, 'total', e.target.value, setRegulatoryFees, regulatoryFees)
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {!fee.isDefault && (
                            <IconButton color="error" onClick={() => handleRemoveRegulatoryFee(idx)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* TOTAL Row */}
                    <TableRow>
                      <TableCell align="right" colSpan={2} sx={{ fontWeight: 'bold' }}>
                        TOTAL
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        {calculateTotal(regulatoryFees)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* TYPE / MODE CARDS */}
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }} display="flex" justifyContent="center" gap={3}>
                {/* TYPE OF REGISTRATION */}
                <Paper
                  elevation={2}
                  sx={{
                    px: 3,
                    py: 2,
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <FormControl>
                    <FormLabel sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
                      TYPE OF REGISTRATION
                    </FormLabel>
                    <RadioGroup
                      name="registrationType"
                      value={registrationType}
                      onChange={(e) => setRegistrationType(e.target.value)}
                    >
                      <FormControlLabel value="new" control={<Radio />} label="NEW" />
                      <FormControlLabel value="renewal" control={<Radio />} label="RENEWAL" />
                      <FormControlLabel value="additional" control={<Radio />} label="ADDITIONAL" />
                    </RadioGroup>
                  </FormControl>
                </Paper>

                {/* MODE OF PAYMENTS */}
                <Paper
                  elevation={2}
                  sx={{
                    px: 3,
                    py: 2,
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <FormControl>
                    <FormLabel sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
                      MODE OF PAYMENTS
                    </FormLabel>
                    <RadioGroup
                      name="paymentMode"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      <FormControlLabel value="annual" control={<Radio />} label="ANNUAL" />
                      <FormControlLabel value="biannual" control={<Radio />} label="BI-ANNUAL" />
                      <FormControlLabel value="quarterly" control={<Radio />} label="QUARTERLY" />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Box>
            </Grid>

            {/* ANNUAL / BI-ANNUAL / QUARTERLY FIELDS */}
            <Grid item xs={12}>
              {/* Annual Fields */}
              {paymentMode === 'annual' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ANNUAL PAYMENT
                  </Typography>
                  <TextField
                    fullWidth
                    type='date'
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={annualDate}
                    onChange={(e) => setAnnualDate(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="OR No."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={annualORNo}
                    onChange={(e) => setAnnualORNo(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Pay"
                    variant="outlined"
                    type="number"
                    sx={{ mb: 2 }}
                    value={annualPay}
                    onChange={(e) => setAnnualPay(e.target.value)}
                  />
                </Box>
              )}

              {/* Bi-Annual Fields */}
{paymentMode === 'biannual' && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
      1ST PAYMENT
    </Typography>
    <TextField
      fullWidth
      type='date'
      variant="outlined"
      sx={{ mb: 2 }}
      value={biFirstDate}
      onChange={(e) => setBiFirstDate(e.target.value)}
    />
    <TextField
      fullWidth
      label="OR No."
      variant="outlined"
      sx={{ mb: 2 }}
      value={biFirstORNo}
      onChange={(e) => setBiFirstORNo(e.target.value)}
    />
    <TextField
      fullWidth
      label="Pay"
      variant="outlined"
      type="number"
      sx={{ mb: 3 }}
      value={biFirstPay}
      onChange={(e) => setBiFirstPay(e.target.value)}
    />

    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
      2ND PAYMENT
    </Typography>
    <TextField
      fullWidth
      type='date'
      variant="outlined"
      sx={{ mb: 2 }}
      value={biSecondDate}
      onChange={(e) => setBiSecondDate(e.target.value)}
    />
    <TextField
      fullWidth
      label="OR No."
      variant="outlined"
      sx={{ mb: 2 }}
      value={biSecondORNo}
      onChange={(e) => setBiSecondORNo(e.target.value)}
    />
    <TextField
      fullWidth
      label="Pay"
      variant="outlined"
      type="number"
      sx={{ mb: 2 }}
      value={biSecondPay}
      onChange={(e) => setBiSecondPay(e.target.value)}
    />
  </Box>
)}

              {/* Quarterly Fields */}
              {paymentMode === 'quarterly' && (
                <Box sx={{ mt: 2 }}>
                  {/* 1ST Payment (excluded) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    1ST PAYMENT (excluded from Local Taxes)
                  </Typography>
                  <TextField
                    fullWidth
                    type='date'
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q1Date}
                    onChange={(e) => setQ1Date(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="OR No."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q1OR}
                    onChange={(e) => setQ1OR(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="1st Payment"
                    variant="outlined"
                    type="number"
                    sx={{ mb: 3 }}
                    value={q1Pay}
                    onChange={(e) => setQ1Pay(e.target.value)}
                  />

                  {/* 2ND Payment (included) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    2ND PAYMENT (included in Local Taxes)
                  </Typography>


                  <TextField
                    fullWidth
                    type='date'
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q2Date}
                    onChange={(e) => setQ2Date(e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="OR No."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q2OR}
                    onChange={(e) => setQ2OR(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="2nd Payment"
                    variant="outlined"
                    type="number"
                    sx={{ mb: 3 }}
                    value={q2Pay}
                    onChange={(e) => setQ2Pay(e.target.value)}
                  />

                  {/* 3RD Payment (included) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    3RD PAYMENT (included in Local Taxes)
                  </Typography>

                  <TextField
                    fullWidth
                    type='date'
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q3Date}
                    onChange={(e) => setQ3Date(e.target.value)}
                  />
                    
                  <TextField
                    fullWidth
                    label="OR No."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q3OR}
                    onChange={(e) => setQ3OR(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="3rd Payment"
                    variant="outlined"
                    type="number"
                    sx={{ mb: 3 }}
                    value={q3Pay}
                    onChange={(e) => setQ3Pay(e.target.value)}
                  />

                  {/* 4TH Payment (included) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    4TH PAYMENT (included in Local Taxes)
                  </Typography>

                  <TextField
                    fullWidth
                    type='date'
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q4Date}
                    onChange={(e) => setQ4Date(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="OR No."
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={q4OR}
                    onChange={(e) => setQ4OR(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="4th Payment"
                    variant="outlined"
                    type="number"
                    sx={{ mb: 2 }}
                    value={q4Pay}
                    onChange={(e) => setQ4Pay(e.target.value)}
                  />

                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    SUBTOTAL: {getQuarterlyPartialSum().toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* ACTION BUTTONS */}
            <Grid item xs={12} display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={handleBack}>
                Previous
              </Button>
              <Button variant="contained" type="submit">
                Next
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}
