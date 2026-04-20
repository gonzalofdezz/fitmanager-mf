import React from 'react';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <div className="exercise-card" data-testid="exercise-card">
      <div className="exercise-card-header">
        <h3>{exercise.name}</h3>
        <span className={`badge badge-${exercise.difficulty}`}>
          {exercise.difficulty}
        </span>
      </div>
      <p className="exercise-description">{exercise.description}</p>
      <div className="exercise-meta">
        <span className="meta-tag">💪 {exercise.muscleGroup}</span>
        <span className="meta-tag">🔧 {exercise.equipment}</span>
      </div>
    </div>
  );
};

export default ExerciseCard;
