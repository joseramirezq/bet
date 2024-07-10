// src/services/AuthService.js
import apiClient from '../axios';

export default {
  login(credentials) {
    return apiClient.post('/login', credentials);
  },
  logout() {
    return apiClient.post('/logout');
  },
};
