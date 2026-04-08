import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { WorkoutSummaryModal } from '../components/WorkoutSummaryModal'
import type { CompletedWorkout } from '../types'

const mockWorkout: CompletedWorkout = {
  id: 'test-1',
  routineName: 'Push',
  date: new Date().toISOString(),
  durationSeconds: 3600,
  totalWeight: 10000,
  exercises: [
    {
      id: 'ex-1',
      name: 'Bench Press',
      weight: 135,
      restSeconds: 180,
      sets: [
        { setNumber: 1, targetReps: 5, isCompleted: true, completedReps: 5 },
        { setNumber: 2, targetReps: 5, isCompleted: true, completedReps: 5 },
        { setNumber: 3, targetReps: 5, isCompleted: false },
      ],
    },
  ],
}

describe('WorkoutSummaryModal', () => {
  const mockOnClose = vi.fn()
  const mockOnViewHistory = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when isOpen is true', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={true}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Workout Complete!')).toBeTruthy()
    expect(screen.getByText(/Congratulations/)).toBeTruthy()
  })

  it('does not render when isOpen is false', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={false}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    expect(screen.queryByText('Workout Complete!')).toBeNull()
  })

  it('displays workout stats correctly', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={true}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('60')).toBeTruthy() // minutes
    expect(screen.getByText('2')).toBeTruthy() // sets done
    expect(screen.getByText('10,000')).toBeTruthy() // volume
  })

  it('calls onClose when Continue button is clicked', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={true}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    const continueBtn = screen.getByText('Continue')
    fireEvent.click(continueBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose then onViewHistory when View History is clicked', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={true}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    const viewHistoryBtn = screen.getByText('View History')
    fireEvent.click(viewHistoryBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(mockOnViewHistory).toHaveBeenCalledTimes(1)
  })

  it('displays the exercise list', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={true}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Bench Press')).toBeTruthy()
    expect(screen.getByText('2/3 sets')).toBeTruthy()
  })

  it('shows a random motivational quote', () => {
    render(
      <BrowserRouter>
        <WorkoutSummaryModal
          workout={mockWorkout}
          isOpen={true}
          onClose={mockOnClose}
          onViewHistory={mockOnViewHistory}
        />
      </BrowserRouter>
    )

    // Check that a quote is displayed (in quotes)
    const quote = screen.getByText(/".*"/)
    expect(quote).toBeTruthy()
  })
})