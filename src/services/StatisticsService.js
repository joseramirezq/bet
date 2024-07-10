import apiClient from '../axios';

export default {
  getStatistics() {
    return apiClient.get('/statistics');
  },
};
