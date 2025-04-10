import React from 'react';
import { Box, Typography } from '@mui/material';

const regulatoryFeesAndChargesBusinessBreakdown = [
  { label: 'WEIGHS AND MEASURE', value: '$300,000' },
  { label: 'TRICYCLE PERMIT FEE', value: '$200,000' },
  { label: 'OCCUPATION TAX', value: '$150,000' },
  { label: 'OTHER PERMITS AND LICENSE', value: '$250,000' },
  { label: 'CIVIL REGISTRATION', value: '$100,000' },
  { label: 'CATTLE/ANIMAL REGISTRATION FEES', value: '$30,000' },
  { label: 'BUILDING PERMITS', value: '$20,000' },
  { label: 'BUSINESS PERMITS', value: '$20,000' },
  { label: 'ZONIAL/LOCATION PERMIT FEES', value: '$20,000' },
];

export default function RegulatoryFeeAndChargesDialogContent() {
  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">REGULATORY FEES AND CHARGES</Typography>
        <Typography variant="h6">TOTAL</Typography>
      </Box>
      {regulatoryFeesAndChargesBusinessBreakdown.map((item, index) => (
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
  );
}
