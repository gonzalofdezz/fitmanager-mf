import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { medicionProgresionService, MedicionProgresion } from '../../services/medicionProgresionService';
import { useAuth } from '../../context/AuthContext';
import './GraficasProgresion.css';

interface GraficasProgresionProps {
  usuarioId: string;
}

export function GraficasProgresion({ usuarioId }: GraficasProgresionProps) {
  useAuth();
  const [mediciones, setMediciones] = useState<MedicionProgresion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    peso: '',
    pesoMaximoLevantado: '',
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
  });
  const [rangoFechas, setRangoFechas] = useState({
    desde: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hasta: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (usuarioId) {
      cargarMediciones();
    }
  }, [usuarioId]);

  const cargarMediciones = async () => {
    setLoading(true);
    try {
      const datos = await medicionProgresionService.obtenerMedicionesEnRango(
        usuarioId,
        rangoFechas.desde,
        rangoFechas.hasta
      );
      setMediciones(datos);
      setError(null);
    } catch (err) {
      setError('Error al cargar mediciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarMedicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.peso && !formData.pesoMaximoLevantado) {
      setError('Ingresa al menos un dato');
      return;
    }

    try {
      await medicionProgresionService.guardarMedicion(usuarioId, {
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        pesoMaximoLevantado: formData.pesoMaximoLevantado ? parseFloat(formData.pesoMaximoLevantado) : undefined,
        fecha: formData.fecha,
        notas: formData.notas || undefined,
      });
      setFormData({
        peso: '',
        pesoMaximoLevantado: '',
        fecha: new Date().toISOString().split('T')[0],
        notas: '',
      });
      setMostrarFormulario(false);
      setError(null);
      await cargarMediciones();
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('Tu sesión es inválida. Por favor, cierra sesión y vuelve a iniciar.');
      } else {
        setError('Error al guardar medición');
      }
      console.error(err);
    }
  };

  const handleCambiarRango = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRangoFechas((prev) => ({ ...prev, [name]: value }));
  };

  const handleAplicarRango = () => {
    cargarMediciones();
  };

  // Preparar datos para gráfico
  const datosGrafico = mediciones.map((m) => ({
    fecha: new Date(m.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    peso: m.peso,
    pesoMax: m.pesoMaximoLevantado,
  }));

  return (
    <div className="graficas-progresion">
      <div className="graficas-header">
        <h3>📊 Tus Gráficas de Progresión</h3>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* SELECTOR DE RANGO */}
      <div className="rango-selector">
        <label>
          Desde:
          <input
            type="date"
            name="desde"
            value={rangoFechas.desde}
            onChange={handleCambiarRango}
          />
        </label>
        <label>
          Hasta:
          <input
            type="date"
            name="hasta"
            value={rangoFechas.hasta}
            onChange={handleCambiarRango}
          />
        </label>
        <button className="btn-rango" onClick={handleAplicarRango} disabled={loading}>
          {loading ? 'Cargando...' : 'Aplicar'}
        </button>
      </div>

      {/* GRÁFICO */}
      {datosGrafico.length > 0 ? (
        <div className="grafico-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.1)" />
              <XAxis
                dataKey="fecha"
                stroke="#696969"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#696969" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  background: '#1c1c1c',
                  border: '1.5px solid #f97316',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
                }}
                labelStyle={{ color: '#f0f0f0', fontWeight: 'bold' }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '16px',
                  fontSize: '12px',
                  color: '#a0a0a0',
                }}
              />
              {mediciones.some((m) => m.peso) && (
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Peso (kg)"
                />
              )}
              {mediciones.some((m) => m.pesoMaximoLevantado) && (
                <Line
                  type="monotone"
                  dataKey="pesoMax"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ fill: '#ea580c', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Peso Máx (kg)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grafico-container">
          <div className="sin-datos">
            <p>No hay datos para mostrar. ¡Registra tu primera medición!</p>
          </div>
        </div>
      )}

      {/* FORMULARIO NUEVA MEDICIÓN */}
      <div className="nueva-medicion-form">
        {!mostrarFormulario ? (
          <button
            className="btn-guardar-medicion"
            onClick={() => setMostrarFormulario(true)}
          >
            + Registrar Nueva Medición
          </button>
        ) : (
          <form onSubmit={handleGuardarMedicion}>
            <h4>Nueva Medición</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 75.5"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Peso Máximo Levantado (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 100.0"
                  value={formData.pesoMaximoLevantado}
                  onChange={(e) => setFormData({ ...formData, pesoMaximoLevantado: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Notas (opcional)</label>
              <textarea
                placeholder="Añade notas sobre tu entrenamiento..."
                rows={2}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-guardar-medicion">
                Guardar Medición
              </button>
              <button
                type="button"
                className="btn-cancelar-medicion"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

