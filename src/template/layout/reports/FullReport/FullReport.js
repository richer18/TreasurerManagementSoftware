import { Edit, Save } from '@mui/icons-material';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
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
import GenerateReport from './GenerateReport';
// Add this near the top of your component, with other constants
const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const BASE_URL = "http://192.168.101.108:3001"; // Define base URL

function FullReport() {
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2025");
  const [data, setData] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [updatedDueFrom, setUpdatedDueFrom] = useState({});
  const [comments, setComments] = useState({});
  const [showButtons, setShowButtons] = useState(false); // Track button visibility

  const [editingField, setEditingField] = useState(null);
  const [inputValues, setInputValues] = useState({}); // Temporary input values

  const [reportDialog, setReportDialog] = useState({
    open: false,
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    progress: 0
  });

  // Then inside your component:
  const theme = useTheme();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogField, setDialogField] = useState("");
  const [dialogInputValue, setDialogInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(true); // Track if adding or subtracting


  const [selectedDate, setSelectedDate] = useState(null);
  

const parseDate = (dateString) => {
  if (!dateString) return null;

  // Handle both formats coming from UI and database
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) { // MM-DD-YYYY format
    const [month, day, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Already in YYYY-MM-DD format
  return dateString;
};


useEffect(() => {
  const controller = new AbortController(); // To cancel fetch on unmount
  const signal = controller.signal;

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/fetch-report`, { signal });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted"); // Fetch cancelled (unmounted)
      } else {
        console.error("Error fetching data:", error);
      }
      setData([]);
    }
  };

  fetchData();

  return () => controller.abort(); // Cleanup function to cancel fetch
}, []);

  

  const filteredData = React.useMemo(
    () =>
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

  const handleEditClick = useCallback(
    (rowIndex) => {
      const selectedRow = filteredData[rowIndex];

      if (!selectedRow) {
        console.error(`❌ Row index ${rowIndex} is out of bounds.`);
        return;
      }

      setEditableRow(rowIndex);
      setUpdatedDueFrom(selectedRow.dueFrom ?? 0); // Ensure it's a valid number
      setShowButtons(true);
    },
    [filteredData]
  );

  const handleSaveClick = async (rowIndex) => {
    const controller = new AbortController(); // To allow request cancellation
    const signal = controller.signal;
  
    const row = filteredData[rowIndex];
  
    // Get ORIGINAL index from unfiltered data
    const originalIndex = data.findIndex((item) => item.date === row.date);
  
    // Convert date properly
    const formattedDate = parseDate(row.date);
  
    // Get numeric value correctly
    const dueFromValue =
      typeof updatedDueFrom[originalIndex] === "number"
        ? updatedDueFrom[originalIndex]
        : row.dueFrom;
  
    const requestBody = {
      date: formattedDate,
      dueFrom: dueFromValue,
      comment: comments[rowIndex] || "",
    };
  
    console.log("📤 Sending Update:", requestBody);
  
    try {
      const response = await fetch(`${BASE_URL}/api/update-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal, // Link fetch to AbortController
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update");
  
      console.log("✅ Update Successful:", result.message);
      window.location.reload();
      setShowButtons(false);
      setEditableRow(null);
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("⚠️ Request Aborted");
      } else {
        console.error("❌ Error Updating:", error);
      }
    } finally {
      controller.abort(); // Cleanup to avoid memory leaks
    }
  };

  const handleCommentChange = (rowIndex, value) => {
    setComments((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const totalRcd = filteredData.reduce((sum, item) => sum + item.rcdTotal, 0);
  const totalDueFrom = filteredData.reduce(
    (sum, item) => sum + item.dueFrom,
    0
  );
  const totalCollections = totalRcd - totalDueFrom;

  // Open dialog for input
  // const openDialog = (rowIndex, field, isIncrement) => {
  //   setDialogRowIndex(rowIndex);
  //   setDialogField(field);
  //   setDialogInputValue(''); // Start with an empty input
  //   setIsAdding(isIncrement); // Set mode (adding or subtracting)
  //   setDialogOpen(true);
  // };

  const handleUnderClick = (index, field) => {
  setDialogField(field);
  setIsAdding(true); // "Under" means adding
  setSelectedDate(filteredData[index].date); // Store selected row's date

  // Get the current value based on the field
  let currentValue = 0;
  switch (field) {
    case "ctc":
      currentValue = filteredData[index]?.CTCunder || 0;
      break;
    case "rpt":
      currentValue = filteredData[index]?.RPTunder || 0;
      break;
    case "gfAndTf":
      currentValue = filteredData[index]?.GFTFunder || 0;
      break;
    default:
      console.error("❌ Invalid field:", field);
      return;
  }

  setDialogInputValue(currentValue); // Set initial value in input field
  setDialogOpen(true);
};

// Opens the dialog with the proper field and adjustment type (isAdding=false means "Over")
const handleOverClick = (index, field) => {
  setDialogField(field);
  setIsAdding(false); // "Over" means subtracting
  setSelectedDate(filteredData[index].date);

  // Get the current value based on the field
  let currentValue = 0;
  switch (field) {
    case "ctc":
      currentValue = filteredData[index]?.CTCover || 0;
      break;
    case "rpt":
      currentValue = filteredData[index]?.RPTover || 0;
      break;
    case "gfAndTf":
      currentValue = filteredData[index]?.GFTFover || 0;
      break;
    default:
      console.error("❌ Invalid field:", field);
      return;
  }

  setDialogInputValue(currentValue); // Set initial value in input field
  setDialogOpen(true);
};

const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString || typeof dateString !== "string") {
      console.error("❌ Invalid date input:", dateString);
      return null;
  }

  // ✅ If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
  }

  const months = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  const parts = dateString.split(" ");
  if (parts.length !== 3) {
      console.error("❌ Invalid date format received:", dateString);
      return null;
  }

  const month = months[parts[0]];
  const day = parts[1].replace(",", "").padStart(2, "0"); // Remove comma and pad day
  const year = parts[2];

  if (!month || !day || !year) {
      console.error("❌ Failed to parse date:", dateString);
      return null;
  }

  return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
};


  // Confirm and apply changes from dialog
  const handleDialogConfirm = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const adjustedValue = parseFloat(dialogInputValue);
    if (isNaN(adjustedValue)) {
        console.warn("⚠️ Invalid input, skipping update");
        return;
    }

    let columnToUpdate = "";
    switch (dialogField) {
        case "ctc":
            columnToUpdate = isAdding ? "CTCunder" : "CTCover";
            break;
        case "rpt":
            columnToUpdate = isAdding ? "RPTunder" : "RPTover";
            break;
        case "gfAndTf":
            columnToUpdate = isAdding ? "GFTFunder" : "GFTFover";
            break;
        default:
            console.error("❌ Invalid field:", dialogField);
            return;
    }

    // ✅ Fix Date Conversion
    const formattedDate = formatDateToYYYYMMDD(selectedDate);
    if (!formattedDate) {
        console.error("❌ Date conversion failed. Invalid date:", selectedDate);
        alert("Invalid date format. Please select a valid date.");
        return;
    }

    const payload = {
        date: formattedDate, // Correctly formatted date
        column: columnToUpdate,
        value: adjustedValue,
    };

    console.log("🚀 Sending payload:", payload);

    try {
        const response = await fetch(`${BASE_URL}/api/save-adjustment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        console.log("✅ Adjustment saved successfully!");
        alert("Adjustment saved successfully!");
    } catch (error) {
        if (error.name === "AbortError") {
            console.warn("⚠️ Request Aborted");
        } else {
            console.error("❌ Failed to save adjustment:", error);
            alert("Failed to save adjustment.");
        }
    } finally {
        controller.abort();
    }

    setDialogOpen(false);
    setDialogInputValue("");
};

  // Handle manual input change in table fields
  const handleInputChange = (rowIndex, field, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      // Allow only numbers and decimal points
      setInputValues((prev) => ({ ...prev, [`${rowIndex}-${field}`]: value }));
      setData((prevData) =>
        prevData.map((item, index) =>
          index === rowIndex
            ? { ...item, [field]: parseFloat(value) || 0 }
            : item
        )
      );
    }
  };

  const handleGenerateReport = () => {
    // Open dialog in loading state
    setReportDialog({
      open: true,
      status: 'loading',
      progress: 0
    });

    // Simulate report generation
    const interval = setInterval(() => {
      setReportDialog(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, status: 'success', progress: 100 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);
  };

  const handleCloseDialog = () => {
    setReportDialog({ ...reportDialog, open: false });
  };
  
  const handleExportCSV = () => {
    // Your CSV export logic
    console.log("Exporting to CSV", filteredData);
  };
  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f7fa" }}>
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.dark }}>
          Financial Report Summary
        </Typography>
        <Chip 
          label={`${month ? months[month-1] : "All Months"} ${year || ""}`.trim()} 
          color="primary" 
          variant="outlined"
          sx={{ fontSize: "0.875rem", fontWeight: 500 }}
        />
      </Box>
  
     {/* Filter and Actions Container */}
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2,
  alignItems: { xs: 'stretch', sm: 'center' },
  mb: 4,
  backgroundColor: 'background.paper',
  p: 3,
  borderRadius: 2,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
}}>
  {/* Filter Controls */}
  <Box sx={{
    display: 'flex',
    flex: 1,
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    minWidth: { sm: '400px' }
  }}>
    {/* Month Selector */}
    <TextField
      select
      fullWidth
      label="Month"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      variant="outlined"
      size="small"
      sx={{
        minWidth: 120,
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
          backgroundColor: "background.default"
        }
      }}
    >
      <MenuItem value="">All Months</MenuItem>
      {[
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ].map((m, index) => (
        <MenuItem key={index} value={index + 1}>
          {m}
        </MenuItem>
      ))}
    </TextField>

    {/* Year Input */}
    <TextField
      fullWidth
      label="Year"
      type="number"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      variant="outlined"
      size="small"
      placeholder="e.g., 2025"
      sx={{
        minWidth: 120,
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
          backgroundColor: "background.default"
        }
      }}
      InputProps={{
        inputProps: { 
          min: 2000, 
          max: new Date().getFullYear() + 5 
        }
      }}
    />
  </Box>

  {/* Action Buttons */}
  <Box sx={{
    display: 'flex',
    gap: 2,
    flexShrink: 0,
    width: { xs: '100%', sm: 'auto' },
    '& > *': {
      flex: { xs: 1, sm: '0 0 auto' }
    }
  }}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<DescriptionOutlined />}
      onClick={handleGenerateReport}
      sx={{
        borderRadius: "6px",
        textTransform: "none",
        px: 3,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
        }
      }}
    >
      Generate Report
    </Button>
    
    <Button
      variant="outlined"
      color="primary"
      startIcon={<FileDownloadOutlined />}
      onClick={handleExportCSV}
      sx={{
        borderRadius: "6px",
        textTransform: "none",
        px: 3,
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px'
        }
      }}
    >
      Export CSV
    </Button>
  </Box>
</Box>
  
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          "& .MuiTableCell-root": {
            py: 1.5,
            fontSize: "0.875rem",
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "Date",
                "CTC",
                "RPT",
                "GF and TF",
                "Due From",
                "RCD Total",
                "Remarks",
                "Action",
              ].map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                    "&:last-child": { borderRight: "none" },
                    py: 1.8,
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
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                      transition: "all 0.2s",
                      "&:hover": { 
                        backgroundColor: "#f0f4ff",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                      },
                    }}
                  >
                    {/* Date Cell */}
                    <TableCell sx={{ 
                      fontWeight: 500, 
                      textAlign: "center",
                      color: theme.palette.text.secondary
                    }}>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(row.date))}
                    </TableCell>
       
                    {/* Editable Value Cells */}
                    {["ctc", "rpt", "gfAndTf"].map((field) => (
                      <TableCell key={field} sx={{ 
                        textAlign: "center", 
                        position: "relative",
                        minWidth: 120
                      }}>
                        {editingField?.row === index && editingField?.field === field ? (
                          <TextField
                            value={inputValues[`${index}-${field}`] || ""}
                            onChange={(e) => handleInputChange(index, field, e.target.value)}
                            size="small"
                            type="number"
                            sx={{
                              width: 100,
                              "& .MuiInputBase-input": {
                                fontWeight: 500,
                                textAlign: "center",
                                py: 0.5,
                              },
                            }}
                            autoFocus
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontWeight: 600 }}>
                              ₱{row[field].toLocaleString()}
                            </span>
  
                            {(row.adjustments?.[field]?.under > 0 || row.adjustments?.[field]?.over > 0) && (
                              <Tooltip
                                title={
                                  <Box>
                                    {row.adjustments[field].under > 0 && (
                                      <Box sx={{ color: theme.palette.error.main }}>
                                        Under: ₱{row.adjustments[field].under.toLocaleString()}
                                      </Box>
                                    )}
                                    {row.adjustments[field].over > 0 && (
                                      <Box sx={{ color: theme.palette.success.main }}>
                                        Over: ₱{row.adjustments[field].over.toLocaleString()}
                                      </Box>
                                    )}
                                  </Box>
                                }
                              >
                                <ErrorIcon
                                  color="error"
                                  sx={{
                                    fontSize: 16,
                                    ml: 0.5,
                                    verticalAlign: "middle",
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        )}
  
                        {editableRow === index && showButtons && (
                          <Box sx={{ 
                            display: "flex", 
                            gap: 1, 
                            justifyContent: "center", 
                            mt: 1,
                            "& .MuiButton-root": {
                              borderRadius: "6px",
                              boxShadow: "none"
                            }
                          }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleUnderClick(index, field)}
                              sx={{ 
                                minWidth: 80, 
                                textTransform: "none",
                                fontSize: "0.75rem",
                                fontWeight: 500
                              }}
                            >
                              Under
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleOverClick(index, field)}
                              sx={{ 
                                minWidth: 80, 
                                textTransform: "none",
                                fontSize: "0.75rem",
                                fontWeight: 500
                              }}
                            >
                              Over
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    ))}
  
                    {/* Due From Cell */}
                    <TableCell sx={{ textAlign: "center" }}>
                      {editableRow === index ? (
                        <TextField
                          value={updatedDueFrom[index] ?? row.dueFrom}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setUpdatedDueFrom((prev) => ({
                              ...prev,
                              [index]: isNaN(value) ? prev[index] : value,
                            }));
                          }}
                          size="small"
                          sx={{
                            width: 100,
                            "& .MuiInputBase-input": {
                              fontWeight: 500,
                              textAlign: "center",
                              py: 0.5,
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">₱</InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <span style={{ fontWeight: 600 }}>
                          ₱{row.dueFrom.toLocaleString()}
                        </span>
                      )}
                    </TableCell>
  
                    {/* RCD Total Cell */}
                    <TableCell sx={{ 
                      textAlign: "center", 
                      fontWeight: 600,
                      color: theme.palette.success.dark
                    }}>
                      ₱{row.rcdTotal.toLocaleString()}
                    </TableCell>
  
                    {/* Remarks Cell */}
                    <TableCell>
                      <TextField
                        fullWidth
                        value={comments[index] || ""}
                        onChange={(e) =>
                          handleCommentChange(index, e.target.value)
                        }
                        size="small"
                        placeholder="Add comment..."
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "6px",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: "0.875rem",
                            py: 0.5,
                          },
                        }}
                      />
                    </TableCell>
  
                    {/* Action Cell */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        color={editableRow === index ? "success" : "primary"}
                        onClick={() =>
                          editableRow === index
                            ? handleSaveClick(index, updatedDueFrom)
                            : handleEditClick(index)
                        }
                        sx={{ 
                          "&:hover": { 
                            backgroundColor: "rgba(25, 118, 210, 0.08)" 
                          },
                          transition: "all 0.2s",
                          transform: editableRow === index ? "scale(1.1)" : "scale(1)"
                        }}
                      >
                        {editableRow === index ? (
                          <Save fontSize="small" />
                        ) : (
                          <Edit fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 6 }}>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    color: theme.palette.text.secondary
                  }}>
                    <InsertDriveFileOutlined  sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      No records found
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Try adjusting your filters
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
  
            {/* Totals Row */}
            <TableRow sx={{ 
              backgroundColor: theme.palette.success.light,
              "& .MuiTableCell-root": {
                fontWeight: 700,
                fontSize: "0.9rem",
                py: 2
              }
            }}>
              <TableCell
                colSpan={4}
                sx={{ textAlign: "right", color: theme.palette.text.secondary }}
              >
                Grand Total
              </TableCell>
              <TableCell sx={{ 
                textAlign: "center", 
                color: theme.palette.error.dark
              }}>
                ₱{totalDueFrom.toLocaleString()}
              </TableCell>
              <TableCell sx={{ 
                textAlign: "center", 
                color: theme.palette.success.dark
              }}>
                ₱{totalRcd.toLocaleString()}
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  
      <Paper elevation={0} sx={{ 
        mt: 4, 
        p: 3, 
        borderRadius: 2,
        backgroundColor: "#f8fafc",
        border: "1px solid #e0e6ed"
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: "#fff", 
              p: 2, 
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: theme.palette.text.secondary,
                mb: 1
              }}>
                TOTAL COLLECTIONS
              </Typography>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  RCD Total
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: theme.palette.success.dark
                }}>
                  ₱{totalRcd.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: "#fff", 
              p: 2, 
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.error.light}`
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: theme.palette.text.secondary,
                mb: 1
              }}>
                DEDUCTIONS
              </Typography>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Due From
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: theme.palette.error.dark
                }}>
                  ₱{totalDueFrom.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ 
              backgroundColor: theme.palette.primary.light, 
              p: 2.5, 
              borderRadius: 2,
              mt: 1
            }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: theme.palette.common.white
                }}>
                  Net Collections
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 800,
                  color: theme.palette.common.white
                }}>
                  ₱{totalCollections.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: "400px"
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          py: 2
        }}>
          {isAdding ? "Add Adjustment" : "Subtract Adjustment"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {isAdding ? "Enter amount to add to" : "Enter amount to subtract from"} <strong>{dialogField}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            type="number"
            variant="outlined"
            value={dialogInputValue}
            onChange={(e) => setDialogInputValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₱</InputAdornment>
              ),
              sx: {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDialogConfirm} 
            color="primary"
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: "none"
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>

    <GenerateReport 
        open={reportDialog.open}
        onClose={handleCloseDialog}
        status={reportDialog.status}
        progress={reportDialog.progress}
      />
  </div>
  );
}

export default FullReport;