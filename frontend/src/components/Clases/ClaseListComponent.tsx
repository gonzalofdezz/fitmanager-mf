import { useState, useEffect } from 'react';
import { claseService, Clase } from '../../services/claseService';
import { reservaService, Reserva } from '../../services/reservaService';
import { useAuth } from '../../context/AuthContext';
import './ClaseList.css';

function formatFecha(fechaStr: string): string {
  const date = new Date(fechaStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ClaseList() {
  const { usuario } = useAuth();
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservando, setReservando] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [misReservas, setMisReservas] = useState<Reserva[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [showMisReservas, setShowMisReservas] = useState(false);
  const [cancelando, setCancelando] = useState<string | null>(null);

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await claseService.getAll();
      setClases(data);
    } catch (err) {
      setError('Error cargando clases. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMisReservas = async () => {
    if (!usuario?.id) return;
    setLoadingReservas(true);
    try {
      const data = await reservaService.listByUsuarioId(usuario.id);
      setMisReservas(data);
    } catch (err) {
      console.error('Error cargando reservas:', err);
    } finally {
      setLoadingReservas(false);
    }
  };

  const handleToggleMisReservas = () => {
    if (!showMisReservas) {
      fetchMisReservas();
    }
    setShowMisReservas(!showMisReservas);
  };

  const handleReservar = async (claseId: number) => {
    if (!usuario?.id) return;
    setReservando(claseId);
    setError(null);
    setSuccessMsg(null);
    try {
      await reservaService.create({
        usuarioId: usuario.id,
        claseId,
        fechaReserva: new Date().toISOString(),
      });
      setSuccessMsg('✅ ¡Reserva realizada con éxito!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError('Error al realizar la reserva. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setReservando(null);
    }
  };

  const handleCancelarReserva = async (reservaId: string) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    setCancelando(reservaId);
    try {
      await reservaService.delete(reservaId);
      setMisReservas(prev => prev.filter(r => r.id !== reservaId));
    } catch (err) {
      console.error('Error cancelando reserva:', err);
    } finally {
      setCancelando(null);
    }
  };

  const getClaseNombre = (claseId: number) => {
    const clase = clases.find(c => c.id === claseId);
    return clase?.nombre || `Clase #${claseId}`;
  };

  if (loading) {
    return <div className="loading">Cargando clases...</div>;
  }

  return (
    <div className="clase-list">
      <div className="list-header">
        <h2>Clases del Gimnasio</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p className="list-subtitle">Selecciona una clase y reserva tu plaza</p>
          <button
            className="btn-mis-reservas"
            onClick={handleToggleMisReservas}
          >
            📋 Mis Reservas {misReservas.length > 0 && !showMisReservas ? `(${misReservas.length})` : ''}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {showMisReservas && (
        <div className="mis-reservas-panel">
          <h3>📋 Mis Reservas</h3>
          {loadingReservas ? (
            <p className="loading-text">Cargando tus reservas...</p>
          ) : misReservas.length === 0 ? (
            <p className="empty-reservas">No tienes ninguna reserva activa.</p>
          ) : (
            <div className="reservas-list">
              {misReservas.map(reserva => (
                <div key={reserva.id} className="reserva-item">
                  <div className="reserva-info">
                    <span className="reserva-nombre">{getClaseNombre(reserva.claseId)}</span>
                    <span className="reserva-fecha">
                      {reserva.fechaReserva
                        ? new Date(reserva.fechaReserva.toString()).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })
                        : '—'}
                    </span>
                    {reserva.estado && (
                      <span className={`reserva-estado estado-${reserva.estado.toLowerCase()}`}>
                        {reserva.estado}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn-cancelar-reserva"
                    onClick={() => handleCancelarReserva(reserva.id!)}
                    disabled={cancelando === reserva.id}
                  >
                    {cancelando === reserva.id ? '⏳' : '✕ Cancelar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {clases.length === 0 ? (
        <div className="empty-state">
          <p>📚 No hay clases disponibles en este momento</p>
        </div>
      ) : (
        <div className="clases-grid">
          {clases.map((clase) => (
            <div key={clase.id} className="clase-card">
              <div className="card-header">
                <h3>{clase.nombre}</h3>
                <span className={`badge nivel-${clase.nivel?.toLowerCase()}`}>
                  {clase.nivel}
                </span>
              </div>

              <p className="card-description">{clase.descripcion}</p>

              <div className="card-info">
                {clase.fechaEspecifica && (
                  <div className="info-item info-date-highlight">
                    <span className="info-label">📆 Fecha</span>
                    <span className="info-value">{formatFecha(clase.fechaEspecifica)}</span>
                  </div>
                )}
                {clase.diaSemana && (
                  <div className="info-item">
                    <span className="info-label">📅 Día</span>
                    <span className="info-value info-day">{clase.diaSemana}</span>
                  </div>
                )}
                {clase.horaInicio && (
                  <div className="info-item">
                    <span className="info-label">🕐 Hora</span>
                    <span className="info-value">{clase.horaInicio}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">⏱ Duración</span>
                  <span className="info-value">{clase.duracionMinutos} min</span>
                </div>
                <div className="info-item">
                  <span className="info-label">👥 Capacidad</span>
                  <span className="info-value">{clase.capacidadPorDefecto} personas</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-reservar"
                  onClick={() => handleReservar(clase.id!)}
                  disabled={reservando === clase.id}
                >
                  {reservando === clase.id ? '⏳ Reservando...' : '📅 Reservar Plaza'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
