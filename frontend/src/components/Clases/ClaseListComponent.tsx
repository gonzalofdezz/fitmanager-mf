import { useState, useEffect } from 'react';
import { claseService, Clase } from '../../services/claseService';
import { suscripcionService } from '../../services/suscripcionService';
import { useAuth } from '../../context/AuthContext';
import { ClaseForm } from './ClaseForm';
import './ClaseList.css';

export function ClaseList() {
  const { usuario } = useAuth();
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClase, setEditingClase] = useState<Clase | null>(null);
  const [planUsuario, setPlanUsuario] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    fetchClases();
    if (usuario?.id) {
      fetchPlanUsuario();
    }
  }, [usuario?.id]);

  const fetchPlanUsuario = async () => {
    if (!usuario?.id) return;
    setLoadingPlan(true);
    try {
      const suscripciones = await suscripcionService.listByUsuarioId(usuario.id);
      if (suscripciones.length > 0) {
        setPlanUsuario(suscripciones[0].tipoPlan);
      }
    } catch (err) {
      console.error('Error cargando plan:', err);
    } finally {
      setLoadingPlan(false);
    }
  };

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

  const canEditClases = planUsuario === 'PREMIUM' || planUsuario === 'VIP';

  const handleCreate = async (claseData: Clase) => {
    try {
      await claseService.create(claseData);
      setShowForm(false);
      await fetchClases();
    } catch (err) {
      setError('Error creando clase');
      console.error(err);
    }
  };

  const handleUpdate = async (claseData: Clase) => {
    if (!editingClase?.id) return;
    try {
      await claseService.update(editingClase.id, claseData);
      setEditingClase(null);
      setShowForm(false);
      await fetchClases();
    } catch (err) {
      setError('Error actualizando clase');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase?')) return;
    try {
      setClases(clases.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando clases...</div>;
  }

  return (
    <div className="clase-list">
      <div className="list-header">
        <h2>Gestión de Clases</h2>
        {!canEditClases && !loadingPlan && (
          <div className="plan-required">
            ⚠️ Se requiere plan PREMIUM o VIP para crear clases
          </div>
        )}
        <button
          className={`btn-primary ${!canEditClases ? 'disabled' : ''}`}
          onClick={() => setShowForm(true)}
          disabled={!canEditClases}
          title={!canEditClases ? 'Necesitas un plan PREMIUM o VIP' : 'Crear nueva clase'}
        >
          ➕ Nueva Clase
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && canEditClases && (
        <ClaseForm
          clase={editingClase || undefined}
          onSubmit={editingClase ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingClase(null);
          }}
        />
      )}

      {clases.length === 0 ? (
        <div className="empty-state">
          <p>📚 No hay clases registradas aún</p>
          {canEditClases && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Crear la primera clase
            </button>
          )}
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
                <div className="info-item">
                  <span className="info-label">Duración</span>
                  <span className="info-value">{clase.duracionMinutos} min</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Capacidad</span>
                  <span className="info-value">{clase.capacidadPorDefecto} personas</span>
                </div>
              </div>

              {canEditClases && (
                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditingClase(clase);
                      setShowForm(true);
                    }}
                  >
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(clase.id!)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

