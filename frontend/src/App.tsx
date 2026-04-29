import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Contact } from './pages/Contact';
// @ts-ignore
import { ClaseList } from './components/Clases/ClaseListComponent.tsx';
// @ts-ignore
import { SuscripcionList } from './components/Suscripciones/SuscripcionListComponent.tsx';
// @ts-ignore
import { ReservaCalendario } from './components/Reservas/ReservaCalendario.tsx';
// @ts-ignore
import { RutinaList } from './components/Rutinas/RutinaListComponent.tsx';
import './App.css';

type AppView = 'landing' | 'clases' | 'suscripciones' | 'reservas' | 'rutinas' | 'contacto';

function AppContent() {
  const { isAuthenticated } = useAuth();
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
          {view === 'suscripciones' && (
            <SuscripcionListWrapper
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
          {view === 'rutinas' && (
            <RutinaListWrapper
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
function ClaseListWrapper({ isAuthenticated, onRequestAuth }: any) {
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

function SuscripcionListWrapper({ isAuthenticated, onRequestAuth }: any) {
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

function ReservaCalendarioWrapper({ isAuthenticated, onRequestAuth }: any) {
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

function RutinaListWrapper({ isAuthenticated, onRequestAuth }: any) {
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


function AuthModal({ onClose, onAuthSuccess }: any) {
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
