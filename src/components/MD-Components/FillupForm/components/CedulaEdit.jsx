import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import MDTypography from '../../../MDTypography';
import NewUser from '../../FillupForm/components/NewUser';
import PopupDialogNew from '../../Popup/PopupNewCedula';

import Snackbar from '@mui/material/Snackbar';
import LinearProgressWithLabel from '../../../../template/layout/abstract/Cedula/components/LinearProgressWithLabel';


const Root = styled(Box)({
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(252, 252, 252, 0.1)',
  overflow: 'visible',
  maxWidth: '800px',
  margin: '0 auto',
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
  color: 'black', 
});

const InputField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const formatNumber = (value) => {
  return (value || 0).toFixed(2);
};


function CedulaEdit({ rowData, onSubmit }) {
  const [dialogContent, setDialogContent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showParentContent, setShowParentContent] = useState(true);

  const [showProgress, setShowProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);



  const [formData, setFormData] = useState({
    DATEISSUED: rowData?.DATE ? dayjs(rowData?.DATE) : null,
    CTCNO: rowData?.['CTC NO'] || '',
    LOCAL_TIN: rowData?.LOCAL || '', 
    OWNERNAME: rowData?.NAME || '',
    BASICTAXDUE: formatNumber(rowData?.BASIC),
    BUSTAXAMOUNT: formatNumber(rowData?.BUSTAXAMOUNT),
    BUSTAXDUE: formatNumber(rowData?.BUSTAXDUE),
    SALTAXAMOUNT: formatNumber(rowData?.SALTAXAMOUNT),
    SALTAXDUE: formatNumber(rowData?.SALTAXDUE),
    RPTAXAMOUNT: formatNumber(rowData?.RPTAXAMOUNT),
    RPTAXDUE: formatNumber(rowData?.RPTAXDUE),
    INTEREST: formatNumber(rowData?.INTEREST),
    USERID: rowData?.CASHIER || '',
  });

  useEffect(() => {
    if (showProgress) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setShowProgress(false); // Hide progress bar when done
          }
          return prevProgress + 10;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [showProgress]);

  // Recalculate the total whenever BASIC, TAX_DUE, or INTEREST changes
  useEffect(() => {
    const taxDue = parseFloat(formData.BUSTAXDUE) + parseFloat(formData.SALTAXDUE) + parseFloat(formData.RPTAXDUE);
    const TOTALAMOUNTPAID = parseFloat(formData.BASICTAXDUE) + taxDue + parseFloat(formData.INTEREST);
    
    setFormData((prevFormData) => ({ 
      ...prevFormData, 
      TAX_DUE: formatNumber(taxDue), 
      TOTALAMOUNTPAID: formatNumber(TOTALAMOUNTPAID) 
    }));
  }, [
    formData.BASICTAXDUE,
    formData.BUSTAXDUE,
    formData.SALTAXDUE,
    formData.RPTAXDUE,
    formData.INTEREST,
    formData.BUSTAXAMOUNT,
    formData.SALTAXAMOUNT,
    formData.RPTAXAMOUNT,
  ]);

    // Snackbar State
    const [state, setState] = useState({
      open: false,
      vertical: 'bottom',
      horizontal: 'right',
    });
    const {open } = state;
  
    const handleClick = (newState) => () => {
      setState({ ...newState, open: true });
    };

    
  
    const handleCloseSnackbar = () => {
      setState({ ...state, open: false });
    };
  

  const handleButtonClick = (content) => {
    setDialogContent(content);
    setIsDialogOpen(true);
    setShowParentContent(false);
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value); // Debugging log
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Show progress when submitting
    setShowProgress(true);
    setProgress(0); // Reset progress to 0 at the start

    const data = {
      DATEISSUED: formData.DATEISSUED,
      CTCNO: formData.CTCNO,
      LOCAL_TIN: formData.LOCAL_TIN,
      OWNERNAME: formData.OWNERNAME,
      BASICTAXDUE: parseFloat(formData.BASICTAXDUE),
      BUSTAXAMOUNT: parseFloat(formData.BUSTAXAMOUNT),
      BUSTAXDUE: parseFloat(formData.BUSTAXDUE),
      SALTAXAMOUNT: parseFloat(formData.SALTAXAMOUNT),
      SALTAXDUE: parseFloat(formData.SALTAXDUE),
      RPTAXAMOUNT: parseFloat(formData.RPTAXAMOUNT),
      RPTAXDUE: parseFloat(formData.RPTAXDUE),
      INTEREST: parseFloat(formData.INTEREST),
      TOTALAMOUNTPAID: parseFloat(formData.TOTALAMOUNTPAID),
      USERID: formData.USERID,
    };

    try {
      const response = await fetch('http://192.168.101.108:3001/api/cedulaedit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Success:', result);
        handleClick({ vertical: 'bottom', horizontal: 'center' })(); // Show Snackbar on success
      } else {
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setShowProgress(false); // Hide progress bar after submission
  };
  
  

  const handleClose = () => {
    setIsDialogOpen(false);
    setShowParentContent(true);
  };

  return (
    <>
     {showParentContent && (
      <Root>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <Title component="div" style={{ flexGrow: 1, textAlign: 'center' }}>CEDULA</Title>
          <Button
            style={{ position: 'absolute', right: 0, display: 'none', alignItems: 'center' }}
            onClick={() => handleButtonClick(<NewUser />)}
          >
            <Tooltip title="NEW?">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AddIcon fontSize="large" />
                <span style={{ marginLeft: 8 }}>REGISTER</span>
              </div>
            </Tooltip>
          </Button>
        </div>

        <GridContainer container spacing={2}>
  <Grid item xs={12}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        fullWidth
        value={formData.DATEISSUED}
        onChange={(newValue) => setFormData({ ...formData, DATEISSUED: newValue })}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  </Grid>
  <Grid item xs={12}>
  <InputField
              name="CTCNO"
              label="Community Tax Certificate Number"
              variant="standard"
              fullWidth
              value={formData.CTCNO}
              onChange={handleChange}
            />
  </Grid>
  <MDTypography variant="h10">
      Local Tin: {formData.LOCAL_TIN}
      </MDTypography>
  <Grid item xs={12}>
  <InputField
              name="OWNERNAME"
              label="NAME OF TAXPAYER"
              variant="standard"
              fullWidth
              required
              value={formData.OWNERNAME}
              onChange={handleChange}
            />
  </Grid>
  <Grid item xs={12}>
  <InputField
              type="number"
              name="BASICTAXDUE"
              label="Basic Amount"
              fullWidth
              required
              value={formData.BASICTAXDUE}
              onChange={handleChange}
            />
  </Grid>
  <Grid item xs={12}>
  <InputField
              name="BUSTAXAMOUNT"
              label="Business Tax Amount"
              variant="standard"
              fullWidth
              required
              value={formData.BUSTAXAMOUNT}
              onChange={handleChange}
            />
  </Grid>
  <MDTypography variant="h10">
  Business Tax Due: {(parseFloat(formData.BUSTAXAMOUNT) / 1000).toFixed(2)}
</MDTypography>
  <Grid item xs={12}>
  <InputField
              name="SALTAXAMOUNT"
              label="Salary Tax Amount"
              variant="standard"
              fullWidth
              required
              value={formData.SALTAXAMOUNT}
              onChange={handleChange}
            />
  </Grid>
  <Grid item xs={12}>
    <MDTypography variant="h10">
      Salary Tax Due: {(parseFloat(formData.SALTAXDUE) / 1000).toFixed(2)}
      </MDTypography>
  </Grid>
  <Grid item xs={12}>
  <InputField
              name="RPTAXAMOUNT"
              label="Real Property Tax Amount"
              variant="standard"
              fullWidth
              required
              value={formData.RPTAXAMOUNT}
              onChange={handleChange}
            />
  </Grid>
  <Grid item xs={12}>
    <MDTypography variant="h10">
      Real Property Tax Due: {(parseFloat(formData.RPTAXDUE) / 1000).toFixed(2)}
      </MDTypography>
  </Grid>
  <Grid item xs={12}>
  <InputField
              name="INTEREST"
              label="Interest"
              variant="standard"
              fullWidth
              required
              value={formData.INTEREST}
              onChange={handleChange}
            />
  </Grid>
  <Grid item xs={12}>
  <InputField
              name="CASHIER"
              label="Name of Cashier"
              variant="standard"
              fullWidth
              required
              value={formData.USERID}
              onChange={handleChange}
            />
  </Grid>
  <Grid item xs={12}>
            <MDTypography variant="h10">
              Total Amount Paid: {(
                parseFloat(formData.BASICTAXDUE) +
                parseFloat(formData.BUSTAXDUE) +
                parseFloat(formData.SALTAXDUE) +
                parseFloat(formData.RPTAXDUE) +
                parseFloat(formData.INTEREST)
              ).toFixed(2)}
            </MDTypography>
          </Grid>
          <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
              {showProgress && <LinearProgressWithLabel value={progress} />}
            </Grid>
</GridContainer>
      </Root>
        )}
        {/* Snackbar Component */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={open}
        onClose={handleCloseSnackbar}
        message="Successfully saved!"
        autoHideDuration={5000} // Close after 5 seconds
      />
      {isDialogOpen && (
        <PopupDialogNew onClose={handleClose}>
          {dialogContent}
        </PopupDialogNew>
      )}
    </>
  );
}

export default CedulaEdit;
