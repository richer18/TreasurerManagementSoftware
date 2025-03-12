import { Edit, Save } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';



function FullReport() {
  const [month, setMonth] = useState('1');
const [year, setYear] = useState('2025');
const [data, setData] = useState([]);
const [editableRow, setEditableRow] = useState(null);
const [updatedDueFrom, setUpdatedDueFrom] = useState('');
const [comments, setComments] = useState({});
const [showButtons, setShowButtons] = useState(false); // Track button visibility

const [editingField, setEditingField] = useState(null);
const [inputValues, setInputValues] = useState({}); // Temporary input values

// Then inside your component:
const theme = useTheme();

// Dialog state
const [dialogOpen, setDialogOpen] = useState(false);
const [dialogField, setDialogField] = useState('');
const [dialogRowIndex, setDialogRowIndex] = useState(null);
const [dialogInputValue, setDialogInputValue] = useState('');
const [isAdding, setIsAdding] = useState(true); // Track if adding or subtracting

const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.101.108:3001/api/fetch-report');
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Fetching error:', error);
        setData([]);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!month || !year) {
      setError("Please select both Month and Year.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        `http://192.168.101.108:3001/api/fetch-report-json?month=${month}&year=${year}`
      );
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = React.useMemo(() => 
    data.filter((item) => {
      const itemDate = new Date(item.date);
      const selectedYear = parseInt(year, 10);
      const selectedMonth = parseInt(month, 10) - 1;
      return (
        (!month || itemDate.getMonth() === selectedMonth) &&
        (!year || itemDate.getFullYear() === selectedYear)
      );
    }),
    [data, month, year]
  );

  const handleEditClick = useCallback((rowIndex) => {
    setEditableRow(rowIndex);
    setUpdatedDueFrom(filteredData[rowIndex].dueFrom);
    setShowButtons(true);
  }, [filteredData]);

  const handleSaveClick = useCallback((rowIndex, updatedDueFrom) => {
    const updatedRow = {
      ...data[rowIndex],
      ctc: inputValues[`${rowIndex}-ctc`] || data[rowIndex].ctc,
      rpt: inputValues[`${rowIndex}-rpt`] || data[rowIndex].rpt,
      gfAndTf: inputValues[`${rowIndex}-gfAndTf`] || data[rowIndex].gfAndTf,
      dueFrom: updatedDueFrom || data[rowIndex].dueFrom,
      remarks: comments[rowIndex] || data[rowIndex].remarks,
    };
  
    if (JSON.stringify(updatedRow) !== JSON.stringify(data[rowIndex])) {
      setData((prevData) => prevData.map((item, i) => (i === rowIndex ? updatedRow : item)));
    }
  
    setShowButtons(false);
    setEditableRow(null);
    setUpdatedDueFrom(null);
  }, [data, inputValues, comments]);

  const handleCommentChange = (rowIndex, value) => {
  setComments((prev) => ({
    ...prev,
    [rowIndex]: value,
  }));
};


  const totalRcd = filteredData.reduce((sum, item) => sum + item.rcdTotal, 0);
  const totalDueFrom = filteredData.reduce((sum, item) => sum + item.dueFrom, 0);
  const totalCollections = totalRcd - totalDueFrom;

  // Open dialog for input
// const openDialog = (rowIndex, field, isIncrement) => {
//   setDialogRowIndex(rowIndex);
//   setDialogField(field);
//   setDialogInputValue(''); // Start with an empty input
//   setIsAdding(isIncrement); // Set mode (adding or subtracting)
//   setDialogOpen(true);
// };

// Open dialog for "Under" (Add value)
const handleUnderClick = (rowIndex, field) => {
  setDialogRowIndex(rowIndex);
  setDialogField(field);
  setIsAdding(true);
  setDialogOpen(true);
};

// Open dialog for "Over" (Subtract value)
const handleOverClick = (rowIndex, field) => {
  setDialogRowIndex(rowIndex);
  setDialogField(field);
  setIsAdding(false);
  setDialogOpen(true);
};

// Confirm and apply changes from dialog
const handleDialogConfirm = async () => {
  const adjustedValue = parseFloat(dialogInputValue) || 0;
  if (adjustedValue === 0) return;

  const adjustmentType = isAdding ? "under" : "over";
  const updatedData = [...data];

  // Get the row that needs updating
  let row = updatedData[dialogRowIndex];

  if (!row) return;

  // Apply the adjustment in the UI
  row[adjustmentType] = (row[adjustmentType] || 0) + adjustedValue;
  row[dialogField] += isAdding ? adjustedValue : -adjustedValue; // Add or Subtract

  // Update UI immediately
  setData(updatedData);

  // Send update to backend for saving in JSON
  try {
    const response = await fetch(`http://192.168.101.108:3001/api/save-adjustment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: row.year,
        month: row.month,
        date: row.date,
        field: dialogField,
        value: isAdding ? adjustedValue : -adjustedValue,
        adjustmentType: adjustmentType
      }),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const result = await response.json();
    console.log("Saved to JSON:", result);

    alert("Adjustment saved successfully!");
  } catch (error) {
    console.error("Failed to save adjustment:", error);
  }

  // Close dialog
  setDialogOpen(false);
  setDialogInputValue("");
};


// Handle manual input change in table fields
const handleInputChange = (rowIndex, field, value) => {
  if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
    setInputValues((prev) => ({ ...prev, [`${rowIndex}-${field}`]: value }));
    setData((prevData) =>
      prevData.map((item, index) =>
        index === rowIndex ? { ...item, [field]: parseFloat(value) || 0 } : item
      )
    );
  }
};
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Full Report
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={6} sm={4}>
          <TextField
            select
            fullWidth
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((m, index) => (
              <MenuItem key={index} value={index + 1}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            variant="outlined"
            placeholder="e.g., 2025"
          />
        </Grid>
        <Grid item xs={6} sm={4} style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={fetchData} fullWidth>
            Fetch Data
          </Button>
        </Grid>
      </Grid>

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Loading Indicator */}
      {loading ? <Typography>Loading data...</Typography> : null}

      <TableContainer
  component={Paper}
  sx={{
    borderRadius: 4,
    boxShadow: 3,
    overflow: 'hidden',
    '& .MuiTableCell-root': {
      py: 1.5,
      fontSize: '0.875rem'
    }
  }}
>
  <Table stickyHeader>
    <TableHead>
      <TableRow>
  {['Date', 'CTC', 'RPT', 'GF and TF', 'Due From', 'RCD Total', 'Remarks', 'Action'].map((header) => (
    <TableCell
      key={header}
      align="center" // Centers content horizontally
      sx={{
        fontWeight: 700,
        fontSize: '0.9rem',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderRight: '1px solid rgba(224, 224, 224, 0.5)',
        '&:last-child': { borderRight: 'none' },
      }}
    >
      {header}
    </TableCell>
  ))}
</TableRow>
    </TableHead>
    <TableBody>
      {filteredData.length > 0 ? (
        filteredData.map((row, index) => (
          <React.Fragment key={index}>
            <TableRow
              sx={{
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#f0f4ff' }
              }}
            >
              {/* Date Cell */}
              <TableCell sx={{ fontWeight: 500, textAlign: 'center' }}>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date(row.date))}
              </TableCell>

              {/* Editable Value Cells */}
              {['ctc', 'rpt', 'gfAndTf'].map((field) => (
                <TableCell key={field} sx={{ textAlign: 'center', position: 'relative' }}>
                  {editingField?.row === index && editingField?.field === field ? (
                    <TextField
                      value={inputValues[`${index}-${field}`] || ''}
                      onChange={(e) => handleInputChange(index, field, e.target.value)}
                      size="small"
                      type="number"
                      sx={{
                        width: 100,
                        '& .MuiInputBase-input': {
                          fontWeight: 500,
                          textAlign: 'center',
                          py: 0.5
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <span style={{ fontWeight: 500 }}>
                        {row[field].toLocaleString()}
                      </span>
                      <Tooltip title="View details">
                        <ErrorIcon
                          color="action"
                          sx={{ fontSize: 16, ml: 0.5, verticalAlign: 'text-top' }}
                        />
                      </Tooltip>
                    </>
                  )}

                  {editableRow === index && showButtons && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleUnderClick(index, field)}
                        sx={{ minWidth: 80, textTransform: 'none' }}
                      >
                        Under
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOverClick(index, field)}
                        sx={{ minWidth: 80, textTransform: 'none' }}
                      >
                        Over
                      </Button>
                    </Box>
                  )}
                </TableCell>
              ))}

              {/* Due From Cell */}
              <TableCell sx={{ textAlign: 'center' }}>
                {editableRow === index ? (
                  <TextField
                    value={updatedDueFrom}
                    onChange={(e) => setUpdatedDueFrom(Number(e.target.value))}
                    size="small"
                    sx={{
                      width: 100,
                      '& .MuiInputBase-input': {
                        fontWeight: 500,
                        textAlign: 'center',
                        py: 0.5
                      }
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: 500 }}>
                    {row.dueFrom.toLocaleString()}
                  </span>
                )}
              </TableCell>

              {/* RCD Total Cell */}
              <TableCell sx={{ textAlign: 'center', fontWeight: 500 }}>
                {row.rcdTotal.toLocaleString()}
              </TableCell>

              {/* Remarks Cell */}
              <TableCell>
                <TextField
                  fullWidth
                  value={comments[index] || ''}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  size="small"
                  placeholder="Add comment..."
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '0.875rem',
                      py: 0.5
                    }
                  }}
                />
              </TableCell>

              {/* Action Cell */}
              <TableCell sx={{ textAlign: 'center' }}>
                <IconButton
                  color={editableRow === index ? 'success' : 'primary'}
                  onClick={() => editableRow === index 
                    ? handleSaveClick(index, updatedDueFrom) 
                    : handleEditClick(index)}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  {editableRow === index ? <Save fontSize="small" /> : <Edit fontSize="small" />}
                </IconButton>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="textSecondary">
              No records found
            </Typography>
          </TableCell>
        </TableRow>
      )}

      {/* Totals Row */}
      <TableRow sx={{ backgroundColor: theme.palette.success.light }}>
        <TableCell colSpan={4} sx={{ textAlign: 'right', fontWeight: 700 }}>
          Total
        </TableCell>
        <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>
          ₱{totalDueFrom.toLocaleString()}
        </TableCell>
        <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>
          ₱{totalRcd.toLocaleString()}
        </TableCell>
        <TableCell colSpan={2} />
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
  <DialogTitle>{isAdding ? "Enter Value to Add" : "Enter Value to Subtract"}</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label={`Enter amount to ${isAdding ? "add to" : "subtract from"} ${dialogField}`}
      type="number"
      fullWidth
      value={dialogInputValue}
      onChange={(e) => setDialogInputValue(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleDialogConfirm} color="primary">Save</Button>
  </DialogActions>
</Dialog>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 2,
          paddingRight: 3,
          paddingLeft: 3,
          borderTop: '1px solid #ccc',
          paddingTop: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            RCD Total: <span style={{ color: '#1565c0' }}>₱{totalRcd.toLocaleString()}</span>
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Less: Due From: <span style={{ color: '#d32f2f' }}>₱{totalDueFrom.toLocaleString()}</span>
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Total Collections: <span style={{ color: '#2e7d32' }}>₱{totalCollections.toLocaleString()}</span>
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default FullReport;