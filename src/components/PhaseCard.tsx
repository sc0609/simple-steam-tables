import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  border: '1.5px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  padding: theme.spacing(1),
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.00),
    '& .action-buttons': {
      opacity: 1,
    },
  },
}));

const PhaseDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 500,
  color: theme.palette.primary.main,
  textAlign: 'center',
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'capitalize',
}));

interface PhaseCardProps {
  title: string;
  notation: string;
  value: string;
  description: string;
  onRemove: () => void;
}

export function PhaseCard({
  title,
  notation,
  value,
  description,
  onRemove,
}: PhaseCardProps) {
  return (
    <StyledCard>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
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
          <Tooltip title={description} placement="top">
            <IconButton size="small" sx={{ 
              padding: 0.5,
              backgroundColor: 'rgba(0,0,0,0.04)'
            }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove" placement="top">
            <IconButton size="small" onClick={onRemove} sx={{ 
              padding: 0.5,
              backgroundColor: 'rgba(0,0,0,0.04)'
            }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ pt: -1, pb: 1 }}>
          <Typography sx={{ 
            fontSize: '0.95rem',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            {notation}
            <span style={{ 
              color: 'text.secondary',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: '0.85rem'
            }}>
              ({title})
            </span>
          </Typography>
        </Box>

        <PhaseDisplay>
          {value}
        </PhaseDisplay>
      </CardContent>
    </StyledCard>
  );
} 