import { Box, Typography } from '@mui/material';
import React from 'react';

const otherIncomeReceiptsBusinessBreakdown = [
  { label: 'INTEREST INCOME', value: '$300,000' },
];

function OtherIncomeDialogContent() {
  return (
  <>
  <Box display="flex" justifyContent="space-between" mb={2}>
    <Typography variant="h6">Other Income Receipts</Typography>
    <Typography variant="h6">TOTAL</Typography>
    </Box>
    {otherIncomeReceiptsBusinessBreakdown.map((item, index) => (
      <Box key={index} display="flex" justifyContent="space-between" mb={1}>
        <Typography>{item.label}</Typography>
        <Typography fontWeight="medium">{item.value}</Typography>
        </Box>
      ))}
      <Box mt={2} display="flex" justifyContent="space-between" borderTop={1} pt={1}>
        <Typography variant="subtitle1" fontWeight="bold">Overall Total</Typography>
        <Typography variant="subtitle1" fontWeight="bold">$1,050,000</Typography>
        </Box>
        </>
  )
}

export default OtherIncomeDialogContent
