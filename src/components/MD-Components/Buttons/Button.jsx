import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import btheme from './BTheme'; // Ensure the correct path

const TButton = (props) => {
  return (
    <ThemeProvider theme={btheme}>
      <CssBaseline />
      <Button {...props} />
    </ThemeProvider>
  );
};

export default TButton;
