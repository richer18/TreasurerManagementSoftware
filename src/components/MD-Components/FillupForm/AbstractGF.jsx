import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert, Box,
  DialogActions,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,Button
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../../template/layout/abstract/GeneralFund/TableData/LinearProgressWithLabel';


const Root = styled(Box)({
  padding: '30px',
  borderRadius: '8px',
  overflow: "hidden",
});

const GridContainer = styled(Grid)({
  spacing: 2,
  justifyContent: 'center',
});

const GridItem = styled(Grid)({
  marginBottom: '16px',
});

// const Title = styled(Typography)({
//   textAlign: 'center',
//   marginBottom: '20px',
//   fontWeight: 'bold',
//   fontSize: '1.5rem',
//   color: 'black',
// });

const fieldOptions = [
  'Manufacturing', 'Distributor', 'Retailing', 'Financial', 'Other_Business_Tax', 'Sand_Gravel',
  'Fines_Penalties', "Mayors_Permit", 'Weighs_Measure', 'Tricycle_Operators', 'Occupation_Tax',
  'Cert_of_Ownership', 'Cert_of_Transfer', 'Cockpit_Prov_Share', 'Cockpit_Local_Share', 'Sultadas',
  'Miscellaneous_Fee', 'Reg_of_Birth', 'Marriage_Fees', 'Burial_Fees', 'Correction_of_Entry',
  'Fishing_Permit_Fee', 'Sale_of_Agri_Prod', 'Sale_of_Acct_Form', 'Water_Fees', 'Stall_Fees',
  'Cash_Tickets', 'Slaughter_House_Fee', 'Rental_of_Equipment', 'Doc_Stamp', 'Police_Report_Clearance',
  'Secretaries_Fee', 'Med_Dent_Lab_Fees', 'Garbage_Fees', 'Docking_Mooring_Fee', 'Cutting_Tree'
];

const cashier = ['Please a select','FLORA MY','IRIS','RICARDO','AGNES','AMABELLA'];

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

