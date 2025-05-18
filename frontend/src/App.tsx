import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FeaturedListings from './components/FeaturedListings/FeaturedListings';
import CoreServices from './components/CoreServices/CoreServices';
import HowItWorks from './components/HowItWorks/HowItWorks';
import WhyUs from './components/WhyUs/WhyUs';
import ContactBanner from './components/ContactBanner/ContactBanner';
import Footer from './components/Footer/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Hero />
                  <FeaturedListings />
                  <CoreServices />
                  <HowItWorks />
                  <WhyUs />
                  <ContactBanner />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <Login />
                  <Footer />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <Register />
                  <Footer />
                </>
              }
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
