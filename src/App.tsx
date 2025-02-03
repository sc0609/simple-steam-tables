import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { SteamCalculator } from './components/SteamCalculator';
import { PressureCalculator } from './components/PressureCalculator';
import { CompressedCalculator } from './components/CompressedCalculator';
import Navigation from './components/Navigation';
import { alpha } from '@mui/material/styles';
import { Footer } from './components/Footer';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
      fontSize: '1rem',
    },
    body2: {
      fontStyle: 'italic',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid',
          borderColor: '#e2e8f0',
          '&:hover': {
            borderColor: '#3b82f6',
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: '0.9rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.9rem',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#3b82f6', 0.08),
          },
        },
        sizeSmall: {
          padding: 6,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 8,
          border: '1px solid',
          borderColor: '#e2e8f0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          minHeight: 32,
          padding: '4px 16px',
          '&:hover': {
            backgroundColor: alpha('#3b82f6', 0.08),
          },
        },
      },
    },
  },
});

export function App() {
  const [mode, setMode] = useState<'temperature' | 'pressure' | 'compressed'>('temperature');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navigation mode={mode} onModeChange={setMode} />
        {mode === 'temperature' ? <SteamCalculator /> : 
         mode === 'pressure' ? <PressureCalculator /> : 
         <CompressedCalculator />}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
