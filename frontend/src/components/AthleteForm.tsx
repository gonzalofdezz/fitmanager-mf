import { useState } from 'react';
import { CreateAthleteRequest } from '../types/Athlete';
import { athleteService } from '../services/athleteService';
import './AthleteForm.css';

interface AthleteFormProps {
  onAthletCreated?: () => void;
}

export function AthleteForm({ onAthletCreated }: AthleteFormProps) {
  const [formData, setFormData] = useState<CreateAthleteRequest>({
    name: '',
    age: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await athleteService.createAthlete(formData);
      setSuccess(true);
      setFormData({ name: '', age: 0 });
      if (onAthletCreated) {
        onAthletCreated();
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error creando atleta. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="athlete-form">
      <h2>Registrar Nuevo Atleta</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">¡Atleta creado exitosamente!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del atleta"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Edad</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Edad del atleta"
            min="1"
            max="150"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Guardando...' : 'Guardar Atleta'}
        </button>
      </form>
    </div>
  );
}
