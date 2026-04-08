import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from './components/WorkoutCompleteScreen';
import { WorkoutSummaryModal } from './components/WorkoutSummaryModal';
import { HistoryScreen } from './components/HistoryScreen';
import { VersionFooter } from './components/VersionFooter';
import { useWorkout } from './hooks/useWorkout';
import type { CompletedWorkout } from './types';

function App() {
  const navigate = useNavigate();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState<CompletedWorkout | null>(null);
  
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
    setLastCompletedWorkout(null);
  };

  const handleCompleteWorkout = (): CompletedWorkout | null => {
    const completed = finishWorkout();
    if (completed) {
      setLastCompletedWorkout(completed);
      setShowSummaryModal(true);
    }
    return completed;
  };

  const handleCloseSummary = () => {
    setShowSummaryModal(false);
    setLastCompletedWorkout(null);
    navigate('/');
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
      
      {/* Workout Summary Modal - shows on finish */}
      {lastCompletedWorkout && (
        <WorkoutSummaryModal
          workout={lastCompletedWorkout}
          isOpen={showSummaryModal}
          onClose={handleCloseSummary}
          onViewHistory={() => navigate('/history')}
        />
      )}
      
      <VersionFooter />
    </div>
  );
}

export default App;