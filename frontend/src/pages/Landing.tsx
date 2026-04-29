import './Landing.css';
import { useAuth } from '../context/AuthContext';

interface LandingProps {
  onAcceder?: () => void;
  isAuthenticated?: boolean;
  onNavigateToModule?: (module: string) => void;
}

export function Landing({
  onAcceder,
  isAuthenticated = false,
  onNavigateToModule
}: LandingProps) {
  const { logout, usuario } = useAuth();
  const sections = [
    { label: 'Clases', desc: 'Yoga, Spinning, Crossfit...', action: 'clases' },
    { label: 'Planes', desc: 'Básico · Premium · VIP', action: 'suscripciones' },
    { label: 'Reservas', desc: 'Reserva tu aula', action: 'reservas' },
    { label: 'Rutinas', desc: 'Gestiona tus entrenamientos', action: 'rutinas' },
  ];

  const stats = [
    { value: '500+', label: 'Socios activos' },
    { value: '30+', label: 'Clases semanales' },
    { value: '10', label: 'Aulas disponibles' },
    { value: '24/7', label: 'Acceso online' },
  ];

  const handleLogout = () => {
    logout();
  };

  // Función para manejar clicks en módulos - SIEMPRE navega, sin validaciones
  const handleModuleClick = (module: string) => {
    if (!onNavigateToModule) {
      console.error('onNavigateToModule no está disponible');
      return;
    }
    console.log('Navegando a:', module, 'Autenticado:', isAuthenticated);
    onNavigateToModule(module);
  };

  // Función para manejar click de auth
  const handleAuthClick = () => {
    console.log('handleAuthClick: onAcceder =', onAcceder);
    if (onAcceder) {
      onAcceder();
    } else {
      console.error('onAcceder no está disponible');
    }
  };

  return (
    <div className="landing-page">
      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="nav-logo">
          fitmanager<span className="nav-logo-dot">.</span>
        </div>

        {/* NAVBAR IGUAL PARA TODOS */}
        <div className="nav-links">
          <a onClick={() => handleModuleClick('clases')} className="nav-link-module">Clases</a>
          <a onClick={() => handleModuleClick('suscripciones')} className="nav-link-module">Planes</a>
          <a onClick={() => handleModuleClick('reservas')} className="nav-link-module">Reservas</a>
          <a onClick={() => handleModuleClick('rutinas')} className="nav-link-module">Rutinas</a>
          <a onClick={() => handleModuleClick('contacto')} className="nav-link-module">Contacto</a>
        </div>

        {!isAuthenticated ? (
          <>
            <button className="nav-cta" onClick={handleAuthClick}>
              Área Clientes
            </button>
            <button className="nav-hamburger" onClick={handleAuthClick} aria-label="Menú">
              <span /><span /><span />
            </button>
          </>
        ) : (
          <>
            <div className="nav-auth-group">
              <span className="nav-user">Hola, {usuario?.nombre || 'Usuario'}</span>
              <button className="nav-logout" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-grid" />
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-lines" />
        </div>

        <div className="hero-content">
          <span className="hero-eyebrow">Plataforma de gestión de gimnasio</span>
          <h1 className="hero-title">
            FIT<br />
            <span className="hero-title-accent">MANAGER</span>
          </h1>
          <p className="hero-subtitle">
            TU TRANSFORMACIÓN<br />EMPIEZA AQUÍ
          </p>

          <div className="hero-pills">
            {sections.map(s => (
              <button
                key={s.label}
                className="hero-pill"
                onClick={() => handleModuleClick(s.action)}
              >
                <span className="pill-label">{s.label}</span>
                <span className="pill-desc">{s.desc}</span>
              </button>
            ))}
          </div>

          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              onClick={() => isAuthenticated ? handleModuleClick('clases') : handleAuthClick()}
            >
              {isAuthenticated ? 'Ir a Clases' : 'Inscríbete ahora'}
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => isAuthenticated ? handleModuleClick('suscripciones') : handleAuthClick()}
            >
              {isAuthenticated ? 'Ver Planes' : 'Ya soy socio'}
            </button>
          </div>
        </div>

        <div className="hero-scroll-indicator" aria-hidden="true">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="stats-inner">
          {stats.map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO ── */}
      <section className="promo-section">
        <div className="promo-left">
          <div className="promo-bg-shapes" aria-hidden="true">
            <div className="promo-shape promo-shape-1" />
            <div className="promo-shape promo-shape-2" />
          </div>
          <div className="promo-left-content">
            <span className="promo-eyebrow">Gestiona tu entrenamiento</span>
            <h2 className="promo-title">
              TU MEJOR PLAN<br />
              <span className="promo-title-accent">PARA ENTRENAR</span>
            </h2>
            <p className="promo-desc">
              Accede a clases en vivo, reserva aulas, sigue tus rutinas y gestiona tu suscripción, todo en un mismo lugar.
            </p>
            <button
              className="btn-promo"
              onClick={() => handleModuleClick('clases')}
            >
              {isAuthenticated ? 'Ir a Clases' : 'Empezar ahora'}
            </button>
          </div>
        </div>

        <div className="promo-right">
          <div className="promo-cards">
            {[
              { title: 'Clases en grupo', detail: 'Yoga · Spinning · Crossfit · Pilates', tag: 'Disponible', action: 'clases' },
              { title: 'Reserva de aulas', detail: 'Personal o grupal · Hasta 30 días', tag: 'Online', action: 'reservas' },
              { title: 'Rutinas personalizadas', detail: 'Crea, gestiona y optimiza tu entrenamiento', tag: 'Nuevo', action: 'rutinas' },
            ].map(card => (
              <div
                key={card.title}
                className="promo-card"
                onClick={() => handleModuleClick(card.action)}
              >
                <div className="promo-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.detail}</p>
                </div>
                <span className="promo-card-tag">{card.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-logo">fitmanager.</span>
          <span className="footer-copy">&copy; {new Date().getFullYear()} FitManager. Todos los derechos reservados.</span>
          {!isAuthenticated && (
            <button className="footer-cta" onClick={handleAuthClick}>
              Área Clientes
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

