import React, { useState } from 'react';
import { DialogTitle,Dialog,Box,Typography,DialogContent,FormControl,InputLabel,Select,MenuItem, TextField } from '@mui/material';
import {
  DescriptionOutlined,CalendarToday
} from '@mui/icons-material';

function GenerateReport({ open, onClose }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [dateType, setDateType] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  
  const handleClose = () => {
    setStatus('idle');
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

      <DialogContent sx={{ py: 35 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 4,
          backgroundColor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{
            display: 'flex',
            flex: 1,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            minWidth: { sm: '400px' }
          }}>
            <FormControl fullWidth size="small">
              <InputLabel id="date-type-label">Date Selection Type</InputLabel>
              <Select
                labelId="date-type-label"
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
              >
                <MenuItem value="dateRange">Select Date Range</MenuItem>
                <MenuItem value="monthYear">Select Month & Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {dateType === 'dateRange' && (
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 4
          }}>
            <TextField
              id="date-from"
              label="Date From"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={{ width: '100%' }}
            />
            <TextField
              id="date-to"
              label="Date To"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              sx={{ width: '100%' }}
            />
          </Box>
        )}

        {dateType === 'monthYear' && (
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 4
          }}>
            <TextField
              id="month"
              label="Month"
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              sx={{ width: '100%' }}
            />
            <TextField
              id="year"
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ width: '100%' }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default GenerateReport
