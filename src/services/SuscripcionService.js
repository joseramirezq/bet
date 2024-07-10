import apiClient from '../axios';

export default {
  getSuscripciones() {
    return apiClient.get('/suscripciones');
  },
  getSuscripcion(id) {
    return apiClient.get(`/suscripciones/${id}`);
  },
  createSuscripcion(data) {
    return apiClient.post('/suscripciones', data);
  },
  updateSuscripcion(id, data) {
    return apiClient.put(`/suscripciones/${id}`, data);
  },
  deleteSuscripcion(id) {
    return apiClient.delete(`/suscripciones/${id}`);
  },
  desactivarSuscripcion(id) {
    return apiClient.put(`/suscripciones/desactivar/${id}`);
  },
};
