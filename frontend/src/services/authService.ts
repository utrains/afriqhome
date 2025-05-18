import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const authService = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  verifyEmail: async (token: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Email verification failed' };
    }
  },

  resendVerification: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to resend verification email' };
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export default authService; 