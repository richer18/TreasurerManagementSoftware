import { Box, Button, Divider, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const ListingBoxGF = ({ value, text, onClick  }) => {
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
ListingBoxGF.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ListingBoxGF;
