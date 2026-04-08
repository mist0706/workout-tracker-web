export interface SetState {
  setNumber: number;
  targetReps: number;
  completedReps?: number;
  isCompleted: boolean;
}

export interface ExerciseState {
  id: string;
  name: string;
  weight: number;
  sets: SetState[];
  restSeconds: number;
}

export interface WorkoutSession {
  id: string;
  routineName: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  exercises: ExerciseState[];
  isCompleted: boolean;
}

export interface CompletedWorkout {
  id: string;
  routineName: string;
  date: string;
  durationSeconds: number;
  totalWeight: number;
  exercises: ExerciseState[];
}

export type PPLRoutine = 'Push' | 'Pull' | 'Legs';

export interface PPLWorkout {
  name: PPLRoutine;
  exercises: Omit<ExerciseState, 'id' | 'sets'>[];
}

export const PPL_ROUTINES: PPLWorkout[] = [
  {
    name: 'Push',
    exercises: [
      { name: 'Bench Press', weight: 135, restSeconds: 180 },
      { name: 'Overhead Press', weight: 95, restSeconds: 180 },
      { name: 'Incline Press', weight: 115, restSeconds: 120 },
      { name: 'Tricep Extension', weight: 35, restSeconds: 90 },
      { name: 'Lateral Raise', weight: 20, restSeconds: 60 },
    ],
  },
  {
    name: 'Pull',
    exercises: [
      { name: 'Deadlift', weight: 225, restSeconds: 240 },
      { name: 'Barbell Row', weight: 135, restSeconds: 180 },
      { name: 'Lat Pulldown', weight: 140, restSeconds: 120 },
      { name: 'Face Pull', weight: 50, restSeconds: 90 },
      { name: 'Barbell Curl', weight: 65, restSeconds: 90 },
    ],
  },
  {
    name: 'Legs',
    exercises: [
      { name: 'Squat', weight: 185, restSeconds: 240 },
      { name: 'Romanian Deadlift', weight: 135, restSeconds: 180 },
      { name: 'Leg Press', weight: 270, restSeconds: 180 },
      { name: 'Leg Curl', weight: 90, restSeconds: 120 },
      { name: 'Calf Raise', weight: 180, restSeconds: 90 },
    ],
  },
];

export const createExerciseSets = (numSets: number, targetReps: number): SetState[] => {
  return Array.from({ length: numSets }, (_, i) => ({
    setNumber: i + 1,
    targetReps,
    isCompleted: false,
  }));
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Last used values for an exercise
export interface ExerciseDefaults {
  weight: number;
  sets: number;
  reps: number;
  lastUsed: string; // ISO date
}

// Per-routine defaults storage
export type RoutineDefaults = Record<string, ExerciseDefaults>;
