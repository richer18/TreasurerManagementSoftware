import { Box, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';

const Root = styled(Box)({
  padding: '30px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(250, 248, 248, 0.1)',
});

const GridContainer = styled(Grid)({
  spacing: 2,
  justifyContent: 'center',
});

const Title = styled(Typography)({
  textAlign: 'center',
  marginBottom: '20px',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#333',
});

const InputField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));

function NewUser() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <Root>
      <Title component="h2">REGISTER</Title>
      <GridContainer container spacing={2}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem label="DATE">
              <DatePicker
                fullWidth
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </DemoItem>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <InputField
            id="name"
            label="Name"
            variant="standard"
            fullWidth
            required
          />
        </Grid>
      </GridContainer>
    </Root>
  );
}

export default NewUser;
