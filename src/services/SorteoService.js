import apiClient from '../axios';

export default {
    getSorteos() {
        return apiClient.get('/sorteos');
    },
    getSorteo(id) {
        return apiClient.get(`/sorteos/${id}`);
    },
    createSorteo(data) {
        return apiClient.post('/sorteos', data);
    },
    updateSorteo(id, data) {
        return apiClient.put(`/sorteos/${id}`, data);
    },
    deleteSorteo(id) {
        return apiClient.delete(`/sorteos/${id}`);
    }
};
