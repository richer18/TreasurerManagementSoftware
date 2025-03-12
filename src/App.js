import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import Routers from './Router/Router';
import { MaterialUIControllerProvider } from './context';
import { AddressProvider } from './template/layout/businesspermit/BusinessRegistration/components/AddressContext'; // Import AddressProvider

// Define your theme with linearGradient functionality
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
        gradients: {
            primary: {
                main: '#1976d2',
                state: '#0d47a1', // Darker shade for gradient state
            },
            dark: {
                main: '#000',
                state: '#333',
            },
        },
    },
    typography: {
        // Define your typography settings
    },
    functions: {
        linearGradient: (color1, color2) => `linear-gradient(${color1}, ${color2})`,
    },
});

function App() {
    return (
        <MaterialUIControllerProvider>
            <ThemeProvider theme={theme}>
                <AddressProvider> {/* Wrap the app with AddressProvider */}
                    <Routers />
                </AddressProvider>
            </ThemeProvider>
        </MaterialUIControllerProvider>
    );
}

export default App;
