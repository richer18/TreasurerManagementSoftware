import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  DescriptionOutlined,
  FileDownloadOutlined,
  CheckCircleOutline,
  ErrorOutline,
  CalendarToday
} from '@mui/icons-material';

const GenerateReport = ({ open, onClose }) => {
  // Cashier data mapped from all tables
  const allCashiers = [
    // From cedula table
    { id: 'flora', name: 'Flora', table: 'cedula' },
    { id: 'angelique', name: 'Angelique', table: 'cedula' },
    { id: 'agnes', name: 'Agnes', table: 'cedula' },
    { id: 'ricardo', name: 'Ricardo', table: 'cedula' },
    
    // From general_fund_data table
    { id: 'RICARDO', name: 'Ricardo Enopia', table: 'general_fund' },
    { id: 'IRIS', name: 'Iris Rafales', table: 'general_fund' },
    { id: 'FLORA MY', name: 'Flora My Ferrer', table: 'general_fund' },
    { id: 'AGNES', name: 'Agnes Ello', table: 'general_fund' },
    { id: 'AMABELLA', name: 'Amabella', table: 'general_fund' },
    
    // From trust_fund_data table
    { id: 'RICARDO', name: 'Ricardo Enopia', table: 'trust_fund' },
    { id: 'IRIS', name: 'Iris Rafales', table: 'trust_fund' },
    { id: 'FLORA MY', name: 'Flora My Ferrer', table: 'trust_fund' },
    { id: 'AGNES', name: 'Agnes Ello', table: 'trust_fund' },
    
    // From real_property_tax_data table
    { id: 'RICARDO ENOPIA', name: 'Ricardo Enopia', table: 'rpt' },
    { id: 'IRIS RAFALES', name: 'Iris Rafales', table: 'rpt' },
    { id: 'FLORA MY FERRER', name: 'Flora My Ferrer', table: 'rpt' }
  ];

  // State for filters
  const [dateType, setDateType] = useState('monthYear');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportType, setReportType] = useState('all');
  const [cashier, setCashier] = useState('all');
  const [orType, setOrType] = useState('');
  const [orFrom, setOrFrom] = useState('');
  const [orTo, setOrTo] = useState('');
  const [validationError, setValidationError] = useState('');

  // Report generation status
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [progress, setProgress] = useState(0);

  // Get appropriate cashiers based on report type
  const getFilteredCashiers = () => {
    if (reportType === 'all') return allCashiers;
    
    const tableMap = {
      cedula: ['cedula'],
      gfAndTf: ['general_fund', 'trust_fund'],
      rpt: ['rpt']
    };
    
    const tables = tableMap[reportType] || [];
    return allCashiers.filter(c => tables.includes(c.table));
  };

  // Get the database-specific cashier ID
  const getDatabaseCashierId = () => {
    if (cashier === 'all') return null;
    const found = allCashiers.find(c => c.id === cashier);
    return found ? found.id : null;
  };

  // Reset related fields when report type changes
  useEffect(() => {
    setCashier('all');
    setOrType('');
  }, [reportType]);

  // Auto-set OR type when Amabella is selected
  useEffect(() => {
    if (cashier === 'AMABELLA') {
      setOrType('Cash Tickets');
    } else {
      setOrType('');
    }
  }, [cashier]);

  const validateFields = () => {
    if (dateType === 'monthYear' && !month) {
      return 'Please select a month';
    }
    if (reportType === 'cedula' && cashier === 'AMABELLA') {
      return 'Amabella is not available for cedula reports';
    }
    if (['CTC', '51', '56'].includes(orType) && (!orFrom || !orTo)) {
      return 'Please enter both OR From and OR To values';
    }
    return '';
  };

  const handleGenerate = () => {
    const error = validateFields();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    
    // Prepare the API payload
    const generateReportData = {
      reportType,
      dateRange: dateType === 'dateRange' ? { 
        start: startDate, 
        end: endDate 
      } : null,
      monthYear: dateType === 'monthYear' ? { 
        month: parseInt(month), 
        year: parseInt(year) 
      } : null,
      cashier: cashier === 'all' ? null : getDatabaseCashierId(),
      orDetails: {
        type: orType !== 'Cash Tickets' ? orType : null,
        range: ['CTC', '51', '56'].includes(orType) ? { 
          from: orFrom, 
          to: orTo 
        } : null
      }
    };

    console.log('Submitting report data:', generateReportData);
    
    setStatus('loading');
    setProgress(0);

    // TODO: Replace with actual API call
    // api.generateReport(generateReportData)
    //   .then(() => setStatus('success'))
    //   .catch(() => setStatus('error'));

    // Simulated loading (remove in production)
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus('success');
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleClose = () => {
    setStatus('idle');
    setValidationError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        py: 2
      }}>
        <Box display="flex" alignItems="center">
          <DescriptionOutlined sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight="500">
            Generate Financial Report
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {status === 'idle' ? (
          <>
            {validationError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationError}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Date Selection Type */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Selection Type</InputLabel>
                  <Select
                    value={dateType}
                    onChange={(e) => setDateType(e.target.value)}
                    label="Date Selection Type"
                  >
                    <MenuItem value="dateRange">Select Date Range</MenuItem>
                    <MenuItem value="monthYear">Select Month & Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Range or Month/Year Selection */}
              {dateType === 'dateRange' ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Month</InputLabel>
                      <Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        label="Month"
                      >
                        {[
                          "January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"
                        ].map((m, index) => (
                          <MenuItem key={index} value={index + 1}>{m}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Year"
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      size="small"
                      InputProps={{
                        inputProps: { 
                          min: 2000, 
                          max: new Date().getFullYear() + 5 
                        }
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Report Type */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type of Report</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Type of Report"
                  >
                    <MenuItem value="cedula">Cedula</MenuItem>
                    <MenuItem value="gfAndTf">GF and TF</MenuItem>
                    <MenuItem value="rpt">RPT</MenuItem>
                    <MenuItem value="all">All Reports</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Cashier Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cashier</InputLabel>
                  <Select
                    value={cashier}
                    onChange={(e) => setCashier(e.target.value)}
                    label="Cashier"
                  >
                    <MenuItem value="all">All Cashiers</MenuItem>
                    {getFilteredCashiers().map((c) => (
                      <MenuItem 
                        key={`${c.table}-${c.id}`} 
                        value={c.id}
                      >
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* OR Type Selection (hidden for cedula) */}
              {cashier !== 'all' && reportType !== 'cedula' && (
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type of OR</InputLabel>
                    <Select
                      value={orType}
                      onChange={(e) => setOrType(e.target.value)}
                      label="Type of OR"
                      disabled={cashier === 'AMABELLA'}
                    >
                      <MenuItem value="CTC">CTC</MenuItem>
                      <MenuItem value="51">51</MenuItem>
                      <MenuItem value="56">56</MenuItem>
                      <MenuItem value="Cash Tickets">Cash Tickets</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* OR Range Fields (shown only for CTC/51/56) */}
              {['CTC', '51', '56'].includes(orType) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="OR From"
                      value={orFrom}
                      onChange={(e) => setOrFrom(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="OR To"
                      value={orTo}
                      onChange={(e) => setOrTo(e.target.value)}
                      size="small"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
        ) : status === 'loading' ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary">
              Generating your report... {progress}%
            </Typography>
          </Box>
        ) : status === 'success' ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutline 
              sx={{ 
                fontSize: 60, 
                color: 'success.main',
                mb: 2
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Report Generated Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your financial report is ready to download.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ErrorOutline 
              sx={{ 
                fontSize: 60, 
                color: 'error.main',
                mb: 2
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Failed to Generate Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again or contact support.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: status === 'idle' ? '1px solid' : 'none',
        borderColor: 'divider'
      }}>
        {status === 'idle' ? (
          <>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerate}
              sx={{ borderRadius: 2 }}
              disabled={!month && dateType === 'monthYear'}
            >
              Generate Report
            </Button>
          </>
        ) : status === 'success' ? (
          <>
            <Button
              variant="outlined"
              onClick={() => setStatus('idle')}
              sx={{ borderRadius: 2 }}
            >
              New Report
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownloadOutlined />}
              onClick={handleClose}
              sx={{ borderRadius: 2 }}
            >
              Download Report
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setStatus('idle')}
            sx={{ borderRadius: 2 }}
          >
            Try Again
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReport;