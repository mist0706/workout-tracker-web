import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkoutSession } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { EditExerciseModal } from './EditExerciseModal';

interface ActiveWorkoutScreenProps {
  workout: WorkoutSession;
  elapsedTime: string;
  onToggleSet: (exerciseId: string, setNumber: number) => void;
  onUpdateExercise: (exerciseId: string, updates: Partial<ExerciseState> & { sets?: number; reps?: number }) => void;
  onFinish: () => void;
  onCancel: () => void;
}

type ExerciseState = import('../types').ExerciseState;

export const ActiveWorkoutScreen = ({
  workout,
  elapsedTime,
  onToggleSet,
  onUpdateExercise,
  onFinish,
  onCancel,
}: ActiveWorkoutScreenProps) => {
  const navigate = useNavigate();
  const [editingExercise, setEditingExercise] = useState<ExerciseState | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const completedSets = workout.exercises.reduce((total, ex) => 
    total + ex.sets.filter(s => s.isCompleted).length, 0
  );
  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const handleSaveExercise = (updates: { weight: number; sets: number; reps: number }) => {
    if (!editingExercise) return;
    onUpdateExercise(editingExercise.id, { weight: updates.weight });
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    onCancel();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Cancel
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{workout.routineName}</h1>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-primary-600">{elapsedTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onFinish}
            disabled={completedSets === 0}
            className={`
              px-5 py-2 rounded-xl font-semibold text-sm transition-colors
              ${completedSets > 0 
                ? 'bg-success-500 text-white hover:bg-success-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            Finish
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-success-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Completed Sets Count */}
        <div className="px-5 py-2 bg-gray-50 text-center border-b border-gray-100">
          <span className="text-sm text-gray-600">
            <span className="font-bold text-success-600">{completedSets}</span> / {totalSets} sets completed
          </span>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="px-5 py-4 space-y-4">
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onToggleSet={(setNumber) => onToggleSet(exercise.id, setNumber)}
            onEdit={() => setEditingExercise(exercise)}
          />
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Workout?</h3>
            <p className="text-gray-600 mb-6">
              Your progress will not be saved. Are you sure you want to cancel?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Continue
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-red-700 bg-red-100 hover:bg-red-200"
              >
                Cancel Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditExerciseModal
        exercise={editingExercise || { 
          id: '', 
          name: '', 
          weight: 0, 
          sets: [], 
          restSeconds: 0 
        }}
        isOpen={!!editingExercise}
        onClose={() => setEditingExercise(null)}
        onSave={handleSaveExercise}
      />
    </div>
  );
};
