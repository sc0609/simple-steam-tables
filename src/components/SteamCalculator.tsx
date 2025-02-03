import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { SteamDataLoader } from '../utils/dataLoader';
import { SteamData, UnitPreferences, InterpolationBounds } from '../types/steam';
import { convertValue } from '../utils/unitConverter';
import { PropertySection } from './PropertySection';
import { alpha, useTheme } from '@mui/material/styles';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import Slider from '@mui/material/Slider';
import { InterpolationDetails } from './InterpolationDetails';

export function SteamCalculator() {
  const [temperature, setTemperature] = useState<string>('25');
  const [units, setUnits] = useState<UnitPreferences>({
    temperature: 'C',
    pressure: 'bar',
    specificVolume: 'm³/kg',
    energy: 'kJ/kg',
    entropy: 'kJ/(kg·K)',
  });
  const [steamData, setSteamData] = useState<SteamData | null>(null);
  const [error, setError] = useState<string>('');
  const [visibleProperties, setVisibleProperties] = useState<Set<string>>(new Set([
    'pressure',
    'vf', 'vg', 'vfg',
    'uf', 'ug', 'ufg',
    'hf', 'hg', 'hfg',
    'sf', 'sg', 'sfg'
  ]));
  const [useDoubleInterpolation, setUseDoubleInterpolation] = useState(false);
  const [interpolationBounds, setInterpolationBounds] = useState<InterpolationBounds | null>(null);

  const theme = useTheme();

  const sectionToUnitKey: Record<string, keyof UnitPreferences> = {
    'Pressure': 'pressure',
    'Specific Volume': 'specificVolume',
    'Internal Energy': 'energy',
    'Enthalpy': 'energy',
    'Entropy': 'entropy'
  };

  useEffect(() => {
    try {
      SteamDataLoader.initialize();
      
      const numValue = parseFloat(temperature);
      if (!isNaN(numValue)) {
        const result = SteamDataLoader.getInterpolatedData(numValue);
        
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
  }, [temperature]);

  // not needed for new versions 
  // const formatTemperature = (temp: number): string => {
  //   if (temp === 0.01 || temp === 373.946) return temp.toString();
  //   if (Number.isInteger(temp)) return Math.round(temp).toString();
  //   return temp.toFixed(2);
  // };

  const temperatureSections = useMemo(() => [
    {
      title: 'Pressure',
      unit: units.pressure,
      availableUnits: ['MPa', 'bar', 'kPa', 'psi'],
      properties: [
        {
          id: 'pressure',
          title: 'Saturation Pressure',
          notation: 'P(sat)',
          value: convertValue(steamData?.pressure || 0, 'MPa', units.pressure),
          description: 'Pressure at which vapor and liquid phases coexist'
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

  const getValidationRange = () => {
    return {
      min: 0.01,
      max: 373.946,
      step: 1,
      error: 'Temperature must be between 0.01°C and 373.946°C',
      range: 'Valid range: 0.01°C to 373.946°C'
    };
  };

  const range = getValidationRange();

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!/^\d*\.?\d{0,3}$/.test(newValue)) return;
    
    setTemperature(newValue);
    
    const numValue = parseFloat(newValue);
    if (newValue === '' || isNaN(numValue)) {
      setError('Please enter a valid value');
      setSteamData(null);
      setInterpolationBounds(null);
      return;
    }

    if (numValue < range.min || numValue > range.max) {
      setError(range.error);
      setSteamData(null);
      setInterpolationBounds(null);
      return;
    }

    setError('');
    const result = SteamDataLoader.getInterpolatedData(numValue);

    if (result) {
      setSteamData(result.data);
      setInterpolationBounds(result.bounds);
    } else {
      setError('Error loading steam data');
      setSteamData(null);
      setInterpolationBounds(null);
    }
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

  return (
    <Container maxWidth="lg" sx={{ 
      py: {xs: 0, sm: 2},
      px: { xs: 1.75, sm: 2, md: 8 }
    }}>
      <Paper 
        elevation={0}
        sx={{ 
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
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ThermostatIcon 
            sx={{ 
              color: alpha(theme.palette.primary.main, 0.8),
              fontSize: '2rem'
            }} 
          />
          Temperature-Based Steam Properties
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
          <Box sx={{ 
            width: { xs: '100%', sm: 300 },
            maxWidth: '100%'
          }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, width: '100%' }}>
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
                  },
                  mt: {xs: 0.15, sm: 0.15}
                }}
              />
              <Box 
                sx={{ 
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
                }}
              >
                °C
              </Box>
            </Box>
            
            <Typography 
              variant="caption" 
              color={error ? "error" : "text.secondary"}
              sx={{ 
                display: 'block',
                ml: 0,
              }}
            >
              {error || range.range}
            </Typography>

            <Box sx={{ px: {xs: 1, sm: 2}, mb: {xs: -0.5, sm: -0.5} }}>
              <Slider
                value={parseFloat(temperature)}
                onChange={(_, newValue) => {
                  const val = typeof newValue === 'number' ? newValue : newValue[0];
                  setTemperature(val.toString());
                }}
                min={0.01}
                max={373.946}
                step={1}
                marks
                size="small"
                sx={{
                  '& .MuiSlider-mark': {
                    height: 2,
                  }
                }}
              />
            </Box>

            {interpolationBounds && (
              <Box sx={{ mt: 2 }}>
                <InterpolationDetails
                  lowerBound={interpolationBounds.lower}
                  upperBound={interpolationBounds.upper}
                  currentTemp={parseFloat(temperature)}
                  isExact={interpolationBounds.isExact}
                  useDoubleInterpolation={useDoubleInterpolation}
                  onInterpolationMethodChange={setUseDoubleInterpolation}
                />
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              height: { xs: 'auto', sm: 40 },
              px: { xs: 0, sm: 2 },
              borderLeft: { xs: 'none', sm: '1.5px solid hsl(0, 0%, 85%)' },
              borderTop: { xs: '1.5px solid hsl(0, 0%, 85%)', sm: 'none' },
              pt: { xs: 1, sm: 0 },
              borderColor: alpha(theme.palette.primary.main, 4),
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.85rem',
                fontStyle: 'italic !important',
                fontWeight: 400,
                letterSpacing: '-0.0em',
                lineHeight: 1,
                textAlign: 'center',
                fontFamily: 'Inter',
              }}
            >
              Saturation properties by temperature
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={1}
        sx={{ 
          px: { xs: 0.75, sm: 3 },
          mb: 1,
          borderRadius: 2,
          background: 'transparent',
        }}        
      >
        {temperatureSections.map(section => (
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