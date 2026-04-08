import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CompletedWorkout } from '../types';
import { Check, Trophy, Clock, Dumbbell } from 'lucide-react';

interface WorkoutCompleteScreenProps {
  workout: CompletedWorkout;
  onBack: () => void;
}

export const WorkoutCompleteScreen = ({ workout, onBack }: WorkoutCompleteScreenProps) => {
  const navigate = useNavigate();
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    // Trigger checkmark animation
    const timer = setTimeout(() => setShowCheckmark(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  };

  const completedExercises = workout.exercises.filter(ex => 
    ex.sets.some(s => s.isCompleted)
  );

  const handleBack = () => {
    onBack();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-success-500 to-success-600 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-white">
        {/* Animated Checkmark */}
        <div className="mb-8">
          <div 
            className={`
              w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl
              transition-all duration-500 ease-out
              ${showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `}
          >
            <Check 
              className={`
                w-16 h-16 text-success-500 
                transition-all duration-500 delay-200
                ${showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
              `}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`
            text-4xl font-bold text-center mb-2
            transition-all duration-500 delay-300
            ${showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          Workout Complete!
        </h1>

        <p 
          className={`
            text-success-100 text-center mb-8
            transition-all duration-500 delay-400
            ${showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          Great job crushing your {workout.routineName} routine!
        </p>

        {/* Stats Cards */}
        <div 
          className={`
            w-full max-w-sm space-y-3
            transition-all duration-500 delay-500
            ${showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          {/* Total Weight */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-success-100 text-sm">Total Weight</p>
              <p className="text-2xl font-bold">{workout.totalWeight.toLocaleString()} kg</p>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-success-100 text-sm">Duration</p>
              <p className="text-2xl font-bold">{formatDuration(workout.durationSeconds)}</p>
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-success-100 text-sm">Exercises</p>
              <p className="text-2xl font-bold">{completedExercises.length} completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-6 bg-white/10 backdrop-blur-sm">
        <button
          onClick={handleBack}
          className="w-full py-4 bg-white text-success-600 font-bold text-lg rounded-2xl shadow-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
