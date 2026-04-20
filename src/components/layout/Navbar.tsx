import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">💪</span>
        <span>FitManager</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-avatar">A</div>
      </div>
    </nav>
  );
};

export default Navbar;
