import { Box, Button, LinearProgress, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './style.css';

const Root = styled(Box)({
  padding: '30px',
  
  borderRadius: '8px',
  
});


// InputField component for consistent styling
const InputField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));


const parseOrDefault = (value, defaultValue = 0) => parseFloat(value) || defaultValue;

const extractMainData = (data) => ({
  date: data.date,
  name: data.name,
  receipt_no: data.receipt,
  barangay: data.barangay,
  status: data.status,
  cashier: data.cashier,
});

const extractCurrentData = (data) => ({
  current_year: parseOrDefault(data.currentYear),
  current_penalties: parseOrDefault(data.currentPenalties),
  current_discounts: parseOrDefault(data.currentDiscounts),
});

const extractPreviousData = (data) => ({
  prev_year: parseOrDefault(data.prevYear),
  prev_penalties: parseOrDefault(data.prevPenalties),
  prior_years: parseOrDefault(data.priorYears),
  prior_penalties: parseOrDefault(data.priorPenalties),
});

const extractAdditionalData = (data) => ({
  additional_current_year: parseOrDefault(data.additionalCurrentYear),
  additional_penalties: parseOrDefault(data.additionalCurrentPenalties),
  additional_discounts: parseOrDefault(data.additionalCurrentDiscounts),
  additional_prev_year: parseOrDefault(data.additionalPrevYear),
  additional_prev_penalties: parseOrDefault(data.additionalPrevPenalties),
  additional_prior_years: parseOrDefault(data.additionalPriorYears),
  additional_prior_penalties: parseOrDefault(data.additionalPriorPenalties),
});

const extractTotals = (data) => ({
  total: parseOrDefault(data.total),
  additional_total: parseOrDefault(data.additionalTotal),
  gf_total: parseOrDefault(data.gfTotal),
  share: parseOrDefault(data.share),
});

const createData = (data) => ({
  ...extractMainData(data),
  ...extractCurrentData(data),
  ...extractPreviousData(data),
  ...extractAdditionalData(data),
  ...extractTotals(data),
});

const initialFormData = {
  date: '',
  barangay: '',
  cashier: '',
  currentYear: 0,
  currentPenalties: 0,
  currentDiscounts: 0,
  prevYear: 0,
  prevPenalties: 0,
  priorYears: 0,
  priorPenalties: 0,
  total: 0,
  share: 0,
  additionalCurrentYear: 0,
  additionalCurrentPenalties: 0,
  additionalCurrentDiscounts: 0,
  additionalPrevYear: 0,
  additionalPrevPenalties: 0,
  additionalPriorYears: 0,
  additionalPriorPenalties: 0,
  additionalTotal: 0,
  gfTotal: 0,
  name: '',
  receipt: '',
  status: '',
};


