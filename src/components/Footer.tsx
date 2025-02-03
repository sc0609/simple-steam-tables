import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';

export function Footer() {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{
        mt: 'auto',
        py: 3,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderTop: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.08),
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 1 
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.875rem',
              }}
            >
              <CodeIcon sx={{ fontSize: '1rem' }} />
              Made with &#9829; by Sarthak
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3,
              alignItems: 'center' 
            }}>
              <Link
                href="https://github.com/yourusername/steam-tables"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                <GitHubIcon sx={{ fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Source Code
                </Typography>
              </Link>

              <Link
                href="https://learncheme.com/student-resources/steam-tables/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                <SchoolIcon sx={{ fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Data Source (NIST)
                </Typography>
              </Link>
            </Box>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.8rem',
              textAlign: { xs: 'center', sm: 'right' },
              maxWidth: { xs: '100%', sm: '500px' },
              opacity: 0.9,
            }}
          >
            Thanks to University of Colorado Boulder, Department of Chemical and 
            Biological Engineering for providing the steam table data
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 