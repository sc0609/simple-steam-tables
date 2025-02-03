// import React from 'react';
import { Box, Container, Typography, Link, } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

export function Footer() {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{
        mt: {xs: 1.5, sm: 2},
        py: { xs: 2, sm: 3 },
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
            gap: { xs: 2.5, sm: 2 },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 1.5, sm: 1 }
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.875rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <CodeIcon sx={{ fontSize: '1rem' }} />
              Created by, 
              <Link
                href="https://www.linkedin.com/in/sarthak-chavhan-4a87a422a/"
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
                Sarthak Chavhan
              </Link>
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 },
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              px: { xs: 2, sm: 0 },
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: { xs: 'flex', sm: 'flex' },
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.875rem',
                }}
              >
                <Link
                  href="https://github.com/sc0609/simple-steam-tables"
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
                  <GitHubIcon sx={{ fontSize: '0.9rem' }} />
                  <Typography variant="body2" sx={{ fontSize: 'inherit', }}>
                    GitHub
                  </Typography>
                </Link>
              </Typography>

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
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                <SchoolIcon sx={{ fontSize: '0.9rem' }} />
                <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                  Data Source (NIST)
                </Typography>
              </Link>

              <Link
                href="https://github.com/sc0609/simple-steam-tables/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                <BugReportIcon sx={{ fontSize: '0.9rem' }} />
                <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                  Report Issue
                </Typography>
              </Link>
            </Box>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              textAlign: { xs: 'center', sm: 'right' },
              maxWidth: { xs: '280px', sm: '500px' },
              opacity: 0.9,
              lineHeight: 1.5,
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
