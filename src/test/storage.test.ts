import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storage } from '../utils/storage'
import type { CompletedWorkout, WorkoutSession } from '../types'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Current Workout', () => {
    const mockWorkout: WorkoutSession = {
      id: 'test-1',
      routineName: 'Push',
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: [],
      isCompleted: false,
    }

    it('saves and retrieves current workout', () => {
      storage.saveCurrentWorkout(mockWorkout)
      const retrieved = storage.getCurrentWorkout()
      
      expect(retrieved).toEqual(mockWorkout)
    })

    it('returns null when no current workout exists', () => {
      const retrieved = storage.getCurrentWorkout()
      expect(retrieved).toBeNull()
    })

    it('clears current workout', () => {
      storage.saveCurrentWorkout(mockWorkout)
      storage.clearCurrentWorkout()
      
      const retrieved = storage.getCurrentWorkout()
      expect(retrieved).toBeNull()
    })
  })

  describe('Workout History', () => {
    const mockCompletedWorkout: CompletedWorkout = {
      id: 'completed-1',
      routineName: 'Push',
      date: new Date().toISOString(),
      durationSeconds: 3600,
      totalWeight: 10000,
      exercises: [],
    }

    it('adds workout to history', () => {
      storage.addWorkoutToHistory(mockCompletedWorkout)
      const history = storage.getWorkoutHistory()
      
      expect(history).toHaveLength(1)
      expect(history[0]).toEqual(mockCompletedWorkout)
    })

    it('prepends new workouts to history', () => {
      const workout1 = { ...mockCompletedWorkout, id: '1' }
      const workout2 = { ...mockCompletedWorkout, id: '2' }
      
      storage.addWorkoutToHistory(workout1)
      storage.addWorkoutToHistory(workout2)
      
      const history = storage.getWorkoutHistory()
      expect(history[0].id).toBe('2')
      expect(history[1].id).toBe('1')
    })

    it('returns empty array when no history exists', () => {
      const history = storage.getWorkoutHistory()
      expect(history).toEqual([])
    })
  })

  describe('Streak', () => {
    it('starts at 0', () => {
      expect(storage.getStreak()).toBe(0)
    })

    it('increments streak when working out on consecutive days', () => {
      // Simulate yesterday's workout
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      localStorage.setItem('workout_tracker_last_date', yesterday.toDateString())
      localStorage.setItem('workout_tracker_streak', '5')
      
      const newStreak = storage.updateStreak()
      expect(newStreak).toBe(6)
    })

    it('resets streak when gap in workout days', () => {
      // Simulate workout 2 days ago
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      localStorage.setItem('workout_tracker_last_date', twoDaysAgo.toDateString())
      localStorage.setItem('workout_tracker_streak', '5')
      
      const newStreak = storage.updateStreak()
      expect(newStreak).toBe(1)
    })
  })

  describe('Exercise Defaults', () => {
    it('saves and retrieves exercise defaults', () => {
      storage.saveExerciseDefaults('Push', 'Bench Press', { weight: 135, sets: 5, reps: 5 })
      
      const defaults = storage.getExerciseDefaults('Push')
      expect(defaults['Bench Press']).toMatchObject({
        weight: 135,
        sets: 5,
        reps: 5,
      })
    })

    it('returns empty object when no defaults exist', () => {
      const defaults = storage.getExerciseDefaults('Push')
      expect(defaults).toEqual({})
    })

    it('updates existing defaults', () => {
      storage.saveExerciseDefaults('Push', 'Bench Press', { weight: 135, sets: 5, reps: 5 })
      storage.saveExerciseDefaults('Push', 'Bench Press', { weight: 145, sets: 5, reps: 5 })
      
      const defaults = storage.getExerciseDefaults('Push')
      expect(defaults['Bench Press'].weight).toBe(145)
    })
  })

  describe('Weekly Volume', () => {
    it('calculates weekly volume from workout history', () => {
      const today = new Date().toISOString()
      const oldWorkout = {
        id: 'old',
        routineName: 'Push',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
        durationSeconds: 3600,
        totalWeight: 5000,
        exercises: [],
      }
      const recentWorkout = {
        id: 'recent',
        routineName: 'Push',
        date: today,
        durationSeconds: 3600,
        totalWeight: 10000,
        exercises: [],
      }
      
      storage.addWorkoutToHistory(oldWorkout)
      storage.addWorkoutToHistory(recentWorkout)
      
      const weeklyVolume = storage.getWeeklyVolume()
      expect(weeklyVolume).toBe(10000) // Only the recent one
    })
  })
})