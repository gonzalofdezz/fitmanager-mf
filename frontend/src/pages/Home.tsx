import { useState } from 'react';
import { ClaseList } from '../components/Clases/ClaseListComponent';
import { SuscripcionList } from '../components/Suscripciones/SuscripcionListComponent';
import { ReservaCalendario } from '../components/Reservas/ReservaCalendario';
import { RutinaList } from '../components/Rutinas/RutinaListComponent';
import { ProgresionComponent } from '../components/Progresion/ProgresionComponent';
import './Home.css';

type ModuleType = 'clases' | 'suscripciones' | 'reservas' | 'rutinas' | 'progresion' | null;

export function Home() {
  const [activeModule, setActiveModule] = useState<ModuleType>(null);

  const modules = [
    {
      id: 'progresion',
      name: 'Progresion',
      description: 'Sigue tu avance en el gimnasio',
      color: '#f97316'
    },
    {
      id: 'clases',
      name: 'Clases',
      description: 'Explora todas las clases disponibles',
      color: '#f97316'
    },
    {
      id: 'suscripciones',
      name: 'Suscripciones',
      description: 'Gestiona tu plan de suscripción',
      color: '#f97316'
    },
    {
      id: 'reservas',
      name: 'Reservas',
      description: 'Reserva aulas y espacios',
      color: '#f97316'
    },
    {
      id: 'rutinas',
      name: 'Rutinas',
      description: 'Crea y gestiona tus rutinas',
      color: '#f97316'
    }
  ] as const;

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'clases':
        return <ClaseList />;
      case 'suscripciones':
        return <SuscripcionList />;
      case 'reservas':
        return <ReservaCalendario />;
      case 'rutinas':
        return <RutinaList />;
      case 'progresion':
        return <ProgresionComponent />;
      default:
        return null;
    }
  };

  return (
    <div className="home">
      {!activeModule ? (
        // Dashboard principal
        <div className="dashboard">
          <div className="dashboard-header">
            <h2>Módulos Disponibles</h2>
            <p>Selecciona un módulo para comenzar</p>
          </div>
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
          {renderModuleContent()}
        </div>
      )}
    </div>
  );
}
