import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Suscripcion {
  id?: string;
  usuarioId: string;
  tipoPlan: 'NINGUNA' | 'BASICA' | 'PREMIUM' | 'VIP';
  fechaInicio?: string | Date;
  fechaFin?: string | Date;
  estado?: string;
}

export const suscripcionService = {
  // GET /suscripciones/{usuarioId}
  getByUsuarioId: async (usuarioId: string): Promise<Suscripcion> => {
    try {
      const response = await apiClient.get<Suscripcion>(`/suscripciones/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suscripcion:', error);
      throw error;
    }
  },

  // GET /suscripciones/usuario/{usuarioId}
  listByUsuarioId: async (usuarioId: string): Promise<Suscripcion[]> => {
    try {
      const response = await apiClient.get<Suscripcion[]>(`/suscripciones/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error listing suscripciones:', error);
      throw error;
    }
  },

  // POST /suscripciones
  create: async (data: Suscripcion): Promise<Suscripcion> => {
    try {
      const response = await apiClient.post<Suscripcion>('/suscripciones', data);
      return response.data;
    } catch (error) {
      console.error('Error creating suscripcion:', error);
      throw error;
    }
  },

  // DELETE /suscripciones/{id}
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/suscripciones/${id}`);
    } catch (error) {
      console.error('Error deleting suscripcion:', error);
      throw error;
    }
  },

  // PUT /suscripciones/{id}/renovar
  renovar: async (id: string, data: { tipoPlan: string; fechaFin: string }): Promise<Suscripcion> => {
    try {
      const response = await apiClient.put<Suscripcion>(`/suscripciones/${id}/renovar`, data);
      return response.data;
    } catch (error) {
      console.error('Error renovating suscripcion:', error);
      throw error;
    }
  },

  // PUT /suscripciones/{id}/plan
  updatePlan: async (id: string, tipoPlan: string): Promise<Suscripcion> => {
    try {
      const response = await apiClient.put<Suscripcion>(`/suscripciones/${id}/plan`, { tipoPlan });
      return response.data;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },
};

