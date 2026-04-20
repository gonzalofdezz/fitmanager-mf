import React, { useState } from 'react';
import MemberList from '../components/members/MemberList';
import MemberForm from '../components/members/MemberForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { mockMembers } from '../data/mockData';
import { Member } from '../types';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (data: Omit<Member, 'id' | 'assignedRoutine'>) => {
    const newMember: Member = { ...data, id: String(Date.now()) };
    setMembers((prev) => [...prev, newMember]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Members</h1>
          <p>Manage gym members and their memberships.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Member</Button>
      </div>

      <MemberList members={members} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Member"
      >
        <MemberForm
          onSubmit={handleAdd}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default MembersPage;
