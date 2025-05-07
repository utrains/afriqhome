import axios from 'axios';

export interface Country {
  name: string;
  alpha2Code: string;
}

export interface City {
  name: string;
  country: string;
}

export const locationService = {
  async getCountries(): Promise<Country[]> {
    try {
      const response = await axios.get('https://restcountries.com/v2/region/africa');
      return response.data.map((country: any) => ({
        name: country.name,
        alpha2Code: country.alpha2Code
      }));
    } catch (error) {
      console.error('Error fetching African countries:', error);
      return [];
    }
  },

  async getCities(countryName: string): Promise<City[]> {
    try {
      // Using the correct API endpoint format with country name as query parameter
      const response = await axios.get(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(countryName)}`);
      
      console.log('Cities API Response:', response.data); // Debug log
      
      if (response.data && response.data.data) {
        return response.data.data.map((cityName: string) => ({
          name: cityName,
          country: countryName
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback to a static list of major cities for testing
      return [
        { name: 'Lagos', country: countryName },
        { name: 'Cairo', country: countryName },
        { name: 'Nairobi', country: countryName },
        { name: 'Johannesburg', country: countryName },
        { name: 'Accra', country: countryName }
      ];
    }
  }
}; 