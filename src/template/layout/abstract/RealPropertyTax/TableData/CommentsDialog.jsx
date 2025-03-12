import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  textAlign: 'center',
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CenteredTableCell = styled(TableCell)({
  textAlign: 'center',
});

function CommentsDialog({ open, onClose, formatDate }) {
  const [comments, setComments] = useState([]);

  // Fetch comments from the database when the dialog is opened
  useEffect(() => {
    if (open) {
      const fetchComments = async () => {
        try {
          const response = await axios.get('http://192.168.101.108:3001/api/getAllComments');
          if (response.status === 200) {
            setComments(response.data);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
      fetchComments();
    }
  }, [open]);

  // Helper function to format time into Philippine format (12-hour clock with AM/PM)
  const formatTime = (time) => {
    if (!time) return 'Invalid Time';
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return format(date, 'h:mm a'); // Use date-fns to format time
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Comments</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Reciept No.</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell>User</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <StyledTableRow key={index}>
                    <CenteredTableCell>{formatDate(comment.date)}</CenteredTableCell>
                    <CenteredTableCell>{comment.receipt_no}</CenteredTableCell>
                    <CenteredTableCell>{comment.description}</CenteredTableCell>
                    <CenteredTableCell>{formatTime(comment.time)}</CenteredTableCell>
                    <CenteredTableCell>{comment.user}</CenteredTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <CenteredTableCell colSpan={5}>No Comments Available</CenteredTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CommentsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default CommentsDialog;
