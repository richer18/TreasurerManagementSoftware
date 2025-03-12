import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material'; // Use standard Material-UI Button
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import TrustFundAllTable from '../../../template/layout/abstract/TrustFund/TableData/TrustFunAllTable';

function TrustFundDialog({ open, onClose, data }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl" // Set maximum width to "extra-large"
            fullWidth // Ensure the dialog takes full width of its maxWidth
            sx={{
                '& .MuiDialog-paper': {
                    width: '90%', // Adjust this percentage to control the width
                    maxWidth: '1200px', // Set a maximum width in pixels
                },
            }}
        >
            <DialogTitle>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Trust Fund View
                    <Button onClick={onClose} color="secondary">
                        <Tooltip title="Close">
                            <CloseIcon fontSize="large" />
                        </Tooltip>
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                <TrustFundAllTable data={[data]} />
            </DialogContent>
        </Dialog>
    );
}

TrustFundDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired, // Define the type based on your data structure
};

export default TrustFundDialog;
