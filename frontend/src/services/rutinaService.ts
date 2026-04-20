import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Ejercicio {
  id?: string;
  rutinaId?: string;
  nombreEjercicio: string;
  series: number;
  repeticiones: number;
  peso: number;
  descansoSegundos: number;
}

export interface Rutina {
  id?: string;
  usuarioId: string;
  nombre: string;
  descripcion: string;
  activa?: boolean;
  fechaCreacion?: string | Date;
  ejercicios?: Ejercicio[];
}

export const rutinaService = {
  // POST /rutinas
  create: async (data: Rutina): Promise<Rutina> => {
    try {
      const response = await apiClient.post<Rutina>('/rutinas', data);
      return response.data;
    } catch (error) {
      console.error('Error creating rutina:', error);
      throw error;
    }
  },

  // GET /rutinas/{id}
  getById: async (id: string): Promise<Rutina> => {
    try {
      const response = await apiClient.get<Rutina>(`/rutinas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rutina:', error);
      throw error;
    }
  },

  // PUT /rutinas/{id}
  update: async (id: string, data: Rutina): Promise<Rutina> => {
    try {
      const response = await apiClient.put<Rutina>(`/rutinas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating rutina:', error);
      throw error;
    }
  },

  // GET /rutinas/usuario/{usuarioId}
  listByUsuarioId: async (usuarioId: string): Promise<Rutina[]> => {
    try {
      const response = await apiClient.get<Rutina[]>(`/rutinas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error listing rutinas:', error);
      throw error;
    }
  },

  // DELETE /rutinas/{id}
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/rutinas/${id}`);
    } catch (error) {
      console.error('Error deleting rutina:', error);
      throw error;
    }
  },

  // POST /rutinas/{id}/ejercicios
  addEjercicio: async (rutinaId: string, ejercicio: Ejercicio): Promise<Ejercicio> => {
    try {
      const response = await apiClient.post<Ejercicio>(`/rutinas/${rutinaId}/ejercicios`, ejercicio);
      return response.data;
    } catch (error) {
      console.error('Error adding ejercicio:', error);
      throw error;
    }
  },

  // GET /rutinas/{id}/ejercicios
  getEjercicios: async (rutinaId: string): Promise<Ejercicio[]> => {
    try {
      const response = await apiClient.get<Ejercicio[]>(`/rutinas/${rutinaId}/ejercicios`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ejercicios:', error);
      throw error;
    }
  },

  // PUT /rutinas/ejercicios/{id}
  updateEjercicio: async (ejercicioId: string, data: Ejercicio): Promise<Ejercicio> => {
    try {
      const response = await apiClient.put<Ejercicio>(`/rutinas/ejercicios/${ejercicioId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating ejercicio:', error);
      throw error;
    }
  },

  // DELETE /rutinas/ejercicios/{id}
  deleteEjercicio: async (ejercicioId: string): Promise<void> => {
    try {
      await apiClient.delete(`/rutinas/ejercicios/${ejercicioId}`);
    } catch (error) {
      console.error('Error deleting ejercicio:', error);
      throw error;
    }
  },
};

