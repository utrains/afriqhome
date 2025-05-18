import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  VerifiedUser as VerifiedUserIcon,
  Payments as PaymentsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const benefits = [
  {
    id: 1,
    title: 'Secure Transactions',
    description: 'Your property transactions are protected with our advanced security measures and verified payment systems.',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 2,
    title: 'Fast Process',
    description: 'Streamlined property search and transaction process to save your valuable time.',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 3,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to assist you with any queries or concerns.',
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 4,
    title: 'Verified Properties',
    description: 'Every property listed undergoes thorough verification to ensure authenticity.',
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 5,
    title: 'Flexible Payments',
    description: 'Multiple payment options and flexible financing solutions for your convenience.',
    icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 6,
    title: 'Market Insights',
    description: 'Access to real-time market data and property value trends across Africa.',
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
  },
];

const WhyUs = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        py: 10,
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
        position: 'relative',
      }}
    >
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
            Why Choose AfriqHome?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Experience the difference with our comprehensive real estate solutions designed for Africa's unique market
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {benefits.map((benefit) => (
            <Paper
              key={benefit.id}
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  mb: 3,
                }}
              >
                {benefit.icon}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                {benefit.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {benefit.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            mt: 8,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Join thousands of satisfied customers who have found their perfect property through AfriqHome
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyUs; 