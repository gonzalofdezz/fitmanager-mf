import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your fitness center.</p>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
