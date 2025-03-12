import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAddressContext } from './AddressContext'; // <-- Import your context here

// ------------------------------------------------------------
// Example zipCodes and barangays data (adapt as needed).
// ------------------------------------------------------------
const zipCodes = {
  Amlan: '6203',
  Ayungon: '6210',
  Bacong: '6209',
  Bais: '6206',
  Basay: '6221',
  Bayawan: '6221',
  Bindoy: '6209',
  Canlaon: '6223',
  Dauin: '6217',
  Dumaguete: '6200',
  Guihulngan: '6214',
  Jimalalud: '6212',
  'La Libertad': '6213',
  Mabinay: '6207',
  Manjuyod: '6208',
  Pamplona: '6205',
  'San Jose': '6202',
  'Santa Catalina': '6220',
  Siaton: '6219',
  Sibulan: '6201',
  Tanjay: '6204',
  Tayasan: '6211',
  Valencia: '6215',
  Vallehermoso: '6213',
  Zamboanguita: '6218',
  Bago: '6101',
  Binalbagan: '6107',
  Cadiz: '6121',
  Calatrava: '6126',
  Candoni: '6110',
  Cauayan: '6112',
  'Enrique B. Magalona': '6118',
  Escalante: '6124',
  Himamaylan: '6108',
  Hinigaran: '6106',
  'Hinoba-an': '6114',
  Ilog: '6109',
  Isabela: '6111',
  Kabankalan: '6111',
  'La Carlota': '6130',
  'La Castellana': '6131',
  Manapla: '6110',
  'Moises Padilla': '6132',
  Murcia: '6129',
  Pontevedra: '6105',
  Pulupandan: '6102',
  Sagay: '6122',
  'Salvador Benedicto': '6103',
  'San Carlos': '6127',
  'San Enrique': '6104',
  Silay: '6116',
  Sipalay: '6113',
  Talisay: '6115',
  Toboso: '6125',
  Valladolid: '6103',
  Victorias: '6119',
};

