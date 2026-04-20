export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  imageUrl?: string;
}

export interface RoutineExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  restTime: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: RoutineExercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  membershipType: 'basic' | 'premium' | 'vip';
  isActive: boolean;
  assignedRoutine?: Routine;
}
