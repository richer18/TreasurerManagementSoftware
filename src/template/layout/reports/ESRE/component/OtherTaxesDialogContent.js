import React from 'react';
import { Box, Typography } from '@mui/material';

const otherTaxesBusinessBreakdown = [
  { label: 'COMMUNITY TAX- INDIVIDUAL', value: '$300,000' },
];

function OtherTaxesDialogContent() {
  return (
    <>
               <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6">Other Taxes</Typography>
                 <Typography variant="h6">TOTAL</Typography>
               </Box>
               {otherTaxesBusinessBreakdown.map((item, index) => (
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

export default OtherTaxesDialogContent
