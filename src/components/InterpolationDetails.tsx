import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { alpha } from '@mui/material/styles';
import { SteamData } from '../types/steam';

// interface BoundData {
//   temp: number;
//   pressure: number;
//   specificVolume: { f: number; g: number; fg: number };
//   internalEnergy: { f: number; g: number; fg: number };
//   enthalpy: { f: number; g: number; fg: number };
//   entropy: { f: number; g: number; fg: number };
// }

interface InterpolationDetailsProps {
  lowerBound: any;
  upperBound: any;
  currentTemp?: number;
  currentPressure?: number;
  isExact?: boolean;
  mode?: 'temperature' | 'pressure';
  useDoubleInterpolation?: boolean;
  onInterpolationMethodChange?: (value: boolean) => void;
}

const formulaTooltip = `
Single Interpolation:
H = H₁ + (T - T₁)(H₂ - H₁)/(T₂ - T₁)

**Note:** Double interpolation might not be accurate for all cases. It is recommended to use single interpolation for most cases.
Double Interpolation:
H = (1 - (P - P₁)/(P₂ - P₁))(H₁ + (T - T₁)(H₂ - H₁)/(T₂ - T₁)) + 
    (P - P₁)/(P₂ - P₁)(H₃ + (T - T₁)(H₄ - H₃)/(T₂ - T₁))
`;

export function InterpolationDetails({
  lowerBound,
  upperBound,
  currentTemp,
  currentPressure,
  isExact,
  mode = 'temperature',
  useDoubleInterpolation,
  onInterpolationMethodChange
}: InterpolationDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  const PropertyRow = ({ label, lower, upper, unit }: { 
    label: string; 
    lower: number; 
    upper: number;
    unit: string;
  }) => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr 1fr', md: '2.5fr 2fr 2fr' },
      gap: { xs: 2, md: 3 },
      mb: 1,
      '& > *': { 
        fontFamily: '"JetBrains Mono", monospace',
        whiteSpace: 'nowrap'
      }
    }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{lower.toFixed(6)} {unit}</Typography>
      {!isExact && (
        <Typography variant="body2">{upper.toFixed(6)} {unit}</Typography>
      )}
    </Box>
  );

  const PropertySection = ({ title, data, unit }: {
    title: string;
    data: { f: number; g: number; fg: number };
    unit: string;
  }) => {
    const getPropertyKey = (title: string): keyof SteamData => {
      switch (title) {
        case 'Specific Volume': return 'specificVolume';
        case 'Internal Energy': return 'internalEnergy';
        case 'Enthalpy': return 'enthalpy';
        case 'Entropy': return 'entropy';
        default: return 'specificVolume';
      }
    };

    const getNotationPrefix = (title: string): string => {
      switch (title) {
        case 'Specific Volume': return 'v';
        case 'Internal Energy': return 'u';
        case 'Enthalpy': return 'h';
        case 'Entropy': return 's';
        default: return '';
      }
    };

    const propertyKey = getPropertyKey(title);
    const prefix = getNotationPrefix(title);

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <PropertyRow 
          label={`${prefix}(f)`} 
          lower={data.f} 
          upper={upperBound[propertyKey].f} 
          unit={unit} 
        />
        <PropertyRow 
          label={`${prefix}(g)`} 
          lower={data.g} 
          upper={upperBound[propertyKey].g} 
          unit={unit} 
        />
        <PropertyRow 
          label={`${prefix}(fg)`} 
          lower={data.fg} 
          upper={upperBound[propertyKey].fg} 
          unit={unit} 
        />
      </Box>
    );
  };

  if (isExact) {
    if (mode === 'temperature') {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          Using exact data at {currentTemp}°C
        </Typography>
      );
    } else {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          Using exact data at {currentPressure} MPa
        </Typography>
      );
    }
  }

  return (
    <Accordion 
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ 
        backgroundColor: alpha('#2563eb', 0.03),
        '&:before': { display: 'none' },
        boxShadow: 'none',
        border: '1px solid',
        borderColor: alpha('#2563eb', 0.1),
        borderRadius: 2,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="text.secondary" sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
          {isExact ? 
            `Using exact data at ${currentTemp}°C` :
            `Interpolated value using data points at ${lowerBound.temperature}°C and ${upperBound.temperature}°C`
          }
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {!isExact && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useDoubleInterpolation}
                  onChange={(e) => onInterpolationMethodChange?.(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">Use double interpolation</Typography>}
            />
            <Tooltip title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{formulaTooltip}</pre>} placement="top" arrow>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 6 },
          width: '100%',
          maxWidth: { xs: '100%', md: 1200 },
          mx: 'auto'
        }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Basic Properties</Typography>
            <PropertyRow 
              label="Temperature" 
              lower={lowerBound.temperature} 
              upper={upperBound.temperature} 
              unit="°C" 
            />
            <PropertyRow 
              label="Pressure" 
              lower={lowerBound.pressure} 
              upper={upperBound.pressure} 
              unit="MPa" 
            />
          </Box>

          <PropertySection title="Specific Volume" data={lowerBound.specificVolume} unit="m³/kg" />
          <PropertySection title="Internal Energy" data={lowerBound.internalEnergy} unit="kJ/kg" />
          <PropertySection title="Enthalpy" data={lowerBound.enthalpy} unit="kJ/kg" />
          <PropertySection title="Entropy" data={lowerBound.entropy} unit="kJ/(kg·K)" />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
} 