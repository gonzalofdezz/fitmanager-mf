import { useState } from 'react';
import { Suscripcion } from '../../services/suscripcionService';
import { useAuth } from '../../context/AuthContext';
import './SuscripcionForm.css';

interface SuscripcionFormProps {
  suscripcion?: Suscripcion;
  onSubmit: (data: Suscripcion) => Promise<void>;
  onCancel: () => void;
}

export function SuscripcionForm({ suscripcion, onSubmit, onCancel }: SuscripcionFormProps) {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({
    usuarioId: usuario?.id || '',
    tipoPlan: suscripcion?.tipoPlan || 'PREMIUM',
    fechaInicio: (suscripcion?.fechaInicio || new Date().toISOString()).toString().split('T')[0],
    fechaFin: (suscripcion?.fechaFin || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()).toString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        tipoPlan: formData.tipoPlan as 'BASICA' | 'PREMIUM' | 'VIP',
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
    { value: 'BASICA', label: 'Básico - €9.99 (30 días)', dias: 30 },
    { value: 'PREMIUM', label: 'Premium - €19.99 (60 días)', dias: 60 },
    { value: 'VIP', label: 'VIP - €29.99 (90 días)', dias: 90 },
  ];

  const planActual = planes.find(p => p.value === formData.tipoPlan);

  return (
    <form className="suscripcion-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{suscripcion ? 'Editar Suscripción' : 'Nueva Suscripción'}</h3>
        <button type="button" className="btn-close" onClick={onCancel}>
          ✕
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

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
            disabled
            readOnly
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
          {loading ? 'Guardando...' : 'Crear Suscripción'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

