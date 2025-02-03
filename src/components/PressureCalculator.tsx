import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { PressureDataLoader } from '../utils/pressureDataLoader';
import { SteamData, UnitPreferences } from '../types/steam';
import { convertValue } from '../utils/unitConverter';
import { PropertySection } from './PropertySection';
import { alpha, useTheme } from '@mui/material/styles';
import CompressIcon from '@mui/icons-material/Compress';
import Slider from '@mui/material/Slider';
import { InterpolationDetails } from './InterpolationDetails';
import { debounce } from 'lodash';

export function PressureCalculator() {
  const [pressure, setPressure] = useState<string>('1');
  const [units, setUnits] = useState<UnitPreferences>({
    temperature: 'C',
    pressure: 'MPa',
    specificVolume: 'm³/kg',
    energy: 'kJ/kg',
    entropy: 'kJ/(kg·K)',
  });
  const [steamData, setSteamData] = useState<SteamData | null>(null);
  const [error, setError] = useState<string>('');
  const [visibleProperties, setVisibleProperties] = useState<Set<string>>(new Set([
    'temperature',
    'vf', 'vg', 'vfg',
    'uf', 'ug', 'ufg',
    'hf', 'hg', 'hfg',
    'sf', 'sg', 'sfg'
  ]));
  const [interpolationBounds, setInterpolationBounds] = useState<any>(null);
  const theme = useTheme();

  const sectionToUnitKey: Record<string, keyof UnitPreferences> = {
    'Temperature': 'temperature',
    'Specific Volume': 'specificVolume',
    'Internal Energy': 'energy',
    'Enthalpy': 'energy',
    'Entropy': 'entropy'
  };

  useEffect(() => {
    try {
      PressureDataLoader.initialize();
      const numValue = parseFloat(pressure);
      if (!isNaN(numValue)) {
        const result = PressureDataLoader.getInterpolatedData(numValue);
        if (result) {
          setSteamData(result.data);
          setInterpolationBounds(result.bounds);
          setError('');
        }
      }
    } catch (err) {
      setError('Error loading steam data');
      setSteamData(null);
      setInterpolationBounds(null);
    }
  }, [pressure]);

  // Debounce the pressure update
  const debouncedPressureUpdate = useMemo(
    () => debounce((value: number) => {
      const result = PressureDataLoader.getInterpolatedData(value);
      if (result) {
        setSteamData(result.data);
        setInterpolationBounds(result.bounds);
      }
    }, 100),
    []
  );

  // Update slider step based on pressure range
  const getSliderStep = (pressure: number) => {
    if (pressure < 0.01) return 0.0001;
    if (pressure < 0.1) return 0.001;
    if (pressure < 1) return 0.01;
    return 0.1;
  };

  const handlePressureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Only allow numbers and up to 6 decimal places
    if (!/^\d*\.?\d{0,6}$/.test(newValue)) return;
    
    setPressure(newValue);
    
    const numValue = parseFloat(newValue);
    if (newValue === '' || isNaN(numValue)) {
      setError('Please enter a valid pressure');
      setSteamData(null);
      setInterpolationBounds(null);
      return;
    }

    if (numValue < 0.000611657 || numValue > 22.064) {
      setError('Pressure must be between 0.000611657 MPa and 22.064 MPa');
      setSteamData(null);
      setInterpolationBounds(null);
      return;
    }

    setError('');
    debouncedPressureUpdate(numValue);
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
      title: 'Temperature',
      unit: '°C',
      availableUnits: ['°C'],
      properties: [
        {
          id: 'temperature',
          title: 'Saturation Temperature',
          notation: 'T(sat)',
          value: steamData?.temperature || 0,
          description: 'Temperature at which vapor and liquid phases coexist'
        }
      ]
    },
    {
      title: 'Specific Volume',
      unit: units.specificVolume,
      availableUnits: ['m³/kg', 'cm³/g', 'ft³/lb'],
      properties: [
        {
          id: 'vf',
          title: 'Liquid',
          notation: 'v(f)',
          value: convertValue(steamData?.specificVolume.f || 0, 'm³/kg', units.specificVolume),
          description: 'Specific volume of saturated liquid'
        },
        {
          id: 'vg',
          title: 'Vapor',
          notation: 'v(g)',
          value: convertValue(steamData?.specificVolume.g || 0, 'm³/kg', units.specificVolume),
          description: 'Specific volume of saturated vapor'
        },
        {
          id: 'vfg',
          title: 'Vaporization',
          notation: 'v(fg)',
          value: convertValue(steamData?.specificVolume.fg || 0, 'm³/kg', units.specificVolume),
          description: 'Change in specific volume during vaporization'
        }
      ]
    },
    {
      title: 'Internal Energy',
      unit: units.energy,
      availableUnits: ['kJ/kg', 'kcal/kg', 'BTU/lb'],
      properties: [
        {
          id: 'uf',
          title: 'Liquid',
          notation: 'u(f)',
          value: convertValue(steamData?.internalEnergy.f || 0, 'kJ/kg', units.energy),
          description: 'Internal energy of saturated liquid'
        },
        {
          id: 'ug',
          title: 'Vapor',
          notation: 'u(g)',
          value: convertValue(steamData?.internalEnergy.g || 0, 'kJ/kg', units.energy),
          description: 'Internal energy of saturated vapor'
        },
        {
          id: 'ufg',
          title: 'Vaporization',
          notation: 'u(fg)',
          value: convertValue(steamData?.internalEnergy.fg || 0, 'kJ/kg', units.energy),
          description: 'Change in internal energy during vaporization'
        }
      ]
    },
    {
      title: 'Enthalpy',
      unit: units.energy,
      availableUnits: ['kJ/kg', 'kcal/kg', 'BTU/lb'],
      properties: [
        {
          id: 'hf',
          title: 'Liquid',
          notation: 'h(f)',
          value: convertValue(steamData?.enthalpy.f || 0, 'kJ/kg', units.energy),
          description: 'Enthalpy of saturated liquid'
        },
        {
          id: 'hg',
          title: 'Vapor',
          notation: 'h(g)',
          value: convertValue(steamData?.enthalpy.g || 0, 'kJ/kg', units.energy),
          description: 'Enthalpy of saturated vapor'
        },
        {
          id: 'hfg',
          title: 'Vaporization',
          notation: 'h(fg)',
          value: convertValue(steamData?.enthalpy.fg || 0, 'kJ/kg', units.energy),
          description: 'Latent heat of vaporization'
        }
      ]
    },
    {
      title: 'Entropy',
      unit: units.entropy,
      availableUnits: ['kJ/(kg·K)', 'kcal/(kg·K)', 'BTU/(lb·°F)'],
      properties: [
        {
          id: 'sf',
          title: 'Liquid',
          notation: 's(f)',
          value: convertValue(steamData?.entropy.f || 0, 'kJ/(kg·K)', units.entropy),
          description: 'Entropy of saturated liquid'
        },
        {
          id: 'sg',
          title: 'Vapor',
          notation: 's(g)',
          value: convertValue(steamData?.entropy.g || 0, 'kJ/(kg·K)', units.entropy),
          description: 'Entropy of saturated vapor'
        },
        {
          id: 'sfg',
          title: 'Vaporization',
          notation: 's(fg)',
          value: convertValue(steamData?.entropy.fg || 0, 'kJ/(kg·K)', units.entropy),
          description: 'Change in entropy during vaporization'
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
          <CompressIcon sx={{ color: alpha(theme.palette.primary.main, 0.8), fontSize: '2rem' }} />
          Pressure-Based Steam Properties
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          backgroundColor: 'white',
          p: { xs: 1.5, sm: 4 },
          pt: {xs: 2.5, sm: 5},
          borderRadius: 1,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}>
          <Box sx={{ width: { xs: '100%', sm: 300 }, maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, width: '100%' }}>
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
                  },
                  mt: {xs: 0.15, sm: 0.15}
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
                width: { xs: 60, sm: 75 },
                minWidth: 65,
                color: 'text.secondary',
                fontSize: '0.9rem'
              }}>
                MPa
              </Box>
            </Box>

            <Typography variant="caption" color={error ? "error" : "text.secondary"}>
              {error || 'Valid range: 0.000611657 MPa to 22.064 MPa'}
            </Typography>

            {interpolationBounds && (
              <Box sx={{ mt: 2 }}>
                <InterpolationDetails
                  lowerBound={interpolationBounds.lower}
                  upperBound={interpolationBounds.upper}
                  currentPressure={parseFloat(pressure)}
                  isExact={interpolationBounds.isExact}
                  mode="pressure"
                />
              </Box>
            )}
          </Box>
        </Box>
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