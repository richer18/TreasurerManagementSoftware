import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import GeneralFundDailyTable from '../../../../../template/layout/abstract/GeneralFund/TableData/components/Table/DailyTable';
import {Button} from '@mui/material';

function GeneralFundDialogPopupDailyTable({ open, onClose }) {
    return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Daily Report
            <Button onClick={onClose} color="secondary">
            <Tooltip title="Close">
                <CloseIcon fontSize="large"/>
            </Tooltip>
            </Button>
        </div>
        </DialogTitle>
        <DialogContent>
        <GeneralFundDailyTable/>
        </DialogContent>
    </Dialog>
    );
}

GeneralFundDialogPopupDailyTable.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GeneralFundDialogPopupDailyTable
