import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, CircularProgress, Alert } from '@mui/material';

const CATEGORY_MAPPING = [
  { label: 'WEIGHS AND MEASURE', fields: ['Weighs_Measure'] },
  { label: 'TRICYCLE PERMIT FEE', fields: ['Tricycle_Operators'] },
  { label: 'OCCUPATION TAX', fields: ['Occupation_Tax'] },
  { 
    label: 'OTHER PERMIST AND LICENSE', 
    fields: [
      'Docking_Mooring_Fee', 'Cockpit_Prov_Share', 'Cockpit_Local_Share', 'Sultadas', 'Miscellaneous_Fee',
      'Fishing_Permit_Fee', 'Sale_of_Agri_Prod', 'Sale_of_Acct_Form',
      'LIVESTOCK_DEV_FUND', 'DIVING_FEE'
    ]
  },
  { 
    label: 'CIVIL REGISTRATION', 
    fields: ['Reg_of_Birth', 'Marriage_Fees', 'Burial_Fees', 'Correction_of_Entry']
  },
  { 
    label: 'CATTLE/ANIMAL REGISTRATION FEES', 
    fields: ['Cert_of_Ownership', 'Cert_of_Transfer']
  },
  { 
    label: 'BUILDING PERMITS', 
    fields: ['BUILDING_PERMIT_FEE', 'ELECTRICAL_FEE']
  },
  { label: 'BUSINESS PERMITS', fields: ['Mayors_Permit'] },
  { label: 'ZONIAL/LOCATION PERMIT FEES', fields: ['ZONING_FEE'] }
];

const convertQuarterToMonths = (quarter) => {
  const quarterMap = {
    'Q1 - Jan, Feb, Mar': [1, 2, 3],
    'Q2 - Apr, May, Jun': [4, 5, 6],
    'Q3 - Jul, Aug, Sep': [7, 8, 9],
    'Q4 - Oct, Nov, Dec': [10, 11, 12],
  };
  return quarterMap[quarter] || [];
};

const formatCurrency = (value) => {
  const number = Number(value);
  return isNaN(number)
    ? '₱ 0.00'
    : new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
      }).format(number);
};
export default function RegulatoryFeeAndChargesDialogContent({ quarter, year }) {
  const [breakdownData, setBreakdownData] = useState([]);
  const [total, setTotal] = useState('₱ 0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const months = convertQuarterToMonths(quarter);
        const params = new URLSearchParams({
          year: year,
          months: months.join(','),
          _: Date.now(),
        });
  
        const response = await fetch(`http://192.168.101.108:3001/api/RegulatoryFeesAndChargesBreakdown?${params}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // ✅ Transform API response (array) into object keyed by category
        const categoryMap = {};
        (data.breakdown || []).forEach(item => {
          categoryMap[item.category] = item.total_amount;
        });
  
        // ✅ Map into the format required for your chart/table
        const transformedData = CATEGORY_MAPPING.map(({ label }) => ({
          label,
          value: formatCurrency(categoryMap[label] || 0)
        }));
  
        // ✅ Calculate total
        const calculatedTotal = transformedData.reduce(
          (sum, item) => sum + Number(item.value.replace(/[^0-9.-]+/g, '')),
          0
        );
  
        setBreakdownData(transformedData);
        setTotal(formatCurrency(calculatedTotal));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [quarter, year]);
  

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">
          Error loading data: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" fontWeight="bold">
        Tax on Business Breakdown
      </Typography>
      <Typography variant="h6" color="text.secondary">
        {year} Total
      </Typography>
    </Box>

    {breakdownData.map((item, index) => (
      <Box
        key={item.label}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={1}
        borderBottom={index !== breakdownData.length - 1 ? 1 : 0}
        borderColor="divider"
      >
        <Typography variant="body2">{item.label}</Typography>
        <Typography variant="body2" fontWeight={500}>
          {item.value}
        </Typography>
      </Box>
    ))}

    <Divider sx={{ my: 2 }} />
    <Box display="flex" justifyContent="space-between">
      <Typography variant="subtitle1" fontWeight="bold">
        Overall Total
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold">
        {total}
      </Typography>
    </Box>
  </Box>
  );
}
