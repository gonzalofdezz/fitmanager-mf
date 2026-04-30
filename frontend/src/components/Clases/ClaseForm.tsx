import { useState } from 'react';
import { Clase } from '../../services/claseService';
import './ClaseForm.css';

interface ClaseFormProps {
  clase?: Clase;
  onSubmit: (data: Clase) => Promise<void>;
  onCancel: () => void;
}

export function ClaseForm({ clase, onSubmit, onCancel }: ClaseFormProps) {
  const [formData, setFormData] = useState<Clase>(
    clase || {
      nombre: '',
      descripcion: '',
      nivel: 'BASICO',
      duracionMinutos: 60,
      capacidadPorDefecto: 20,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('duracion') || name.includes('capacidad') ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Error guardando la clase');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="clase-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{clase ? 'Editar Clase' : 'Nueva Clase'}</h3>
        <button type="button" className="btn-close" onClick={onCancel}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="nombre">Nombre de la Clase</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="p.e. Yoga, Pilates, CrossFit"
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
          placeholder="Describe la clase..."
          rows={3}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nivel">Nivel</label>
          <select id="nivel" name="nivel" value={formData.nivel} onChange={handleChange}>
            <option value="BASICO">Básico</option>
            <option value="INTERMEDIO">Intermedio</option>
            <option value="AVANZADO">Avanzado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duracionMinutos">Duración (minutos)</label>
          <input
            type="number"
            id="duracionMinutos"
            name="duracionMinutos"
            value={formData.duracionMinutos}
            onChange={handleChange}
            min="15"
            max="180"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacidadPorDefecto">Capacidad</label>
          <input
            type="number"
            id="capacidadPorDefecto"
            name="capacidadPorDefecto"
            value={formData.capacidadPorDefecto}
            onChange={handleChange}
            min="1"
            max="100"
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : clase ? 'Actualizar Clase' : 'Crear Clase'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

