import React from 'react';
import { Member } from '../../types';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="exercise-card" data-testid="member-card">
      <div className="exercise-card-header">
        <h3>{member.name}</h3>
        <span className={`badge badge-${member.isActive ? 'active' : 'inactive'}`}>
          {member.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <p className="exercise-description">{member.email}</p>
      <div className="exercise-meta">
        <span className="meta-tag">📅 {member.joinDate}</span>
        <span className={`badge badge-${member.membershipType}`}>{member.membershipType}</span>
      </div>
    </div>
  );
};

export default MemberCard;
