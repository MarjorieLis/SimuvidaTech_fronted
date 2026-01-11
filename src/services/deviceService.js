// frontend/src/services/deviceService.js
import api from './api';

export const createDevice = async (deviceData) => {
  const response = await api.post('/devices', deviceData);
  return response.data;
};