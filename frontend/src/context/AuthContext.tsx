import React, { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, contrasena: string) => Promise<boolean>;
  register: (nombre: string, email: string, contrasena: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, contrasena: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, contrasena);
      const nuevoUsuario: Usuario = {
        id: response.id || email,
        nombre: response.nombre || email.split('@')[0],
        email: response.email || email,
      };
      setUsuario(nuevoUsuario);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (nombre: string, email: string, contrasena: string): Promise<boolean> => {
    try {
      const response = await authService.register({ nombre, email, contrasena });
      const nuevoUsuario: Usuario = {
        id: response.id || email,
        nombre: response.nombre || nombre,
        email: response.email || email,
      };
      setUsuario(nuevoUsuario);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      // ❌ NO crear suscripción automáticamente
      // El usuario debe comprar un plan manualmente
      console.log('✅ Usuario registrado sin suscripción inicial');

      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

