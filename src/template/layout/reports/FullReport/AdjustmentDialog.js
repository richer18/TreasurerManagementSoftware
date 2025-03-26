import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const AdjustmentDialog = ({ open, onClose, rowData, field }) => {
  const [inputValue, setInputValue] = useState('');
  const isAdding = field === 'under';

  const handleSave = async () => {
    const value = parseFloat(inputValue);
    if (!value || value <= 0) return;

    try {
      // Parse date components from "January 2, 2025"
      const [month, day, year] = rowData.date.replace(',', '').split(' ');

      const response = await fetch('http://192.168.101.108:3001/api/save-adjustment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: year,
          month: month.toUpperCase(),
          day: day,
          field: field === 'under' ? 'ctc' : 'rpt', // Example field mapping
          value: isAdding ? value : -value,
          adjustmentType: field
        })
      });

      if (!response.ok) throw new Error('Save failed');
      
      // Refresh data or update local state
      onClose(true); // Trigger parent component refresh
      setInputValue('');
      
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save adjustment');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{`Adjust ${field === 'under' ? 'Under' : 'Over'} Payment`}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`Enter adjustment amount`}
          type="number"
          fullWidth
          variant="standard"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save Adjustment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdjustmentDialog;