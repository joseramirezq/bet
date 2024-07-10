import apiClient from '../axios';

export default {
  getPremios() {
    return apiClient.get('/premios');
  },
  getPremiosActivos() {
    return apiClient.get('/premios/activos');
  },
  getPremio(id) {
    return apiClient.get(`/premios/${id}`);
  },
  createPremio(data) {
    return apiClient.post('/premios', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updatePremio(id, data) {
    return apiClient.post(`/premios/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  desactivarPremio(id) {
    return apiClient.put(`/premios/desactivar/${id}`);
  },
};
