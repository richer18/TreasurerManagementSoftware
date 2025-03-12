import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import GeneralFundReport from '../../../../../template/layout/abstract/GeneralFund/TableData/components/Table/RegulatoryFees';
import {Button} from '@mui/material';

function GeneralFundDialogPopup({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Regulatory Fees and Charges Report
          <Button onClick={onClose} color="secondary">
            <Tooltip title="Close">
              <CloseIcon fontSize="large"/>
            </Tooltip>
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        <GeneralFundReport/>
      </DialogContent>
    </Dialog>
  );
}

GeneralFundDialogPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GeneralFundDialogPopup;