const barangays = {
  Zamboanguita: [
    'Basak (Basac)',
    'Calango',
    'Lutoban (Lotuban)',
    'Malongcay Diot',
    'Maluay',
    'Mayabon',
    'Nabago',
    'Najandig',
    'Nasig-id',
    'Poblacion',
  ],
  // More arrays for other municipalities, if needed...
};

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
function BusinessOperation({ handleNext, handleBack }) {
  // Pull “businessAddress” from your custom context
  const { businessAddress } = useAddressContext();

  // Taxpayer address local state
  const [taxpayerAddress, setTaxpayerAddress] = useState({
    region: '',
    province: '',
    municipality: '',
    barangay: '',
    addressDetails: '',
    zipCode: '',
  });

  // Extra states
  const [sameAsBusiness, setSameAsBusiness] = useState(false);

  // Copy from businessAddress or clear fields if "Same as Business Address" changes
  useEffect(() => {
    if (sameAsBusiness) {
      setTaxpayerAddress({
        region: businessAddress.region || '',
        province: businessAddress.province || '',
        municipality: businessAddress.municipality || '',
        barangay: businessAddress.barangay || '',
        addressDetails: businessAddress.addressDetails || '',
        zipCode: businessAddress.zipCode || '',
      });
    } else {
      setTaxpayerAddress({
        region: '',
        province: '',
        municipality: '',
        barangay: '',
        addressDetails: '',
        zipCode: '',
      });
    }
  }, [sameAsBusiness, businessAddress]);

  // Update local taxpayerAddress fields on user input
  const handleTaxpayerChange = (e) => {
    const { name, value } = e.target;
    setTaxpayerAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto‐update ZIP code if municipality changes
  useEffect(() => {
    if (taxpayerAddress.municipality) {
      setTaxpayerAddress((prev) => ({
        ...prev,
        zipCode: zipCodes[taxpayerAddress.municipality] || '',
      }));
    }
  }, [taxpayerAddress.municipality]);

  

  // On form submit => go to next step
  const onSubmit = (event) => {
    event.preventDefault();
    // ...any validation or data saving logic
    if (handleNext) handleNext();
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        backgroundImage:
          'url("https://ucarecdn.com/4594b137-724c-4041-a614-43a973a69812/")',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'left bottom',
        minHeight: '650px',
        padding: '2rem',
      }}
    >
      <form onSubmit={onSubmit}>
        {/* 
          ---------------------------------------------------------------- 
          1) Business Operation Section 
          ---------------------------------------------------------------- 
        */}
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}
        >
          Business Operation
        </Typography>

        {/* 
          We'll use a Stack to arrange fields in rows or columns.
          Each “row” is a horizontal Stack (direction="row"), 
          and we'll provide spacing so they don’t overlap.
        */}
        <Stack spacing={2} mb={4}>
          {/* Row 1: Business Area + Male Employees */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Business Area/Total Floor Area (sq.m)"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Total No. of Employees Within the residence"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Total No. of Male Employees"
              variant="outlined"
              fullWidth
            />
          </Stack>

          {/* Row 2: Female Employees (and optionally more fields) */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Total No. of Female Employees"
              variant="outlined"
              fullWidth
            />
            {/* If you have another field, place it here. Otherwise, keep it empty. */}
          </Stack>
        </Stack>

        {/* 
          ---------------------------------------------------------------- 
          2) Number of Delivery Vehicles Section 
          ---------------------------------------------------------------- 
        */}
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}
        >
          No. of Delivery Vehicle (If Applicable)
        </Typography>
        <Stack spacing={2} mb={4}>
          <Stack direction="row" spacing={2}>
            <TextField label="Van" variant="outlined" fullWidth />
            <TextField label="Motorcycle" variant="outlined" fullWidth />
            <TextField label="Truck" variant="outlined" fullWidth />
          </Stack>
        </Stack>

        {/* 
          ---------------------------------------------------------------- 
          3) Taxpayer's Address Section 
          ---------------------------------------------------------------- 
        */}
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}
        >
          Taxpayer's Address
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={sameAsBusiness}
              onChange={(e) => setSameAsBusiness(e.target.checked)}
            />
          }
          label="Same as Business Address"
          sx={{ mb: 2, color: '#444' }}
        />

        {/* We'll group address fields in vertical and horizontal stacks */}
        <Stack spacing={2} mb={2}>
          {/* Region dropdown */}
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              label="Region"
              name="region"
              value={taxpayerAddress.region}
              onChange={handleTaxpayerChange}
            >
              <MenuItem value="NegrosIsland">Negros Island</MenuItem>
            </Select>
          </FormControl>

          {/* Province (only if region is "NegrosIsland") */}
          {taxpayerAddress.region === 'NegrosIsland' && (
            <FormControl fullWidth>
              <InputLabel>Province</InputLabel>
              <Select
                label="Province"
                name="province"
                value={taxpayerAddress.province}
                onChange={handleTaxpayerChange}
              >
                {['Negros Oriental', 'Negros Occidental'].map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Municipality (only if province is selected) */}
          {taxpayerAddress.province && (
            <FormControl fullWidth>
              <InputLabel>City / Municipality</InputLabel>
              <Select
                label="City / Municipality"
                name="municipality"
                value={taxpayerAddress.municipality}
                onChange={handleTaxpayerChange}
              >
                {(taxpayerAddress.province === 'Negros Oriental'
                  ? [
                      'Amlan',
                      'Ayungon',
                      'Bacong',
                      'Bais',
                      'Basay',
                      'Bayawan',
                      'Bindoy',
                      'Canlaon',
                      'Dauin',
                      'Dumaguete',
                      'Guihulngan',
                      'Jimalalud',
                      'La Libertad',
                      'Mabinay',
                      'Manjuyod',
                      'Pamplona',
                      'San Jose',
                      'Santa Catalina',
                      'Siaton',
                      'Sibulan',
                      'Tanjay',
                      'Tayasan',
                      'Valencia',
                      'Vallehermoso',
                      'Zamboanguita',
                    ]
                  : [
                      'Bago',
                      'Binalbagan',
                      'Cadiz',
                      'Calatrava',
                      'Candoni',
                      'Cauayan',
                      'Enrique B. Magalona',
                      'Escalante',
                      'Himamaylan',
                      'Hinigaran',
                      'Hinoba-an',
                      'Ilog',
                      'Isabela',
                      'Kabankalan',
                      'La Carlota',
                      'La Castellana',
                      'Manapla',
                      'Moises Padilla',
                      'Murcia',
                      'Pontevedra',
                      'Pulupandan',
                      'Sagay',
                      'Salvador Benedicto',
                      'San Carlos',
                      'San Enrique',
                      'Silay',
                      'Sipalay',
                      'Talisay',
                      'Toboso',
                      'Valladolid',
                      'Victorias',
                    ]
                ).map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Barangay (only if municipality is selected) */}
          {taxpayerAddress.municipality && (
            <FormControl fullWidth>
              <InputLabel>Barangay</InputLabel>
              <Select
                label="Barangay"
                name="barangay"
                value={taxpayerAddress.barangay}
                onChange={handleTaxpayerChange}
              >
                {(barangays[taxpayerAddress.municipality] || []).map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Street / Unit details */}
          <TextField
            label="Unit/Room No./Floor, Building Name, House No., Street Name"
            variant="outlined"
            name="addressDetails"
            value={taxpayerAddress.addressDetails}
            onChange={handleTaxpayerChange}
            fullWidth
          />

          {/* ZIP Code (readonly) */}
          <TextField
            label="ZIP Code"
            variant="outlined"
            name="zipCode"
            value={taxpayerAddress.zipCode}
            onChange={handleTaxpayerChange}
            fullWidth
            disabled
          />
        </Stack>
        

        {/* 
          ---------------------------------------------------------------- 
          6) Navigation Buttons 
          ---------------------------------------------------------------- 
        */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            sx={{ width: '48%', fontWeight: 'bold' }}
          >
            Previous
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: '48%', fontWeight: 'bold' }}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default BusinessOperation;
