import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExerciseList from '../components/exercises/ExerciseList';
import { mockExercises } from '../data/mockData';

describe('ExerciseList', () => {
  it('renders exercise cards', () => {
    render(<ExerciseList exercises={mockExercises} />);
    const cards = screen.getAllByTestId('exercise-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders filter buttons', () => {
    render(<ExerciseList exercises={mockExercises} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Legs')).toBeInTheDocument();
    expect(screen.getByText('Chest')).toBeInTheDocument();
  });

  it('filters by muscle group', () => {
    render(<ExerciseList exercises={mockExercises} />);
    const legsButton = screen.getByText('Legs');
    fireEvent.click(legsButton);
    const cards = screen.getAllByTestId('exercise-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(mockExercises.length);
  });

  it('shows empty state when no exercises match filter', () => {
    const { rerender } = render(<ExerciseList exercises={[]} />);
    rerender(<ExerciseList exercises={[]} />);
    expect(screen.getByText('No exercises found for this muscle group.')).toBeInTheDocument();
  });

  it('renders all exercises with All filter', () => {
    render(<ExerciseList exercises={mockExercises} />);
    const allButton = screen.getByText('All');
    fireEvent.click(allButton);
    const cards = screen.getAllByTestId('exercise-card');
    expect(cards).toHaveLength(mockExercises.length);
  });
});
