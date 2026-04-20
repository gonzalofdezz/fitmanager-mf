import React, { useState } from 'react';
import { Exercise } from '../../types';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
}

const muscleGroups = ['All', 'Legs', 'Chest', 'Back', 'Shoulders', 'Core'];

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [selectedGroup, setSelectedGroup] = useState('All');

  const filtered =
    selectedGroup === 'All'
      ? exercises
      : exercises.filter((e) => e.muscleGroup === selectedGroup);

  return (
    <div>
      <div className="filter-bar" data-testid="filter-bar">
        {muscleGroups.map((group) => (
          <button
            key={group}
            className={`filter-btn${selectedGroup === group ? ' active' : ''}`}
            onClick={() => setSelectedGroup(group)}
          >
            {group}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No exercises found for this muscle group.</p>
        </div>
      ) : (
        <div className="cards-grid" data-testid="exercise-grid">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
