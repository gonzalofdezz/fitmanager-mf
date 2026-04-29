import { useState } from 'react';
import './Home.css';

type ModuleType = 'clases' | 'suscripciones' | 'reservas' | 'pagos' | 'rutinas' | null;

export function Home() {
  const [activeModule, setActiveModule] = useState<ModuleType>(null);

  const modules = [
    {
      id: 'clases',
      name: 'Clases',
      description: 'Gestiona las clases del gimnasio',
      color: '#f97316'
    },
    {
      id: 'suscripciones',
      name: 'Suscripciones',
      description: 'Gestiona suscripciones de usuarios',
      color: '#f97316'
    },
    {
      id: 'reservas',
      name: 'Reservas',
      description: 'Gestiona las reservas de clases',
      color: '#f97316'
    },
    {
      id: 'pagos',
      name: 'Pagos',
      description: 'Procesa pagos de suscripciones',
      color: '#f97316'
    },
    {
      id: 'rutinas',
      name: 'Rutinas',
      description: 'Crea y gestiona rutinas de entrenamiento',
      color: '#f97316'
    }
  ] as const;

  return (
    <div className="home">
      <div className="container">
        {!activeModule ? (
          // Dashboard principal
          <div className="dashboard">
            <h2>Módulos Disponibles</h2>
            <div className="modules-grid">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="module-card"
                  onClick={() => setActiveModule(module.id as ModuleType)}
                >
                  <div className="module-icon">{module.name.split(' ')[0]}</div>
                  <h3>{module.name}</h3>
                  <p>{module.description}</p>
                  <button className="btn-enter">Entrar →</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Módulos
          <div className="module-view">
            <button className="btn-back" onClick={() => setActiveModule(null)}>
              ← Volver al inicio
            </button>
            <h2>{modules.find(m => m.id === activeModule)?.name}</h2>
            <div className="module-content">
              <p>Módulo de {activeModule} en construcción...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
