import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from '@/components/task/TaskForm'

describe('TaskForm Component', () => {
  const mockOnAdd = vi.fn()

  beforeEach(() => {
    mockOnAdd.mockClear()
  })

  describe('Rendering', () => {
    it('should render input field', () => {
      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      expect(input).toBeInTheDocument()
    })

    it('should render add button', () => {
      render(<TaskForm onAddTask={mockOnAdd} />)

      const button = screen.getByRole('button', { name: /add/i })
      expect(button).toBeInTheDocument()
    })

    it('should have empty input field initially', () => {
      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      expect(input).toHaveValue('')
    })
  })

  describe('User Input', () => {
    it('should update input value when user types', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      await user.type(input, 'New Task')

      expect(input).toHaveValue('New Task')
    })

    it('should accept multiword task names', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      await user.type(input, 'Buy groceries for dinner')

      expect(input).toHaveValue('Buy groceries for dinner')
    })
  })

  describe('Adding Tasks', () => {
    it('should call onAddTask when add button is clicked', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      const button = screen.getByRole('button', { name: /add/i })

      await user.type(input, 'New Task')
      await user.click(button)

      expect(mockOnAdd).toHaveBeenCalledWith('New Task')
      expect(mockOnAdd).toHaveBeenCalledTimes(1)
    })

    it('should call onAddTask when Enter key is pressed', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)

      await user.type(input, 'New Task{Enter}')

      expect(mockOnAdd).toHaveBeenCalledWith('New Task')
      expect(mockOnAdd).toHaveBeenCalledTimes(1)
    })

    it('should clear input field after adding task', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)

      await user.type(input, 'New Task{Enter}')

      expect(input).toHaveValue('')
    })

    it('should trim whitespace from task name', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)

      await user.type(input, '  Task with spaces  {Enter}')

      expect(mockOnAdd).toHaveBeenCalledWith('Task with spaces')
    })
  })

  describe('Validation', () => {
    it('should not add empty task', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const button = screen.getByRole('button', { name: /add/i })
      await user.click(button)

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should not add task with only whitespace', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      await user.type(input, '   {Enter}')

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should disable add button when input is empty', () => {
      render(<TaskForm onAddTask={mockOnAdd} />)

      const button = screen.getByRole('button', { name: /add/i })
      expect(button).toBeDisabled()
    })

    it('should enable add button when input has value', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      const button = screen.getByRole('button', { name: /add/i })

      await user.type(input, 'Task')

      expect(button).toBeEnabled()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible input field', () => {
      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      expect(input).toHaveAttribute('aria-label')
    })

    it('should have accessible add button', () => {
      render(<TaskForm onAddTask={mockOnAdd} />)

      const button = screen.getByRole('button', { name: /add/i })
      expect(button).toHaveAttribute('aria-label')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)

      // Tab to input
      await user.tab()
      expect(input).toHaveFocus()
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus on input after adding task', async () => {
      const user = userEvent.setup()

      render(<TaskForm onAddTask={mockOnAdd} />)

      const input = screen.getByPlaceholderText(/add.*task/i)

      await user.type(input, 'New Task{Enter}')

      expect(input).toHaveFocus()
    })
  })
})
