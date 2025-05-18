import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Construction as ConstructionIcon,
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  SupportAgent as SupportAgentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const services = [
  {
    id: 1,
    title: 'Document Verification',
    description: 'Ensure your property documents are authentic and legally binding',
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    link: '/services/document-verification',
  },
  {
    id: 2,
    title: 'Construction Monitoring',
    description: 'Professional oversight of your construction project from start to finish',
    icon: <ConstructionIcon sx={{ fontSize: 40 }} />,
    link: '/services/construction-monitoring',
  },
  {
    id: 3,
    title: 'Legal Assistance',
    description: 'Expert legal guidance for all your property transactions',
    icon: <GavelIcon sx={{ fontSize: 40 }} />,
    link: '/services/legal-assistance',
  },
  {
    id: 4,
    title: 'Financing Options',
    description: 'Flexible financing solutions tailored to your property needs',
    icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
    link: '/services/financing',
  },
  {
    id: 5,
    title: 'Agent Support',
    description: 'Connect with trusted real estate professionals in your area',
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    link: '/services/agent-support',
  },
];

const CoreServices = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        py: 10,
        background: theme.palette.primary.light,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.secondary.main} 50%, 
            ${theme.palette.primary.main} 100%
          )`,
        }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.primary.contrastText,
            }}
          >
            Our Core Services
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha(theme.palette.primary.contrastText, 0.8),
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Comprehensive solutions to make your property journey seamless
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
            gap: 3,
          }}
        >
          {services.map((service) => (
            <Card
              key={service.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: theme.palette.primary.main,
                  }}
                >
                  {service.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: theme.palette.text.primary,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 2,
                  }}
                >
                  {service.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main,
                    cursor: 'pointer',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                    },
                  }}
                  component="a"
                  href={service.link}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mr: 1,
                    }}
                  >
                    Learn More
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 20 }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CoreServices; 