import { useState, useEffect } from 'react';
import type { ExerciseState } from '../types';
import { X, Minus, Plus } from 'lucide-react';

interface EditExerciseModalProps {
  exercise: ExerciseState;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { weight: number; sets: number; reps: number }) => void;
}

export const EditExerciseModal = ({ exercise, isOpen, onClose, onSave }: EditExerciseModalProps) => {
  const [weight, setWeight] = useState(exercise.weight);
  const [numSets, setNumSets] = useState(exercise.sets.length);
  const [reps, setReps] = useState(exercise.sets[0]?.targetReps || 5);

  // Sync state when modal opens or exercise changes
  useEffect(() => {
    if (isOpen) {
      setWeight(exercise.weight);
      setNumSets(exercise.sets.length);
      setReps(exercise.sets[0]?.targetReps || 5);
    }
  }, [isOpen, exercise.id, exercise.weight, exercise.sets.length, exercise.sets[0]?.targetReps]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ weight, sets: numSets, reps });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        {/* Handle for mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{exercise.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-5 py-6 space-y-8">
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">Weight (kg)</label>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setWeight(w => Math.max(0, w - 2.5))}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <Minus className="w-6 h-6 text-gray-600" />
              </button>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                min="0"
                step="0.5"
                className="text-4xl font-bold text-gray-900 min-w-[120px] text-center bg-transparent border-b-2 border-transparent focus:border-primary-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setWeight(w => w + 2.5)}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Sets */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">Sets</label>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setNumSets(s => Math.max(1, s - 1))}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <Minus className="w-6 h-6 text-gray-600" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={numSets}
                onChange={(e) => setNumSets(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                min="1"
                max="10"
                className="text-4xl font-bold text-gray-900 min-w-[80px] text-center bg-transparent border-b-2 border-transparent focus:border-primary-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setNumSets(s => Math.min(10, s + 1))}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Reps */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">Reps per Set</label>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setReps(r => Math.max(1, r - 1))}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <Minus className="w-6 h-6 text-gray-600" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                min="1"
                max="20"
                className="text-4xl font-bold text-gray-900 min-w-[80px] text-center bg-transparent border-b-2 border-transparent focus:border-primary-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setReps(r => Math.min(20, r + 1))}
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
