import { useState, useEffect, useCallback, useRef } from 'react';
import type { WorkoutSession, ExerciseState, SetState, CompletedWorkout, PPLRoutine } from '../types';
import { createExerciseSets, generateId, PPL_ROUTINES } from '../types';
import { storage } from '../utils/storage';

const DEFAULT_SETS = 5;
const DEFAULT_REPS = 5;

export const useWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Load saved workout on mount
  useEffect(() => {
    const saved = storage.getCurrentWorkout();
    if (saved && !saved.isCompleted) {
      setCurrentWorkout(saved);
      const elapsed = Math.floor((Date.now() - new Date(saved.startTime).getTime()) / 1000);
      setElapsedSeconds(Math.max(0, elapsed));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentWorkout && !currentWorkout.isCompleted) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const newElapsed = prev + 1;
          if (currentWorkout) {
            const updated = { ...currentWorkout, durationSeconds: newElapsed };
            storage.saveCurrentWorkout(updated);
          }
          return newElapsed;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentWorkout?.isCompleted]);

  const startWorkout = useCallback((routineType: PPLRoutine = 'Push') => {
    const routine = PPL_ROUTINES.find(r => r.name === routineType);
    if (!routine) return;

    const exercises: ExerciseState[] = routine.exercises.map((ex) => ({
      id: generateId(),
      name: ex.name,
      weight: ex.weight,
      restSeconds: ex.restSeconds,
      sets: createExerciseSets(DEFAULT_SETS, DEFAULT_REPS),
    }));

    const newWorkout: WorkoutSession = {
      id: generateId(),
      routineName: routine.name,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises,
      isCompleted: false,
    };

    setCurrentWorkout(newWorkout);
    setElapsedSeconds(0);
    storage.saveCurrentWorkout(newWorkout);
  }, []);

  const toggleSetComplete = useCallback((exerciseId: string, setNumber: number) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      const updated: WorkoutSession = {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;

          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.setNumber !== setNumber) return set;
              return {
                ...set,
                isCompleted: !set.isCompleted,
                completedReps: !set.isCompleted ? set.targetReps : undefined,
              };
            }),
          };
        }),
      };

      storage.saveCurrentWorkout(updated);
      return updated;
    });
  }, []);

  const updateExercise = useCallback((exerciseId: string, updates: Partial<ExerciseState>) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      const updated: WorkoutSession = {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return { ...ex, ...updates };
        }),
      };

      storage.saveCurrentWorkout(updated);
      return updated;
    });
  }, []);

  const updateExerciseSets = useCallback((exerciseId: string, numSets: number) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      const updated: WorkoutSession = {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;

          const currentSets = ex.sets;
          let newSets: SetState[];

          if (numSets > currentSets.length) {
            // Add sets
            newSets = [
              ...currentSets,
              ...createExerciseSets(numSets - currentSets.length, currentSets[0]?.targetReps || DEFAULT_REPS),
            ];
          } else {
            // Remove sets
            newSets = currentSets.slice(0, numSets);
          }

          return { ...ex, sets: newSets };
        }),
      };

      storage.saveCurrentWorkout(updated);
      return updated;
    });
  }, []);

  const updateExerciseReps = useCallback((exerciseId: string, reps: number) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      const updated: WorkoutSession = {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;

          return {
            ...ex,
            sets: ex.sets.map(set => ({ ...set, targetReps: reps })),
          };
        }),
      };

      storage.saveCurrentWorkout(updated);
      return updated;
    });
  }, []);

  const finishWorkout = useCallback((): CompletedWorkout | null => {
    if (!currentWorkout) return null;

    const totalWeight = currentWorkout.exercises.reduce((total, ex) => {
      const completedSets = ex.sets.filter(s => s.isCompleted).length;
      return total + (ex.weight * completedSets * (ex.sets[0]?.targetReps || 0));
    }, 0);

    const completedWorkout: CompletedWorkout = {
      id: currentWorkout.id,
      routineName: currentWorkout.routineName,
      date: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalWeight,
      exercises: currentWorkout.exercises,
    };

    storage.addWorkoutToHistory(completedWorkout);
    storage.updateStreak();
    storage.clearCurrentWorkout();

    const finalWorkout: WorkoutSession = {
      ...currentWorkout,
      isCompleted: true,
      endTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
    };

    setCurrentWorkout(finalWorkout);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return completedWorkout;
  }, [currentWorkout, elapsedSeconds]);

  const cancelWorkout = useCallback(() => {
    storage.clearCurrentWorkout();
    setCurrentWorkout(null);
    setElapsedSeconds(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const isWorkoutActive = currentWorkout !== null && !currentWorkout.isCompleted;

  return {
    currentWorkout,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    isWorkoutActive,
    isWorkoutCompleted: currentWorkout?.isCompleted || false,
    startWorkout,
    toggleSetComplete,
    updateExercise,
    updateExerciseSets,
    updateExerciseReps,
    finishWorkout,
    cancelWorkout,
  };
};
