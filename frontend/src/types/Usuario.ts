export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol?: 'USER' | 'MANAGER';
}