function AbstractGF({ data, mode }) {
  // -----------------------------
  //  STATE
  // -----------------------------
  const [selectedDate, setSelectedDate] = useState(null);
  const [taxpayerName, setTaxpayerName] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [typeReceipt, setTypeReceipt] = useState('');
  const [selectedCashier, setSelectedCashier] = useState('');
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [selectedField, setSelectedField] = useState('');
  const [showSelect, setShowSelect] = useState(true);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // -----------------------------
  //  PREFILL IF EDIT MODE
  // -----------------------------
  useEffect(() => {
    if (mode === 'edit' && data) {
      // The field names below must match the DB fields from your table
      setSelectedDate(data.date || null);
      setTaxpayerName(data.name || '');
      setReceiptNumber(data.receipt_no || '');
      setTypeReceipt(data.type_receipt || '');
      setSelectedCashier(data.cashier || '');

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

  // -----------------------------
  //  CALCULATE TOTAL
  // -----------------------------
  useEffect(() => {
    const totalSum = Object.values(fieldValues)
      .reduce((acc, value) => acc + parseFloat(value || 0), 0);
    setTotal(totalSum);
  }, [fieldValues]);

  // -----------------------------
  //  FIELD HANDLERS
  // -----------------------------
  const handleChange = (event) => {
    setSelectedCashier(event.target.value);
  };
  const handleFieldChange = (field, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleRemoveField = (removedField) => {
    const updatedFields = fields.filter((f) => f !== removedField);
    setFields(updatedFields);

    setFieldValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[removedField];
      return updatedValues;
    });
  };
  const handleFieldSelect = (event) => {
    const newSelectedField = event.target.value;
    if (newSelectedField) {
      setFields([...fields, newSelectedField]);
      setFieldValues({ ...fieldValues, [newSelectedField]: '' });
      setSelectedField('');
      setSelectedField(event.target.value);
      setShowSelect(false);
    }
  };
  const handleNewField = () => {
    setShowSelect(true);
  };

  // -----------------------------
  //  RESET ALL
  // -----------------------------
  const handleClearFields = React.useCallback(() => {
    setSelectedDate(null);
    setTaxpayerName('');
    setReceiptNumber('');
    setTypeReceipt('');
    setSelectedCashier('');
    setFieldValues({});
    setFields([]);
  }, []);

  // -----------------------------
  //  SAVE / UPDATE
  // -----------------------------
  // Helper function to fill in 0 for any missing fields
  const getDefaultFieldValues = (fieldsObj) => {
    const defaultValues = {};
    fieldOptions.forEach((field) => {
      defaultValues[field] = fieldsObj[field] || 0;
    });
    return defaultValues;
  };

  const handleSave = React.useCallback(async (event) => {
    event.preventDefault();
  
    // Basic validation
    if (!selectedDate || !taxpayerName || !receiptNumber || !typeReceipt || !selectedCashier) {
      setAlertMessage('Please fill out all required fields.');
      setAlertSeverity('error');
      return;
    }
  
    for (const [field, value] of Object.entries(fieldValues)) {
      if (!value) {
        setAlertMessage(`Please fill out the field: ${field}.`);
        setAlertSeverity('error');
        return;
      }
    }
  
    // Fix date format to prevent time zone issues
    const dateToSave = new Date(selectedDate);
    dateToSave.setHours(0, 0, 0, 0); // Set time to midnight (local)
    const formattedDate = `${dateToSave.getFullYear()}-${(dateToSave.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${dateToSave.getDate().toString().padStart(2, '0')}`;
  
    console.log("Formatted Date:", formattedDate); // Debugging log
  
    // Merge with default 0 fields
    const defaultFieldValues = getDefaultFieldValues(fieldValues);
  
    // Build data payload
    const payload = {
      date: formattedDate, // Use the fixed date format
      name: taxpayerName,
      receipt_no: receiptNumber,
      ...defaultFieldValues,
      total: total,
      cashier: selectedCashier,
      type_receipt: typeReceipt,
    };
  
    // If in EDIT MODE, use PUT request
    if (mode === 'edit' && data && data.id) {
      try {
        setLoading(true);
        const response = await fetch(
          `http://192.168.101.108:3001/api/updateGeneralFundData/${data.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
  
        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            setAlertMessage(errorData.message || 'Duplicate receipt number');
            setAlertSeverity('error');
            setLoading(false);
            return;
          }
          throw new Error('Network response was not ok');
        }
  
        setTimeout(() => {
          handleClearFields();
          window.location.reload();
          setAlertMessage('Data updated successfully.');
          setAlertSeverity('success');
          setLoading(false);
        }, 3000);
  
      } catch (error) {
        console.error('Failed to update data:', error);
        setAlertMessage('Failed to update data.');
        setAlertSeverity('error');
        setLoading(false);
      }
      return;
    }
  
    // Otherwise, assume ADD mode:
    try {
      setLoading(true);
      const response = await fetch('http://192.168.101.108:3001/api/saveGeneralFundData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setAlertMessage(errorData.message);
          setAlertSeverity('error');
          setLoading(false);
          return;
        }
        throw new Error('Network response was not ok');
      }
  
      setTimeout(() => {
        handleClearFields();
        window.location.reload();
        setAlertMessage('Data saved successfully.');
        setAlertSeverity('success');
        setLoading(false);
      }, 3000);
  
    } catch (error) {
      console.error('Failed to save data:', error);
      setAlertMessage('Failed to save data.');
      setAlertSeverity('error');
      setLoading(false);
    }
  }, [
    mode,
    data,
    selectedDate,
    taxpayerName,
    receiptNumber,
    typeReceipt,
    selectedCashier,
    fieldValues,
    total,
    handleClearFields
  ]);
  

  // -----------------------------
  //  PROGRESS ANIMATION
  // -----------------------------
  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            // If you want to automatically call handleSave() on reaching 100%, do so here
            return 100;
          }
          const diff = Math.random() * 10;
          return Math.min(prevProgress + diff, 100);
        });
      }, 300);
      return () => {
        clearInterval(timer);
      };
    }
  }, [loading]);

  // -----------------------------
  //  RENDER
  // -----------------------------
  const filtered = filterOptions(fieldOptions);

  return (
    <Root>
      {/* <Title>General Fund Abstracts ({mode === 'edit' ? 'Edit' : 'Add'})</Title> */}
      <GridContainer container>
        <GridItem item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              fullWidth
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(newValue) => setSelectedDate(newValue ? newValue.format('YYYY-MM-DD') : null)}
              slotProps={{ field: { clearable: true } }}
              required
            />
          </LocalizationProvider>
        </GridItem>

        <GridItem item xs={12}>
          <TextField
            id="filled-taxpayer"
            value={taxpayerName}
            onChange={(e) => setTaxpayerName(e.target.value)}
            label="NAME OF TAXPAYER"
            variant="standard"
            fullWidth
            required
          />
        </GridItem>

        <GridItem item xs={12}>
          <TextField
            id="filled-receipt"
            label="RECEIPT NO. P.F. NO. 25(A)"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            variant="standard"
            fullWidth
            required
          />
        </GridItem>

        <GridItem item xs={12}>
          <TextField
            id="type-receipt"
            label="Type of Receipt"
            variant="standard"
            value={typeReceipt}
            onChange={(e) => setTypeReceipt(e.target.value)}
            fullWidth
            required
          />
        </GridItem>

        <GridItem item xs={12}>
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
        </GridItem>

        {/* DYNAMIC FIELDS */}
        {fields.map((field) => (
          <GridItem item xs={12} key={field}>
            <TextField
              label={field}
              variant="standard"
              fullWidth
              value={fieldValues[field] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              sx={{ marginBottom: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleRemoveField(field)}>
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
          </GridItem>
        ))}

        {showSelect && (
          <GridItem item xs={12}>
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
                    style: { maxHeight: 300 },
                  },
                }}
              >
                {filtered.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </GridItem>
        )}
        <GridItem item xs={12}>
          <Button onClick={handleNewField} variant="contained">
            Add New Field
          </Button>
        </GridItem>

        <GridItem item xs={12}>
          <Typography variant="h6" color="black">Total: {total.toFixed(2)}</Typography>
        </GridItem>
      </GridContainer>

      <DialogActions>
        <Button onClick={handleClearFields} color="secondary">
          Reset
        </Button>
        {/* The SAME handleSave for both add & edit */}
        <Button onClick={handleSave} color="secondary" variant="contained">
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </DialogActions>

      {loading && (
        <Grid item xs={12}>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        </Grid>
      )}

      {alertMessage && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
    </Root>
  );
}

export default AbstractGF;
