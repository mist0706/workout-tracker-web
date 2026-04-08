import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { CompletedWorkout } from '../types';
import { Dumbbell, Clock, ChevronLeft, Calendar, TrendingUp, Trash2 } from 'lucide-react';

export const HistoryScreen = ({ onBack }: { onBack: () => void }) => {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  useEffect(() => {
    setWorkouts(storage.getWorkoutHistory());
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    localStorage.setItem('workout_tracker_history', JSON.stringify(updated));
    setSelectedWorkout(null);
  };

  // Group workouts by month
  const groupedWorkouts: Record<string, CompletedWorkout[]> = {};
  workouts.forEach(workout => {
    const date = new Date(workout.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groupedWorkouts[monthKey]) {
      groupedWorkouts[monthKey] = [];
    }
    groupedWorkouts[monthKey].push(workout);
  });

  const monthKeys = Object.keys(groupedWorkouts).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Workout History</h1>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-5 py-4">
        <div className="bg-primary-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">All Time Stats</span>
            </div>
            <span className="text-primary-100 text-sm">{workouts.length} workouts</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">
                {workouts.reduce((sum, w) => sum + w.totalWeight, 0).toLocaleString()} kg
              </p>
              <p className="text-primary-100 text-sm">Total Volume</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.floor(workouts.reduce((sum, w) => sum + w.durationSeconds, 0) / 60)}m
              </p>
              <p className="text-primary-100 text-sm">Total Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="px-5 pb-8">
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No workouts yet</h3>
            <p className="text-gray-500">Start your first workout to see history here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {monthKeys.map(monthKey => {
              const [year, month] = monthKey.split('-');
              const monthName = new Date(parseInt(year), parseInt(month)).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              });
              
              return (
                <div key={monthKey}>
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sticky top-[73px] bg-gray-50 py-2">
                    {monthName}
                  </h2>
                  <div className="space-y-3">
                    {groupedWorkouts[monthKey].map(workout => (
                      <button
                        key={workout.id}
                        onClick={() => setSelectedWorkout(workout)}
                        className="w-full bg-white rounded-xl p-4 shadow-sm text-left active:scale-[0.99] transition-transform"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                              <Dumbbell className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{workout.routineName}</p>
                              <p className="text-sm text-gray-500">{formatDateShort(workout.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{workout.totalWeight.toLocaleString()} kg</p>
                            <div className="flex items-center justify-end gap-1 text-sm text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDuration(workout.durationSeconds)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div 
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedWorkout.routineName}</h2>
                <button
                  onClick={() => deleteWorkout(selectedWorkout.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedWorkout.date)}
              </p>
            </div>

            {/* Summary */}
            <div className="px-5 py-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-gray-900">{selectedWorkout.totalWeight.toLocaleString()} kg</p>
                <p className="text-sm text-gray-500">Total Volume</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-gray-900">{formatDuration(selectedWorkout.durationSeconds)}</p>
                <p className="text-sm text-gray-500">Duration</p>
              </div>
            </div>

            {/* Exercises */}
            <div className="px-5 pb-6">
              <h3 className="font-bold text-gray-900 mb-3">Exercises</h3>
              <div className="space-y-2">
                {selectedWorkout.exercises
                  .filter(ex => ex.sets.some(s => s.isCompleted))
                  .map(exercise => {
                    const completedSets = exercise.sets.filter(s => s.isCompleted).length;
                    const totalReps = exercise.sets
                      .filter(s => s.isCompleted)
                      .reduce((sum, s) => sum + (s.completedReps || s.targetReps), 0);
                    
                    return (
                      <div 
                        key={exercise.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{exercise.name}</p>
                          <p className="text-sm text-gray-500">{exercise.weight} kg × {completedSets} sets</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success-600">
                            {completedSets}/{exercise.sets.length}
                          </p>
                          <p className="text-xs text-gray-400">{totalReps} reps</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Close Button */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setSelectedWorkout(null)}
                className="w-full py-3.5 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
