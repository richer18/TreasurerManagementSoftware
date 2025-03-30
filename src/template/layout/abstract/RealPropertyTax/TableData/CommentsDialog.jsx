import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

const CompactTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: '0.875rem',
  '&:last-child': {
    paddingRight: theme.spacing(1.5),
  },
}));

const TableHeaderCell = styled(CompactTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 
    theme.palette.primary.dark : theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  borderBottom: 'none',
}));

const columns = [
  { 
    id: 'date', 
    label: 'Date', 
    width: '25%',
    format: (value) => format(new Date(value), 'MMMM d, yyyy'),
  },
  { 
    id: 'receipt_no', 
    label: 'Receipt', 
    width: '25%',
    format: (value) => value || '--',
  },
  { 
    id: 'description', 
    label: 'Comment', 
    width: '25%',
    format: (value) => value || 'No description',
  },
  {
    id: 'created_at',
    label: 'Time',
    width: '19%',
    format: (value) => format(new Date(value), "yyyy-MM-dd h:mm a"),
  },
  { 
    id: 'user', 
    label: 'User', 
    width: '9%',
    format: (value) => value?.split(' ')[0] || '--',
  },
];

function CommentsDialog({ open, onClose, comments }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedComments = useMemo(() => {
    if (!comments?.length) return [];
    
    return [...comments].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      let comparison = 0;

      if (['date', 'created_at'].includes(sortBy)) {
        comparison = new Date(aValue) - new Date(bValue);
      } else {
        comparison = `${aValue}`.localeCompare(`${bValue}`);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [comments, sortBy, sortOrder]);

  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'common.white',
        py: 1,
        position: 'relative',
      }}>
        <Box display="flex" alignItems="center">
          <CommentOutlinedIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
          <Typography variant="subtitle1">Comments</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              color: 'common.white',
              padding: 0.5,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {sortedComments.length > 0 ? (
          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table 
              stickyHeader
              size="small"
              sx={{
                tableLayout: 'fixed',
                '& th, & td': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableHeaderCell
                      key={column.id}
                      sortDirection={sortBy === column.id ? sortOrder : false}
                      sx={{ width: column.width }}
                    >
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id)}
                        sx={{ 
                          color: 'inherit !important',
                          '& .MuiTableSortLabel-icon': {
                            color: 'inherit !important',
                          }
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedComments.map((comment, index) => (
                  <TableRow hover key={index}>
                    {columns.map((column) => (
                      <CompactTableCell key={column.id}>
                        {column.format(comment[column.id])}
                      </CompactTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            p: 4,
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <CommentOutlinedIcon sx={{ 
              fontSize: 40, 
              color: 'text.disabled',
              mb: 1,
              opacity: 0.5
            }} />
            <Typography variant="body2" color="text.secondary">
              No comments available
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        px: 2, 
        py: 1,
        borderTop: `1px solid ${theme.palette.divider}` 
      }}>
        <Button 
          onClick={onClose}
          size="small"
          color="primary"
          sx={{ 
            borderRadius: 1,
            textTransform: 'none',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CommentsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      receipt_no: PropTypes.string,
      description: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      user: PropTypes.string,
    })
  ).isRequired,
};

export default CommentsDialog;