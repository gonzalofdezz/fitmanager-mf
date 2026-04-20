import React, { useState } from 'react';
import ExerciseList from '../components/exercises/ExerciseList';
import ExerciseForm from '../components/exercises/ExerciseForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { mockExercises } from '../data/mockData';
import { Exercise } from '../types';

const ExercisesPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (data: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = { ...data, id: String(Date.now()) };
    setExercises((prev) => [...prev, newExercise]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Exercises</h1>
          <p>Manage your exercise library.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Exercise</Button>
      </div>

      <ExerciseList exercises={exercises} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Exercise"
      >
        <ExerciseForm
          onSubmit={handleAdd}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ExercisesPage;
