import React from 'react';
import { Routine } from '../../types';
import RoutineCard from './RoutineCard';

interface RoutineListProps {
  routines: Routine[];
}

const RoutineList: React.FC<RoutineListProps> = ({ routines }) => {
  if (routines.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p>No routines found.</p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
};

export default RoutineList;
