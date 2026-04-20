import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/Auth';
// @ts-ignore
import { Sidebar } from './components/Sidebar.tsx';
// @ts-ignore
import { ClaseList } from './components/Clases/ClaseListComponent.tsx';
// @ts-ignore
import { SuscripcionList } from './components/Suscripciones/SuscripcionListComponent.tsx';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState('clases');

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div className="app-authenticated">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="main-content">
        {activeModule === 'clases' && <ClaseList />}
        {activeModule === 'suscripciones' && <SuscripcionList />}
        {activeModule === 'reservas' && <div className="module-placeholder">Módulo de Reservas - En construcción</div>}
        {activeModule === 'rutinas' && <div className="module-placeholder">Módulo de Rutinas - En construcción</div>}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
