import { Box, Button, LinearProgress, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
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
import MDTypography from '../../../components/MDTypography';
import './style.css';

const Root = styled(Box)({
  padding: '30px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const GridContainer = styled(Grid)({
  spacing: 2,
  justifyContent: 'center',
});


const Title = styled(MDTypography)({
  textAlign: 'center',
  marginBottom: '20px',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#0a0a0a',
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
  currentYear: '',
  currentPenalties: '',
  currentDiscounts: '',
  prevYear: '',
  prevPenalties: '',
  priorYears: '',
  priorPenalties: '',
  total: 0,
  share: 0,
  additionalCurrentYear: '',
  additionalCurrentPenalties: '',
  additionalCurrentDiscounts: '',
  additionalPrevYear: '',
  additionalPrevPenalties: '',
  additionalPriorYears: '',
  additionalPriorPenalties: '',
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

function AbstractRPT({ data, onSave, onClose }) {
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
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.name) newErrors.name = 'Name of Taxpayer is required';
    if (!formData.receipt) newErrors.receipt = 'Receipt No. P.F. No. 25(A) is required';
    if (!formData.currentYear) newErrors.currentYear = 'Current Year is required';
    if (!formData.currentPenalties) newErrors.currentPenalties = 'Penalties are required';
    if (!formData.currentDiscounts) newErrors.currentDiscounts = 'Discounts are required';
    if (!formData.prevYear) newErrors.prevYear = 'Immediate Preceding Year is required';
    if (!formData.prevPenalties) newErrors.prevPenalties = 'Penalties are required';
    if (!formData.priorYears) newErrors.priorYears = 'Prior Years is required';
    if (!formData.priorPenalties) newErrors.priorPenalties = 'Penalties are required';
    if (!formData.barangay) newErrors.barangay = 'Barangay is required';
    if (!formData.share) newErrors.share = '25% Share is required';
    if (!formData.additionalCurrentYear) newErrors.additionalCurrentYear = 'Additional Current Year is required';
    if (!formData.additionalCurrentPenalties) newErrors.additionalCurrentPenalties = 'Additional Penalties are required';
    if (!formData.additionalCurrentDiscounts) newErrors.additionalCurrentDiscounts = 'Additional Discounts are required';
    if (!formData.additionalPrevYear) newErrors.additionalPrevYear = 'Additional Immediate Preceding Year is required';
    if (!formData.additionalPrevPenalties) newErrors.additionalPrevPenalties = 'Additional Penalties are required';
    if (!formData.additionalPriorYears) newErrors.additionalPriorYears = 'Additional Prior Years is required';
    if (!formData.additionalPriorPenalties) newErrors.additionalPriorPenalties = 'Additional Penalties are required';
    if (!formData.additionalTotal) newErrors.additionalTotal = 'Additional Total is required';
    if (!formData.gfTotal) newErrors.gfTotal = 'GF and SEF is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.cashier) newErrors.cashier = 'Cashier is required';
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

  const newEntry = createData({
    date: formData.date,
    ...formData,
  });

  try {
    let response;

    if (formData.id) {
      // Update logic
      response = await axios.put(
        `http://localhost:3001/api/update/${formData.id}`,
        newEntry
      );
      console.log('Update response:', response.data);
      alert('Data updated successfully');
    } else {
      // Insert logic
      response = await axios.post('http://localhost:3001/api/save', newEntry);
      console.log('Insert response:', response.data);
      alert('Data inserted successfully');
    }

    setProgress(100);
    setTimeout(() => setShowProgress(false), 500);
    onSave(newEntry);
  } catch (error) {
    console.error('Error saving data:', error);
    alert(error.response?.data?.error || 'Error saving data');
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
      const newState = { ...prevData, [name]: value };

      if (additionalFieldNameMap[name]) {
        newState[additionalFieldNameMap[name]] = value;
      }

      return newState;
    });
  };



  return (
    <Root>
  <form onSubmit={handleSubmit}>
    <Title sx={{ textAlign: 'center', mb: 4 }}>Abstract of Real Property Tax</Title>
    
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
  onClose: PropTypes.func.isRequired,
};

export default AbstractRPT;
