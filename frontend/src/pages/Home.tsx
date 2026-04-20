import { useState } from 'react';
import { AthleteForm } from '../components/AthleteForm';
import { AthleteList } from '../components/AthleteList';
import './Home.css';

export function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAthleteCreated = () => {
    // Regenera el componente AthleteList para refrescar la lista
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="home">
      <div className="container">
        <AthleteForm onAthletCreated={handleAthleteCreated} />
        <AthleteList key={refreshKey} />
      </div>
    </div>
  );
}
