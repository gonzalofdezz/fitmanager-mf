import { apiClient } from './api';

export interface Reserva {
  id?: string;
  usuarioId: string;
  claseId: number;
  fechaReserva: string | Date;
  estado?: 'RESERVADA' | 'ASISTIDA' | 'CANCELADA';
}

export interface Disponibilidad {
  claseId: number;
  capacidadTotal: number;
  espaciosDisponibles: number;
  reservas: number;
}

export const reservaService = {
  // POST /reservas
  create: async (data: Reserva): Promise<Reserva> => {
    try {
      const response = await apiClient.post<Reserva>('/reservas', data);
      return response.data;
    } catch (error) {
      console.error('Error creating reserva:', error);
      throw error;
    }
  },

  // GET /reservas/usuario/{usuarioId}
  listByUsuarioId: async (usuarioId: string): Promise<Reserva[]> => {
    try {
      const response = await apiClient.get<Reserva[]>(`/reservas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error listing reservas:', error);
      throw error;
    }
  },

  // DELETE /reservas/{id}
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/reservas/${id}`);
    } catch (error) {
      console.error('Error deleting reserva:', error);
      throw error;
    }
  },

  // GET /reservas/clases/{claseId}/disponibilidad
  getDisponibilidad: async (claseId: number): Promise<Disponibilidad> => {
    try {
      const response = await apiClient.get<Disponibilidad>(`/reservas/clases/${claseId}/disponibilidad`);
      return response.data;
    } catch (error) {
      console.error('Error fetching disponibilidad:', error);
      throw error;
    }
  },
};