function LinearProgressWithLabel({ value }) {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function AbstractRPT({ data, onSave }) {
  const [formData, setFormData] = useState(data || initialFormData);

  const [showProgress, setShowProgress] = useState(false); // Progress visibility
  const [progress, setProgress] = useState(0); // Progress value for simulation

  // Simulate a progress update (optional)
  const simulateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      if (value >= 100) {
        clearInterval(interval);
        setProgress(100);
      } else {
        setProgress(value);
      }
    }, 200);
  };

  useEffect(() => {
    console.log("Received data for edit:", data); // Debugging

    if (data) {
      const updatedFormData = {
        ...initialFormData, // Ensures all fields are present
        ...data,
        date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : '',
      };
      setFormData(updatedFormData);
    } else {
      setFormData(initialFormData);
    }
  }, [data]);

  React.useEffect(() => {
    console.log("Received data in AbstractRPT:", data);
    if (data) {
      setFormData({ ...initialFormData, ...data }); // Merge missing fields
    }
  }, [data]); // ✅ Now it's correctly inside AbstractRPT

  const [errors, setErrors] = useState({
    date: '',
    name: '',
    receipt: '',
    currentYear: '',
    currentPenalties: '',
    currentDiscounts: '',
    prevYear: '',
    prevPenalties: '',
    priorYears: '',
    priorPenalties: '',
    barangay: '',
    share: '',
    additionalCurrentYear: '',
    additionalCurrentPenalties: '',
    additionalCurrentDiscounts: '',
    additionalPrevYear: '',
    additionalPrevPenalties: '',
    additionalPriorYears: '',
    additionalPriorPenalties: '',
    additionalTotal: '',
    gfTotal: '',
    status: '',
    cashier: ''
  });

  const validateForm = () => {
    const newErrors = {};

    // Convert falsy but valid values (like "0") to a valid check
    if (formData.currentPenalties === "" || formData.currentPenalties === null) 
        newErrors.currentPenalties = "Penalties are required";

    if (formData.prevYear === "" || formData.prevYear === null) 
        newErrors.prevYear = "Immediate Preceding Year is required";

    if (formData.prevPenalties === "" || formData.prevPenalties === null) 
        newErrors.prevPenalties = "Penalties are required";

    if (formData.priorYears === "" || formData.priorYears === null) 
        newErrors.priorYears = "Prior Years is required";

    if (formData.priorPenalties === "" || formData.priorPenalties === null) 
        newErrors.priorPenalties = "Penalties are required";

    // Log formData to debug what's being checked
    console.log("formData before validation:", formData);

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};


  useEffect(() => {
    const fetchListings = async () => {
     
    };

    fetchListings();

    const parseNumber = (value) => parseFloat(value) || 0;

    const computedTotal =
      parseNumber(formData.currentYear) +
      parseNumber(formData.currentPenalties) -
      parseNumber(formData.currentDiscounts) +
      parseNumber(formData.prevYear) +
      parseNumber(formData.prevPenalties) +
      parseNumber(formData.priorYears) +
      parseNumber(formData.priorPenalties);

    const computedAdditionalTotal =
      parseNumber(formData.additionalCurrentYear) +
      parseNumber(formData.additionalCurrentPenalties) -
      parseNumber(formData.additionalCurrentDiscounts) +
      parseNumber(formData.additionalPrevYear) +
      parseNumber(formData.additionalPrevPenalties) +
      parseNumber(formData.additionalPriorYears) +
      parseNumber(formData.additionalPriorPenalties);

    setFormData((prevData) => ({
      ...prevData,
      total: computedTotal,
      additionalTotal: computedAdditionalTotal,
      share: computedTotal * 0.25,
      gfTotal: computedTotal + computedAdditionalTotal,
    }));
  }, [
    formData.currentYear, formData.currentPenalties, formData.currentDiscounts,
    formData.prevYear, formData.prevPenalties, formData.priorYears, formData.priorPenalties,
    formData.additionalCurrentYear, formData.additionalCurrentPenalties, formData.additionalCurrentDiscounts,
    formData.additionalPrevYear, formData.additionalPrevPenalties, formData.additionalPriorYears, formData.additionalPriorPenalties
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      // Form is valid, proceed with submission logic
      console.log('Form Data:', formData);
    }
  };
 

const handleReset = () => {
    setErrors({});
    setFormData(initialFormData);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
  
    setShowProgress(true);
    simulateProgress();
  
    const newEntry = createData({ ...formData });
  
    try {
      let response;
      const baseUrl = "http://192.168.101.108:3001/api";
  
      if (formData.id) {
        // Update logic
        response = await axios.put(`${baseUrl}/update/${formData.id}`, newEntry);
        console.log("Update response:", response.data);
        alert("Data updated successfully");
      } else {
        // Insert logic
        response = await axios.post(`${baseUrl}/save`, newEntry);
        console.log("Insert response:", response.data);
        alert("Data inserted successfully");
      }
  
      setProgress(100);
      setTimeout(() => {
        setShowProgress(false);
        onSave(newEntry); // Call onSave only after progress bar finishes
      }, 500);
  
      // Instead of reloading the page, you should update the state
      setTimeout(() => {
        // Example: Fetch new data instead of reloading
        // fetchData();
        window.location.reload(); // If necessary
      }, 1000);
    } catch (error) {
      console.error("Error saving data:", error);
      alert(error.response?.data?.error || "Error saving data");
      setShowProgress(false);
    }
  };



