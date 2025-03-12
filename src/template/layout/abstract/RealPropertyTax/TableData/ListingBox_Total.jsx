// ListingBoxTotal.js
import { Box, Divider, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const ListingBoxTotal = ({ value, text }) => {
  return (
    <Box textAlign="center">
      <Typography variant="h4" color="primary">
        {value.toFixed(2)}
        <Divider />
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {text}
      </Typography>
    </Box>
  );
};

ListingBoxTotal.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default ListingBoxTotal;
