import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAddressContext } from './AddressContext';

// Zip codes and Barangays data
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
  // Add other LGU barangay lists if needed
};

function BusinessAddressForm({ handleNext, handleBack }) {
  // Get / set address data from context
  const { businessAddress, setBusinessAddress } = useAddressContext();
  const [formValues, setFormValues] = useState(businessAddress);

  // Update local and context state on field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);
    setBusinessAddress(updatedValues);
  };

  // Auto-update ZIP Code when municipality changes
  useEffect(() => {
    if (formValues.municipality) {
      const zipCode = zipCodes[formValues.municipality] || '';
      setFormValues((prev) => ({ ...prev, zipCode }));
      setBusinessAddress((prev) => ({ ...prev, zipCode }));
    }
  }, [formValues.municipality, setBusinessAddress]);

  // Handle Next button (submit) 
  const onSubmit = (event) => {
    event.preventDefault();
    // ...do any validation or data handling as needed...
    handleNext(); // Tells parent stepper to go to next step
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        backgroundImage: 'url("https://ucarecdn.com/4594b137-724c-4041-a614-43a973a69812/")',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'left bottom',
        minHeight: '650px',
        padding: '2rem',
      }}
    >
      <Box maxWidth="lg" mx="auto">
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            marginBottom: '1rem',
          }}
        >
          Business Address
        </Typography>

        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {/* Region */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  name="region"
                  value={formValues.region || ''}
                  onChange={handleChange}
                  input={<OutlinedInput label="Region" />}
                >
                  <MenuItem value="NegrosIsland">Negros Island</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Province (only if region is selected) */}
            {formValues.region === 'NegrosIsland' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Province</InputLabel>
                  <Select
                    name="province"
                    value={formValues.province || ''}
                    onChange={handleChange}
                    input={<OutlinedInput label="Province" />}
                  >
                    {['Negros Oriental', 'Negros Occidental'].map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* City / Municipality */}
            {formValues.province && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>City / Municipality</InputLabel>
                  <Select
                    name="municipality"
                    value={formValues.municipality || ''}
                    onChange={handleChange}
                    input={<OutlinedInput label="City / Municipality" />}
                  >
                    {(formValues.province === 'Negros Oriental'
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
                    ).map((municipality) => (
                      <MenuItem key={municipality} value={municipality}>
                        {municipality}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Barangay */}
            {formValues.municipality && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Barangay</InputLabel>
                  <Select
                    name="barangay"
                    value={formValues.barangay || ''}
                    onChange={handleChange}
                    input={<OutlinedInput label="Barangay" />}
                  >
                    {(barangays[formValues.municipality] || []).map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Address Details */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Unit/Room No./Floor, Building Name, House No., Street Name"
                variant="outlined"
                fullWidth
                name="addressDetails"
                value={formValues.addressDetails || ''}
                onChange={handleChange}
              />
            </Grid>

            {/* ZIP Code */}
            <Grid item xs={12} md={6}>
              <TextField
                label="ZIP Code"
                variant="outlined"
                fullWidth
                name="zipCode"
                value={formValues.zipCode || ''}
                onChange={handleChange}
                disabled
              />
            </Grid>

            {/* Navigation Buttons */}
            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleBack}
              >
                Previous
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}

export default BusinessAddressForm;
