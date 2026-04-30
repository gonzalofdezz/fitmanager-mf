import { useState, useEffect } from 'react';
import { progresionService, Progresion } from '../../services/progresionService';
import { useAuth } from '../../context/AuthContext';
import { GraficasProgresion } from './GraficasProgresion';
import './Progresion.css';

export function ProgresionComponent() {
  const { usuario } = useAuth();
  const [progresion, setProgresion] = useState<Progresion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    pesoCorporal: '',
    pesoMaximoLevantado: '',
  });

  useEffect(() => {
    if (usuario?.id) {
      fetchProgresion();
    }
  }, [usuario?.id]);

  const fetchProgresion = async () => {
    if (!usuario?.id) return;
    setLoading(true);
    try {
      const data = await progresionService.obtenerPorUsuarioId(usuario.id);
      setProgresion(data);
      setFormData({
        pesoCorporal: data.pesoCorporal?.toString() || '',
        pesoMaximoLevantado: data.pesoMaximoLevantado?.toString() || '',
      });
    } catch (err) {
      // Si no existe, crear una nueva
      try {
        const nueva = await progresionService.crear(usuario.id);
        setProgresion(nueva);
      } catch (createErr) {
        setError('Error cargando progresión');
        console.error(createErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id || !progresion) return;

    try {
      const actualizada = await progresionService.actualizar(usuario.id, {
        pesoCorporal: formData.pesoCorporal ? parseFloat(formData.pesoCorporal) : undefined,
        pesoMaximoLevantado: formData.pesoMaximoLevantado ? parseFloat(formData.pesoMaximoLevantado) : undefined,
      });
      setProgresion(actualizada);
      setEditando(false);
    } catch (err) {
      setError('Error actualizando progresión');
      console.error(err);
    }
  };

  const handleCompletarEntrenamiento = async () => {
    if (!usuario?.id) return;
    try {
      await progresionService.completarEntrenamiento(usuario.id);
      fetchProgresion();
    } catch (err) {
      setError('Error completando entrenamiento');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="progresion-container">Cargando progresión...</div>;
  }

  if (!progresion) {
    return <div className="progresion-container">Progresión no disponible</div>;
  }

  return (
    <div className="progresion-container">
      <div className="progresion-header">
        <h2>Mi Progresión</h2>
        <p>Sigue tu avance en el gimnasio</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="progresion-stats">
        <div className="stat-card">
          <span className="stat-label">Entrenamientos</span>
          <span className="stat-value">{progresion.entrenamientosCompletados}</span>
          <button
            className="btn-complete"
            onClick={handleCompletarEntrenamiento}
            title="Marcar entrenamiento completado"
          >
            + Completar
          </button>
        </div>

        <div className="stat-card">
          <span className="stat-label">Racha de Asistencias</span>
          <span className="stat-value">{progresion.rachaAsistencias} días</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Peso Corporal</span>
          <span className="stat-value">{progresion.pesoCorporal ? `${progresion.pesoCorporal} kg` : 'No registrado'}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Peso Máximo Levantado</span>
          <span className="stat-value">{progresion.pesoMaximoLevantado ? `${progresion.pesoMaximoLevantado} kg` : 'No registrado'}</span>
        </div>
      </div>

      {!editando ? (
        <button className="btn-editar" onClick={() => setEditando(true)}>
          Editar Datos
        </button>
      ) : (
        <form onSubmit={handleActualizar} className="progresion-form">
          <div className="form-group">
            <label>Peso Corporal (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pesoCorporal}
              onChange={(e) => setFormData({ ...formData, pesoCorporal: e.target.value })}
              placeholder="Ej: 75.5"
            />
          </div>

          <div className="form-group">
            <label>Peso Máximo Levantado (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pesoMaximoLevantado}
              onChange={(e) => setFormData({ ...formData, pesoMaximoLevantado: e.target.value })}
              placeholder="Ej: 100.0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* NUEVO: COMPONENTE DE GRÁFICAS */}
      {usuario?.id && <GraficasProgresion usuarioId={usuario.id} />}
    </div>
  );
}

