import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: 'white',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 4,
          }}
        >
          {/* About Us Column */}
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.grey[400] }}>
              AfriqHome is your trusted partner in African real estate, connecting buyers, sellers, and investors across the continent.
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                gap: 2,
              }}
            >
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
              <Link href="#" color="inherit">
                <LinkedInIcon />
              </Link>
            </Box>
          </Box>

          {/* Quick Links Column */}
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Link href="/properties" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Properties
              </Link>
              <Link href="/agents" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Find Agents
              </Link>
              <Link href="/blog" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Blog
              </Link>
              <Link href="/careers" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Careers
              </Link>
              <Link href="/contact" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Contact Us
              </Link>
            </Box>
          </Box>

          {/* Services Column */}
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Services
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Link href="/buy" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Buy Property
              </Link>
              <Link href="/sell" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Sell Property
              </Link>
              <Link href="/rent" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Rent Property
              </Link>
              <Link href="/invest" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Investment
              </Link>
              <Link href="/legal" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Legal Services
              </Link>
            </Box>
          </Box>

          {/* Newsletter Column */}
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.grey[400] }}>
              Subscribe to our newsletter for the latest updates and offers.
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                size="small"
                placeholder="Enter your email"
                sx={{
                  backgroundColor: theme.palette.grey[800],
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: theme.palette.grey[700],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.grey[600],
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Mini Map */}
        <Box
          sx={{
            mt: 6,
            mb: 4,
            height: 200,
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.grey[800]}`,
          }}
        >
          <iframe
            title="AfriqHome Office Location in Lagos, Nigeria"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.2512412175!2d3.1473149!3d6.5480559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1647881234567!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.grey[800]}`,
            pt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} AfriqHome. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 