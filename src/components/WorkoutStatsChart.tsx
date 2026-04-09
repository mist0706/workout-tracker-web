import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,  // Added for line charts
  LineElement,   // Added for line charts
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { CompletedWorkout } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,  // Register point
  LineElement,   // Register line
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WorkoutStatsChartProps {
  workouts: CompletedWorkout[];
  type?: 'volume' | 'intensity' | 'frequency';
}

export const WorkoutStatsChart = ({ workouts, type = 'volume' }: WorkoutStatsChartProps) => {
  const chartData = useMemo(() => {
    if (workouts.length === 0) return null;

    // Get last 10 workouts, sorted by date
    const sortedWorkouts = [...workouts]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);

    const labels = sortedWorkouts.map(w => 
      new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    switch (type) {
      case 'volume':
        return {
          labels,
          datasets: [{
            label: 'Total Volume (kg)',
            data: sortedWorkouts.map(w => Math.round(w.totalWeight)),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          }],
        };
      
      case 'intensity':
        return {
          labels,
          datasets: sortedWorkouts[0].exercises.map((_, exIndex) => ({
            label: sortedWorkouts[sortedWorkouts.length - 1].exercises[exIndex]?.name || `Exercise ${exIndex + 1}`,
            data: sortedWorkouts.map(w => 
              w.exercises[exIndex]?.weight || 0
            ),
            backgroundColor: `rgba(${59 + exIndex * 40}, ${130 - exIndex * 20}, ${246 - exIndex * 30}, 0.6)`,
            borderColor: `rgba(${59 + exIndex * 40}, ${130 - exIndex * 20}, ${246 - exIndex * 30}, 1)`,
            borderWidth: 1,
          })),
        };

      case 'frequency':
        // Group by week
        const weekData: Record<string, number> = {};
        sortedWorkouts.forEach(w => {
          const date = new Date(w.date);
          const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          weekData[week] = (weekData[week] || 0) + 1;
        });
        return {
          labels: Object.keys(weekData),
          datasets: [{
            label: 'Workouts per Week',
            data: Object.values(weekData),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
          }],
        };
    }
  }, [workouts, type]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'intensity',
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: type === 'volume' ? 'Training Volume Over Time' : 
              type === 'intensity' ? 'Weight Progression' : 
              'Workout Frequency',
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (!chartData || workouts.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
        <p>No workout data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WorkoutStatsChart;