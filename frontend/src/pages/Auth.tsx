import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        return;
      }
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          onAuthSuccess();
        } else {
          setError('Email o contraseña incorrectos');
        }
      } catch (err) {
        setError('Error al iniciar sesión');
      }
    } else {
      if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (formData.password.length < 6 || formData.password.length > 255) {
        setError('La contraseña debe tener entre 6 y 255 caracteres');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      try {
        const success = await register(formData.nombre, formData.email, formData.password);
        if (success) {
          setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
          setIsLogin(true);
          setError('');
        } else {
          setError('Error al registrarse. Intenta de nuevo.');
        }
      } catch (err) {
        setError('Error al registrarse');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <h1>FitManager</h1>
          <p className="subtitle">Plataforma de gestión de gimnasio</p>

          <div className="auth-tabs">
            <button
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
                setError('');
              }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
                setError('');
              }}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-auth">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="auth-footer">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
                setError('');
              }}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </span>
          </p>
        </div>

        <div className="auth-decorative">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
          <div className="decoration-circle decoration-3"></div>
        </div>
      </div>
    </div>
  );
}

