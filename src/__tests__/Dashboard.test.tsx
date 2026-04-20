import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/dashboard/Dashboard';

describe('Dashboard', () => {
  it('renders stat cards', () => {
    render(<Dashboard />);
    const cards = screen.getAllByTestId('stat-card');
    expect(cards).toHaveLength(4);
  });

  it('shows Total Exercises label', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Exercises')).toBeInTheDocument();
  });

  it('shows Total Routines label', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Routines')).toBeInTheDocument();
  });

  it('shows Active Members label', () => {
    render(<Dashboard />);
    expect(screen.getByText('Active Members')).toBeInTheDocument();
  });

  it('shows Inactive Members label', () => {
    render(<Dashboard />);
    expect(screen.getByText('Inactive Members')).toBeInTheDocument();
  });
});
