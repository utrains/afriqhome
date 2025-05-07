import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import './FeaturedProperties.css';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        const propertiesWithFullImagePaths = response.data.map(property => ({
          ...property,
          images: property.images.map(image => `http://localhost:5000/${image}`)
        }));
        // Filter featured properties (first 3 properties for now)
        const featured = propertiesWithFullImagePaths.slice(0, 3);
        setProperties(featured);
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
    <section className="featured-properties">
      <div className="container">
        <h2>Featured Properties</h2>
        <p className="section-description">Explore our handpicked selection of premium properties</p>
        
        <div className="properties-grid">
          {properties.map(property => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                <img 
                  src={property.images?.[0] || '/placeholder.jpg'} 
                  alt={property.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div className="property-type">{property.type}</div>
                <div className="property-status">{property.status}</div>
              </div>
              
              <div className="property-details">
                <h3>{property.title}</h3>
                <p className="property-location">
                  <i className="fas fa-map-marker-alt"></i> {property.location?.city}, {property.location?.country}
                </p>
                
                <div className="property-features">
                  <span>
                    <i className="fas fa-bed"></i> {property.bedrooms} Beds
                  </span>
                  <span>
                    <i className="fas fa-bath"></i> {property.bathrooms} Baths
                  </span>
                  <span>
                    <i className="fas fa-ruler-combined"></i> {property.area} sq ft
                  </span>
                </div>
                
                <div className="property-price">
                  ${property.price.toLocaleString()}
                </div>
                
                <Link to={`/property/${property.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-container">
          <Link to="/properties" className="view-all-btn">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties; 