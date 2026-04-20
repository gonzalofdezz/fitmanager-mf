import axios from 'axios';
import { Athlete, CreateAthleteRequest } from '../types/Athlete';

// Para desarrollo, puedes cambiar esto fácilmente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const athleteService = {
  // Obtener todos los atletas
  getAllAthletes: async (): Promise<Athlete[]> => {
    try {
      console.log('Fetching athletes from:', `${API_BASE_URL}/api/v1/athletes`);
      const response = await apiClient.get<Athlete[]>('/api/v1/athletes');
      console.log('Athletes loaded:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching athletes:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      throw error;
    }
  },

  // Obtener un atleta por ID
  getAthleteById: async (id: string): Promise<Athlete> => {
    try {
      const response = await apiClient.get<Athlete>(`/api/v1/athletes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching athlete:', error);
      throw error;
    }
  },

  // Crear un nuevo atleta
  createAthlete: async (data: CreateAthleteRequest): Promise<Athlete> => {
    try {
      const response = await apiClient.post<Athlete>('/api/v1/athletes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating athlete:', error);
      throw error;
    }
  },
};
