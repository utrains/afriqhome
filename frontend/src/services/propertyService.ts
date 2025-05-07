import axios from 'axios';

export interface Property {
  id: number;
  user_id: number;
  title: string;
  description: string;
  location: {
    country: string;
    city: string;
    address: string;
    landmark: string;
  } | null;
  price: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  features: string[];
  images: string[];
  created_at: string;
  updated_at: string;
  rating?: number;
  views?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    try {
      const response = await api.get('/properties');
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async getUserProperties(userId: number): Promise<Property[]> {
    try {
      const response = await api.get(`/properties/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user properties:', error);
      throw error;
    }
  },

  async getProperty(id: number): Promise<Property> {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    try {
      const response = await api.post('/properties', property);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  async updateProperty(id: number, property: Partial<Property>): Promise<Property> {
    try {
      const response = await api.put(`/properties/${id}`, property);
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  async deleteProperty(id: number): Promise<void> {
    try {
      await api.delete(`/properties/${id}`);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  async uploadImages(propertyId: number, images: File[]): Promise<void> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      await api.post(`/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  async updateVisibility(id: number, status: Property['status']): Promise<void> {
    try {
      await api.patch(`/properties/${id}/status`, { status });
    } catch (error) {
      console.error('Error updating property visibility:', error);
      throw error;
    }
  },
};

export { propertyService }; 