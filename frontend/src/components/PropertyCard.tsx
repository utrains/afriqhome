import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Rating,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Property } from '../services/propertyService';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Add logging to see the property data
  console.log('PropertyCard received property:', {
    id: property.id,
    title: property.title,
    location: property.location,
    price: property.price,
    type: property.type,
    status: property.status,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    features: property.features,
    images: property.images,
    rating: property.rating,
    views: property.views
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };

  // Safely format location
  const formatLocation = () => {
    try {
      // Check if location is a valid object
      if (!property.location || typeof property.location !== 'object') {
        console.warn('Invalid location data:', property.location);
        return 'Location not specified';
      }

      const { city, country, address, landmark } = property.location;
      
      // Ensure all values are strings
      const safeCity = city || '';
      const safeCountry = country || '';
      const safeAddress = address || '';
      const safeLandmark = landmark || '';

      // Build location string
      const parts = [];
      if (safeCity) parts.push(safeCity);
      if (safeCountry) parts.push(safeCountry);
      if (safeAddress) parts.push(safeAddress);
      if (safeLandmark) parts.push(safeLandmark);

      return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    } catch (error) {
      console.error('Error formatting location:', error);
      return 'Location not specified';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={property.images?.[0] || '/placeholder.jpg'}
          alt={property.title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              View Details
            </Typography>
          </Box>
        </Fade>
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label={property.status.replace('_', ' ').toUpperCase()}
            color={property.status === 'for_sale' ? 'primary' : 'secondary'}
            size="small"
          />
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                },
              }}
            >
              {isFavorite ? (
                <Favorite color="error" />
              ) : (
                <FavoriteBorder color="error" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {property.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatLocation()}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" gutterBottom>
          ${property.price.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
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
        <Rating value={property.rating} readOnly size="small" />
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {property.views} views
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PropertyCard; 