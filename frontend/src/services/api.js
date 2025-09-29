import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const itemsApi = {
  getAll: () => api.get('/api/items'),
  refresh: () => api.post('/api/refresh'),
};

export default api;
