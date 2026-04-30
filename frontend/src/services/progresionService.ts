import { apiClient } from './api';

export interface Progresion {
  id?: string;
  usuarioId: string;
  pesoCorporal?: number;
  entrenamientosCompletados: number;
  rachaAsistencias: number;
  ultimaActividad?: string | Date;
  banderasConseguidas?: string;
  pesoMaximoLevantado?: number;
  fechaCreacion?: string | Date;
  fechaActualizacion?: string | Date;
}

export interface ActualizarProgresionDTO {
  pesoCorporal?: number;
  entrenamientosCompletados?: number;
  rachaAsistencias?: number;
  banderasConseguidas?: string;
  pesoMaximoLevantado?: number;
}

export const progresionService = {
  // GET /progresion/usuario/{usuarioId}
  obtenerPorUsuarioId: async (usuarioId: string): Promise<Progresion> => {
    try {
      const response = await apiClient.get<Progresion>(`/progresion/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progresion:', error);
      throw error;
    }
  },

  // POST /progresion/usuario/{usuarioId}
  crear: async (usuarioId: string): Promise<Progresion> => {
    try {
      const response = await apiClient.post<Progresion>(`/progresion/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error creating progresion:', error);
      throw error;
    }
  },

  // PUT /progresion/usuario/{usuarioId}
  actualizar: async (usuarioId: string, data: ActualizarProgresionDTO): Promise<Progresion> => {
    try {
      const response = await apiClient.put<Progresion>(`/progresion/usuario/${usuarioId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating progresion:', error);
      throw error;
    }
  },

  // POST /progresion/usuario/{usuarioId}/completar-entrenamiento
  completarEntrenamiento: async (usuarioId: string): Promise<void> => {
    try {
      await apiClient.post(`/progresion/usuario/${usuarioId}/completar-entrenamiento`);
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  },
};

