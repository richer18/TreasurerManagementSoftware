import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import OtherIncomeDialogContent from "./component/OtherIncomeDialogContent";
import OtherTaxesDialogContent from "./component/OtherTaxesDialogContent";
import ReceiptsFromEconomicDialogContent from "./component/ReceiptsFromEconomicEnterprisesDialogContent";
import RegulatoryFeesDialogContent from "./component/RegulatoryFeeAndChargesDialogContent";
import ServiceUserChargesDialogContent from "./component/ServiceUserChargesDialogContent";
import TaxOnBusinessDialogContent from "./component/TaxOnBusinessDialogContent";

import RealPropertyTaxBasicDialogContent from "./component/RealPropertyTaxBasicDialogContent";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import GavelIcon from "@mui/icons-material/Gavel";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import StoreIcon from "@mui/icons-material/Store";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Utility functions
const convertQuarterToMonths = (quarter) => {
  const quarterMap = {
    "Q1 - Jan, Feb, Mar": [1, 2, 3],
    "Q2 - Apr, May, Jun": [4, 5, 6],
    "Q3 - Jul, Aug, Sep": [7, 8, 9],
    "Q4 - Oct, Nov, Dec": [10, 11, 12],
  };
  return quarterMap[quarter] || [];
};

// Utility to format currency
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(value);

// Utility to generate box value (loading, error, or formatted)
const formatValue = (data) =>
  data.loading ? (
    <CircularProgress size={24} />
  ) : (
    data.error || formatCurrency(data.value)
  );

// Utility to get icon
const getIcon = (title) => {
  switch (title) {
    case "TAX ON BUSINESS":
      return <BusinessIcon />;
    case "REGULATORY FEES":
      return <GavelIcon />;
    case "SERVICE/USER CHARGES":
      return <MonetizationOnIcon />;
    case "RECEIPTS FROM ECONOMIC ENTERPRISES":
      return <StoreIcon />;
    case "OTHER TAXES":
      return <AttachMoneyIcon />;
    case "OTHER INCOME RECEIPTS":
      return <PaymentsIcon />;
    case "Real Property Tax Basic":
      return <PaymentsIcon />;
    case "RPT SEF":
      return <PaymentsIcon />;
    case "Overall Total":
      return <PaymentsIcon />;
    default:
      return null;
  }
};