const handleFormDataChange = (event) => {
  const { name, value } = event.target;

  const additionalFieldNameMap = {
    currentYear: 'additionalCurrentYear',
    currentPenalties: 'additionalCurrentPenalties',
    currentDiscounts: 'additionalCurrentDiscounts',
    prevYear: 'additionalPrevYear',
    prevPenalties: 'additionalPrevPenalties',
    priorYears: 'additionalPriorYears',
    priorPenalties: 'additionalPriorPenalties',
  };

  setFormData((prevData) => {
    const isNumericField = [
      'currentYear', 'currentPenalties', 'currentDiscounts', 'prevYear',
      'prevPenalties', 'priorYears', 'priorPenalties', 'total', 'share',
      'additionalCurrentYear', 'additionalCurrentPenalties', 'additionalCurrentDiscounts',
      'additionalPrevYear', 'additionalPrevPenalties', 'additionalPriorYears',
      'additionalPriorPenalties', 'additionalTotal', 'gfTotal'
    ].includes(name);

    const newValue = isNumericField ? (parseFloat(value) || 0) : value;

    const newState = { ...prevData, [name]: newValue };

    if (additionalFieldNameMap[name]) {
      newState[additionalFieldNameMap[name]] = newValue;
    }

    return newState;
  });
};



  return (
    <Root>
  <form onSubmit={handleSubmit}>
    
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InputField
        margin="dense"
        label="Date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        name="date"
        value={formData.date}
        onChange={handleFormDataChange}
        required
        error={!!errors.date}
        helperText={errors.date}
        sx={{ mb: 2 }}
      />
            <InputField
              autoFocus
              margin="dense"
              label="Name of Taxpayer"
              fullWidth
              name="name"
              value={formData.name}
              onChange={(e) => handleFormDataChange({ target: { name: e.target.name, value: e.target.value.toUpperCase() } })}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <InputField
              margin="dense"
              label="Receipt No. P.F. No. 25(A)"
              fullWidth
              name="receipt"
              value={formData.receipt}
              onChange={handleFormDataChange}
              required
              error={!!errors.receipt}
              helperText={errors.receipt}
            />
            <InputField
              margin="dense"
              label="Current Year"
              type="number"
              fullWidth
              name="currentYear"
              value={formData.currentYear}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Penalties"
              type="number"
              fullWidth
              name="currentPenalties"
              value={formData.currentPenalties}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Discounts"
              type="number"
              fullWidth
              name="currentDiscounts"
              value={formData.currentDiscounts}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Immediate Preceding Year"
              type="number"
              fullWidth
              name="prevYear"
              value={formData.prevYear}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Penalties"
              type="number"
              fullWidth
              name="prevPenalties"
              value={formData.prevPenalties}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Prior Years"
              type="number"
              fullWidth
              name="priorYears"
              value={formData.priorYears}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
         
            <InputField
              margin="dense"
              label="Penalties"
              type="number"
              fullWidth
              name="priorPenalties"
              value={formData.priorPenalties}
              onChange={handleFormDataChange}
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
         
            <InputField
              margin="dense"
              label="Total"
              type="number"
              fullWidth
              InputProps={{
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
              value={formData.total}
            />
            <FormControl fullWidth margin="dense" error={!!errors.barangay} required sx={{ mb: 2 }}>
              <InputLabel>Barangay</InputLabel>
              <Select
                name="barangay"
                value={formData.barangay}
                onChange={handleFormDataChange}
                label="Barangay"
              >
                <MenuItem value="BASAC">BASAC</MenuItem>
                <MenuItem value="CALANGO">CALANGO</MenuItem>
                <MenuItem value="LUTOBAN">LUTOBAN</MenuItem>
                <MenuItem value="MALONGCAY-DIOT">MALONGCAY-DIOT</MenuItem>
                <MenuItem value="MALUAY">MALUAY</MenuItem>
                <MenuItem value="MAYABON">MAYABON</MenuItem>
                <MenuItem value="NABAGO">NABAGO</MenuItem>
                <MenuItem value="NASIG-ID">NASIG-ID</MenuItem>
                <MenuItem value="NAJANDIG">NAJANDIG</MenuItem>
                <MenuItem value="POBLACION">POBLACION</MenuItem>
              </Select>
              <FormHelperText>{errors.barangay}</FormHelperText>
            </FormControl>
            <InputField
              margin="dense"
              label="25% Share"
              type="number"
              fullWidth
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
              value={formData.share}
            />
            <InputField
              margin="dense"
              label="Additional Current Year"
              type="number"
              fullWidth
              name="additionalCurrentYear"
              value={formData.additionalCurrentYear}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
          
            <InputField
              margin="dense"
              label="Additional Penalties"
              type="number"
              fullWidth
              name="additionalCurrentPenalties"
              value={formData.additionalCurrentPenalties}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Additional Discounts"
              type="number"
              fullWidth
              name="additionalCurrentDiscounts"
              value={formData.additionalCurrentDiscounts}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Additional Immediate Preceding Year"
              type="number"
              fullWidth
              name="additionalPrevYear"
              value={formData.additionalPrevYear}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Additional Penalties"
              type="number"
              fullWidth
              name="additionalPrevPenalties"
              value={formData.additionalPrevPenalties}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Additional Prior Years"
              type="number"
              fullWidth
              name="additionalPriorYears"
              value={formData.additionalPriorYears}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Additional Penalties"
              type="number"
              fullWidth
              name="additionalPriorPenalties"
              value={formData.additionalPriorPenalties}
              onChange={handleFormDataChange}
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <InputField
              margin="dense"
              label="Additional Total"
              type="number"
              fullWidth
              name="additionalTotal"
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
              value={formData.additionalTotal}
            />
            <InputField
              margin="dense"
              label="GF and SEF"
              fullWidth
              InputProps={{
                readOnly: true, // Prevents user input
                inputProps: { step: "any" },
                sx: {
                  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  'input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
              value={formData.gfTotal}
              onChange={(e) => handleFormDataChange({ target: { name: 'gfTotal', value: e.target.value } })}
            />
            <FormControl fullWidth margin="dense" error={!!errors.status} required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormDataChange}
                label="Status"
              >
                <MenuItem value="LAND-COMML">LAND-COMML</MenuItem>
                <MenuItem value="LAND-AGRI">LAND-AGRI</MenuItem>
                <MenuItem value="LAND-RES">LAND-RES</MenuItem>
                <MenuItem value="BLDG-RES">BLDG-RES</MenuItem>
                <MenuItem value="BLDG-COMML">BLDG-COMML</MenuItem>
                <MenuItem value="MACHINERY">MACHINERY</MenuItem>
                <MenuItem value="BLDG-INDUS">BLDG-INDUS</MenuItem>
                <MenuItem value="SPECIAL">SPECIAL</MenuItem>
              </Select>
              <FormHelperText>{errors.status}</FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="dense" error={!!errors.cashier} required>
              <InputLabel>Cashier</InputLabel>
              <Select
                name="cashier"
                value={formData.cashier}
                onChange={handleFormDataChange}
                label="Cashier"
              >
                <MenuItem value="IRIS RAFALES">IRIS RAFALES</MenuItem>
                <MenuItem value="RICARDO ENOPIA">RICARDO ENOPIA</MenuItem>
                <MenuItem value="FLORA MY FERRER">FLORA MY FERRER</MenuItem>
                <MenuItem value="AGNES ELLO">AGNES ELLO</MenuItem>
              </Select>
              <FormHelperText>{errors.cashier}</FormHelperText>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button 
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
              <Button 
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
              >
                Save
              </Button>

               {/* Loading Indicator */}
        {showProgress && <LinearProgressWithLabel value={progress} />}
            </Box>
        </form>
        </Root>
 
  );
}

AbstractRPT.propTypes = {
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default AbstractRPT;
