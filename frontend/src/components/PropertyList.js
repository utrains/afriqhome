import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
} from '@mui/icons-material';
import { locationService } from '../services/locationService';
import './PropertyList.css';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await locationService.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (filters.country) {
        setLoadingCities(true);
        try {
          const citiesData = await locationService.getCities(filters.country);
          setCities(citiesData);
        } catch (error) {
          console.error('Error fetching cities:', error);
        } finally {
          setLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [filters.country]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        // Prepend base URL to image paths
        const propertiesWithFullImagePaths = response.data.map(property => ({
          ...property,
          images: property.images.map(image => `http://localhost:5000/${image}`)
        }));
        setProperties(propertiesWithFullImagePaths);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    const { city, country, address, landmark } = location;
    const parts = [];
    if (city) parts.push(city);
    if (country) parts.push(country);
    if (address) parts.push(address);
    if (landmark) parts.push(landmark);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const filteredProperties = properties.filter((property) => {
    if (filters.country && property.location?.country !== filters.country) return false;
    if (filters.city && property.location?.city !== filters.city) return false;
    if (filters.status && property.status !== filters.status) return false;
    if (filters.minPrice && Number(property.price) < Number(filters.minPrice)) return false;
    if (filters.maxPrice && Number(property.price) > Number(filters.maxPrice)) return false;
    if (filters.bedrooms && property.bedrooms !== Number(filters.bedrooms)) return false;
    if (filters.bathrooms && property.bathrooms !== Number(filters.bathrooms)) return false;
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          height: '60vh',
          minHeight: '400px',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/africa-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 2,
              color: 'white'
            }}
          >
            Find Your Dream Property in Africa
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
              maxWidth: '800px',
              mx: 'auto',
              color: 'white'
            }}
          >
            Discover amazing properties across the continent
          </Typography>
        </Container>
      </Box>

      {/* Rest of the existing PropertyList component */}
      <Container maxWidth="lg">
        {/* Filters Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  label="Country"
                >
                  <MenuItem value="">All Countries</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.alpha2Code} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  label="City"
                  disabled={!filters.country || loadingCities}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="For Sale">For Sale</MenuItem>
                  <MenuItem value="For Rent">For Rent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="minPrice"
                label="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="maxPrice"
                label="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Bedrooms</InputLabel>
                <Select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  label="Bedrooms"
                >
                  <MenuItem value="">Any</MenuItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}+
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Bathrooms</InputLabel>
                <Select
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                  label="Bathrooms"
                >
                  <MenuItem value="">Any</MenuItem>
                  {[1, 2, 3, 4].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}+
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Properties Grid */}
        <Grid container spacing={3}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
                onClick={() => handlePropertyClick(property.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={property.images?.[0] || '/placeholder.jpg'}
                  alt={property.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h2" noWrap>
                      {property.title}
                    </Typography>
                    <Chip 
                      label={property.status.replace('_', ' ').toUpperCase()} 
                      color={property.status === 'for_sale' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {formatLocation(property.location)}
                    </Typography>
                  </Box>

                  <Typography variant="h6" color="primary" gutterBottom>
                    ${property.price.toLocaleString()}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Bed fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{property.bedrooms}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Bathtub fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{property.bathrooms}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SquareFoot fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{property.area} sqft</Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {property.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePropertyClick(property.id);
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyList; 