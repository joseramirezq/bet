import apiClient from '../axios';

export default {
  getSliders() {
    return apiClient.get('/sliders');
  },
  getSliderActivos() {
    return apiClient.get('/sliders/activos');
  },
  getSlider(id) {
    return apiClient.get(`/sliders/${id}`);
  },
  createSlider(data) {
    return apiClient.post('/sliders', data);
  },
  updateSlider(id, data) {
    return apiClient.put(`/sliders/${id}`, data);
  },
  desactivarSlider(id) {
    return apiClient.put(`/sliders/desactivar/${id}`);
  },
};
