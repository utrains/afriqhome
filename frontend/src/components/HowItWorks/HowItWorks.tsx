import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Description as DescriptionIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';

const steps = [
  {
    id: 1,
    title: 'Search & Browse',
    description: 'Explore our extensive collection of properties across Africa. Use our advanced filters to find your perfect match.',
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    position: 'left',
  },
  {
    id: 2,
    title: 'Visit Properties',
    description: 'Schedule viewings for properties that catch your eye. Our agents will guide you through each property.',
    icon: <HomeIcon sx={{ fontSize: 40 }} />,
    position: 'right',
  },
  {
    id: 3,
    title: 'Documentation',
    description: 'Our team handles all legal documentation and verification processes to ensure a secure transaction.',
    icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
    position: 'left',
  },
  {
    id: 4,
    title: 'Close the Deal',
    description: 'Complete your purchase with our secure payment system and move into your new property.',
    icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
    position: 'right',
  },
];

const HowItWorks = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Your journey to finding the perfect property in four simple steps
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: { xs: '50%', md: '50%' },
              transform: 'translateX(-50%)',
              width: '2px',
              height: '100%',
              backgroundColor: theme.palette.primary.main,
              opacity: 0.2,
            },
          }}
        >
          {steps.map((step) => (
            <Box
              key={step.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                mb: 4,
                position: 'relative',
                '&:last-child': {
                  mb: 0,
                },
              }}
            >
              {/* Content container */}
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  display: 'flex',
                  justifyContent: step.position === 'left' ? 'flex-end' : 'flex-start',
                  pr: { md: step.position === 'left' ? 4 : 0 },
                  pl: { md: step.position === 'right' ? 4 : 0 },
                  order: { xs: 1, md: step.position === 'left' ? 1 : 3 },
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    display: 'inline-block',
                    maxWidth: '400px',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      color: theme.palette.primary.main,
                      justifyContent: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Paper>
              </Box>

              {/* Timeline dot */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  zIndex: 1,
                  order: { xs: 2, md: 2 },
                  my: { xs: 2, md: 0 },
                }}
              >
                {step.id}
              </Box>

              {/* Empty box for spacing */}
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  order: { xs: 3, md: step.position === 'left' ? 3 : 1 },
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks; 