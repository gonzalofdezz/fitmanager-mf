import React from 'react';
import { Routine } from '../../types';

interface RoutineCardProps {
  routine: Routine;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ routine }) => {
  return (
    <div className="routine-card" data-testid="routine-card">
      <div className="routine-card-header">
        <h3>{routine.name}</h3>
        <span className={`badge badge-${routine.difficulty}`}>{routine.difficulty}</span>
      </div>
      <p className="routine-description">{routine.description}</p>
      <div className="routine-stats">
        <span className="routine-stat">⏱️ {routine.duration} min</span>
        <span className="routine-stat">📅 {routine.createdAt}</span>
      </div>
      <div className="routine-exercises-title">Exercises ({routine.exercises.length})</div>
      {routine.exercises.map((re, idx) => (
        <div key={idx} className="routine-exercise-item">
          <span className="routine-exercise-name">{re.exercise.name}</span>
          <span className="routine-exercise-details">
            {re.sets}×{re.reps} · {re.restTime}s rest
          </span>
        </div>
      ))}
    </div>
  );
};

export default RoutineCard;
