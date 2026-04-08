import type { CompletedWorkout, WorkoutSession, RoutineDefaults, ExerciseDefaults } from '../types';

const STORAGE_KEYS = {
  CURRENT_WORKOUT: 'workout_tracker_current',
  WORKOUT_HISTORY: 'workout_tracker_history',
  STREAK: 'workout_tracker_streak',
  LAST_WORKOUT_DATE: 'workout_tracker_last_date',
  EXERCISE_DEFAULTS: 'workout_tracker_defaults',
};

export const storage = {
  // Current workout session
  saveCurrentWorkout: (workout: WorkoutSession): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
    } catch (e) {
      console.error('Failed to save current workout:', e);
    }
  },

  getCurrentWorkout: (): WorkoutSession | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get current workout:', e);
      return null;
    }
  },

  clearCurrentWorkout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
  },

  // Workout history
  getWorkoutHistory: (): CompletedWorkout[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get workout history:', e);
      return [];
    }
  },

  addWorkoutToHistory: (workout: CompletedWorkout): void => {
    try {
      const history = storage.getWorkoutHistory();
      history.unshift(workout); // Add to beginning
      localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to add workout to history:', e);
    }
  },

  // Streak tracking
  getStreak: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      return data ? parseInt(data, 10) : 0;
    } catch (e) {
      return 0;
    }
  },

  getLastWorkoutDate: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.LAST_WORKOUT_DATE);
  },

  updateStreak: (): number => {
    const today = new Date().toDateString();
    const lastDate = storage.getLastWorkoutDate();
    
    if (lastDate === today) {
      return storage.getStreak();
    }
    
    const lastDateObj = lastDate ? new Date(lastDate) : null;
    const todayObj = new Date();
    const yesterday = new Date(todayObj);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let streak = storage.getStreak();
    
    if (lastDateObj && lastDateObj.toDateString() === yesterday.toDateString()) {
      streak += 1;
    } else if (!lastDateObj || lastDateObj.toDateString() !== today) {
      streak = 1;
    }
    
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_WORKOUT_DATE, today);
    
    return streak;
  },

  // Calculate total volume from history
  getWeeklyVolume: (): number => {
    const history = storage.getWorkoutHistory();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return history
      .filter(w => new Date(w.date) >= weekAgo)
      .reduce((total, workout) => total + workout.totalWeight, 0);
  },

  // Clear all data (for testing)
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Exercise defaults (persist last used values)
  getExerciseDefaults: (routineName: string): RoutineDefaults => {
    try {
      const key = `${STORAGE_KEYS.EXERCISE_DEFAULTS}_${routineName}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to get exercise defaults:', e);
      return {};
    }
  },

  saveExerciseDefaults: (routineName: string, exerciseName: string, defaults: Omit<ExerciseDefaults, 'lastUsed'>): void => {
    try {
      const key = `${STORAGE_KEYS.EXERCISE_DEFAULTS}_${routineName}`;
      const existing = storage.getExerciseDefaults(routineName);
      
      existing[exerciseName] = {
        ...defaults,
        lastUsed: new Date().toISOString(),
      };
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save exercise defaults:', e);
    }
  },

  // Save workout defaults from a completed workout
  saveWorkoutDefaults: (routineName: string, exercises: WorkoutSession['exercises']): void => {
    try {
      const key = `${STORAGE_KEYS.EXERCISE_DEFAULTS}_${routineName}`;
      const existing = storage.getExerciseDefaults(routineName);
      
      exercises.forEach(ex => {
        existing[ex.name] = {
          weight: ex.weight,
          sets: ex.sets.length,
          reps: ex.sets[0]?.targetReps || 5,
          lastUsed: new Date().toISOString(),
        };
      });
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save workout defaults:', e);
    }
  },
};