export default function Esre() {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [anchorQuarter, setAnchorQuarter] = useState(null);
  const [anchorYear, setAnchorYear] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);

  const [taxBusinessData, setTaxBusinessData] = useState({
    value: 0,
    loading: true,
    error: null,
  });

  const [regulatoryFeesData, setRegulatoryFeesData] = useState({
    value: 0,
    loading: true,
    error: null,
  });

  const [serviceUserChargesData, setServiceUserChargesData] = useState({
    value: 0,
    loading: true,
    error: null,
  });

  const [receiptsEconomicEntData, setReceiptsEconomicEntDataData] = useState({
    value: 0,
    loading: true,
    error: null,
  });

  const [otherTaxesData, setOtherTaxesData] = useState({
    value: 0,
    loading: true,
    error: null,
  });

  const [realPropertyTaxData, setRealPropertyTaxData] = useState({
    value: 0,
    loading: true,
    error: null,
  });


  

  // Filter options
  const quarterOptions = [
    "Q1 - Jan, Feb, Mar",
    "Q2 - Apr, May, Jun",
    "Q3 - Jul, Aug, Sep",
    "Q4 - Oct, Nov, Dec",
  ];

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() + i
  );

  // Fetch Tax on Business data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const months = convertQuarterToMonths(selectedQuarter);
        const params = new URLSearchParams({
          year: selectedYear,
          months: months?.join(",") || "",
        });

        // Start both loading
        setTaxBusinessData((prev) => ({ ...prev, loading: true, error: null }));
        setRegulatoryFeesData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));
        setServiceUserChargesData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));
        setReceiptsEconomicEntDataData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));
        setOtherTaxesData((prev) => ({ ...prev, loading: true, error: null }));
        setRealPropertyTaxData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const [taxRes, regRes, serRes, reeRes, otRes,basicRes] = await Promise.all([
          fetch(
            `http://localhost:3001/api/TaxOnBusinessTotalESREBox?${params}`
          ),
          fetch(
            `http://localhost:3001/api/RegulatoryFeesAndChargesTotalESREBox?${params}`
          ),
          fetch(
            `http://localhost:3001/api/ServiceUserChargesTotalESREBox?${params}`
          ),
          fetch(
            `http://localhost:3001/api/ReceiptsEconomicEnterprisesTotalESREBox?${params}`
          ),
          fetch(
            `http://localhost:3001/api/OtherTaxesTotalESREBox?${params}`
          ),
          fetch(
            `http://localhost:3001/api/RealPropertyTaxSharingTotalBox?${params}`
          ),
        ]);

        const checkJson = async (res) => {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            throw new Error(`Invalid response format: ${text.slice(0, 100)}`);
          }
          return res.json();
        };

        const [taxData, regData, serData, reeData, otsData,basicData] = await Promise.all(
          [
            checkJson(taxRes),
            checkJson(regRes),
            checkJson(serRes),
            checkJson(reeRes),
            checkJson(otRes),
            checkJson(basicRes),
          ]
        );

        if (
          typeof taxData.total === "undefined" ||
          typeof taxData.currency === "undefined"
        ) {
          throw new Error("Invalid structure in tax data");
        }

        if (
          typeof regData.total === "undefined" ||
          typeof regData.currency === "undefined"
        ) {
          throw new Error("Invalid structure in regulatory data");
        }
        if (
          typeof serData.total === "undefined" ||
          typeof serData.currency === "undefined"
        ) {
          throw new Error("Invalid structure in regulatory data");
        }
        if (
          typeof reeData.total === "undefined" ||
          typeof reeData.currency === "undefined"
        ) {
          throw new Error("Invalid structure in regulatory data");
        }
        if (
          typeof otsData.total === "undefined" ||
          typeof otsData.currency === "undefined"
        ) {
          throw new Error("Invalid structure in regulatory data");
        }
        if (
          typeof basicData.total === "undefined" ||
          typeof basicData.currency === "undefined"
        ) {
          throw new Error("Invalid structure in RealPropertyTax Basic data");
        }

        setTaxBusinessData({
          value: taxData.total,
          loading: false,
          error: null,
        });
        setRegulatoryFeesData({
          value: regData.total,
          loading: false,
          error: null,
        });
        setServiceUserChargesData({
          value: serData.total,
          loading: false,
          error: null,
        });
        setReceiptsEconomicEntDataData({
          value: reeData.total,
          loading: false,
          error: null,
        });
        setOtherTaxesData({
          value: otsData.total,
          loading: false,
          error: null,
        });
        setRealPropertyTaxData({
          value: basicData.total,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Fetch error:", err);

        setTaxBusinessData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`,
        });
        setRegulatoryFeesData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`,
        });
        setServiceUserChargesData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`,
        });
        setReceiptsEconomicEntDataData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`,
        });
        setOtherTaxesData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`,
        });
        setRealPropertyTaxData({
          value: 0,
          loading: false,
          error: `Data load failed: ${err.message}`,
        });
      }
    };

    fetchDashboardData();
  }, [selectedQuarter, selectedYear]);

  // Dashboard boxes configuration
  const dashboardBoxes = [
    {
      title: "TAX ON BUSINESS",
      value: formatValue(taxBusinessData),
      trend: "+12%",
      trendIcon: <TrendingUpIcon color="success" />,
      icon: getIcon("TAX ON BUSINESS"),
      color: "#e3f2fd",
      isDynamic: true,
    },
    {
      title: "REGULATORY FEES",
      value: formatValue(regulatoryFeesData),
      trend: "+3%",
      trendIcon: <TrendingUpIcon color="success" />,
      icon: getIcon("REGULATORY FEES"),
      color: "#f1f8e9",
      isDynamic: true,
    },
    {
      title: "SERVICE/USER CHARGES",
      value: formatValue(serviceUserChargesData),
      trend: "+5%",
      trendIcon: <TrendingUpIcon color="success" />,
      icon: getIcon("SERVICE/USER CHARGES"),
      color: "#fffde7",
      isDynamic: true,
    },
    {
      title: "RECEIPTS FROM ECONOMIC ENTERPRISES",
      value: formatValue(receiptsEconomicEntData),
      trend: "+2%",
      trendIcon: <TrendingUpIcon color="success" />,
      icon: getIcon("RECEIPTS FROM ECONOMIC ENTERPRISES"),
      color: "#e8f5e9",
      isDynamic: true,
    },
    {
      title: "OTHER TAXES",
      value: formatValue(otherTaxesData),
      trend: "+4%",
      trendIcon: <TrendingUpIcon color="success" />,
      icon: getIcon("OTHER TAXES"),
      color: "#fce4ec",
      isDynamic: true,
    },
    {
      title: "OTHER INCOME RECEIPTS",
      value: "-2.3%",
      trend: "-0.5%",
      trendIcon: <TrendingDownIcon color="error" />,
      icon: getIcon("OTHER INCOME RECEIPTS"),
      color: "#ede7f6",
      isDynamic: false,
    },
    {
      title: "Real Property Tax Basic",
      value: formatValue(realPropertyTaxData),
      trend: "-5.5%",
      trendIcon: <TrendingDownIcon color="error" />,
      icon: getIcon("Real Property Tax Basic"),
      color: "#ede7f6",
      isDynamic: false,
    },
    {
      title: "Real Property Tax SEF",
      value: "-2.3%",
      trend: "-0.5%",
      trendIcon: <TrendingDownIcon color="error" />,
      icon: getIcon("Real Property Tax SEF"),
      color: "#ede7f6",
      isDynamic: false,
    },
    {
      title: "Overall Total",
      value: "-2.3%",
      trend: "-0.5%",
      trendIcon: <TrendingDownIcon color="error" />,
      icon: getIcon("Overall Total"),
      color: "#ede7f6",
      isDynamic: false,
    },
  ];

  const dialogContentMap = {
    "TAX ON BUSINESS": (
      <TaxOnBusinessDialogContent
        quarter={selectedQuarter}
        year={selectedYear}
      />
    ),
    "REGULATORY FEES": (
      <RegulatoryFeesDialogContent
        quarter={selectedQuarter}
        year={selectedYear}
      />
    ),
    "SERVICE/USER CHARGES": (
      <ServiceUserChargesDialogContent
        quarter={selectedQuarter}
        year={selectedYear}
      />
    ),
    "RECEIPTS FROM ECONOMIC ENTERPRISES": (
      <ReceiptsFromEconomicDialogContent
        quarter={selectedQuarter}
        year={selectedYear}
      />
    ),
    "OTHER TAXES": (
      <OtherTaxesDialogContent quarter={selectedQuarter} year={selectedYear} />
    ),
    "OTHER INCOME RECEIPTS": <OtherIncomeDialogContent />,
    "Real Property Tax Basic": (
      <RealPropertyTaxBasicDialogContent quarter={selectedQuarter} year={selectedYear} />
    ),
    "RPT SEF": <OtherIncomeDialogContent />,
    "OVERALL TOTAL": <OtherIncomeDialogContent />,
  };

  const handleDialogClose = () => {
    setSelectedBox(null); // closes the dialog
  };

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box mb={5}>
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            ESRE Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Executive Summary Reporting Engine Overview
          </Typography>
        </Box>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 5, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                endIcon={<ExpandMoreIcon />}
                onClick={(e) => setAnchorQuarter(e.currentTarget)}
              >
                {selectedQuarter || "Select Quarter"}
              </Button>
              <Menu
                anchorEl={anchorQuarter}
                open={Boolean(anchorQuarter)}
                onClose={() => setAnchorQuarter(null)}
              >
                {quarterOptions.map((quarter) => (
                  <MenuItem
                    key={quarter}
                    onClick={() => {
                      setSelectedQuarter(quarter);
                      setAnchorQuarter(null);
                    }}
                  >
                    {quarter}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                endIcon={<ExpandMoreIcon />}
                onClick={(e) => setAnchorYear(e.currentTarget)}
              >
                {selectedYear}
              </Button>
              <Menu
                anchorEl={anchorYear}
                open={Boolean(anchorYear)}
                onClose={() => setAnchorYear(null)}
              >
                {yearOptions.map((year) => (
                  <MenuItem
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setAnchorYear(null);
                    }}
                  >
                    {year}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Paper>

        {/* Dashboard Cards */}
        <Grid container spacing={4}>
          {dashboardBoxes.map((box, index) => {
            const trendIsPositive = box.trend?.startsWith("+");
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ButtonBase
                  onClick={() => setSelectedBox(box)}
                  sx={{ width: "100%", borderRadius: 3 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      backgroundColor: box.color,
                      borderRadius: 3,
                      width: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 8,
                      },
                      position: "relative",
                      overflow: "hidden",
                      minHeight: 120,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      ...(box.isDynamic &&
                        box.error && {
                          border: "2px solid #f44336",
                          boxShadow: "0 0 8px rgba(244,67,54,0.3)",
                        }),
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {box.title}
                      {box.error && (
                        <Typography variant="caption" color="error" ml={1}>
                          (Error)
                        </Typography>
                      )}
                    </Typography>

                    <Box
                      mt={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {box.value}
                      </Typography>
                      <Chip
                        label={box.trend}
                        size="small"
                        sx={{
                          backgroundColor: trendIsPositive
                            ? "#c8e6c9"
                            : "#ffcdd2",
                          color: trendIsPositive ? "#256029" : "#b71c1c",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Paper>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>

        {/* Dialog Section */}
        <Dialog
          open={Boolean(selectedBox)}
          onClose={handleDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {selectedBox?.title || "Details"}
            </Typography>
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {selectedBox?.title && dialogContentMap[selectedBox.title] ? (
              dialogContentMap[selectedBox.title]
            ) : (
              <DialogContentText>
                <Typography variant="body1" gutterBottom>
                  <strong>Value:</strong> {selectedBox?.value}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Trend:</strong> {selectedBox?.trend}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Selected Quarter:</strong> {selectedQuarter || "None"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Selected Year:</strong> {selectedYear}
                </Typography>
              </DialogContentText>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
