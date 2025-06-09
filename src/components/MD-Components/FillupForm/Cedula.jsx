
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,

  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';


// Styled Components
const Root = styled(Box)({
  padding: '30px',
  // backgroundColor: 'white',
  borderRadius: '8px',
  // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  margin: '20px auto',
});


const InputField = styled(TextField)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  '& .MuiInputBase-root': {
    borderRadius: '8px',
  },
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
});

const CustomButton = styled(Button)(({ variant }) => ({
  fontSize: '0.9rem',
  borderRadius: '8px',
  padding: '8px 16px',
  ...(variant === 'outlined' && {
    color: '#555',
    borderColor: '#ccc',
  }),
  ...(variant === 'contained' && {
    color: 'white',
    backgroundColor: '#007bff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  }),
}));

// Options for cashier dropdown
const cashierOptions = ['Please select', 'flora', 'angelique', 'ricardo', 'agnes'];

function Cedula({ data, mode }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [interest, setInterest] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedCashier, setSelectedCashier] = useState('');
  const [formData, setFormData] = useState({
    receipt: '',
    taxpayerName: '',
    taxToPay: '',
    userid: '',
  });
  


  const [savingInProgress, setSavingInProgress] = useState(false);

  const basicCommunityTax = 5.0;

  // Map data to form fields
const mapDataToForm = (data) => ({
  receipt: data?.['CTC NO'] || data?.CTCNO || '',
  taxpayerName: data?.['NAME'] || data?.OWNERNAME || '',
  taxToPay: data?.['TAX_DUE'] || data?.SALTAXDUE || '',
  userid: data?.['CASHIER'] || data?.CASHIER || '',
  ctcId: data?.['CTC_ID'] || data?.id || '', // Map the CTC_ID properly
});


  // Populate form fields when editing
 useEffect(() => {
  if (data) {
    
    const mappedData = mapDataToForm(data);
  

    setFormData(mappedData);
    setSelectedDate(data.DATE ? dayjs(data.DATE) : null);
    setInterest(data.INTEREST || '');
    setTotal(data.TOTALAMOUNTPAID || 0);
    setSelectedCashier(data.CASHIER || '');
  }
}, [data]);


  // Calculate interest based on tax to pay and date
 useEffect(() => {
  if (selectedDate) {
    const month = selectedDate.month() + 1; // Get month (1-12)
    const baseMonth = 3; // Interest starts in March
    const baseRate = 0.06; // 6% for March
    const incrementRate = 0.02; // 2% increase per month

    let interestRate = 0.0;

    // Apply interest if the month is March (3) or later
    if (month >= baseMonth) {
      interestRate = baseRate + incrementRate * (month - baseMonth);
    }

    // Parse taxToPay (default to 0 if empty)
    const taxAmount = parseFloat(formData.taxToPay || 0);

    // Updated interest calculation: (Basic + TaxToPay) * InterestRate
    const calculatedInterest = (basicCommunityTax + taxAmount) * interestRate;

    setInterest(calculatedInterest.toFixed(2));

    // Updated total calculation: Basic + TaxToPay + Interest
    const totalValue = basicCommunityTax + taxAmount + calculatedInterest;
    setTotal(totalValue.toFixed(2));
  }
}, [selectedDate, formData.taxToPay]);


  // Calculate total amount
  useEffect(() => {
    const totalValue =
      basicCommunityTax +
      parseFloat(formData.taxToPay || 0) +
      (parseFloat(interest) || 0);
    setTotal(totalValue.toFixed(2));
  }, [formData.taxToPay, interest]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'userid') setSelectedCashier(value);
  };

  useEffect(() => {
  
  }, [mode]);

  useEffect(() => {
  }, [formData]);

  const handleSave = async () => {
    if (!formData.receipt || savingInProgress) return; // Prevent multiple triggers
    setSavingInProgress(true); // Lock saving to prevent duplicates
  
    const now = new Date();
    const dataToSave = {
      DATEISSUED: selectedDate ? selectedDate.format("YYYY-MM-DD") : null,
      TRANSDATE: now.toISOString(),
      CTCNO: formData.receipt,
      CTCTYPE: "CTCI",
      OWNERNAME: formData.taxpayerName,
      BASICTAXDUE: parseFloat(basicCommunityTax), // convert to number
      SALTAXDUE: parseFloat(formData.taxToPay),
      INTEREST: parseFloat(interest),
      TOTALAMOUNTPAID: parseFloat(total),
      USERID: formData.userid,
      CTCYEAR: now.getFullYear(),
    };
    console.log("Data to save:", dataToSave);
  
    const baseUrl = "http://192.168.101.108:3001/api";
    const endpoint =
      mode === "edit" && formData?.receipt
        ? `${baseUrl}/updateCedulaData/${formData.receipt}`
        : `${baseUrl}/saveCedulaData`;
  
    const method = mode === "edit" ? "PUT" : "POST";
  
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
  
      if (!response.ok) {
        throw new Error(`Operation failed: ${response.statusText}`);
      }
  
      console.log("Operation successful");
      alert(mode === "edit" ? "Data updated successfully" : "Data saved successfully");
  
      handleReset(); // Reset form fields after successful save
  
      // Refresh page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during save:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setSavingInProgress(false); // Unlock saving
    }
  };

  const handleReset = () => {
    setFormData({
      receipt: '',
      taxpayerName: '',
      taxToPay: '',
      userid: '',
    });
    setSelectedDate(null);
    setInterest('');
    setTotal(0);
  };

 


  return (
    <Root>
      

      <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Date Issued"
    value={selectedDate}
    onChange={setSelectedDate}
    slotProps={{
      textField: { fullWidth: true, variant: 'outlined' },
    }}
  />
</LocalizationProvider>

      <InputField
        name="receipt"
        label="Community Tax Certificate Number"
        variant="outlined"
        fullWidth
        value={formData.receipt}
        onChange={handleChange}
      />

      <InputField
        name="taxpayerName"
        label="Name of Taxpayer"
        variant="outlined"
        fullWidth
        value={formData.taxpayerName}
        onChange={handleChange}
      />

      <Typography sx={{ color: 'black' }}>Basic Tax Due: {basicCommunityTax.toFixed(2)}</Typography>

      <InputField
        name="taxToPay"
        label="Tax to Pay"
        type="number"
        variant="outlined"
        fullWidth
        value={formData.taxToPay}
        onChange={handleChange}
      />

<FormControl fullWidth>
  <InputLabel>Select Cashier</InputLabel>
  <Select
    name="userid"
    value={selectedCashier} // Use the `userid` field
    onChange={(e) => {
      setSelectedCashier(e.target.value);
      setFormData((prev) => ({ ...prev, userid: e.target.value })); // Update `userid` in `formData`
    }}
    label="Select Cashier"
  >
    {cashierOptions.map((cashier) => (
      <MenuItem key={cashier} value={cashier}>
        {cashier}
      </MenuItem>
    ))}
  </Select>
</FormControl>

      <Typography sx={{ color: 'black' }}>Interest: {interest}</Typography>
      <Typography sx={{ color: 'black' }}>Total Amount Paid: {total}</Typography>

      <ButtonContainer>
        <CustomButton variant="outlined" onClick={handleReset}>
          RESET
        </CustomButton>
        <CustomButton variant="contained" onClick={handleSave}>
          SAVE
        </CustomButton>
      </ButtonContainer>
     
    </Root>
  );
}

Cedula.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CTCNO: PropTypes.string,
    OWNERNAME: PropTypes.string,
    SALTAXDUE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    USERID: PropTypes.string,
    DATEISSUED: PropTypes.string,
    INTEREST: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    TOTALAMOUNTPAID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CASHIER: PropTypes.string,
  }),
  mode: PropTypes.string,
 
};

export default Cedula;