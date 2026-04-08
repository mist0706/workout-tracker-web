import { useEffect, useState } from 'react';
import { Trophy, X, Dumbbell, Clock, Flame } from 'lucide-react';
import type { CompletedWorkout } from '../types';

interface WorkoutSummaryModalProps {
  workout: CompletedWorkout;
  isOpen: boolean;
  onClose: () => void;
  onViewHistory: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "Crushed it! Your future self is already thanking you!",
  "Strength doesn't come from what you can do. It comes from overcoming what you couldn't.",
  "Every rep is a step closer to your goal!",
  "The only bad workout is the one you didn't do.",
  "Pain is weakness leaving the body!",
  "Your only limit is you!",
  "Discipline equals freedom!",
  "Beast mode activated!",
  "One more! Just kidding, you're done for today!",
  "You're not just building muscle, you're building character!",
  "The iron never lies!",
  "Sweat is just fat crying!",
  "Stronger than yesterday!",
  "Progress, not perfection!",
  "You're a force of nature!",
];

export const WorkoutSummaryModal = ({ 
  workout, 
  isOpen, 
  onClose,
  onViewHistory 
}: WorkoutSummaryModalProps) => {
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  
  useEffect(() => {
    // Pick random quote on open
    if (isOpen) {
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.isCompleted).length, 
    0
  );
  const totalVolume = workout.exercises.reduce((sum, ex) => {
    const exVolume = ex.sets
      .filter(s => s.isCompleted)
      .reduce((sSum, s) => sSum + (ex.weight * (s.completedReps || s.targetReps)), 0);
    return sum + exVolume;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-success-500 to-emerald-400 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Workout Complete!</h2>
          <p className="text-white/90 mt-1 text-sm">Congratulations on finishing strong</p>
        </div>

        {/* Quote */}
        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
          <p className="text-emerald-700 text-center italic text-sm">
            "{quote}"
          </p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{Math.round(workout.durationSeconds / 60)}</p>
              <p className="text-xs text-gray-500">minutes</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Dumbbell className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{completedSets}</p>
              <p className="text-xs text-gray-500">sets done</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Flame className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{Math.round(totalVolume).toLocaleString()}</p>
              <p className="text-xs text-gray-500">kg volume</p>
            </div>
          </div>

          {/* Exercise Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm">Exercises Completed</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {workout.exercises.map((ex, idx) => {
                const exCompletedSets = ex.sets.filter(s => s.isCompleted).length;
                return (
                  <div key={idx} className="flex justify-between items-center text-sm py-1 px-2 bg-gray-50 rounded">
                    <span className="text-gray-700">{ex.name}</span>
                    <span className="text-success-600 font-medium">
                      {exCompletedSets}/{ex.sets.length} sets
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-success-500 hover:bg-success-600 text-white font-semibold rounded-xl transition-colors"
          >
            Continue
          </button>
          <button
            onClick={() => { onClose(); onViewHistory(); }}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            View History
          </button>
        </div>

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};