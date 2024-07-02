// src/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Cambia esto a la URL de tu API
  withCredentials: false, // Esto se puede cambiar según tus necesidades
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
