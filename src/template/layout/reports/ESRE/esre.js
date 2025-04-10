import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  ButtonBase,
  Container,
  Menu,
  Dialog,
  MenuItem,DialogTitle,
  DialogContent,
  DialogContentText,
  Button,IconButton,CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import TaxOnBusinessDialogContent from './component/TaxOnBusinessDialogContent';
import RegulatoryFeesDialogContent from './component/RegulatoryFeeAndChargesDialogContent';
import ServiceUserChargesDialogContent from './component/ServiceUserChargesDialogContent';
import ReceiptsFromEconomicDialogContent from './component/ReceiptsFromEconomicEnterprisesDialogContent';
import OtherTaxesDialogContent from './component/OtherTaxesDialogContent';
import OtherIncomeDialogContent from './component/OtherIncomeDialogContent';

// Utility functions
const convertQuarterToMonths = (quarter) => {
  const quarterMap = {
    'Q1 - Jan, Feb, Mar': [1, 2, 3],
    'Q2 - Apr, May, Jun': [4, 5, 6],
    'Q3 - Jul, Aug, Sep': [7, 8, 9],
    'Q4 - Oct, Nov, Dec': [10, 11, 12],
  };
  return quarterMap[quarter] || [];
};

export default function Esre() {
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [anchorQuarter, setAnchorQuarter] = useState(null);
  const [anchorYear, setAnchorYear] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);



 
  const [taxBusinessData, setTaxBusinessData] = useState({
    value: 0,
    loading: true,
    error: null
  });

  // Filter options
  const quarterOptions = [
    'Q1 - Jan, Feb, Mar',
    'Q2 - Apr, May, Jun',
    'Q3 - Jul, Aug, Sep',
    'Q4 - Oct, Nov, Dec',
  ];
 
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  // Fetch Tax on Business data
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        setTaxBusinessData(prev => ({ ...prev, loading: true, error: null }));
        
        const months = convertQuarterToMonths(selectedQuarter);
        const params = new URLSearchParams({
          year: selectedYear,
          months: months?.join(',') || ''
        });
  
        const response = await fetch(`http://192.168.101.108:3001/api/TaxOnBusinessTotalESREBox?${params}`);
        
        // First check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Invalid response format: ${text.slice(0, 100)}`);
        }
  
        const data = await response.json();
        
        // Validate response structure
        if (typeof data.total === 'undefined' || typeof data.currency === 'undefined') {
          throw new Error('Invalid response structure from server');
        }
  
        setTaxBusinessData({
          value: data.total,
          loading: false,
          error: null
        });
  
      } catch (err) {
        console.error('Fetch error:', err);
        setTaxBusinessData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`
        });
      }
    };
  
    fetchTaxData();
  }, [selectedQuarter, selectedYear]);

  // Dashboard boxes configuration
  const dashboardBoxes = [
    { 
      title: 'TAX ON BUSINESS',
      value: taxBusinessData.loading ? 
        <CircularProgress size={24} /> : 
        taxBusinessData.error || 
        new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(taxBusinessData.value),
      trend: '+12%', // You can implement trend calculation similarly
      color: '#e3f2fd',
      isDynamic: true
    },
    // Static boxes
    { title: 'REGULATORY FEES', value: '24', trend: '+3', color: '#d0f0c0' },
    { title: 'SERVICE/USER CHARGES', value: '87%', trend: '+5%', color: '#ede7f6' },
    { title: 'RECEIPTS FROM ECONOMIC ENTERPRISES', value: '4.8/5.0', trend: '+0.2', color: '#fff8e1' },
    { title: 'OTHER TAXES', value: '38', trend: '-7', color: '#ffebee' },
    { title: 'OTHER INCOME RECEIPTS', value: '-2.3%', trend: '+0.5%', color: '#e8eaf6' },
  ];

  const dialogContentMap = {
    'TAX ON BUSINESS': (
      <TaxOnBusinessDialogContent 
        quarter={selectedQuarter}
        year={selectedYear}
      />
    ),
    'REGULATORY FEES': <RegulatoryFeesDialogContent />,
    'SERVICE/USER CHARGES': <ServiceUserChargesDialogContent />,
    'RECEIPTS FROM ECONOMIC ENTERPRISES': <ReceiptsFromEconomicDialogContent />,
    'OTHER TAXES': <OtherTaxesDialogContent />,
    'OTHER INCOME RECEIPTS': <OtherIncomeDialogContent />,
  };

  const handleDialogClose = () => {
    setSelectedBox(null); // closes the dialog
  };

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            ESRE Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Executive Summary Reporting Engine
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              endIcon={<ExpandMoreIcon />}
              onClick={(e) => setAnchorQuarter(e.currentTarget)}
            >
              {selectedQuarter || 'Select Quarter'}
            </Button>
            <Menu
              anchorEl={anchorQuarter}
              open={Boolean(anchorQuarter)}
              onClose={() => setAnchorQuarter(null)}
            >
              {quarterOptions.map((quarter) => (
                <MenuItem
                  key={quarter}
                  onClick={() => {
                    setSelectedQuarter(quarter);
                    setAnchorQuarter(null);
                  }}
                >
                  {quarter}
                </MenuItem>
              ))}
            </Menu>
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              fullWidth
              endIcon={<ExpandMoreIcon />}
              onClick={(e) => setAnchorYear(e.currentTarget)}
            >
              {selectedYear}
            </Button>
            <Menu
              anchorEl={anchorYear}
              open={Boolean(anchorYear)}
              onClose={() => setAnchorYear(null)}
            >
              {yearOptions.map((year) => (
                <MenuItem
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setAnchorYear(null);
                  }}
                >
                  {year}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>

        {/* Dashboard Boxes */}
        <Grid container spacing={3}>
          {dashboardBoxes.map((box, index) => {
            const trendIsPositive = box.trend.startsWith('+');
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ButtonBase
                  onClick={() => setSelectedBox(box)}
                  sx={{ width: '100%', borderRadius: 3 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      backgroundColor: box.color,
                      borderRadius: 3,
                      width: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      ...(box.isDynamic && taxBusinessData.error ? {
                        border: '2px solid #ff4444',
                        boxShadow: '0 0 8px rgba(255, 68, 68, 0.3)'
                      } : {})
                    }}
                  >
                    {box.isDynamic && taxBusinessData.loading && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CircularProgress />
                      </Box>
                    )}

                    <Typography variant="subtitle1" fontWeight="medium">
                      {box.title}
                      {box.isDynamic && taxBusinessData.error && (
                        <Typography variant="caption" color="error" ml={1}>
                          (Error)
                        </Typography>
                      )}
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" fontWeight="bold">
                        {box.value}
                      </Typography>
                      <Chip
                        label={box.trend}
                        size="small"
                        sx={{
                          backgroundColor: trendIsPositive ? '#c8e6c9' : '#ffcdd2',
                          color: trendIsPositive ? '#256029' : '#b71c1c',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Paper>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>

        {/* Dialog */}
        {/* Dialog */}
<Dialog
  open={Boolean(selectedBox)}
  onClose={handleDialogClose}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography>
      {selectedBox?.title || 'Details'}
    </Typography>
    <IconButton onClick={handleDialogClose} edge="end" aria-label="close">
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers>
  {selectedBox?.title ? (
    dialogContentMap[selectedBox.title]
  ) : (
    <DialogContentText component="div">
      <Typography variant="body1" gutterBottom>
        <strong>Value:</strong> {selectedBox?.value}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Trend:</strong> {selectedBox?.trend}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Selected Quarter:</strong> {selectedQuarter || 'None'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Selected Year:</strong> {selectedYear}
      </Typography>
    </DialogContentText>
  )}
</DialogContent>
</Dialog>
      </Container>
    </Box>
  );
}
