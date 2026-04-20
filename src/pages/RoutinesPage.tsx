import React, { useState } from 'react';
import RoutineList from '../components/routines/RoutineList';
import RoutineForm from '../components/routines/RoutineForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { mockRoutines } from '../data/mockData';
import { Routine } from '../types';

const RoutinesPage: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>(mockRoutines);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (data: Omit<Routine, 'id' | 'createdAt' | 'exercises'>) => {
    const newRoutine: Routine = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
      exercises: [],
    };
    setRoutines((prev) => [...prev, newRoutine]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Routines</h1>
          <p>Create and manage workout routines.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Routine</Button>
      </div>

      <RoutineList routines={routines} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Routine"
      >
        <RoutineForm
          onSubmit={handleAdd}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default RoutinesPage;
