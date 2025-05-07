import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { locationService } from '../services/locationService';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await locationService.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (filters.country) {
        setLoadingCities(true);
        try {
          const citiesData = await locationService.getCities(filters.country);
          setCities(citiesData);
        } catch (error) {
          console.error('Error fetching cities:', error);
        } finally {
          setLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [filters.country]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <section className="hero position-relative">
      <div className="hero-overlay"></div>
      <div className="container position-relative">
        <div className="row min-vh-100 align-items-center">
          <div className="col-12">
            <div className="hero-content text-white text-center">
              <h1 className="display-4 fw-bold mb-4">Find Your Dream Property</h1>
              <p className="lead mb-5">Discover the perfect home from our extensive collection of properties</p>
            </div>
          </div>
        </div>
      </div>
      <div className="search-container">
        <div className="container">
          <div className="search-box bg-white rounded-4 p-3 shadow-lg">
            <div className="row g-2 align-items-center">
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.alpha2Code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  disabled={!filters.country || loadingCities}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>
              <div className="col-md-1">
                <select
                  className="form-select form-select-sm"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                >
                  <option value="">Beds</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}+
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-1">
                <select
                  className="form-select form-select-sm"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                >
                  <option value="">Baths</option>
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}+
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <button 
                  className="btn btn-primary btn-sm w-100"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 