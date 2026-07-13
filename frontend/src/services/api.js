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
export const verifyOtp = (data) => axios.post(`${API_URL}/auth/verify-otp`, data);
export const resendOtp = (data) => axios.post(`${API_URL}/auth/resend-otp`, data);
export const googleAuth = (credential) => axios.post(`${API_URL}/auth/google`, { credential });

export const fetchVehicles = () => axios.get(`${API_URL}/vehicles`);
export const fetchDrivers = () => axios.get(`${API_URL}/drivers`);
export const fetchTrips = () => axios.get(`${API_URL}/trips`);
export const dispatchTrip = (data) => axios.post(`${API_URL}/trips/dispatch`, data);
export const completeTrip = (id, data) => axios.post(`${API_URL}/trips/${id}/complete`, data);
export const createMaintenance = (data) => axios.post(`${API_URL}/maintenance`, data);
export const fetchMaintenance = () => axios.get(`${API_URL}/maintenance`);
export const resolveMaintenance = (id) => axios.post(`${API_URL}/maintenance/${id}/resolve`);

export const fetchFuelLogs = () => axios.get(`${API_URL}/fuel`);
export const addFuelLog = (data) => axios.post(`${API_URL}/fuel`, data);

export const fetchExpenses = () => axios.get(`${API_URL}/expenses`);
export const addExpense = (data) => axios.post(`${API_URL}/expenses`, data);

export const fetchDocuments = (refType, refId) => axios.get(`${API_URL}/documents/${refType}/${refId}`);
export const uploadDocument = (data) => axios.post(`${API_URL}/documents`, data);
