import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useScrollTrigger,
  Slide,
  Container,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  BusinessCenter as BusinessIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  window?: () => Window;
  children?: React.ReactNode;
}

function HideOnScroll(props: NavbarProps) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children as React.ReactElement}
    </Slide>
  );
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setLanguageAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Properties', path: '/properties', icon: <ApartmentIcon /> },
    { label: 'Services', path: '/services', icon: <BusinessIcon /> },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <HideOnScroll {...props}>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 70 }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.5px',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              AFRICAHOME
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    mx: 0.5,
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Language Switcher */}
              <IconButton
                size="large"
                onClick={handleLanguageMenuOpen}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    color: 'primary.main',
                  },
                }}
              >
                <LanguageIcon />
              </IconButton>

              {/* Auth Buttons */}
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleMobileMenuOpen}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    color: 'primary.main',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Language Menu */}
        <Menu
          anchorEl={languageAnchorEl}
          open={Boolean(languageAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          {languages.map((language) => (
            <MenuItem 
              key={language.code} 
              onClick={handleMenuClose}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              {language.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          {isMobile ? (
            <>
              <MenuItem 
                component={Link} 
                to="/login" 
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                Login
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/register" 
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                Register
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem 
                component={Link} 
                to="/profile" 
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                Profile
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/settings" 
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                Settings
              </MenuItem>
              <MenuItem 
                onClick={handleMenuClose}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.04),
                  },
                }}
              >
                Logout
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1,
              borderRadius: 2,
              width: 250,
            },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              component={Link}
              to={item.path}
              onClick={handleMenuClose}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                {item.label}
              </Box>
            </MenuItem>
          ))}
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleMenuClose}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleMenuClose}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Menu>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 