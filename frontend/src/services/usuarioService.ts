import { apiClient } from './api';
import { Usuario } from '../types/Usuario';

export const usuarioService = {
  // GET /usuarios - obtener todos los usuarios
  getAll: async (): Promise<Usuario[]> => {
    try {
      const response = await apiClient.get<Usuario[]>('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  },

  // GET /usuarios/{id}
  getById: async (id: string): Promise<Usuario> => {
    try {
      const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching usuario:', error);
      throw error;
    }
  },

  // POST /usuarios
  create: async (data: Usuario): Promise<Usuario> => {
    try {
      const response = await apiClient.post<Usuario>('/usuarios', data);
      return response.data;
    } catch (error) {
      console.error('Error creating usuario:', error);
      throw error;
    }
  },

  // PUT /usuarios/{id}
  update: async (id: string, data: Usuario): Promise<Usuario> => {
    try {
      const response = await apiClient.put<Usuario>(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating usuario:', error);
      throw error;
    }
  },

  // DELETE /usuarios/{id}
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error('Error deleting usuario:', error);
      throw error;
    }
  },
};

