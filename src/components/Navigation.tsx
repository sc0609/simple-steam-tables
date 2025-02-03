import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CompressIcon from '@mui/icons-material/Compress';
import WaterIcon from '@mui/icons-material/Water';
import { alpha } from '@mui/material/styles';

interface NavigationProps {
  mode: 'temperature' | 'pressure' | 'compressed';
  onModeChange: (mode: 'temperature' | 'pressure' | 'compressed') => void;
}

const Navigation: React.FC<NavigationProps> = ({ mode, onModeChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const commonButtonStyles = {
    borderColor: alpha(theme.palette.primary.main, 0.5),
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      }
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }
  };

  if (isMobile) {
    return (
      <Box sx={{ 
        mb: 3,
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.default',
        zIndex: 1100,
        py: 1,
        boxShadow: '0 1.5px 2px rgba(0,0,0,0.05)',
      }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && onModeChange(newMode)}
          size="small"
          sx={{
            display: 'flex',
            width: '100%',
            px: 1,
            '& .MuiToggleButton-root': {
              ...commonButtonStyles,
              flex: 1,
              py: 1,
              fontSize: '0.75rem',
              lineHeight: 1.2,
              flexDirection: 'column',
              gap: 0.5,
            }
          }}
        >
          <ToggleButton value="temperature">
            <ThermostatIcon sx={{ fontSize: '1.2rem' }} />
            Temp
          </ToggleButton>
          <ToggleButton value="pressure">
            <CompressIcon sx={{ fontSize: '1.2rem' }} />
            Press
          </ToggleButton>
          <ToggleButton value="compressed">
            <WaterIcon sx={{ fontSize: '1.2rem' }} />
            Super
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      mb: 3, 
      display: 'flex', 
      justifyContent: 'center',
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
      py: 2,
      borderBottom: '1px solid',
      borderColor: alpha(theme.palette.primary.main, 0.1),
    }}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, newMode) => newMode && onModeChange(newMode)}
        size="large"
        sx={{
          '& .MuiToggleButton-root': {
            ...commonButtonStyles,
            px: 4,
            py: 1.5,
            gap: 1.5,
            fontSize: '0.85rem',
            fontWeight: 500,
          }
        }}
      >
        <ToggleButton value="temperature">
          <ThermostatIcon />
          Temperature-Based
        </ToggleButton>
        <ToggleButton value="pressure">
          <CompressIcon />
          Pressure-Based
        </ToggleButton>
        <ToggleButton value="compressed">
          <WaterIcon />
          Compressed/Superheated
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default Navigation;