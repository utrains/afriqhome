import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        About Us
      </Typography>
      
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          We are dedicated to helping people find their dream properties across Africa. Our platform connects buyers, sellers, and real estate agents in a seamless and efficient way.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          To become the leading property listing platform in Africa, making property transactions simple, transparent, and accessible to everyone.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          What We Offer
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Wide Selection
                </Typography>
                <Typography variant="body2">
                  Access to thousands of properties across different African countries.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expert Agents
                </Typography>
                <Typography variant="body2">
                  Connect with experienced real estate professionals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Secure Transactions
                </Typography>
                <Typography variant="body2">
                  Safe and reliable property transactions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About; 