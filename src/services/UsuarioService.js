// src/services/UsuarioService.js
import apiClient from '../axios';

export default {
  getUsuarios() {
    return apiClient.get('/usuarios');
  },
  getUsuario(id) {
    return apiClient.get(`/usuarios/${id}`);
  },
  createUsuario(data) {
    return apiClient.post('/usuarios', data);
  },
  updateUsuario(id, data) {
    return apiClient.put(`/usuarios/${id}`, data);
  },
  deleteUsuario(id) {
    return apiClient.delete(`/usuarios/${id}`);
  },
  desactivarUsuario(id) {
    return apiClient.put(`/usuarios/desactivar/${id}`);
  },
  getUsuariosActivos() {
    return apiClient.get('/usuarios/activos');
  },
  getUsuariosAdministradores() {
    return apiClient.get('/usuarios/admin');
  },
};
