import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Property {
  id: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  location: {
    city: string;
    country: string;
  };
  is_featured: boolean;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get<Property[]>('http://localhost:5000/api/properties');
        const propertiesWithFullImagePaths = response.data.map((property: Property) => ({
          ...property,
          images: property.images.map((image: string) => `http://localhost:5000/${image}`)
        }));
        // Filter featured properties (first 3 properties for now)
        const featured = propertiesWithFullImagePaths.slice(0, 3);
        setFeaturedProperties(featured);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Find Your Dream Property in Africa
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Discover the best properties across the continent
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/properties')}
          >
            Browse Properties
          </Button>
        </Container>
      </Box>

      {/* Featured Properties */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Properties
        </Typography>
        <Grid container spacing={4}>
          {featuredProperties.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
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
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={property.images?.[0] || '/placeholder.jpg'}
                  alt={property.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {property.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {property.location?.city}, {property.location?.country}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${property.price.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Typography variant="body2">
                      {property.bedrooms} Beds
                    </Typography>
                    <Typography variant="body2">
                      {property.bathrooms} Baths
                    </Typography>
                    <Typography variant="body2">
                      {property.area} sqft
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 