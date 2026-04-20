import React from 'react';
import { mockExercises, mockRoutines, mockMembers } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const totalExercises = mockExercises.length;
  const totalRoutines = mockRoutines.length;
  const activeMembers = mockMembers.filter((m) => m.isActive).length;
  const inactiveMembers = mockMembers.filter((m) => !m.isActive).length;

  const stats = [
    { label: 'Total Exercises', value: totalExercises, icon: '🏋️', color: 'blue' },
    { label: 'Total Routines', value: totalRoutines, icon: '📋', color: 'green' },
    { label: 'Active Members', value: activeMembers, icon: '✅', color: 'amber' },
    { label: 'Inactive Members', value: inactiveMembers, icon: '❌', color: 'red' },
  ];

  const recentMembers = mockMembers.slice(0, 5);

  return (
    <div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.color}`} data-testid="stat-card">
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Recent Members</div>
      <div className="activity-list">
        {recentMembers.map((member) => (
          <div key={member.id} className="activity-item">
            <div className={`activity-dot ${member.isActive ? 'green' : 'amber'}`} />
            <span className="activity-text">
              <strong>{member.name}</strong> — {member.membershipType} member
            </span>
            <span className="activity-time">
              {member.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
