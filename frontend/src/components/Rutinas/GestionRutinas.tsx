import { useState, useEffect } from 'react';
import { rutinaService, Rutina } from '../../services/rutinaService';
import { usuarioService } from '../../services/usuarioService';
import { Usuario } from '../../types/Usuario';
import { GestionRutinaForm } from './GestionRutinaForm';
import '../Clases/ClaseList.css';

function formatFecha(fechaStr: string | Date): string {
  const fecha = typeof fechaStr === 'string' ? new Date(fechaStr) : fechaStr;
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function GestionRutinas() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Rutina | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const usuariosData = await usuarioService.getAll();
      setUsuarios(usuariosData);

      // Obtener rutinas de todos los usuarios
      const todasRutinas: Rutina[] = [];
      for (const usuario of usuariosData) {
        try {
          const rutinasUsuario = await rutinaService.listByUsuarioId(usuario.id);
          todasRutinas.push(...rutinasUsuario);
        } catch {
          // Usuario sin rutinas
        }
      }
      setRutinas(todasRutinas);
    } catch (err) {
      setError('Error cargando rutinas. Verifica que el backend esté ejecutándose.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (data: Rutina) => {
    try {
      const nueva = await rutinaService.create(data);
      setRutinas(prev => [...prev, nueva]);
      setShowForm(false);
      setSuccessMsg('Rutina creada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al crear la rutina';
      setError(msg);
      console.error(err);
    }
  };

  const handleEditar = async (data: Rutina) => {
    if (!editando?.id) return;
    try {
      const actualizada = await rutinaService.update(editando.id, data);
      setRutinas(prev => prev.map(r => r.id === editando.id ? actualizada : r));
      setEditando(null);
      setSuccessMsg('Rutina actualizada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al actualizar la rutina';
      setError(msg);
      console.error(err);
    }
  };

  const handleEliminar = async (rutina: Rutina) => {
    if (!rutina.id) return;
    const usuario = usuarios.find(u => u.id === rutina.usuarioId);
    if (!confirm(`¿Eliminar la rutina "${rutina.nombre}" del usuario "${usuario?.nombre}"? Esta acción no se puede deshacer.`)) return;
    setEliminando(rutina.id);
    setError(null);
    try {
      await rutinaService.delete(rutina.id);
      setRutinas(prev => prev.filter(r => r.id !== rutina.id));
      setSuccessMsg('Rutina eliminada con éxito');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || null;
      setError(msg ? String(msg) : 'Error al eliminar la rutina. Inténtalo de nuevo.');
    } finally {
      setEliminando(null);
    }
  };

  if (loading) {
    return <div className="loading">Cargando rutinas...</div>;
  }

  const getNombreUsuario = (usuarioId: string) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nombre : 'Usuario desconocido';
  };

  return (
    <div className="clase-list">
      <div className="list-header">
        <div>
          <h2>Gestión de Rutinas</h2>
          <p className="list-subtitle">Administra las rutinas de entrenamiento</p>
        </div>
        <button
          className="btn-nueva-clase"
          onClick={() => { setShowForm(true); setEditando(null); }}
        >
          + Nueva Rutina
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {(showForm || editando) && (
        <div className="form-container">
          <GestionRutinaForm
            rutina={editando || undefined}
            onSubmit={editando ? handleEditar : handleCrear}
            onCancel={() => { setShowForm(false); setEditando(null); }}
            usuarios={usuarios}
          />
        </div>
      )}

      {rutinas.length === 0 ? (
        <div className="empty-state">
          <p>No hay rutinas. Crea la primera rutina usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="clases-grid">
          {rutinas.map((rutina) => (
            <div key={rutina.id} className="clase-card manager-card">
              <div className="card-header">
                <h3>{rutina.nombre}</h3>
                <span className={`badge ${rutina.activa ? 'nivel-basico' : 'nivel-intermedio'}`}>
                  {rutina.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <p className="card-description">{rutina.descripcion}</p>

              <div className="card-info">
                <div className="info-item">
                  <span className="info-label">Usuario</span>
                  <span className="info-value">{getNombreUsuario(rutina.usuarioId)}</span>
                </div>
                {rutina.fechaCreacion && (
                  <div className="info-item info-date-highlight">
                    <span className="info-label">Creación</span>
                    <span className="info-value">{formatFecha(rutina.fechaCreacion)}</span>
                  </div>
                )}
                {rutina.ejercicios && (
                  <div className="info-item">
                    <span className="info-label">Ejercicios</span>
                    <span className="info-value">{rutina.ejercicios.length}</span>
                  </div>
                )}
              </div>

              <div className="card-actions card-actions-manager">
                <button
                   className="btn-editar"
                   onClick={() => { setEditando(rutina); setShowForm(false); }}
                 >
                   Editar
                 </button>
                 <button
                   className="btn-eliminar"
                   onClick={() => handleEliminar(rutina)}
                   disabled={eliminando === rutina.id}
                 >
                   {eliminando === rutina.id ? 'Eliminando...' : 'Eliminar'}
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


