import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
  InputLabel,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  border: '1.5px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.00),
    '& .action-buttons': {
      opacity: 1,
    },
  },
}));

const ValueContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1.5),
  },
}));

const ValueDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.primary.main,
  fontFamily: '"JetBrains Mono", monospace',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.95rem',
    textAlign: 'center',
  },
}));

const UnitSelect = styled(Select)(({ theme }) => ({
  minWidth: 90,
  maxWidth: 150,
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.85rem',
  '& .MuiSelect-select': {
    padding: '4px 10px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    flex: 1,
    width: '100%',
    maxWidth: 'none',
    fontSize: '0.85rem',
    '& .MuiSelect-select': {
      padding: '3px 11px',
    },
  },
}));

const PropertyTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .title-suffix': {
    color: theme.palette.text.secondary,
    fontFamily: '"Inter", sans-serif',
    fontWeight: 400,
    fontSize: '0.85rem',
  }
}));

interface PropertyCardProps {
  title: string;
  notation: string;
  value: number | string;
  unit: string;
  availableUnits: string[];
  description: string;
  onUnitChange: (newUnit: string) => void;
  onRemove: () => void;
}

export function PropertyCard({
  title,
  notation,
  value,
  unit,
  availableUnits,
  description,
  onUnitChange,
  onRemove,
}: PropertyCardProps) {
  const theme = useTheme();
  const [showDescription, setShowDescription] = useState(false);

  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    return value.toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <StyledCard>
      <CardContent sx={{ 
        p: 1,
        '&:last-child': { pb: 1 },
      }}>
        <Box 
          className="action-buttons"
          sx={{ 
            position: 'absolute',
            top: 6,
            right: 4,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          <Tooltip 
            title={description} 
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={1500}
          >
            <IconButton size="small" sx={{ 
              padding: 0.5,
              backgroundColor: 'rgba(0,0,0,0.04)'
            }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip 
            title="Remove" 
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={1500}
          >
            <IconButton size="small" onClick={onRemove} sx={{ 
              padding: 0.5,
              backgroundColor: 'rgba(0,0,0,0.04)'
            }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ pt: -1, pb: 1 }}>
          <PropertyTitle component="div">
            {notation}
            <span className="title-suffix">({title})</span>
          </PropertyTitle>
        </Box>

        <ValueContainer>
          <ValueDisplay className="property-value">
            {formatValue(value)}
          </ValueDisplay>
          <UnitSelect
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            size="small"
            variant="outlined"
          >
            {availableUnits.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </UnitSelect>
        </ValueContainer>
      </CardContent>
    </StyledCard>
  );
} 