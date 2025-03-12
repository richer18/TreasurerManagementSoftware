import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import CedulaFundViewAllTable from '../../../template/layout/abstract/Cedula/TableData/CedulaFundViewTable';
import {Button} from '@mui/material';

function CedulaFundDialog({ open, onClose, data }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{
        sx: { width: '90vw', maxWidth: 'none' }
      }}>
       <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Cedula Fund View
            <Button onClick={onClose} color="secondary">
              <Tooltip title="Close">
                <CloseIcon fontSize="large"/>
              </Tooltip>
            </Button>
            
          </div>
        </DialogTitle>
        <DialogContent sx={{ overflowX: 'auto' }}>
          <CedulaFundViewAllTable data={[data]} />
        </DialogContent>
      </Dialog>
    );
}

CedulaFundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,  // Define the type based on your data structure
};

export default CedulaFundDialog
