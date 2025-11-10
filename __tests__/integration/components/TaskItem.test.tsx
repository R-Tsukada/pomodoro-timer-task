import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskItem from '@/components/task/TaskItem'
import type { PomodoroTask } from '@/types/task'

describe('TaskItem Component', () => {
  const mockTask: PomodoroTask = {
    id: 'task-1',
    name: 'Test Task',
    isCompleted: false,
    sessionsCompleted: 3,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }

  const mockOnToggle = vi.fn()
  const mockOnSelect = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnSelect.mockClear()
    mockOnDelete.mockClear()
  })

  describe('Rendering', () => {
    it('should render task name', () => {
      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    it('should render session count', () => {
      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should show completed style when task is completed', () => {
      const completedTask = { ...mockTask, isCompleted: true }

      render(
        <TaskItem
          task={completedTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const taskName = screen.getByText('Test Task')
      expect(taskName).toHaveClass('line-through')
    })

    it('should show selected style when task is selected', () => {
      const { container } = render(
        <TaskItem
          task={mockTask}
          isSelected={true}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const taskItem = container.firstChild as HTMLElement
      expect(taskItem).toHaveClass('ring-2')
    })
  })

  describe('Interactions', () => {
    it('should call onToggleComplete when checkbox is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(mockOnToggle).toHaveBeenCalledWith('task-1')
      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onSelect when task item is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const taskName = screen.getByText('Test Task')
      await user.click(taskName)

      expect(mockOnSelect).toHaveBeenCalledWith('task-1')
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should not call onSelect when checkbox is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(mockOnSelect).not.toHaveBeenCalled()
    })

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledWith('task-1')
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible checkbox', () => {
      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('aria-label')
    })

    it('should show checked state when task is completed', () => {
      const completedTask = { ...mockTask, isCompleted: true }

      render(
        <TaskItem
          task={completedTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should have accessible delete button', () => {
      render(
        <TaskItem
          task={mockTask}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toBeInTheDocument()
    })
  })

  describe('Session Count Display', () => {
    it('should show 0 sessions when task has no sessions', () => {
      const taskWithNoSessions = { ...mockTask, sessionsCompleted: 0 }

      render(
        <TaskItem
          task={taskWithNoSessions}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should show correct session count', () => {
      const taskWithManySessions = { ...mockTask, sessionsCompleted: 12 }

      render(
        <TaskItem
          task={taskWithManySessions}
          isSelected={false}
          onToggleComplete={mockOnToggle}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('12')).toBeInTheDocument()
    })
  })
})
