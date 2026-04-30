import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Contact } from './pages/Contact';
import { ClaseList } from './components/Clases/ClaseListComponent';
import { GestionClases } from './components/Clases/GestionClases';
import { SuscripcionList } from './components/Suscripciones/SuscripcionListComponent';
import { GestionSuscripciones } from './components/Suscripciones/GestionSuscripciones';
import { ReservaCalendario } from './components/Reservas/ReservaCalendario';
import { GestionReservas } from './components/Reservas/GestionReservas';
import { RutinaList } from './components/Rutinas/RutinaListComponent';
import { GestionRutinas } from './components/Rutinas/GestionRutinas';
import './App.css';

type AppView = 'landing' | 'clases' | 'gestion-clases' | 'suscripciones' | 'gestion-suscripciones' | 'reservas' | 'gestion-reservas' | 'rutinas' | 'gestion-rutinas' | 'contacto';

interface ModuleWrapperProps {
  isAuthenticated: boolean;
  onRequestAuth: () => void;
}

function AppContent() {
  const { isAuthenticated, isManager } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Flujo de navegación:
  // 1. Landing: click → handleNavigateToModule(module)
  // 2. App.tsx setView(module)
  // 3. Si no autenticado, mostrar overlay
  // 4. Si autenticado, mostrar módulo normal

  const handleNavigateToModule = (module: string) => {
    console.log('App.handleNavigateToModule:', module);
    setView(module as AppView);
  };

  const handleRequestAuth = () => {
    console.log('App.handleRequestAuth: showing auth modal');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    console.log('App.handleAuthSuccess: auth successful');
    setShowAuthModal(false);
  };

  // Landing visible para quienquiera
  if (view === 'landing') {
    return (
      <>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
        <Landing
          isAuthenticated={isAuthenticated}
          onAcceder={handleRequestAuth}
          onNavigateToModule={handleNavigateToModule}
        />
      </>
    );
  }

  // Módulos visibles para todos pero con restricciones si no autenticado
  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      <div className={`module-container ${!isAuthenticated ? 'unauthenticated' : ''}`}>
        <div className="module-header">
          <button className="back-button" onClick={() => setView('landing')}>
            ← Volver al inicio
          </button>
        </div>
        <main className="module-content">
          {view === 'clases' && (
            <ClaseListWrapper
              isAuthenticated={isAuthenticated}
              onRequestAuth={handleRequestAuth}
            />
          )}
          {view === 'gestion-clases' && isManager && (
            <GestionClasesWrapper
              isAuthenticated={isAuthenticated}
              onRequestAuth={handleRequestAuth}
            />
          )}
           {view === 'suscripciones' && (
             <SuscripcionListWrapper
               isAuthenticated={isAuthenticated}
               onRequestAuth={handleRequestAuth}
             />
           )}
           {view === 'gestion-suscripciones' && isManager && (
             <GestionSuscripcionesWrapper
               isAuthenticated={isAuthenticated}
               onRequestAuth={handleRequestAuth}
             />
           )}
           {view === 'reservas' && (
             <ReservaCalendarioWrapper
               isAuthenticated={isAuthenticated}
               onRequestAuth={handleRequestAuth}
             />
           )}
           {view === 'gestion-reservas' && isManager && (
             <GestionReservasWrapper
               isAuthenticated={isAuthenticated}
               onRequestAuth={handleRequestAuth}
             />
           )}
           {view === 'rutinas' && (
             <RutinaListWrapper
               isAuthenticated={isAuthenticated}
               onRequestAuth={handleRequestAuth}
             />
           )}
           {view === 'gestion-rutinas' && isManager && (
             <GestionRutinasWrapper
               isAuthenticated={isAuthenticated}
               onRequestAuth={handleRequestAuth}
             />
           )}
           {view === 'contacto' && <Contact />}
        </main>
      </div>
    </>
  );
}

// Wrappers para mostrar overlay si no autenticado
function ClaseListWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <ClaseList />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión para acceder a todas las funciones</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GestionClasesWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <GestionClases />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión como Manager para gestionar clases</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GestionSuscripcionesWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <GestionSuscripciones />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión como Manager para gestionar planes</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GestionReservasWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <GestionReservas />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión como Manager para gestionar reservas</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GestionRutinasWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <GestionRutinas />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión como Manager para gestionar rutinas</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SuscripcionListWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <SuscripcionList />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión para acceder a todas las funciones</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservaCalendarioWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <ReservaCalendario />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión para acceder a todas las funciones</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RutinaListWrapper({ isAuthenticated, onRequestAuth }: ModuleWrapperProps) {
  return (
    <div className={isAuthenticated ? '' : 'module-overlay-wrapper'}>
      <RutinaList />
      {!isAuthenticated && (
        <div className="module-overlay">
          <div className="overlay-content">
            <h2>Acceso Limitado</h2>
            <p>Inicia sesión para acceder a todas las funciones</p>
            <button className="overlay-button" onClick={onRequestAuth}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: () => void;
}

function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <AuthPage onAuthSuccess={() => {
          onAuthSuccess();
          onClose();
        }} />
      </div>
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
