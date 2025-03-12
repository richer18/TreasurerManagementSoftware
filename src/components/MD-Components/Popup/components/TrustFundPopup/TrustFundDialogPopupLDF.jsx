import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import TrustFundReport from '../../../../../template/layout/abstract/TrustFund/TableData/components/Table/LivestockDevFundFee.jsx';
import {Button} from '@mui/material';

function TrustFundDialogPopupLDF({ open, onClose }) {
    return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Livestock Dev Fund Report
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


TrustFundDialogPopupLDF.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default TrustFundDialogPopupLDF
