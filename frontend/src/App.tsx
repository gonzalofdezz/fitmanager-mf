import { Home } from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💪 FitManager</h1>
          <p>Plataforma de gestión de atletas</p>
        </div>
      </header>
      <main>
        <Home />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 FitManager TFG. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
