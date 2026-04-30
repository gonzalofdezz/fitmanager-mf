import axios from 'axios';
import { apiClient } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// apiClient sin token para auth (login/register no necesitan token)
const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  contrasena: string;
}

export interface AuthResponse {
  id?: string;
  nombre?: string;
  email?: string;
  token?: string;
  rol?: string;
  message?: string;
}

export const authService = {
  // POST /auth/registrar
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log('Registrando usuario:', data);
      const response = await authApiClient.post<AuthResponse>('/auth/registrar', data);
      console.log('Registro exitoso:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error registering:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
      }
      throw error;
    }
  },

  // POST /auth/login
  login: async (email: string, contrasena: string): Promise<AuthResponse> => {
    try {
      console.log('Login attempt:', email);
      const response = await authApiClient.post<AuthResponse>('/auth/login', {
        email,
        contrasena,
      });
      console.log('Login exitoso:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error logging in:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
      }
      throw error;
    }
  },

  // GET /auth/usuarios/{email}
  getByEmail: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.get<AuthResponse>(`/auth/usuarios/${email}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching user:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      throw error;
    }
  },

  // GET /auth/usuarios/{email}/existe
  emailExists: async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ existe: boolean }>(`/auth/usuarios/${email}/existe`);
      return response.data.existe;
    } catch (error: unknown) {
      console.error('Error checking email:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      return false;
    }
  },
};
