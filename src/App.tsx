import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from './components/WorkoutCompleteScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { useWorkout } from './hooks/useWorkout';
import type { CompletedWorkout } from './types';

function App() {
  const navigate = useNavigate();
  const {
    currentWorkout,
    elapsedSeconds,
    formattedTime,
    startWorkout,
    toggleSetComplete,
    updateExercise,
    updateExerciseSets,
    updateExerciseReps,
    finishWorkout,
    cancelWorkout,
  } = useWorkout();

  const handleStartWorkout = (routine: 'Push' | 'Pull' | 'Legs') => {
    startWorkout(routine);
  };

  const handleCompleteWorkout = (): CompletedWorkout | null => {
    return finishWorkout();
  };

  const totalWeight = currentWorkout?.isCompleted
    ? currentWorkout.exercises.reduce((total: number, ex: { sets: { isCompleted: boolean }[]; weight: number }) => {
        const completedSets = ex.sets.filter(s => s.isCompleted).length;
        return total + (completedSets * ex.weight * 5);
      }, 0)
    : 0;

  const completedWorkout = currentWorkout?.isCompleted
    ? ({
        ...currentWorkout,
        date: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
        totalWeight,
      } as CompletedWorkout)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={
            currentWorkout && !currentWorkout.isCompleted ? (
              <Navigate to="/workout" replace />
            ) : (
              <HomeScreen onStartWorkout={handleStartWorkout} />
            )
          }
        />
        <Route
          path="/workout"
          element={
            currentWorkout ? (
              <ActiveWorkoutScreen
                workout={currentWorkout}
                elapsedTime={formattedTime}
                onToggleSet={toggleSetComplete}
                onUpdateExercise={updateExercise}
                onUpdateSets={updateExerciseSets}
                onUpdateReps={updateExerciseReps}
                onFinish={handleCompleteWorkout}
                onCancel={cancelWorkout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/complete"
          element={
            completedWorkout ? (
              <WorkoutCompleteScreen workout={completedWorkout} onBack={() => navigate('/')} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/history" element={<HistoryScreen onBack={() => navigate('/')} />} />
      </Routes>
    </div>
  );
}

export default App;