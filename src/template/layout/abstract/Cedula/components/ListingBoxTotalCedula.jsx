import { Box, Button, Divider, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const ListingBoxCedula = ({ value, text, onClick  }) => {
  return (
   <Box textAlign="center" onClick={onClick} sx={{ cursor: 'pointer' }}>
      <Typography variant="h4" color="primary">
        {value}
        <Divider/>
      </Typography>
      <Button variant="subtitle1" color="textSecondary">
        {text}
      </Button>
    </Box>
  );
};

// Add PropTypes for validation
ListingBoxCedula.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ListingBoxCedula;
