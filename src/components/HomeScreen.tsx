import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Flame, BarChart3, ChevronRight, Dumbbell, History } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HomeScreen = ({ onStartWorkout }: { onStartWorkout: (type: 'Push' | 'Pull' | 'Legs') => void }) => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [weeklyVolume, setWeeklyVolume] = useState(0);
  const [recentWorkouts, setRecentWorkouts] = useState<ReturnType<typeof storage.getWorkoutHistory>>([]);

  useEffect(() => {
    setStreak(storage.getStreak());
    setWeeklyVolume(storage.getWeeklyVolume());
    setRecentWorkouts(storage.getWorkoutHistory().slice(0, 5));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  const RoutineCard = ({ name, exercises, color }: { name: string; exercises: string[]; color: string }) => (
    <button
      onClick={() => onStartWorkout(name as 'Push' | 'Pull' | 'Legs')}
      className={`w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform mb-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{name} Routine</h3>
            <p className="text-sm text-gray-500">{exercises.length} exercises</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-primary-600 pt-safe-top pb-8">
        <div className="px-5 pt-12 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">Workout Tracker</h1>
            <p className="text-primary-100 mt-1">Let's crush your goals today</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <History className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="px-5 flex gap-3">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="text-2xl font-bold text-white">{streak}</span>
            </div>
            <p className="text-sm text-primary-100">day streak</p>
          </div>

          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-green-300" />
              <span className="text-2xl font-bold text-white">{weeklyVolume.toLocaleString()}</span>
            </div>
            <p className="text-sm text-primary-100">kg this week</p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Quick Start</h2>
          <p className="text-gray-500 text-sm mb-5">Choose your routine to begin</p>

          <RoutineCard 
            name="Push" 
            exercises={['Bench Press', 'OHP', 'Incline', 'Triceps', 'Lateral Raise']}
            color="bg-blue-500"
          />
          <RoutineCard 
            name="Pull" 
            exercises={['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Face Pull', 'Curl']}
            color="bg-purple-500"
          />
          <RoutineCard 
            name="Legs" 
            exercises={['Squat', 'RDL', 'Leg Press', 'Leg Curl', 'Calf Raise']}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900">Recent Workouts</h2>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-primary-600 font-medium"
          >
            See all
          </button>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            <Dumbbell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No workouts yet. Start your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <div 
                key={workout.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{workout.routineName}</p>
                    <p className="text-sm text-gray-500">{formatDate(workout.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatDuration(workout.durationSeconds)}</p>
                  <p className="text-xs text-gray-500">{workout.totalWeight.toLocaleString()} kg</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
