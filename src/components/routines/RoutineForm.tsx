import React, { useState } from 'react';
import { Routine } from '../../types';
import Button from '../common/Button';

interface RoutineFormProps {
  onSubmit: (routine: Omit<Routine, 'id' | 'createdAt' | 'exercises'>) => void;
  onCancel: () => void;
}

const RoutineForm: React.FC<RoutineFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration: 30,
    difficulty: 'beginner' as Routine['difficulty'],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.name === 'duration' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Routine Name</label>
        <input
          className="form-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Full Body Workout"
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
        />
      </div>
      <div className="form-group">
        <label className="form-label">Duration (minutes)</label>
        <input
          className="form-input"
          type="number"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          min={1}
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
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Routine</Button>
      </div>
    </form>
  );
};

export default RoutineForm;
