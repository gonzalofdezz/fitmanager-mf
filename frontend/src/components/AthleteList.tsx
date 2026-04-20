import { useState, useEffect } from 'react';
import { Athlete } from '../types/Athlete';
import { athleteService } from '../services/athleteService';
import './AthleteList.css';

export function AthleteList() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await athleteService.getAllAthletes();
      setAthletes(data);
    } catch (err) {
      setError('Error cargando atletas. Asegúrate de que el backend está corriendo en http://localhost:8080');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="athlete-list">
      <h2>Atletas Registrados</h2>
      {athletes.length === 0 ? (
        <p className="empty">No hay atletas registrados</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Edad</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id}>
                <td>{athlete.id}</td>
                <td>{athlete.name}</td>
                <td>{athlete.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={fetchAthletes} className="btn-refresh">
        Recargar
      </button>
    </div>
  );
}
