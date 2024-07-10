import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL + '/api',
  withCredentials: false, // Esto se puede cambiar según tus necesidades
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las solicitudes
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;
