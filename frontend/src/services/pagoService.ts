import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Pago {
  id?: string;
  pagoId?: string; // campo que devuelve el backend
  suscripcionId?: string;
  usuarioId?: string;
  plan?: 'BASICA' | 'PREMIUM' | 'VIP';
  monto?: number;
  estado?: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO';
  metodoPago?: string;
  fechaCreacion?: string | Date;
}

export const pagoService = {
  // POST /pagos/iniciar
  iniciar: async (usuarioId: string, plan: string): Promise<Pago> => {
    try {
      const payload = {
        usuarioId,
        plan,
      };
      console.log('Iniciando pago con payload:', payload);
      const response = await apiClient.post<Pago>('/pagos/iniciar', payload);
      console.log('Pago iniciado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error initiating pago:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Message:', error.message);
      }
      throw error;
    }
  },

  // POST /pagos/confirmar
  confirmar: async (pagoId: string, estado: string): Promise<Pago> => {
    try {
      console.log('Confirmando pago:', pagoId);
      const response = await apiClient.post<Pago>('/pagos/confirmar', {
        pagoId,
        estado,
      });
      console.log('Pago confirmado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error confirming pago:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  },

  // GET /pagos/{pagoId}/confirmar-fake (DESARROLLO)
  confirmarFake: async (pagoId: string): Promise<Pago> => {
    try {
      console.log('Confirmando pago (fake):', pagoId);
      const response = await apiClient.get<Pago>(`/pagos/${pagoId}/confirmar-fake`);
      console.log('Pago confirmado (fake):', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fake confirming pago:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  },

  // GET /pagos/{pagoId}
  getById: async (pagoId: string): Promise<Pago> => {
    try {
      const response = await apiClient.get<Pago>(`/pagos/${pagoId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pago:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  },
};

