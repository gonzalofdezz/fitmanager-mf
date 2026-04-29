import { useState, useEffect } from 'react';
import { claseService, Clase } from '../../services/claseService';
import { inscripcionService, Inscripcion } from '../../services/inscripcionService';
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
  const [inscribiendo, setInscribiendo] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [misInscripciones, setMisInscripciones] = useState<Inscripcion[]>([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState(false);
  const [showMisInscripciones, setShowMisInscripciones] = useState(false);
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

  const fetchMisInscripciones = async () => {
    if (!usuario?.id) return;
    setLoadingInscripciones(true);
    try {
      const data = await inscripcionService.listByUsuarioId(usuario.id);
      setMisInscripciones(data);
    } catch (err) {
      console.error('Error cargando inscripciones:', err);
    } finally {
      setLoadingInscripciones(false);
    }
  };

  const handleToggleMisInscripciones = () => {
    if (!showMisInscripciones) {
      fetchMisInscripciones();
    }
    setShowMisInscripciones(!showMisInscripciones);
  };

  const handleInscribirse = async (claseId: number) => {
    if (!usuario?.id) return;
    setInscribiendo(claseId);
    setError(null);
    setSuccessMsg(null);
    try {
      await inscripcionService.create({ usuarioId: usuario.id, claseId });
      setSuccessMsg('Te has inscrito en la clase con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
      // Actualizar inscripciones si el panel está abierto
      if (showMisInscripciones) fetchMisInscripciones();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || null;
      setError(msg ? String(msg) : 'Error al inscribirte. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setInscribiendo(null);
    }
  };

  const handleCancelarInscripcion = async (inscripcionId: string) => {
    if (!confirm('¿Cancelar esta inscripción?')) return;
    setCancelando(inscripcionId);
    try {
      await inscripcionService.delete(inscripcionId);
      setMisInscripciones(prev => prev.filter(i => i.id !== inscripcionId));
    } catch (err) {
      console.error('Error cancelando inscripción:', err);
    } finally {
      setCancelando(null);
    }
  };

  const getClaseNombre = (claseId: number) => {
    const clase = clases.find(c => c.id === claseId);
    return clase?.nombre || `Clase #${claseId}`;
  };

  const getClaseInfo = (claseId: number) => {
    return clases.find(c => c.id === claseId);
  };

  if (loading) {
    return <div className="loading">Cargando clases...</div>;
  }

  return (
    <div className="clase-list">
      <div className="list-header">
        <div>
          <h2>Clases del Gimnasio</h2>
          <p className="list-subtitle">Selecciona una clase y apúntate</p>
        </div>
        <button
          className="btn-mis-inscripciones"
          onClick={handleToggleMisInscripciones}
        >
          Mis Inscripciones {misInscripciones.length > 0 && !showMisInscripciones ? `(${misInscripciones.length})` : ''}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {showMisInscripciones && (
        <div className="mis-reservas-panel">
          <h3>Mis Inscripciones a Clases</h3>
          {loadingInscripciones ? (
            <p className="loading-text">Cargando tus inscripciones...</p>
          ) : misInscripciones.length === 0 ? (
            <p className="empty-reservas">Todavía no estás inscrito en ninguna clase.</p>
          ) : (
            <div className="reservas-list">
              {misInscripciones.map(inscripcion => {
                const claseInfo = getClaseInfo(inscripcion.claseId);
                return (
                  <div key={inscripcion.id} className="reserva-item">
                    <div className="reserva-info">
                      <span className="reserva-nombre">
                        {inscripcion.nombreClase || getClaseNombre(inscripcion.claseId)}
                      </span>
                      {claseInfo && (
                        <span className="reserva-fecha">
                          {claseInfo.diaSemana && `${claseInfo.diaSemana}`}
                          {claseInfo.horaInicio && ` · ${claseInfo.horaInicio}`}
                          {claseInfo.fechaEspecifica && ` · ${formatFecha(claseInfo.fechaEspecifica)}`}
                        </span>
                      )}
                      {inscripcion.estado && (
                        <span className={`reserva-estado estado-${inscripcion.estado.toLowerCase()}`}>
                          {inscripcion.estado}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn-cancelar-reserva"
                      onClick={() => handleCancelarInscripcion(inscripcion.id!)}
                      disabled={cancelando === inscripcion.id}
                    >
                      {cancelando === inscripcion.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {clases.length === 0 ? (
        <div className="empty-state">
          <p>No hay clases disponibles en este momento</p>
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
                    <span className="info-label">Fecha</span>
                    <span className="info-value">{formatFecha(clase.fechaEspecifica)}</span>
                  </div>
                )}
                {clase.diaSemana && (
                  <div className="info-item">
                    <span className="info-label">Día</span>
                    <span className="info-value info-day">{clase.diaSemana}</span>
                  </div>
                )}
                {clase.horaInicio && (
                  <div className="info-item">
                    <span className="info-label">Hora</span>
                    <span className="info-value">{clase.horaInicio}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Duración</span>
                  <span className="info-value">{clase.duracionMinutos} min</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Capacidad</span>
                  <span className="info-value">{clase.capacidadPorDefecto} personas</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-reservar"
                  onClick={() => handleInscribirse(clase.id!)}
                  disabled={inscribiendo === clase.id}
                >
                  {inscribiendo === clase.id ? 'Inscribiendo...' : 'Inscribirme'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
