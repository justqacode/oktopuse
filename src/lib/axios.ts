import { config } from '@/config/app.config';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '@/auth/authStore';

const API: AxiosInstance = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
