import { useState, useEffect } from 'react';
import { suscripcionService, Suscripcion } from '../../services/suscripcionService';
import { usuarioService } from '../../services/usuarioService';
import { GestionSuscripcionForm } from './GestionSuscripcionForm';
import '../Clases/ClaseList.css';

function formatFecha(fechaStr: string | Date): string {
  const fecha = typeof fechaStr === 'string' ? new Date(fechaStr) : fechaStr;
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GestionSuscripciones() {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Suscripcion | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    fetchSuscripciones();
  }, []);

  const fetchSuscripciones = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener lista de usuarios
      const usuarios = await usuarioService.getAll();
      const mapa: Record<string, string> = {};
      usuarios.forEach(u => {
        mapa[u.id] = u.nombre || 'Usuario';
      });
      setUsuariosMap(mapa);

      // Obtener suscripciones de todos los usuarios
      const todasSuscripciones: Suscripcion[] = [];
      for (const usuario of usuarios) {
        try {
          const suscripcion = await suscripcionService.getByUsuarioId(usuario.id);
          todasSuscripciones.push(suscripcion);
        } catch {
          // Usuario sin suscripción
        }
      }
      setSuscripciones(todasSuscripciones);
    } catch (err) {
      setError('Error cargando suscripciones. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (data: Suscripcion) => {
    try {
      const nueva = await suscripcionService.create(data);
      setSuscripciones(prev => [...prev, nueva]);
      setShowForm(false);
      setSuccessMsg('Suscripción creada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al crear la suscripción';
      setError(msg);
      console.error(err);
    }
  };

  const handleEditar = async (data: Suscripcion) => {
    if (!editando?.id) return;
    try {
      const actualizada = await suscripcionService.renovar(editando.id, {
        tipoPlan: data.tipoPlan,
        fechaFin: typeof data.fechaFin === 'string' ? data.fechaFin : data.fechaFin?.toISOString().split('T')[0] || ''
      });
      setSuscripciones(prev => prev.map(s => s.id === editando.id ? actualizada : s));
      setEditando(null);
      setSuccessMsg('Suscripción actualizada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al actualizar la suscripción';
      setError(msg);
      console.error(err);
    }
  };

  const handleEliminar = async (suscripcion: Suscripcion) => {
    if (!suscripcion.id) return;
    if (!confirm(`¿Eliminar la suscripción del usuario "${usuariosMap[suscripcion.usuarioId] || 'Unknown'}"? Esta acción no se puede deshacer.`)) return;
    setEliminando(suscripcion.id);
    setError(null);
    try {
      await suscripcionService.delete(suscripcion.id);
      setSuscripciones(prev => prev.filter(s => s.id !== suscripcion.id));
      setSuccessMsg('Suscripción eliminada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || null;
      setError(msg ? String(msg) : 'Error al eliminar la suscripción. Inténtalo de nuevo.');
    } finally {
      setEliminando(null);
    }
  };

  if (loading) {
    return <div className="loading">Cargando suscripciones...</div>;
  }

  return (
    <div className="clase-list">
      <div className="list-header">
        <div>
          <h2>Gestión de Planes</h2>
          <p className="list-subtitle">Administra los planes de suscripción de los usuarios</p>
        </div>
        <button
          className="btn-nueva-clase"
          onClick={() => { setShowForm(true); setEditando(null); }}
        >
          + Nuevo Plan
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {(showForm || editando) && (
        <div className="form-container">
          <GestionSuscripcionForm
            suscripcion={editando || undefined}
            onSubmit={editando ? handleEditar : handleCrear}
            onCancel={() => { setShowForm(false); setEditando(null); }}
            usuariosMap={usuariosMap}
          />
        </div>
      )}

      {suscripciones.length === 0 ? (
        <div className="empty-state">
          <p>No hay suscripciones. Crea el primer plan usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="clases-grid">
          {suscripciones.map((suscripcion) => (
            <div key={suscripcion.id} className="clase-card manager-card">
              <div className="card-header">
                <h3>{usuariosMap[suscripcion.usuarioId] || 'Usuario'}</h3>
                <span className={`badge nivel-${suscripcion.tipoPlan?.toLowerCase()}`}>
                  {suscripcion.tipoPlan}
                </span>
              </div>

              <div className="card-info">
                <div className="info-item">
                  <span className="info-label">Usuario ID</span>
                  <span className="info-value">{suscripcion.usuarioId}</span>
                </div>
                {suscripcion.fechaInicio && (
                  <div className="info-item">
                    <span className="info-label">Inicio</span>
                    <span className="info-value">{formatFecha(suscripcion.fechaInicio)}</span>
                  </div>
                )}
                {suscripcion.fechaFin && (
                  <div className="info-item info-date-highlight">
                    <span className="info-label">Fin</span>
                    <span className="info-value">{formatFecha(suscripcion.fechaFin)}</span>
                  </div>
                )}
                {suscripcion.estado && (
                  <div className="info-item">
                    <span className="info-label">Estado</span>
                    <span className="info-value">{suscripcion.estado}</span>
                  </div>
                )}
              </div>

              <div className="card-actions card-actions-manager">
                <button
                   className="btn-editar"
                   onClick={() => { setEditando(suscripcion); setShowForm(false); }}
                 >
                   Editar
                 </button>
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(suscripcion)}
                  disabled={eliminando === suscripcion.id}
                >
                  {eliminando === suscripcion.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


