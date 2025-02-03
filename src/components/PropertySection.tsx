import React, { useState } from 'react';
import {
  Grid,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Paper,
  Collapse,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled, useTheme } from '@mui/material/styles';
import { PropertyCard } from './PropertyCard';
import { alpha } from '@mui/material/styles';
import { PhaseCard } from './PhaseCard';
import { Property } from '../types/steam';

interface PropertySectionProps {
  title: string;
  unit: string;
  availableUnits: string[];
  properties: Property[];
  visibleProperties: Set<string>;
  onToggleProperty: (propertyId: string) => void;
  onUnitChange: (newUnit: string) => void;
}

export function PropertySection({
  title,
  unit,
  availableUnits,
  properties,
  visibleProperties,
  onToggleProperty,
  onUnitChange,
}: PropertySectionProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const hiddenProperties = properties.filter(p => !visibleProperties.has(p.id));
  const isPhaseSection = title === 'Phase';
  const visibleProps = properties.filter(p => visibleProperties.has(p.id));

  const handleUnitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    event.stopPropagation();
    onUnitChange(event.target.value as string);
  };

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePropertyAdd = (propertyId: string) => {
    onToggleProperty(propertyId);
    setAnchorEl(null);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper elevation={0} sx={{ padding: 1.5, marginBottom: 1.5, backgroundColor: '#ffffff', borderRadius: 1.5, boxShadow: 'none', border: '1.5px solid', borderColor: 'divider', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: 'primary.light', backgroundColor: alpha(theme.palette.primary.main, 0.02) }, [theme.breakpoints.down('sm')]: { padding: 0.75 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer', padding: 0.5, borderRadius: 1.5, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.035) } }} onClick={() => setIsExpanded(!isExpanded)}>
          <IconButton size="small">
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
          {!isPhaseSection && availableUnits.length > 0 && (
            <Select
              value={unit}
              onChange={handleUnitChange}
              onClick={(e) => e.stopPropagation()}
              size="small"
              sx={{ 
                ml: 1,
                height: 28,
                '& .MuiSelect-select': {
                  py: 0.5,
                  px: 1,
                  fontSize: '0.75rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {availableUnits.map((unit) => (
                <MenuItem 
                  key={unit} 
                  value={unit}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ 
                    fontSize: '0.75rem',
                    minHeight: 'unset',
                    py: 0.75 
                  }}
                >
                  {unit}
                </MenuItem>
              ))}
            </Select>
          )}
          {hiddenProperties.length > 0 && (
            <>
              <Tooltip title="Add properties">
                <IconButton 
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleAddClick}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }
                }}
              >
                {hiddenProperties.map(prop => (
                  <MenuItem 
                    key={prop.id}
                    onClick={() => handlePropertyAdd(prop.id)}
                    sx={{ 
                      fontSize: '0.85rem',
                      py: 0.75 
                    }}
                  >
                    {prop.notation} ({prop.title})
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
          <Box flex={1} />
        </Box>

        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={1}>
              {visibleProps.map((property) => (
                <Grid item xs={12} key={property.id}>
                  {isPhaseSection ? (
                    <PhaseCard
                      title={property.title}
                      notation={property.notation}
                      value={property.value as string}
                      description={property.description}
                      onRemove={() => onToggleProperty(property.id)}
                    />
                  ) : (
                    <PropertyCard
                      title={property.title}
                      notation={property.notation}
                      value={property.value as number}
                      unit={unit}
                      availableUnits={availableUnits}
                      description={property.description}
                      onUnitChange={onUnitChange}
                      onRemove={() => onToggleProperty(property.id)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Paper>
    </Grid>
  );
} 