import React, { useState, useEffect } from 'react';
console.log("property details page");
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Favorite,
  Share,
  ArrowBack,
  Phone,
  Email,
} from '@mui/icons-material';
import { Property, propertyService } from '../services/propertyService';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (id) {
      fetchProperty(parseInt(id));
    }
  }, [id]);

  const fetchProperty = async (propertyId: number) => {
    try {
      setLoading(true);
      const data = await propertyService.getProperty(propertyId);
      setProperty(data);
    } catch (error) {
      setError('Error loading property details');
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically send the contact form to your backend
      // For now, we'll just show a success message
      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success',
      });
      setOpenContactDialog(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Container>
        <Typography color="error">{error || 'Property not found'}</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/properties')}
          sx={{ mt: 2 }}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/properties')}
        sx={{ mb: 2 }}
      >
        Back to Properties
      </Button>

      <Grid container spacing={4}>
        {/* Property Images */}
        <Grid item xs={12} md={8}>
          <Box
            component="img"
            src={property.images[0] || 'https://source.unsplash.com/random/800x600/?house'}
            alt={property.title}
            sx={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
            {property.images.slice(1).map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`${property.title} ${index + 2}`}
                sx={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Property Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {property.title}
              </Typography>
              <Box>
                <IconButton>
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              ${property.price.toLocaleString()}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography>
                {property?.location?.city && property?.location?.country 
                  ? `${property.location.city}, ${property.location.country}`
                  : property?.location?.country || 'Location not specified'}
              </Typography>
              {property?.location?.address && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {property.location.address}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Bed />}
                label={`${property.bedrooms || 0} Beds`}
                variant="outlined"
              />
              <Chip
                icon={<Bathtub />}
                label={`${property.bathrooms || 0} Baths`}
                variant="outlined"
              />
              <Chip
                icon={<SquareFoot />}
                label={`${property.area || 0} sq ft`}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>{property.description}</Typography>

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {property.features?.map((feature, index) => (
                <Chip key={index} label={feature} />
              ))}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Phone />}
                onClick={() => setOpenContactDialog(true)}
              >
                Contact Agent
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      <Dialog open={openContactDialog} onClose={() => setOpenContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Agent</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleContactSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContactDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleContactSubmit}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PropertyDetails; 