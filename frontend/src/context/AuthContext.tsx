import React, { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export type UserRole = 'USER' | 'MANAGER';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isManager: boolean;
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
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      let userId = response.id;
      let userName = response.nombre;
      let userRol: UserRole = (response.rol as UserRole) || 'USER';

      if (!userId) {
        try {
          const userInfo = await authService.getByEmail(email);
          userId = userInfo.id;
          userName = userInfo.nombre || userName;
          if (userInfo.rol) userRol = userInfo.rol as UserRole;
        } catch (_) {
          userId = email;
        }
      }

      const nuevoUsuario: Usuario = {
        id: userId || email,
        nombre: userName || email.split('@')[0],
        email: response.email || email,
        rol: userRol,
      };
      setUsuario(nuevoUsuario);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
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
        rol: (response.rol as UserRole) || 'USER',
      };
      setUsuario(nuevoUsuario);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
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

  const isManager = usuario?.rol === 'MANAGER';

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, isManager, login, register, logout }}>
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
