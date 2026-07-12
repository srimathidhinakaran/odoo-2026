import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const googleAuth = (credential) => axios.post(`${API_URL}/auth/google`, { credential });

export const fetchVehicles = () => axios.get(`${API_URL}/vehicles`);
export const fetchDrivers = () => axios.get(`${API_URL}/drivers`);
export const fetchTrips = () => axios.get(`${API_URL}/trips`);
export const dispatchTrip = (data) => axios.post(`${API_URL}/trips/dispatch`, data);
export const completeTrip = (id, data) => axios.post(`${API_URL}/trips/${id}/complete`, data);
export const createMaintenance = (data) => axios.post(`${API_URL}/maintenance`, data);
export const fetchMaintenance = () => axios.get(`${API_URL}/maintenance`);
export const resolveMaintenance = (id) => axios.post(`${API_URL}/maintenance/${id}/resolve`);
