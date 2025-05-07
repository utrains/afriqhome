import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProperties from './components/FeaturedProperties';
import Footer from './components/Footer';
import PropertyList from './components/PropertyList';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Contact from './pages/Contact.tsx';
import About from './pages/About.tsx';
import Agents from './pages/Agents.tsx';
import Dashboard from './pages/Dashboard.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedProperties />
              </>
            } />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/agents" element={<Agents />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 