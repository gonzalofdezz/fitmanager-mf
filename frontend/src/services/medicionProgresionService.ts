import { apiClient } from './api';

export interface MedicionProgresion {
  id?: string;
  usuarioId: string;
  peso?: number;
  pesoMaximoLevantado?: number;
  fecha: string;
  notas?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CrearMedicionDTO {
  peso?: number;
  pesoMaximoLevantado?: number;
  fecha?: string;
  notas?: string;
}

export const medicionProgresionService = {
  // POST /mediciones-progresion/usuario/{usuarioId}
  guardarMedicion: async (usuarioId: string, data: CrearMedicionDTO): Promise<MedicionProgresion> => {
    try {
      const response = await apiClient.post<MedicionProgresion>(`/mediciones-progresion/usuario/${usuarioId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving medicion:', error);
      throw error;
    }
  },

  // GET /mediciones-progresion/usuario/{usuarioId}
  obtenerMediciones: async (usuarioId: string): Promise<MedicionProgresion[]> => {
    try {
      const response = await apiClient.get<MedicionProgresion[]>(`/mediciones-progresion/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mediciones:', error);
      throw error;
    }
  },

  // GET /mediciones-progresion/usuario/{usuarioId}/rango
  obtenerMedicionesEnRango: async (usuarioId: string, desde: string, hasta: string): Promise<MedicionProgresion[]> => {
    try {
      const response = await apiClient.get<MedicionProgresion[]>(
        `/mediciones-progresion/usuario/${usuarioId}/rango`,
        {
          params: { desde, hasta }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching mediciones en rango:', error);
      throw error;
    }
  },
};

