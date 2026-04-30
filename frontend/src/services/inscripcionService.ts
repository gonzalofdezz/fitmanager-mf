import { apiClient } from './api';

export interface Inscripcion {
  id?: string;
  usuarioId: string;
  claseId: number;
  fechaInscripcion?: string;
  estado?: string;
  // campos enriquecidos que puede devolver el back
  nombreClase?: string;
  diaSemana?: string;
  horaInicio?: string;
}

export const inscripcionService = {
  // POST /inscripciones
  create: async (data: { usuarioId: string; claseId: number }): Promise<Inscripcion> => {
    try {
      const response = await apiClient.post<Inscripcion>('/inscripciones', data);
      return response.data;
    } catch (error) {
      console.error('Error creating inscripcion:', error);
      throw error;
    }
  },

  // GET /inscripciones/usuario/{usuarioId}
  listByUsuarioId: async (usuarioId: string): Promise<Inscripcion[]> => {
    try {
      const response = await apiClient.get<Inscripcion[]>(`/inscripciones/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error listing inscripciones:', error);
      throw error;
    }
  },

  // DELETE /inscripciones/{id}
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/inscripciones/${id}`);
    } catch (error) {
      console.error('Error deleting inscripcion:', error);
      throw error;
    }
  },
};

