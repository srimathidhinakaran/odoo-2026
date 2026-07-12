import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchVehicles = () => axios.get(`${API_URL}/vehicles`);
export const fetchDrivers = () => axios.get(`${API_URL}/drivers`);
export const fetchTrips = () => axios.get(`${API_URL}/trips`);
export const dispatchTrip = (data) => axios.post(`${API_URL}/trips/dispatch`, data);
export const completeTrip = (id, data) => axios.post(`${API_URL}/trips/${id}/complete`, data);
export const createMaintenance = (data) => axios.post(`${API_URL}/maintenance`, data);
export const resolveMaintenance = (id) => axios.post(`${API_URL}/maintenance/${id}/resolve`);
