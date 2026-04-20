import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Clase {
  id?: number;
  nombre: string;
  descripcion: string;
  nivel: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  duracionMinutos: number;
  capacidadPorDefecto: number;
}

export const claseService = {
  // Obtener todas las clases - GET /clases
  getAll: async (): Promise<Clase[]> => {
    try {
      const response = await apiClient.get<Clase[]>('/clases');
      return response.data;
    } catch (error) {
      console.error('Error fetching clases:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
      }
      throw error;
    }
  },

  // Obtener clase por ID - GET /clases/{id}
  getById: async (id: number): Promise<Clase> => {
    try {
      const response = await apiClient.get<Clase>(`/clases/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clase:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      throw error;
    }
  },

  // Crear clase - POST /clases
  create: async (data: Clase): Promise<Clase> => {
    try {
      console.log('Creando clase:', data);
      const response = await apiClient.post<Clase>('/clases', data);
      console.log('Clase creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating clase:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Message:', error.message);
      }
      throw error;
    }
  },

  // Editar clase - PUT /clases/{id}
  update: async (id: number, data: Clase): Promise<Clase> => {
    try {
      const response = await apiClient.put<Clase>(`/clases/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating clase:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      throw error;
    }
  },
};

