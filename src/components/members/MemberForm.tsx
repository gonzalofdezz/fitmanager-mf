import React, { useState } from 'react';
import { Member } from '../../types';
import Button from '../common/Button';

interface MemberFormProps {
  onSubmit: (member: Omit<Member, 'id' | 'assignedRoutine'>) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    membershipType: 'basic' as Member['membershipType'],
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value =
      e.target.name === 'isActive'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Join Date</label>
        <input className="form-input" type="date" name="joinDate" value={form.joinDate} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className="form-label">Membership Type</label>
        <select className="form-input" name="membershipType" value={form.membershipType} onChange={handleChange}>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Member</Button>
      </div>
    </form>
  );
};

export default MemberForm;
