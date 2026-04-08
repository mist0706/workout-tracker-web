import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from './components/WorkoutCompleteScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { useWorkout } from './hooks/useWorkout';
import type { CompletedWorkout } from './types';

function App() {
  const {
    currentWorkout,
    elapsedSeconds,
    startWorkout,
    toggleSetComplete,
    updateExercise,
    finishWorkout,
    cancelWorkout,
  } = useWorkout();

  const handleStartWorkout = (routine: 'Push' | 'Pull' | 'Legs') => {
    startWorkout(routine);
  };

  const handleCompleteWorkout = (): CompletedWorkout | null => {
    return completeWorkout();
  };

  const completedWorkout = currentWorkout?.isCompleted
    ? ({
        ...currentWorkout,
        durationSeconds: elapsedSeconds,
        completedAt: new Date().toISOString(),
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
                elapsedSeconds={elapsedSeconds}
                onToggleSet={toggleSetComplete}
                onUpdateExercise={updateExercise}
                onComplete={handleCompleteWorkout}
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
              <WorkoutCompleteScreen workout={completedWorkout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/history" element={<HistoryScreen />} />
      </Routes>
    </div>
  );
}

export default App;