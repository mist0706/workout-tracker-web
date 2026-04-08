import type { ExerciseState } from '../types';
import { Check } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseState;
  onToggleSet: (setNumber: number) => void;
  onEdit: () => void;
}

export const ExerciseCard = ({ exercise, onToggleSet, onEdit }: ExerciseCardProps) => {
  const completedSets = exercise.sets.filter(s => s.isCompleted).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* Header */}
      <div 
        className="px-5 py-4 flex justify-between items-center cursor-pointer active:scale-[0.99] transition-transform"
        onClick={onEdit}
      >
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{exercise.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {exercise.weight} kg × {exercise.sets[0]?.targetReps || 5} reps
          </p>
        </div>
        <div className="text-right">
          <span className="text-primary-600 font-semibold text-lg">
            {completedSets}/{exercise.sets.length}
          </span>
        </div>
      </div>

      {/* Sets */}
      <div className="px-5 pb-5">
        <div className="flex flex-wrap gap-3">
          {exercise.sets.map((set) => (
            <button
              key={set.setNumber}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSet(set.setNumber);
              }}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-200 active:scale-95
                ${set.isCompleted 
                  ? 'bg-success-500 text-white shadow-md' 
                  : 'bg-white border-2 border-gray-300 text-gray-400 hover:border-gray-400'}
              `}
            >
              {set.isCompleted ? (
                <Check className="w-5 h-5" strokeWidth={3} />
              ) : (
                set.targetReps
              )}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-success-500 transition-all duration-300"
            style={{ width: `${(completedSets / exercise.sets.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
