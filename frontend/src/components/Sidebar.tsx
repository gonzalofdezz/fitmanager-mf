import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { usuario, logout, isManager } = useAuth();

  // Módulos para USER normal
  const userModules = [
    { id: 'clases', label: 'Clases' },
    { id: 'suscripciones', label: 'Suscripciones' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'rutinas', label: 'Rutinas' },
  ];

  // Módulos para MANAGER (incluye ver clases, gestión, y acceso a todo lo demás)
  const managerModules = [
    { id: 'clases', label: 'Ver Clases' },
    { id: 'gestion-clases', label: 'Gestión de Clases' },
    { id: 'suscripciones', label: 'Suscripciones' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'rutinas', label: 'Rutinas' },
  ];

  const modules = isManager ? managerModules : userModules;

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '≡'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>FitManager</h2>
          <p className="user-info">{usuario?.nombre}</p>
          <span className={`role-badge ${isManager ? 'role-manager' : 'role-user'}`}>
            {isManager ? 'Manager' : 'Usuario'}
          </span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">Módulos</p>
          {modules.map((module) => (
            <button
              key={module.id}
              className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
              onClick={() => {
                onModuleChange(module.id);
                setIsOpen(false);
              }}
            >
              <span className="nav-label">{module.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={logout}>
            Salir
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
