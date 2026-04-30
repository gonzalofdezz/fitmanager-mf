import { useState } from 'react';
import { Rutina } from '../../services/rutinaService';
import { Usuario } from '../../types/Usuario';
import '../Clases/ClaseForm.css';

interface GestionRutinaFormProps {
  rutina?: Rutina;
  onSubmit: (data: Rutina) => Promise<void>;
  onCancel: () => void;
  usuarios: Usuario[];
}

export function GestionRutinaForm({ rutina, onSubmit, onCancel, usuarios }: GestionRutinaFormProps) {
  const [formData, setFormData] = useState({
    usuarioId: rutina?.usuarioId || '',
    nombre: rutina?.nombre || '',
    descripcion: rutina?.descripcion || '',
    activa: rutina?.activa !== undefined ? rutina.activa : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSubmit: Rutina = {
        usuarioId: formData.usuarioId,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        activa: formData.activa,
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError('Error guardando la rutina');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="clase-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{rutina ? 'Editar Rutina' : 'Nueva Rutina'}</h3>
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
          disabled={!!rutina}
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
        <label htmlFor="nombre">Nombre de la Rutina</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="p.e. Rutina de Pecho, Full Body"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe la rutina..."
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="activa">
          <input
            type="checkbox"
            id="activa"
            name="activa"
            checked={formData.activa}
            onChange={handleChange}
          />
          {' '}Rutina Activa
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : rutina ? 'Actualizar Rutina' : 'Crear Rutina'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}



