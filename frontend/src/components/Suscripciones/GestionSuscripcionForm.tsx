import { useState, useEffect } from 'react';
import { Suscripcion } from '../../services/suscripcionService';
import { usuarioService } from '../../services/usuarioService';
import { Usuario } from '../../types/Usuario';
import './SuscripcionForm.css';

interface GestionSuscripcionFormProps {
  suscripcion?: Suscripcion;
  onSubmit: (data: Suscripcion) => Promise<void>;
  onCancel: () => void;
  usuariosMap: Record<string, string>;
}

export function GestionSuscripcionForm({ suscripcion, onSubmit, onCancel }: GestionSuscripcionFormProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState({
    usuarioId: suscripcion?.usuarioId || '',
    tipoPlan: suscripcion?.tipoPlan || 'PREMIUM',
    fechaInicio: (suscripcion?.fechaInicio ? new Date(suscripcion.fechaInicio).toISOString() : new Date().toISOString()).split('T')[0],
    fechaFin: (suscripcion?.fechaFin ? new Date(suscripcion.fechaFin).toISOString() : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()).split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (err) {
      console.error('Error fetching usuarios:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSubmit: Suscripcion = {
        usuarioId: formData.usuarioId,
        tipoPlan: formData.tipoPlan as 'BASICA' | 'PREMIUM' | 'VIP' | 'NINGUNA',
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError('Error guardando la suscripción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const planes = [
    { value: 'BASICA', label: 'Básico - €9.99', dias: 30 },
    { value: 'PREMIUM', label: 'Premium - €19.99', dias: 60 },
    { value: 'VIP', label: 'VIP - €29.99', dias: 90 },
    { value: 'NINGUNA', label: 'Ninguna', dias: 0 },
  ];

  const planActual = planes.find(p => p.value === formData.tipoPlan);

  return (
    <form className="suscripcion-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{suscripcion ? 'Editar Plan' : 'Nuevo Plan'}</h3>
        <button type="button" className="btn-close" onClick={onCancel}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="usuarioId">Usuario</label>
        <select
          id="usuarioId"
          name="usuarioId"
          value={formData.usuarioId}
          onChange={handleChange}
          required
          disabled={!!suscripcion}
        >
          <option value="">-- Selecciona un usuario --</option>
           {usuarios.map(usuario => (
             <option key={usuario.id} value={usuario.id}>
               {usuario.nombre} ({usuario.id})
             </option>
           ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tipoPlan">Plan</label>
        <select
          id="tipoPlan"
          name="tipoPlan"
          value={formData.tipoPlan}
          onChange={handleChange}
          required
        >
          {planes.map(plan => (
            <option key={plan.value} value={plan.value}>
              {plan.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha Inicio</label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaFin">Fecha Fin</label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="plan-details">
        <p>
          <strong>Plan seleccionado:</strong> {formData.tipoPlan}
        </p>
        <p>
          <strong>Duración:</strong> {planActual?.dias} días
        </p>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : suscripcion ? 'Actualizar Plan' : 'Crear Plan'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}


