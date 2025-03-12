import React from 'react';
import { Button } from '@mui/material';

const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <div>
        <Button variant="contained" color="primary" onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onNavigate('PREV')}>
          Back
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onNavigate('NEXT')}>
          Next
        </Button>
        <Button variant="contained" color="default" onClick={() => alert('Task button clicked!')}>
          Task
        </Button>
      </div>
      <span>{label}</span> {/* Displays the current view label */}
    </div>
  );
};

export default CustomToolbar;
