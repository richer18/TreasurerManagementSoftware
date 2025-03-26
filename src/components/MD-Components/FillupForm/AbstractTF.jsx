import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Box, DialogActions, Grid, IconButton, InputAdornment, Select, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../../template/layout/abstract/GeneralFund/TableData/LinearProgressWithLabel';
import {Button} from '@mui/material';

const Root = styled(Box)({
  padding: '30px',
  borderRadius: '8px',
});
  
  const GridContainer = styled(Grid)({
    spacing: 2,
    justifyContent: 'center',
  });

  const InputField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    '& .MuiInputBase-root': {
      borderRadius: theme.shape.borderRadius,
    },
  }));



  const fieldOptions = ['BUILDING_PERMIT_FEE', 'ELECTRICAL_FEE', 'ZONING_FEE', 'LIVESTOCK_DEV_FUND', 'DIVING_FEE'];
  const cashier = ['Please a select','FLORA MY','IRIS','RICARDO','AGNES'];

const fieldConfigs = {
  BUILDING_PERMIT_FEE: {
    label: 'Building Permit Fee',
    percentages: [
      { label: 'Local Fund (80%)', value: (value) => (value * 0.8).toFixed(2) },
      { label: 'Trust Fund (15%)', value: (value) => (value * 0.15).toFixed(2) },
      { label: 'National Fund (5%)', value: (value) => (value * 0.05).toFixed(2) },
    ],
  },
  LIVESTOCK_DEV_FUND: {
    label: 'Livestock Dev. Fund',
    percentages: [
      { label: 'Local Fund (80%)', value: (value) => (value * 0.8).toFixed(2) },
      { label: 'National Fund (20%)', value: (value) => (value * 0.2).toFixed(2) },
    ],
  },
  DIVING_FEE: {
    label: 'Diving Fee',
    percentages: [
      { label: 'GF (40%)', value: (value) => (value * 0.4).toFixed(2) },
      { label: 'BRGY (30%)', value: (value) => (value * 0.3).toFixed(2) },
      { label: 'Fishers (30%)', value: (value) => (value * 0.3).toFixed(2) },
    ],
  },
  ELECTRICAL_FEE: {
    label: 'Electrical Fee',
    percentages: [],
  },
  ZONING_FEE: {
    label: 'Zoning Fee',
    percentages: [],
  },
};


  const filterOptions = (options, inputValue) => {
  if (!inputValue) {
    return options;
  }

  return options
    .filter(option => option && typeof option === 'string')
    .filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const BASE_URL = "http://192.168.101.108:3001"; // Define base URL

function AbstractTF({ data, mode,refreshData  }) {
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [showSelect, setShowSelect] = useState(true);
  const [selectedField, setSelectedField] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCashier, setSelectedCashier] = useState('');
  const [taxpayerName, setTaxpayerName] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [typeReceipt, setTypeReceipt] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);




   const handleFieldChange = (field, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
      
// Total Calculation Hook
 // Calculate Total
  useEffect(() => {
    const total = Object.values(fieldValues).reduce((acc, cur) => acc + (Number(cur) || 0), 0);
    setTotal(total.toFixed(2));
  }, [fieldValues]);

const handleChange = (event) => {
    setSelectedCashier(event.target.value);
  };

  const handleFieldSelect = (event) => {
    const selectedField = event.target.value;
    if (selectedField) {
      setFields([...fields, selectedField]);
      setFieldValues({ ...fieldValues, [selectedField]: '' });
      setSelectedField('');
      setShowSelect(false);
    }
  };

  const handleNewField = () => {
    setShowSelect(true);
  };

  const handleClearFields = React.useCallback(() => {
    setSelectedDate(null);
    setTaxpayerName('');
    setReceiptNumber('');
    setTypeReceipt('');
    setSelectedCashier('');
    setFieldValues({});
    setFields([]);
  }, []);
  
  const handleSave = useCallback(async () => {
    if (!selectedDate || !taxpayerName || !receiptNumber || !typeReceipt || !selectedCashier) {
      setAlertMessage('Please fill out all required fields.');
      setAlertSeverity('error');
      return;
    }

    const payload = {
      DATE: selectedDate,
      NAME: taxpayerName,
      RECEIPT_NO: receiptNumber,
      CASHIER: selectedCashier,
      TYPE_OF_RECEIPT: typeReceipt,
      TOTAL: total,
      ...fieldValues,
    };

    setLoading(true);

    try {
      const url = mode === 'edit'
        ? `${BASE_URL}/api/update-trust-fund/${data.ID}`
        : `${BASE_URL}/api/save-trust-fund`;

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = response.status === 400 ? 'Receipt number already exists.' : 'Failed to save data.';
        throw new Error(errorMessage);
      }

      setAlertMessage(mode === 'edit' ? 'Data updated successfully.' : 'Data saved successfully.');
      setAlertSeverity('success');

      handleClearFields();

      // Refresh the page after a short delay to allow alert messages to be shown
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adjust delay if needed
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity('error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, taxpayerName, receiptNumber, typeReceipt, selectedCashier, total, fieldValues, mode, data, handleClearFields]);


// Handle form submission and progress animation
React.useEffect(() => {
  if (loading) {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer); // Stop the timer when 100% is reached
          handleSave(); // Trigger save operation when 100% is reached
          return 100; // Ensure progress stays at 100%
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
    }, 300); // Adjust the interval time if needed

    return () => {
      clearInterval(timer);
    };
  }
}, [loading, handleSave]); // Include handleSave in the dependency array

  // Handle Remove Field
  const handleRemoveField = (fieldToRemove) => {
    const updatedFields = fields.filter((field) => field !== fieldToRemove);
    setFields(updatedFields);

    setFieldValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[fieldToRemove];
      return updatedValues;
    });
  };


   // -----------------------------
    //  PREFILL IF EDIT MODE
    // -----------------------------
    useEffect(() => {
      if (mode === 'edit' && data) {
        // The field names below must match the DB fields from your table
        setSelectedDate(data.DATE || null);
        setTaxpayerName(data.NAME || '');
        setReceiptNumber(data.RECEIPT_NO || '');
        setTypeReceipt(data.TYPE_OF_RECEIPT || '');
        setSelectedCashier(data.CASHIER || '');
  
        // For dynamic fields, if your DB includes them, you can parse them here:
        // e.g., if your row has 'Manufacturing', 'Retailing', etc. as numeric values
        // We build an array & object from what's actually present on `data`
        const newFields = [];
        const newFieldValues = {};
  
        // Check each known fieldOption, if it’s > 0 or some value, treat it as present
        fieldOptions.forEach((fieldKey) => {
          if (data[fieldKey] !== undefined && data[fieldKey] !== 0) {
            newFields.push(fieldKey);
            newFieldValues[fieldKey] = data[fieldKey].toString(); // or data[fieldKey]
          }
        });
  
        setFields(newFields);
        setFieldValues(newFieldValues);
      }
    }, [data, mode]);
    
    
    const filteredOptions = filterOptions(fieldOptions);
  return (
    <Root>
      <GridContainer container spacing={2}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
            fullWidth
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={(newValue) => setSelectedDate(newValue ? newValue.format('YYYY-MM-DD') : null)}
            slotProps={{ field: { clearable: true } }}
            required
            />
            </LocalizationProvider>
            </Grid>
                <Grid item xs={12}>
                <TextField
            id="filled-receipt"
            label="RECEIPT NO. P.F. NO. 25(A)"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            variant="standard"
            fullWidth
            required
          />
        </Grid>
                <Grid item xs={12}>
                    <InputField
                        id="filled-taxpayer-name"
                        label="NAME OF TAXPAYER"
                        value={taxpayerName}
                        variant="standard"
                        onChange={(e) => setTaxpayerName(e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
          <TextField
            id="type-receipt"
            label="Type of Receipt"
            variant="standard"
            value={typeReceipt}
            onChange={(e) => setTypeReceipt(e.target.value)}
            fullWidth
            required
          />
        </Grid>

                <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="cashier-select-label">Select Cashier</InputLabel>
            <Select
              labelId="cashier-select-label"
              id="cashier-select"
              value={selectedCashier}
              onChange={handleChange}
              label="Select Cashier"
              required
            >
              {cashier.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
       {fields.map((field) => {
  const config = fieldConfigs[field];

  if (!config) return null; // Skip fields not in the config

  const value = fieldValues[field] || '';

  return (
    <Grid item xs={12} key={field}>
      <InputField
        id={field}
        label={config.label}
        variant="standard"
        fullWidth
        required
        value={value}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleRemoveField(field)}>
                <DeleteIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {config.percentages.length > 0 && (
  <Grid container spacing={1} sx={{ mt: 2 }}>
    {config.percentages.map((percentage, index) => (
      <Grid item xs={12} key={index}>
        <Typography variant="body2" color="textSecondary">
          <strong>{percentage.label}</strong>: {percentage.value(value)}
        </Typography>
      </Grid>
    ))}
  </Grid>
)}
    </Grid>
  );
})}
        {showSelect && (
          <Grid item xs={12}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="select-field-label">Select Field</InputLabel>
              <Select
                labelId="select-field-label"
                value={selectedField}
                onChange={handleFieldSelect}
                label="Select Field"
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {filteredOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button onClick={handleNewField} variant="contained">
            Add New Field
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h9" color="secondary">Total: {total}</Typography>
        </Grid>
      </GridContainer>
      <DialogActions>
        <Button onClick={handleClearFields} color="secondary">
          Reset
        </Button>
        <Button onClick={handleSave} color="secondary" variant="contained">
          Save
        </Button>
      </DialogActions>
      {loading && (
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <LinearProgressWithLabel value={progress} />
            </Box>
          </Grid>
        )}
      {alertMessage && (
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      )}
      </Root>
  )
}

export default AbstractTF
