import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  useTheme,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 300,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  },
}));

const Agents: React.FC = () => {
  const theme = useTheme();
  const agents = [
    {
      id: 1,
      name: 'John Doe',
      title: 'Senior Agent',
      image: 'https://source.unsplash.com/random/300x300/?portrait',
      properties: 150,
      experience: '5 years',
      specialties: ['Luxury Homes', 'Commercial'],
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Jane Smith',
      title: 'Property Specialist',
      image: 'https://source.unsplash.com/random/300x300/?woman',
      properties: 200,
      experience: '7 years',
      specialties: ['Residential', 'Investment'],
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      title: 'Luxury Homes Expert',
      image: 'https://source.unsplash.com/random/300x300/?man',
      properties: 100,
      experience: '4 years',
      specialties: ['Luxury', 'International'],
      rating: 4.7,
    },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
        minHeight: '100vh',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            Meet Our Expert Agents
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Our team of experienced real estate professionals is here to help you find your dream property
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {agents.map((agent) => (
            <Grid item key={agent.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <StyledCardMedia
                  image={agent.image}
                  title={agent.name}
                />
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -40,
                      left: 20,
                      right: 20,
                      background: 'white',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        mb: 0.5,
                      }}
                    >
                      {agent.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {agent.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      {agent.specialties.map((specialty) => (
                        <Chip
                          key={specialty}
                          label={specialty}
                          size="small"
                          sx={{
                            background: theme.palette.primary.light,
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {agent.properties} Properties
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {agent.experience} Experience
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 4, pt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                        },
                      }}
                    >
                      Contact Agent
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Agents; 