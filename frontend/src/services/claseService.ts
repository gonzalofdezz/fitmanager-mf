import axios from 'axios';
import { apiClient } from './api';

export interface Clase {
  id?: number;
  nombre: string;
  descripcion: string;
  nivel: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  duracionMinutos: number;
  capacidadPorDefecto: number;
  diaSemana?: string;
  horaInicio?: string;
  fechaEspecifica?: string; // fecha concreta, e.g. "2026-04-28"
}

// Mock de horarios hasta que el backend los soporte
const MOCK_HORARIOS: Record<number, { diaSemana: string; horaInicio: string }> = {
  1: { diaSemana: 'Lunes', horaInicio: '09:00' },
  2: { diaSemana: 'Martes', horaInicio: '10:30' },
  3: { diaSemana: 'Miércoles', horaInicio: '18:00' },
  4: { diaSemana: 'Jueves', horaInicio: '07:30' },
  5: { diaSemana: 'Viernes', horaInicio: '19:00' },
  6: { diaSemana: 'Sábado', horaInicio: '10:00' },
  7: { diaSemana: 'Domingo', horaInicio: '11:00' },
};

// Calcula la próxima fecha (a partir de hoy) para un día de semana dado
function nextDateForDay(diaSemana: string): string {
  const dias: Record<string, number> = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
    'Viernes': 5, 'Sábado': 6, 'Domingo': 0,
  };
  const target = dias[diaSemana];
  if (target === undefined) return '';
  const today = new Date();
  const currentDay = today.getDay();
  let diff = target - currentDay;
  if (diff <= 0) diff += 7;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  return date.toISOString().split('T')[0];
}

export function enrichClaseWithHorario(clase: Clase): Clase {
  if (clase.diaSemana && clase.horaInicio) {
    // Si ya tiene diaSemana pero no fechaEspecifica, calcularla
    if (!clase.fechaEspecifica) {
      return { ...clase, fechaEspecifica: nextDateForDay(clase.diaSemana) };
    }
    return clase;
  }
  const horario = clase.id ? MOCK_HORARIOS[clase.id] : undefined;
  const base = horario
    ? { ...clase, ...horario }
    : (() => {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const horas = ['08:00', '09:30', '11:00', '17:00', '18:30', '20:00'];
        const idx = (clase.id || 0) % dias.length;
        return { ...clase, diaSemana: dias[idx], horaInicio: horas[idx] };
      })();
  return { ...base, fechaEspecifica: nextDateForDay(base.diaSemana!) };
}

export const claseService = {
  // Obtener todas las clases - GET /clases
  getAll: async (): Promise<Clase[]> => {
    try {
      const response = await apiClient.get<Clase[]>('/clases');
      return response.data.map(enrichClaseWithHorario);
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

  // Eliminar clase - DELETE /clases/{id}
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/clases/${id}`);
    } catch (error) {
      console.error('Error deleting clase:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      throw error;
    }
  },
};

