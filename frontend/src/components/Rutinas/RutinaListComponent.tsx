import { useState, useEffect } from 'react';
import { rutinaService, Rutina, Ejercicio } from '../../services/rutinaService';
import { useAuth } from '../../context/AuthContext';
import './RutinaList.css';

export function RutinaList() {
  const { usuario } = useAuth();

  // --- Rutinas ---
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Formulario nueva rutina ---
  const [showForm, setShowForm] = useState(false);
  const [formRutina, setFormRutina] = useState({ nombre: '', descripcion: '' });
  const [savingRutina, setSavingRutina] = useState(false);

  // --- Edición rutina ---
  const [editingRutina, setEditingRutina] = useState<Rutina | null>(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '' });

  // --- Rutina expandida (ejercicios) ---
  const [expandedRutinaId, setExpandedRutinaId] = useState<string | null>(null);
  const [ejercicios, setEjercicios] = useState<Record<string, Ejercicio[]>>({});
  const [loadingEj, setLoadingEj] = useState<string | null>(null);

  // --- Formulario nuevo ejercicio ---
  const [showEjForm, setShowEjForm] = useState<string | null>(null);
  const [ejForm, setEjForm] = useState<Omit<Ejercicio, 'id' | 'rutinaId'>>({
    nombreEjercicio: '', series: 3, repeticiones: 10, peso: 0, descansoSegundos: 60,
  });
  const [savingEj, setSavingEj] = useState(false);

  // --- Edición ejercicio ---
  const [editingEj, setEditingEj] = useState<Ejercicio | null>(null);
  const [editEjForm, setEditEjForm] = useState<Omit<Ejercicio, 'id' | 'rutinaId'>>({
    nombreEjercicio: '', series: 3, repeticiones: 10, peso: 0, descansoSegundos: 60,
  });

  useEffect(() => {
    if (usuario?.id) fetchRutinas();
  }, [usuario?.id]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // =========== RUTINAS ===========
  const fetchRutinas = async () => {
    if (!usuario?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await rutinaService.listByUsuarioId(usuario.id);
      setRutinas(data);
    } catch (err) {
      setError('Error cargando rutinas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearRutina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id || !formRutina.nombre.trim()) return;
    setSavingRutina(true);
    try {
      const nueva = await rutinaService.create({
        usuarioId: usuario.id,
        nombre: formRutina.nombre,
        descripcion: formRutina.descripcion,
      });
      setRutinas(prev => [...prev, nueva]);
      setFormRutina({ nombre: '', descripcion: '' });
      setShowForm(false);
      showSuccess('Rutina creada con éxito');
    } catch (err) {
      setError('Error creando rutina.');
    } finally {
      setSavingRutina(false);
    }
  };

  const handleEliminarRutina = async (rutinaId: string) => {
    if (!confirm('¿Eliminar esta rutina? Esta acción no se puede deshacer.')) return;
    try {
      await rutinaService.delete(rutinaId);
      setRutinas(prev => prev.filter(r => r.id !== rutinaId));
      if (expandedRutinaId === rutinaId) setExpandedRutinaId(null);
      showSuccess('Rutina eliminada');
    } catch (err) {
      setError('Error eliminando rutina.');
    }
  };

  const handleStartEdit = (rutina: Rutina) => {
    setEditingRutina(rutina);
    setEditForm({ nombre: rutina.nombre, descripcion: rutina.descripcion });
  };

  const handleGuardarEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRutina?.id) return;
    setSavingRutina(true);
    try {
      const updated = await rutinaService.update(editingRutina.id, {
        ...editingRutina,
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
      });
      setRutinas(prev => prev.map(r => r.id === updated.id ? updated : r));
      setEditingRutina(null);
      showSuccess('Rutina actualizada');
    } catch (err) {
      setError('Error actualizando rutina.');
    } finally {
      setSavingRutina(false);
    }
  };

  // =========== EJERCICIOS ===========
  const handleToggleEjercicios = async (rutinaId: string) => {
    if (expandedRutinaId === rutinaId) {
      setExpandedRutinaId(null);
      return;
    }
    setExpandedRutinaId(rutinaId);
    if (!ejercicios[rutinaId]) {
      setLoadingEj(rutinaId);
      try {
        const data = await rutinaService.getEjercicios(rutinaId);
        setEjercicios(prev => ({ ...prev, [rutinaId]: data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEj(null);
      }
    }
  };

  const handleAgregarEjercicio = async (e: React.FormEvent, rutinaId: string) => {
    e.preventDefault();
    if (!ejForm.nombreEjercicio.trim()) return;
    setSavingEj(true);
    try {
      const nuevo = await rutinaService.addEjercicio(rutinaId, ejForm as Ejercicio);
      setEjercicios(prev => ({
        ...prev,
        [rutinaId]: [...(prev[rutinaId] || []), nuevo],
      }));
      setEjForm({ nombreEjercicio: '', series: 3, repeticiones: 10, peso: 0, descansoSegundos: 60 });
      setShowEjForm(null);
      showSuccess('Ejercicio añadido');
    } catch (err) {
      setError('Error añadiendo ejercicio.');
    } finally {
      setSavingEj(false);
    }
  };

  const handleEliminarEjercicio = async (ejercicioId: string, rutinaId: string) => {
    if (!confirm('¿Eliminar este ejercicio?')) return;
    try {
      await rutinaService.deleteEjercicio(ejercicioId);
      setEjercicios(prev => ({
        ...prev,
        [rutinaId]: prev[rutinaId].filter(e => e.id !== ejercicioId),
      }));
    } catch (err) {
      setError('Error eliminando ejercicio.');
    }
  };

  const handleStartEditEj = (ej: Ejercicio) => {
    setEditingEj(ej);
    setEditEjForm({
      nombreEjercicio: ej.nombreEjercicio,
      series: ej.series,
      repeticiones: ej.repeticiones,
      peso: ej.peso,
      descansoSegundos: ej.descansoSegundos,
    });
  };

  const handleGuardarEditEj = async (e: React.FormEvent, rutinaId: string) => {
    e.preventDefault();
    if (!editingEj?.id) return;
    setSavingEj(true);
    try {
      const updated = await rutinaService.updateEjercicio(editingEj.id, editEjForm as Ejercicio);
      setEjercicios(prev => ({
        ...prev,
        [rutinaId]: prev[rutinaId].map(e => e.id === updated.id ? updated : e),
      }));
      setEditingEj(null);
      showSuccess('Ejercicio actualizado');
    } catch (err) {
      setError('Error actualizando ejercicio.');
    } finally {
      setSavingEj(false);
    }
  };

  if (loading) return <div className="loading">Cargando rutinas...</div>;

  return (
    <div className="rutina-list">
      <div className="list-header">
        <div>
          <h2>Mis Rutinas</h2>
          <p className="list-subtitle">Crea y gestiona tus rutinas de entrenamiento</p>
        </div>
        <button className="btn-nueva-rutina" onClick={() => { setShowForm(!showForm); setEditingRutina(null); }}>
          {showForm ? 'Cerrar' : '+ Nueva Rutina'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {/* Formulario nueva rutina */}
      {showForm && !editingRutina && (
        <div className="rutina-form-panel">
          <h3>Nueva Rutina</h3>
          <form onSubmit={handleCrearRutina} className="rutina-form">
            <div className="form-row">
              <label>Nombre *</label>
              <input
                type="text"
                value={formRutina.nombre}
                onChange={e => setFormRutina({ ...formRutina, nombre: e.target.value })}
                placeholder="Ej: Rutina de fuerza"
                required
              />
            </div>
            <div className="form-row">
              <label>Descripción</label>
              <input
                type="text"
                value={formRutina.descripcion}
                onChange={e => setFormRutina({ ...formRutina, descripcion: e.target.value })}
                placeholder="Describe tu rutina"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={savingRutina}>
                {savingRutina ? 'Guardando...' : 'Crear Rutina'}
              </button>
              <button type="button" className="btn-cancel-form" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal edición rutina */}
      {editingRutina && (
        <div className="rutina-form-panel editing">
          <h3>Editar Rutina</h3>
          <form onSubmit={handleGuardarEdit} className="rutina-form">
            <div className="form-row">
              <label>Nombre *</label>
              <input
                type="text"
                value={editForm.nombre}
                onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <label>Descripción</label>
              <input
                type="text"
                value={editForm.descripcion}
                onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={savingRutina}>
                {savingRutina ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" className="btn-cancel-form" onClick={() => setEditingRutina(null)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {rutinas.length === 0 ? (
        <div className="empty-state">
          <p>Todavía no tienes rutinas. ¡Crea tu primera rutina!</p>
        </div>
      ) : (
        <div className="rutinas-grid">
          {rutinas.map(rutina => (
            <div key={rutina.id} className="rutina-card">
              <div className="rutina-card-header">
                <div className="rutina-title-area">
                  <h3>{rutina.nombre}</h3>
                  {rutina.activa !== undefined && (
                    <span className={`badge-activa ${rutina.activa ? 'activa' : 'inactiva'}`}>
                      {rutina.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  )}
                </div>
                <div className="rutina-actions">
                  <button className="btn-edit-rutina" onClick={() => handleStartEdit(rutina)} title="Editar">Editar</button>
                  <button className="btn-delete-rutina" onClick={() => handleEliminarRutina(rutina.id!)} title="Eliminar">Eliminar</button>
                </div>
              </div>

              {rutina.descripcion && <p className="rutina-desc">{rutina.descripcion}</p>}

              <button
                className="btn-toggle-ejercicios"
                onClick={() => handleToggleEjercicios(rutina.id!)}
              >
                {expandedRutinaId === rutina.id ? 'Ocultar ejercicios' : 'Ver ejercicios'}
              </button>

              {expandedRutinaId === rutina.id && (
                <div className="ejercicios-panel">
                  {loadingEj === rutina.id ? (
                    <p className="loading-text">Cargando ejercicios...</p>
                  ) : (
                    <>
                      {(ejercicios[rutina.id!] || []).length === 0 ? (
                        <p className="empty-ejercicios">Sin ejercicios todavía.</p>
                      ) : (
                        <div className="ejercicios-list">
                          {(ejercicios[rutina.id!] || []).map(ej => (
                            <div key={ej.id} className="ejercicio-item">
                              {editingEj?.id === ej.id ? (
                                <form onSubmit={e => handleGuardarEditEj(e, rutina.id!)} className="ej-edit-form">
                                  <input
                                    value={editEjForm.nombreEjercicio}
                                    onChange={e => setEditEjForm({ ...editEjForm, nombreEjercicio: e.target.value })}
                                    placeholder="Nombre"
                                    required
                                  />
                                  <div className="ej-nums">
                                    <label>Series<input type="number" min={1} value={editEjForm.series} onChange={e => setEditEjForm({ ...editEjForm, series: +e.target.value })} /></label>
                                    <label>Reps<input type="number" min={1} value={editEjForm.repeticiones} onChange={e => setEditEjForm({ ...editEjForm, repeticiones: +e.target.value })} /></label>
                                    <label>Peso(kg)<input type="number" min={0} step={0.5} value={editEjForm.peso} onChange={e => setEditEjForm({ ...editEjForm, peso: +e.target.value })} /></label>
                                    <label>Desc(s)<input type="number" min={0} value={editEjForm.descansoSegundos} onChange={e => setEditEjForm({ ...editEjForm, descansoSegundos: +e.target.value })} /></label>
                                  </div>
                                  <div className="ej-form-btns">
                                     <button type="submit" className="btn-save-ej" disabled={savingEj}>{savingEj ? '...' : 'Guardar'}</button>
                                     <button type="button" className="btn-cancel-form" onClick={() => setEditingEj(null)}>Cancelar</button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <div className="ej-info">
                                    <span className="ej-nombre">{ej.nombreEjercicio}</span>
                                    <div className="ej-stats">
                                      <span>{ej.series} series</span>
                                      <span>{ej.repeticiones} reps</span>
                                      {ej.peso > 0 && <span>{ej.peso} kg</span>}
                                      <span>{ej.descansoSegundos}s desc.</span>
                                    </div>
                                  </div>
                                  <div className="ej-actions">
                                    <button className="btn-edit-ej" onClick={() => handleStartEditEj(ej)} title="Editar">Editar</button>
                                    <button className="btn-delete-ej" onClick={() => handleEliminarEjercicio(ej.id!, rutina.id!)} title="Eliminar">Eliminar</button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulario añadir ejercicio */}
                      {showEjForm === rutina.id ? (
                        <form onSubmit={e => handleAgregarEjercicio(e, rutina.id!)} className="ej-add-form">
                          <input
                            value={ejForm.nombreEjercicio}
                            onChange={e => setEjForm({ ...ejForm, nombreEjercicio: e.target.value })}
                            placeholder="Nombre del ejercicio *"
                            required
                          />
                          <div className="ej-nums">
                            <label>Series<input type="number" min={1} value={ejForm.series} onChange={e => setEjForm({ ...ejForm, series: +e.target.value })} /></label>
                            <label>Reps<input type="number" min={1} value={ejForm.repeticiones} onChange={e => setEjForm({ ...ejForm, repeticiones: +e.target.value })} /></label>
                            <label>Peso(kg)<input type="number" min={0} step={0.5} value={ejForm.peso} onChange={e => setEjForm({ ...ejForm, peso: +e.target.value })} /></label>
                            <label>Desc(s)<input type="number" min={0} value={ejForm.descansoSegundos} onChange={e => setEjForm({ ...ejForm, descansoSegundos: +e.target.value })} /></label>
                          </div>
                          <div className="ej-form-btns">
                            <button type="submit" className="btn-save-ej" disabled={savingEj}>
                              {savingEj ? 'Guardando...' : 'Añadir'}
                            </button>
                            <button type="button" className="btn-cancel-form" onClick={() => setShowEjForm(null)}>Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <button className="btn-add-ejercicio" onClick={() => setShowEjForm(rutina.id!)}>
                          + Añadir Ejercicio
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

