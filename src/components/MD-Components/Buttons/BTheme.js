import { createTheme } from '@mui/material/styles';

const btheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    tertiary: {
      main: '#4caf50', // Example tertiary color
    },
    quaternary: {
      main: '#f57c00', // Example quaternary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Remove uppercase transformation
          // Custom transparent button
          '&.transparent': {
            backgroundColor: 'transparent',
            color: '#1976d2', // Adjust color as needed
            border: `1px solid #1976d2`, // Add border if desired
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.1)', // Light transparent hover effect
              borderColor: '#115293',
            },
          },
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
        containedSecondary: {
          backgroundColor: '#dc004e',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#9a0036',
          },
        },
      },
    },
  },
});

export default btheme;
