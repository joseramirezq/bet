import apiClient from '../axios';

export default {
    getGanadores() {
        return apiClient.get('/ganadores');
    },
    getGanador(id) {
        return apiClient.get(`/ganadores/${id}`);
    },
    createGanador(data) {
        return apiClient.post('/ganadores', data);
    },
    updateGanador(id, data) {
        return apiClient.put(`/ganadores/${id}`, data);
    },
    deleteGanador(id) {
        return apiClient.delete(`/ganadores/${id}`);
    }
};
