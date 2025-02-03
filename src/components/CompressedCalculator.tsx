import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import WaterIcon from '@mui/icons-material/Water';
import { PropertySection } from './PropertySection';
// import { debounce } from 'lodash';
import { CompressedDataLoader } from '../utils/compressedDataLoader';
import { SteamData, UnitPreferences } from '../types/steam';
import { convertValue } from '../utils/unitConverter';

export function CompressedCalculator() {
  const [temperature, setTemperature] = useState<string>('100');
  const [pressure, setPressure] = useState<string>('1');
  const [units, setUnits] = useState<UnitPreferences>({
    temperature: '°C',
    pressure: 'MPa',
    specificVolume: 'm³/kg',
    energy: 'kJ/kg',
    entropy: 'kJ/(kg·K)',
  });
  const [steamData, setSteamData] = useState<SteamData | null>(null);
  const [error, setError] = useState<string>('');
  const [phaseWarning, setPhaseWarning] = useState<string>('');
  const [visibleProperties, setVisibleProperties] = useState<Set<string>>(new Set([
    'phase',
    'v', 'u', 'h', 's'
  ]));

  const theme = useTheme();

  const sectionToUnitKey: Record<string, keyof UnitPreferences> = {
    'Pressure': 'pressure',
    'Specific Volume': 'specificVolume',
    'Internal Energy': 'energy',
    'Enthalpy': 'energy',
    'Entropy': 'entropy'
  };

//   const debouncedDataUpdate = useMemo(
//     () => debounce((temp: number, press: number) => {
//       try {
//         const result = CompressedDataLoader.getData(temp, press);
//         if (result) {
//           setSteamData(result.data);
//           setPhaseWarning(result.warning || '');
//         }
//       } catch (err) {
//         setError('Error loading steam data');
//         setSteamData(null);
//       }
//     }, 100),
//     []
//   );

  useEffect(() => {
    try {
      CompressedDataLoader.initialize();
      
      const tempValue = parseFloat(temperature);
      const pressValue = parseFloat(pressure);
      
      if (!isNaN(tempValue) && !isNaN(pressValue)) {
        const result = CompressedDataLoader.getData(tempValue, pressValue);
        if (result) {
          setSteamData(result.data);
          setPhaseWarning(result.warning || '');
          setError('');
        }
      }
    } catch (err) {
      setError('Error loading steam data');
      setSteamData(null);
    }
  }, [temperature, pressure]);

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!/^\d*\.?\d{0,3}$/.test(newValue)) return;
    
    setTemperature(newValue);
    const numValue = parseFloat(newValue);
    
    if (newValue === '' || isNaN(numValue)) {
      setError('Please enter a valid temperature');
      return;
    }

    if (numValue < 0.01 || numValue > 373.95) {
      setError('Temperature must be between 0.01°C and 373.95°C');
      return;
    }

    setError('');
  };

  const handlePressureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!/^\d*\.?\d{0,3}$/.test(newValue)) return;
    
    setPressure(newValue);
    const numValue = parseFloat(newValue);
    
    if (newValue === '' || isNaN(numValue)) {
      setError('Please enter a valid pressure');
      return;
    }

    if (numValue < 0.01 || numValue > 1000) {
      setError('Pressure must be between 0.01 MPa and 1000 MPa');
      return;
    }

    setError('');
  };

  const toggleProperty = (propertyId: string) => {
    setVisibleProperties(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  };

  const sections = useMemo(() => [
    {
      title: 'Phase',
      unit: '',
      availableUnits: [''],
      properties: [
        {
          id: 'phase',
          title: 'State',
          notation: 'φ',
          value: steamData?.phase || 'N/A',
          description: 'Phase of water at given conditions'
        }
      ]
    },
    {
      title: 'Specific Volume',
      unit: units.specificVolume,
      availableUnits: ['m³/kg', 'cm³/g', 'ft³/lb'],
      properties: [
        {
          id: 'v',
          title: 'Specific Volume',
          notation: 'v',
          value: convertValue(steamData?.specificVolume.f || 0, 'm³/kg', units.specificVolume),
          description: 'Specific volume at given conditions'
        }
      ]
    },
    {
      title: 'Internal Energy',
      unit: units.energy,
      availableUnits: ['kJ/kg', 'kcal/kg', 'BTU/lb'],
      properties: [
        {
          id: 'u',
          title: 'Internal Energy',
          notation: 'u',
          value: convertValue(steamData?.internalEnergy.f || 0, 'kJ/kg', units.energy),
          description: 'Internal energy at given conditions'
        }
      ]
    },
    {
      title: 'Enthalpy',
      unit: units.energy,
      availableUnits: ['kJ/kg', 'kcal/kg', 'BTU/lb'],
      properties: [
        {
          id: 'h',
          title: 'Enthalpy',
          notation: 'h',
          value: convertValue(steamData?.enthalpy.f || 0, 'kJ/kg', units.energy),
          description: 'Enthalpy at given conditions'
        }
      ]
    },
    {
      title: 'Entropy',
      unit: units.entropy,
      availableUnits: ['kJ/(kg·K)', 'kcal/(kg·K)', 'BTU/(lb·°F)'],
      properties: [
        {
          id: 's',
          title: 'Entropy',
          notation: 's',
          value: convertValue(steamData?.entropy.f || 0, 'kJ/(kg·K)', units.entropy),
          description: 'Entropy at given conditions'
        }
      ]
    }
  ], [steamData, units]);

  return (
    <Container maxWidth="lg" sx={{ py: {xs: 0, sm: 2}, px: { xs: 1.75, sm: 2, md: 8 } }}>
      <Paper elevation={0} sx={{ 
        p: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 5 },
        pl: {xs: 1.5, sm: 3},
        pr: {xs: 1.5, sm: 3},
        mr: {xs: 0.66, sm: 3},
        ml: {xs: 0.66, sm: 3},
        borderRadius: 2,
        border: '2px solid',
        borderColor: alpha(theme.palette.primary.main, 0.04),
        background: alpha(theme.palette.primary.main, 0.04),
      }}>
        <Typography variant="h4" sx={{ 
          fontSize: '1.25rem',
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <WaterIcon sx={{ color: alpha(theme.palette.primary.main, 0.8), fontSize: '2rem' }} />
          Compressed Liquid & Superheated Steam Properties
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          backgroundColor: 'white',
          p: { xs: 2, sm: 4 },
          borderRadius: 1,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}>
          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Temperature"
                value={temperature}
                onChange={handleTemperatureChange}
                error={!!error}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                px: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'white',
                width: 65,
                color: 'text.secondary',
                fontSize: '0.9rem'
              }}>
                °C
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Valid range: 0.01°C to 373.95°C
            </Typography>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Pressure"
                value={pressure}
                onChange={handlePressureChange}
                error={!!error}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                px: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'white',
                width: 65,
                color: 'text.secondary',
                fontSize: '0.9rem'
              }}>
                MPa
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Valid range: 0.01 MPa to 1000 MPa
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {phaseWarning && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {phaseWarning}
          </Alert>
        )}
      </Paper>

      <Grid container spacing={1} sx={{ 
        px: { xs: 0.75, sm: 3 },
        mb: 1,
        borderRadius: 2,
        background: 'transparent',
      }}>
        {sections.map(section => (
          <PropertySection
            key={section.title}
            {...section}
            visibleProperties={visibleProperties}
            onToggleProperty={toggleProperty}
            onUnitChange={(newUnit) => {
              const key = sectionToUnitKey[section.title];
              if (key) {
                setUnits(prev => ({ ...prev, [key]: newUnit }));
              }
            }}
          />
        ))}
      </Grid>
    </Container>
  );
} 