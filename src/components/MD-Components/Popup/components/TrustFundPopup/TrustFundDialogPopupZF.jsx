import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import TrustFundReport from '../../../../../template/layout/abstract/TrustFund/TableData/components/Table/ZoningPermitFee';
import {Button} from '@mui/material';

function TrustFundDialogPopupZF({ open, onClose }) {
    return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Zoning Report
            <Button onClick={onClose} color="secondary">
            <Tooltip title="Close">
                <CloseIcon fontSize="large"/>
            </Tooltip>
            </Button>
        </div>
        </DialogTitle>
        <DialogContent>
        <TrustFundReport/>
        </DialogContent>
    </Dialog>
    )
}

TrustFundDialogPopupZF.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TrustFundDialogPopupZF
