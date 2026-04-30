import { useState } from 'react';
import { Reserva } from '../../services/reservaService';
import { Clase } from '../../services/claseService';
import { Usuario } from '../../types/Usuario';
import '../Clases/ClaseForm.css';

interface GestionReservaFormProps {
  reserva?: Reserva;
  onSubmit: (data: Reserva) => Promise<void>;
  onCancel: () => void;
  clases: Clase[];
  usuarios: Usuario[];
}

export function GestionReservaForm({ reserva, onSubmit, onCancel, clases, usuarios }: GestionReservaFormProps) {
  const [formData, setFormData] = useState({
    usuarioId: reserva?.usuarioId || '',
    claseId: reserva?.claseId?.toString() || '',
    fechaReserva: reserva?.fechaReserva ? new Date(reserva.fechaReserva).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    estado: reserva?.estado || 'RESERVADA',
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
      const dataToSubmit: Reserva = {
        usuarioId: formData.usuarioId,
        claseId: parseInt(formData.claseId, 10),
        fechaReserva: formData.fechaReserva,
        estado: formData.estado as 'RESERVADA' | 'ASISTIDA' | 'CANCELADA',
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError('Error guardando la reserva');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="clase-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{reserva ? 'Editar Reserva' : 'Nueva Reserva'}</h3>
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
          disabled={!!reserva}
        >
          <option value="">-- Selecciona un usuario --</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre} ({usuario.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="claseId">Clase</label>
        <select
          id="claseId"
          name="claseId"
          value={formData.claseId}
          onChange={handleChange}
          required
          disabled={!!reserva}
        >
          <option value="">-- Selecciona una clase --</option>
          {clases.map(clase => (
            <option key={clase.id} value={clase.id}>
              {clase.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaReserva">Fecha Reserva</label>
          <input
            type="date"
            id="fechaReserva"
            name="fechaReserva"
            value={formData.fechaReserva}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="RESERVADA">Reservada</option>
            <option value="ASISTIDA">Asistida</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading || !!reserva}>
          {loading ? 'Guardando...' : 'Crear Reserva'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}



