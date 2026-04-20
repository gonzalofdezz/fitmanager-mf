import React, { useState } from 'react';
import { Exercise } from '../../types';
import Button from '../common/Button';

interface ExerciseFormProps {
  onSubmit: (exercise: Omit<Exercise, 'id'>) => void;
  onCancel: () => void;
  initial?: Partial<Exercise>;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSubmit, onCancel, initial = {} }) => {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    description: initial.description ?? '',
    muscleGroup: initial.muscleGroup ?? '',
    difficulty: initial.difficulty ?? 'beginner' as Exercise['difficulty'],
    equipment: initial.equipment ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Exercise Name</label>
        <input
          className="form-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Barbell Squat"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the exercise..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Muscle Group</label>
        <input
          className="form-input"
          name="muscleGroup"
          value={form.muscleGroup}
          onChange={handleChange}
          required
          placeholder="e.g. Legs"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Difficulty</label>
        <select
          className="form-input"
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Equipment</label>
        <input
          className="form-input"
          name="equipment"
          value={form.equipment}
          onChange={handleChange}
          placeholder="e.g. Barbell, Dumbbells, None"
        />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Exercise</Button>
      </div>
    </form>
  );
};

export default ExerciseForm;
