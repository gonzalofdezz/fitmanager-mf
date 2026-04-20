import React from 'react';
import { Member } from '../../types';

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <div className="table-container" data-testid="member-table">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Join Date</th>
            <th>Membership</th>
            <th>Status</th>
            <th>Routine</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="member-name">{member.name}</div>
              </td>
              <td className="member-email">{member.email}</td>
              <td>{member.phone}</td>
              <td>{member.joinDate}</td>
              <td>
                <span className={`badge badge-${member.membershipType}`}>
                  {member.membershipType}
                </span>
              </td>
              <td>
                <span className={`badge badge-${member.isActive ? 'active' : 'inactive'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{member.assignedRoutine?.name ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
