import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as yup from 'yup';
// import { useNavigate } from 'react-router-dom';


function BusinessForm({ handleNext }) {
  const businessTypesWithGender = ['One Person Corporation', 'Sole Proprietorship'];
  // const navigate = useNavigate(); // Initialize navigate function

  const schema = yup.object().shape({
    businessType: yup.string().required('Business Type is required'),
    registrationNo: yup
      .string()
      .test(
        'is-required-based-on-businessType',
        'Registration No. is required',
        function (value) {
          const { businessType } = this.parent;
          const typesRequiringRegistrationNo = [
            'Cooperative',
            'Corporation',
            'One Person Corporation',
            'Partnership',
            'Sole Proprietorship',
          ];
          return typesRequiringRegistrationNo.includes(businessType) ? !!value : true;
        }
      ),
    businessName: yup.string().required('Business Name is required'),
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    nationality: yup.string().required('Country of Citizenship is required'),
    emailAddress: yup
      .string()
      .email('Invalid email')
      .required('E-Mail Address is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const businessType = useWatch({
    control,
    name: 'businessType',
  });

  const onSubmit = (data) => {
    // Handle form submission logic here
    console.log(data);
    handleNext();
  };

  const isOwnerGenderApplicable = businessTypesWithGender.includes(businessType);

  React.useEffect(() => {
    if (!isOwnerGenderApplicable) {
      setValue('ownerGender', '');
    }
  }, [isOwnerGenderApplicable, setValue]);

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        backgroundImage: 'url("https://ucarecdn.com/4594b137-724c-4041-a614-43a973a69812/")',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'left bottom',
        minHeight: '650px',
        padding: '2rem',
      }}
    >
      <Box maxWidth="lg" mx="auto">
        {/* Form Header */}
        <Typography variant="h5"
  align="left" // Align to the left
  gutterBottom
  sx={{
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: "1rem", // Adjust spacing
  }}>
          Business Information and Registration
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Business Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.businessType}>
                <InputLabel id="business-type-label">Business Type</InputLabel>
                <Controller
                  name="businessType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} labelId="business-type-label" label="Business Type">
                      <MenuItem value="">
                        <em>Select Business Type</em>
                      </MenuItem>
                      <MenuItem value="Cooperative">Cooperative</MenuItem>
                      <MenuItem value="Corporation">Corporation</MenuItem>
                      <MenuItem value="One Person Corporation">One Person Corporation</MenuItem>
                      <MenuItem value="Partnership">Partnership</MenuItem>
                      <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.businessType?.message}</FormHelperText>
              </FormControl>
            </Grid>


            {/* Owner's Gender */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
              >
                <InputLabel id="owner-gender-label">
                  Owner's Gender
                </InputLabel>
                <Controller
                  name="ownerGender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      labelId="owner-gender-label"
                      label="Owner's Gender"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Dynamic Registration No. */}
            <Grid item xs={12} md={6}>
              <Controller
                name="registrationNo"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  let label = '';
                  switch (businessType) {
                    case 'Cooperative':
                      label = 'CDA Registration No.';
                      break;
                    case 'Corporation':
                    case 'One Person Corporation':
                    case 'Partnership':
                      label = 'SEC Registration No.';
                      break;
                    case 'Sole Proprietorship':
                      label = 'DTI Registration No.';
                      break;
                    default:
                      label = 'Registration No.';
                  }
                  return (
                    <TextField
                      {...field}
                      label={label}
                      placeholder="Enter Registration No."
                      variant="outlined"
                      fullWidth
                      error={!!errors.registrationNo}
                      helperText={errors.registrationNo ? errors.registrationNo.message : ''}
                    />
                  );
                }}
              />
            </Grid>

            {/* Business Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="businessName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Business Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.businessName}
                    helperText={errors.businessName ? errors.businessName.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Owner's Name Section Header */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ marginTop: '2rem', fontWeight: 'bold', color: '#050505',  }}>
                Owner's Name
              </Typography>
            </Grid>

            {/* First Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Middle Name */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Middle Name (Optional)"
                variant="outlined"
                fullWidth
                name="middleName"
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Extension Name */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="suffix-name-label">Extension Name</InputLabel>
                <Controller
                  name="suffixName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="suffix-name-label"
                      label="Extension Name"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Jr.">Jr.</MenuItem>
                      <MenuItem value="Sr.">Sr.</MenuItem>
                      <MenuItem value="III">III</MenuItem>
                      <MenuItem value="IV">IV</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          

         {/* Contact Information Section Header */}
<Grid item xs={12}>
  <Typography
    variant="h5"
    gutterBottom
    sx={{
      marginTop: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#050505', 
    }}
  >
    Contact Information
  </Typography>
</Grid>

{/* E-Mail Address */}
<Grid item xs={12} md={6}>
  <Controller
    name="emailAddress"
    control={control}
    defaultValue=""
    render={({ field }) => (
      <TextField
        {...field}
        label="E-Mail Address"
        variant="outlined"
        fullWidth
        required
        error={!!errors.emailAddress}
        helperText={errors.emailAddress ? errors.emailAddress.message : ''}
      />
    )}
  />
</Grid>

{/* Telephone Number */}
<Grid item xs={12} md={6}>
  <Controller
    name="cellphoneNo"
    control={control}
    defaultValue="+63"
    render={({ field }) => (
      <Box sx={{ width: '100%', position: 'relative' }}>
        <PhoneInput
  country="ph"
  onlyCountries={['ph']}
  // This custom mask says: 
  // "take 3 digits, space, 3 digits, space, 4 digits" 
  // for the part after +63
  masks={{
    ph: '... ... ....'
  }}

  // Prevent users from deleting "+63"
  countryCodeEditable={false}
  
  // Styling, etc.
  containerStyle={{
    width: '100%',
    borderRadius: '4px',
  }}
  inputStyle={{
    width: '100%',
    height: '56px',
    fontSize: '16px',
    paddingLeft: '48px',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    backgroundColor: 'transparent',
    color: '#333',
    outline: 'none',
  }}
  buttonStyle={{
    border: 'none',
    background: 'transparent',
    position: 'absolute',
    top: '50%',
    left: '8px',
    transform: 'translateY(-50%)',
  }}
  dropdownStyle={{
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }}
/>
        {errors.cellphoneNo && (
          <FormHelperText sx={{ color: 'red' }}>
            {errors.cellphoneNo.message}
          </FormHelperText>
        )}
      </Box>
    )}
  />
</Grid>

{/* Buttons */}
<Grid container spacing={2} sx={{ marginTop: '2rem' }}>
  <Grid item xs={12} md={6}>
    <Button
      type="submit"
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: '#323232',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#505050',
        },
        height: '56px', // Match TextField height
        fontSize: '16px',
      }}
    >
      Next
    </Button>
  </Grid>
  <Grid item xs={12} md={6}>
    <Button
      type="button"
      variant="outlined"
      fullWidth
      sx={{
        height: '56px', // Match TextField height
        fontSize: '16px',
      }}
      onClick={() => {
        // Handle cancel action here
      }}
    >
      Cancel
    </Button>
  </Grid>
</Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}

export default BusinessForm;
