import React from 'react';
import { Box, Typography } from '@mui/material';

const serviceUserChargesBusinessBreakdown = [
  { label: 'Police Clearance', value: '$300,000' },
  { label: 'Secretaries Fee', value: '$200,000' },
  { label: 'Garbage Fees', value: '$150,000' },
  { label: 'Med./Lab Fees', value: '$250,000' },
];

function ServiceUserChargesDialogContent() {
  return (
    <>
         <Box display="flex" justifyContent="space-between" mb={2}>
           <Typography variant="h6">Service/User Charges</Typography>
           <Typography variant="h6">TOTAL</Typography>
         </Box>
         {serviceUserChargesBusinessBreakdown.map((item, index) => (
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

export default ServiceUserChargesDialogContent
