import { useState, useEffect } from 'react';
import { reservaService, Reserva } from '../../services/reservaService';
import { claseService, Clase } from '../../services/claseService';
import { usuarioService } from '../../services/usuarioService';
import { Usuario } from '../../types/Usuario';
import { GestionReservaForm } from './GestionReservaForm';
import '../Clases/ClaseList.css';

function formatFecha(fechaStr: string | Date): string {
  const fecha = typeof fechaStr === 'string' ? new Date(fechaStr) : fechaStr;
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GestionReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Reserva | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clasesData, usuariosData] = await Promise.all([
        claseService.getAll(),
        usuarioService.getAll(),
      ]);
      setClases(clasesData);
      setUsuarios(usuariosData);

      // Obtener reservas de todos los usuarios
      const todasReservas: Reserva[] = [];
      for (const usuario of usuariosData) {
        try {
          const reservasUsuario = await reservaService.listByUsuarioId(usuario.id);
          todasReservas.push(...reservasUsuario);
        } catch {
          // Usuario sin reservas
        }
      }
      setReservas(todasReservas);
    } catch (err) {
      setError('Error cargando reservas. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (data: Reserva) => {
    try {
      const nueva = await reservaService.create(data);
      setReservas(prev => [...prev, nueva]);
      setShowForm(false);
      setSuccessMsg('Reserva creada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al crear la reserva';
      setError(msg);
      console.error(err);
    }
  };

  const handleEliminar = async (reserva: Reserva) => {
    if (!reserva.id) return;
    const usuario = usuarios.find(u => u.id === reserva.usuarioId);
    const clase = clases.find(c => c.id === reserva.claseId);
    if (!confirm(`¿Eliminar la reserva del usuario "${usuario?.nombre}" para la clase "${clase?.nombre}"? Esta acción no se puede deshacer.`)) return;
    setEliminando(reserva.id);
    setError(null);
    try {
      await reservaService.delete(reserva.id);
      setReservas(prev => prev.filter(r => r.id !== reserva.id));
      setSuccessMsg('Reserva eliminada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || null;
      setError(msg ? String(msg) : 'Error al eliminar la reserva. Inténtalo de nuevo.');
    } finally {
      setEliminando(null);
    }
  };

  if (loading) {
    return <div className="loading">Cargando reservas...</div>;
  }

  const getNombreUsuario = (usuarioId: string) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nombre : 'Usuario desconocido';
  };

  const getNombreClase = (claseId: number) => {
    const clase = clases.find(c => c.id === claseId);
    return clase ? clase.nombre : 'Clase desconocida';
  };

  return (
    <div className="clase-list">
      <div className="list-header">
        <div>
          <h2>Gestión de Reservas</h2>
          <p className="list-subtitle">Administra las reservas de aulas</p>
        </div>
        <button
          className="btn-nueva-clase"
          onClick={() => { setShowForm(true); setEditando(null); }}
        >
          + Nueva Reserva
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {(showForm || editando) && (
        <div className="form-container">
          <GestionReservaForm
            reserva={editando || undefined}
            onSubmit={handleCrear}
            onCancel={() => { setShowForm(false); setEditando(null); }}
            clases={clases}
            usuarios={usuarios}
          />
        </div>
      )}

      {reservas.length === 0 ? (
        <div className="empty-state">
          <p>No hay reservas. Crea la primera reserva usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="clases-grid">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="clase-card manager-card">
              <div className="card-header">
                <h3>{getNombreClase(reserva.claseId)}</h3>
                <span className={`badge nivel-${reserva.estado?.toLowerCase()}`}>
                  {reserva.estado || 'RESERVADA'}
                </span>
              </div>

              <div className="card-info">
                <div className="info-item">
                  <span className="info-label">Usuario</span>
                  <span className="info-value">{getNombreUsuario(reserva.usuarioId)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Clase</span>
                  <span className="info-value">{reserva.claseId}</span>
                </div>
                {reserva.fechaReserva && (
                  <div className="info-item info-date-highlight">
                    <span className="info-label">Fecha</span>
                    <span className="info-value">{formatFecha(reserva.fechaReserva)}</span>
                  </div>
                )}
              </div>

              <div className="card-actions card-actions-manager">
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(reserva)}
                  disabled={eliminando === reserva.id}
                >
                  {eliminando === reserva.id ? 'Eliminando...' : 'Cancelar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


