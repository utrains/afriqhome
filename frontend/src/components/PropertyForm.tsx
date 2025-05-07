import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Box,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Property, propertyService } from '../services/propertyService';
import { locationService, Country, City } from '../services/locationService';

interface PropertyFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
}

interface FormData {
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'land' | 'commercial';
  price: string;
  location: {
    country: string;
    city: string;
    address: string;
    landmark: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: string;
  features: string[];
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented';
  userId: number;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ open, onClose, onSuccess, userId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'house',
    price: '',
    location: {
      country: '',
      city: '',
      address: '',
      landmark: '',
    },
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    features: [],
    status: 'for_sale',
    userId: userId,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.location?.country) {
      fetchCities(formData.location.country);
    }
  }, [formData.location?.country]);

  const fetchCountries = async () => {
    const countriesData = await locationService.getCountries();
    setCountries(countriesData);
  };

  const fetchCities = async (countryName: string) => {
    setLoadingCities(true);
    const citiesData = await locationService.getCities(countryName);
    setCities(citiesData);
    setLoadingCities(false);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1] as keyof FormData['location'];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.location?.country || !formData.location?.city || !formData.location?.address || !formData.price || !formData.type || !formData.status) {
        setError('Please fill in all required fields');
        return;
      }

      // Create property
      const propertyData = {
        ...formData,
        user_id: userId,
        images: [],
        rating: 0,
        views: 0,
      };
      
      const createdProperty = await propertyService.createProperty(propertyData as Omit<Property, 'id' | 'created_at' | 'updated_at'>);

      // Upload images if any
      if (selectedImages.length > 0) {
        await propertyService.uploadImages(createdProperty.id, selectedImages);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const steps = [
    {
      label: 'Basic Details',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Type"
              name="type"
              select
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="land">Land</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Location & Features',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="location.country"
              select
              value={formData.location?.country || ''}
              onChange={handleChange}
              required
            >
              {countries.map((country) => (
                <MenuItem key={country.alpha2Code} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="location.city"
              select
              value={formData.location?.city}
              onChange={handleChange}
              required
              disabled={!formData.location?.country || loadingCities}
            >
              {cities.map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="location.address"
              value={formData.location?.address}
              onChange={handleChange}
              required
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Landmark"
              name="location.landmark"
              value={formData.location?.landmark}
              onChange={handleChange}
              placeholder="Nearby landmarks or points of interest"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Area (sq ft)"
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Parking', 'Garden', 'Pool', 'Security', 'Furnished'].map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  onClick={() => handleFeatureClick(feature)}
                  color={formData.features.includes(feature) ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Photos',
      content: (
        <Box>
          <input
            accept="image/*"
            type="file"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="property-images"
          />
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <label htmlFor="property-images">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Photos
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              You can upload multiple photos. Recommended size: 1200x800 pixels
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {selectedImages.map((file, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 150,
                  height: 150,
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Property ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          {selectedImages.length > 0 && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {selectedImages.length} photo{selectedImages.length !== 1 ? 's' : ''} selected
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Property</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {steps[activeStep].content}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Creating...' : 'Create Property'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PropertyForm; 