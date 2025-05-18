import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Link,
  useTheme,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Help as HelpIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

const ContactBanner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 4,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          {/* Support Contact */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <PhoneIcon />
              <Typography variant="body1">+234 123 456 7890</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <EmailIcon />
              <Typography variant="body1">support@afriqhome.com</Typography>
            </Box>
          </Box>

          {/* FAQ Link */}
          <Link
            href="/faq"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'white',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <HelpIcon />
            <Typography variant="body1">Frequently Asked Questions</Typography>
          </Link>

          {/* Book Consultation Button */}
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<CalendarIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            Book a Consultation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactBanner; 