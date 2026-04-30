import { useState, useEffect } from 'react';
import { claseService, Clase, enrichClaseWithHorario } from '../../services/claseService';
import { ClaseForm } from './ClaseForm';
import './ClaseList.css';

function formatFecha(fechaStr: string): string {
  const date = new Date(fechaStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GestionClases() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Clase | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

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

  const handleCrear = async (data: Clase) => {
    try {
      const nueva = await claseService.create(data);
      setClases(prev => [...prev, enrichClaseWithHorario(nueva)]);
      setShowForm(false);
      setSuccessMsg('Clase creada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al crear la clase';
      setError(msg);
      console.error(err);
    }
  };

   const handleEditar = async (data: Clase) => {
     if (!editando?.id) return;
     try {
       const actualizada = await claseService.update(editando.id, data);
       setClases(prev => prev.map(c => c.id === editando.id ? enrichClaseWithHorario(actualizada) : c));
       setEditando(null);
       setSuccessMsg('Clase actualizada con éxito');
       setTimeout(() => setSuccessMsg(null), 4000);
     } catch (err: any) {
       const msg = err?.response?.data?.message || 'Error al actualizar la clase';
       setError(msg);
       console.error(err);
     }
   };

  const handleEliminar = async (clase: Clase) => {
    if (!clase.id) return;
    if (!confirm(`¿Eliminar la clase "${clase.nombre}"? Esta acción no se puede deshacer.`)) return;
    setEliminando(clase.id);
    setError(null);
    try {
      await claseService.delete(clase.id);
      setClases(prev => prev.filter(c => c.id !== clase.id));
      setSuccessMsg('Clase eliminada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || null;
      setError(msg ? String(msg) : 'Error al eliminar la clase. Inténtalo de nuevo.');
    } finally {
      setEliminando(null);
    }
  };

  if (loading) {
    return <div className="loading">Cargando clases...</div>;
  }

  return (
    <div className="clase-list">
      <div className="list-header">
        <div>
          <h2>Gestión de Clases</h2>
          <p className="list-subtitle">Administra las clases del gimnasio</p>
        </div>
        <button
          className="btn-nueva-clase"
          onClick={() => { setShowForm(true); setEditando(null); }}
        >
          + Nueva Clase
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {(showForm || editando) && (
        <div className="form-container">
          <ClaseForm
            clase={editando || undefined}
            onSubmit={editando ? handleEditar : handleCrear}
            onCancel={() => { setShowForm(false); setEditando(null); }}
          />
        </div>
      )}

      {clases.length === 0 ? (
        <div className="empty-state">
          <p>No hay clases. Crea la primera clase usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="clases-grid">
          {clases.map((clase) => (
            <div key={clase.id} className="clase-card manager-card">
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

              <div className="card-actions card-actions-manager">
                <button
                   className="btn-editar"
                   onClick={() => { setEditando(clase); setShowForm(false); }}
                 >
                   Editar
                 </button>
                 <button
                   className="btn-eliminar"
                   onClick={() => handleEliminar(clase)}
                   disabled={eliminando === clase.id}
                 >
                   {eliminando === clase.id ? 'Eliminando...' : 'Eliminar'}
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

