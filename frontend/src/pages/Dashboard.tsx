import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  useTheme,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Badge,
  Divider,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { Property, propertyService } from '../services/propertyService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  agency?: {
    name: string;
    license: string;
    address: string;
  };
  kycVerified?: boolean;
  profilePicture?: string;
}

interface Lead {
  id: number;
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'follow_up' | 'closed';
  date: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [openAddProperty, setOpenAddProperty] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);
      fetchUserProperties(user.id);
      setLeads([]);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserProperties = async (userId: number) => {
    try {
      console.log(`[Dashboard] Fetching properties for user ${userId}...`);
      const userProperties = await propertyService.getUserProperties(userId);
      console.log(`[Dashboard] Successfully fetched ${userProperties.length} properties for user ${userId}`);
      setProperties(userProperties);
    } catch (error: any) {
      console.error('[Dashboard] Error fetching properties:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNotificationChange = (type: 'email' | 'sms') => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePropertySuccess = () => {
    if (user) {
      fetchUserProperties(user.id);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    try {
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(property => property.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleToggleVisibility = async (id: number, currentStatus: Property['status']) => {
    try {
      const newStatus = currentStatus === 'for_sale' ? 'sold' : 'for_sale';
      await propertyService.updateVisibility(id, newStatus);
      setProperties(prev => prev.map(property => 
        property.id === id ? { ...property, status: newStatus } : property
      ));
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.firstName}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={leads.filter(lead => lead.status === 'new').length} color="error">
            <NotificationsIcon />
          </Badge>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Profile Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={user?.profilePicture}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: theme.palette.primary.main,
                    mr: 2,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography color="textSecondary">
                    {user?.email}
                  </Typography>
                  {user?.agency && (
                    <Typography variant="body2" color="textSecondary">
                      {user.agency.name}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  KYC Status
                </Typography>
                <Chip
                  icon={user?.kycVerified ? <CheckCircleIcon /> : <WarningIcon />}
                  label={user?.kycVerified ? 'Verified' : 'Pending Verification'}
                  color={user?.kycVerified ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              {user?.agency && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Agency Information
                  </Typography>
                  <Typography variant="body2">
                    Name: {user.agency.name}
                  </Typography>
                  <Typography variant="body2">
                    License: {user.agency.license}
                  </Typography>
                  <Typography variant="body2">
                    Address: {user.agency.address}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Email Notifications" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <NotificationsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="SMS Notifications" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="My Listings" />
                <Tab label="Leads" />
              </Tabs>

              {/* Overview Tab */}
              {activeTab === 0 && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{properties.length}</Typography>
                        <Typography color="textSecondary">Total Properties</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{leads.length}</Typography>
                        <Typography color="textSecondary">Total Leads</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">
                          {properties.filter(p => p.status === 'sold' || p.status === 'rented').length}
                        </Typography>
                        <Typography color="textSecondary">Properties Sold/Rented</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* My Listings Tab */}
              {activeTab === 1 && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddProperty(true)}
                    >
                      Add New Property
                    </Button>
                  </Box>
                  <List>
                    {properties.map((property) => (
                      <React.Fragment key={property.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              variant="rounded"
                              src={property.images?.[0] || ''}
                              sx={{ width: 56, height: 56 }}
                            >
                              <HomeIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={property.title}
                            secondary={
                              <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocationIcon fontSize="small" />
                                  <Typography component="span" variant="body2">
                                    {(() => {
                                      if (!property.location) return 'Location not specified';
                                      
                                      const { city, country } = property.location;
                                      if (!city && !country) return 'Location not specified';
                                      
                                      const parts = [];
                                      if (city) parts.push(city);
                                      if (country) parts.push(country);
                                      
                                      return parts.join(', ');
                                    })()}
                                  </Typography>
                                </Box>
                                <Typography component="span" variant="body2">
                                  ${property.price.toLocaleString()} • {property.type}
                                </Typography>
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              aria-label="delete"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              aria-label="visibility"
                              onClick={() => handleToggleVisibility(property.id, property.status)}
                            >
                              {property.status === 'for_sale' ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {/* Leads Tab */}
              {activeTab === 2 && (
                <Box sx={{ mt: 3 }}>
                  <List>
                    {leads.map((lead) => (
                      <React.Fragment key={lead.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>{lead.name[0]}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={lead.name}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {lead.message}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  {new Date(lead.date).toLocaleDateString()}
                                </Typography>
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="call">
                              <PhoneIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="email">
                              <EmailIcon />
                            </IconButton>
                            <Chip
                              label={lead.status}
                              color={
                                lead.status === 'new' ? 'primary' :
                                lead.status === 'contacted' ? 'secondary' :
                                lead.status === 'follow_up' ? 'warning' : 'success'
                              }
                              size="small"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Property Form Dialog */}
      {user && (
        <PropertyForm
          open={openAddProperty}
          onClose={() => setOpenAddProperty(false)}
          onSuccess={handlePropertySuccess}
          userId={user.id}
        />
      )}
    </Container>
  );
};

export default Dashboard; 