// AppTitleComponent.jsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";

function AppTitleComponent({ logoSrc, title }) {
    return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
        <img src={logoSrc} alt="Logo" style={{ height: 40 }} />
        <Typography variant="h6" fontWeight="bold">
        {title}
        </Typography>
    </Box>
    );
}

AppTitleComponent.propTypes = {
    logoSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default AppTitleComponent;
