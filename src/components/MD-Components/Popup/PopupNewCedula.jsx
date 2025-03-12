import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types'; // Import PropTypes
import React from 'react';
import {Button} from '@mui/material';

function PopupNewCedula({ onClose, children }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(243, 240, 240, 0.7)', // Set background color with transparency
          color: '#fff', // Set text color
        },
      }}
    >
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Entry Form
         
          <Button onClick={onClose} color="secondary">
            <Tooltip title="Close">
              <CloseIcon fontSize="large"/>
            </Tooltip>
          </Button>
          
        </div>
      </DialogTitle>

      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}

// Prop types validation
PopupNewCedula.propTypes = {
  onClose: PropTypes.func.isRequired, // 'onClose' should be a function and is required
  children: PropTypes.node.isRequired, // 'children' can be any renderable content and is required
};

export default PopupNewCedula;
