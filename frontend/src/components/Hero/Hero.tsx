import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Apartment as ApartmentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const cities = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Ibadan',
  'Kano',
  'Benin City',
  'Calabar',
  'Enugu',
];

const propertyTypes = [
  { value: 'buy', label: 'Buy', icon: <HomeIcon /> },
  { value: 'rent', label: 'Rent', icon: <ApartmentIcon /> },
  { value: 'commercial', label: 'Commercial', icon: <BusinessIcon /> },
];

const Hero = () => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState('buy');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <Box
      sx={{
        position: 'relative',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              color: alpha('#fff', 0.9)
            }}
          >
            Find Your Dream Home
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              mb: 4,
              color: alpha('#fff', 0.9),
            }}
          >
            Search properties for sale and for rent in Africa
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            {/* Property Type Selection */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '3' } }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {propertyTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? 'contained' : 'text'}
                    onClick={() => setSelectedType(type.value)}
                    startIcon={type.icon}
                    sx={{
                      flex: 1,
                      color: selectedType === type.value ? 'white' : 'text.primary',
                      '&:hover': {
                        backgroundColor: selectedType === type.value 
                          ? theme.palette.primary.dark 
                          : alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    {type.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* City Selection */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '3' } }}>
              <TextField
                select
                fullWidth
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Select City"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setSelectedCity('')}
                        sx={{ visibility: selectedCity ? 'visible' : 'hidden' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Search Input */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '4' } }}>
              <TextField
                fullWidth
                placeholder="Enter locality, landmark or project"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          // Add search functionality here
                          console.log('Search clicked');
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />
            </Box>

            {/* Search Button */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '2' } }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                sx={{
                  height: '56px',
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Quick Stats */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Properties', value: '10,000+' },
            { label: 'Cities', value: '20+' },
            { label: 'Happy Customers', value: '50,000+' },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                textAlign: 'center',
                color: 'white',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: 'white'
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: alpha('#fff', 0.9),
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Hero; 