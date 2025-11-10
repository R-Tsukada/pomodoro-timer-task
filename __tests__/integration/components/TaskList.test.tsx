import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskList from '@/components/task/TaskList'
import { useTaskStore } from '@/stores/task-store'
import { act, renderHook } from '@testing-library/react'

describe('TaskList Component', () => {
  beforeEach(() => {
    // 各テスト前にLocalStorageとZustandのstateをクリア
    localStorage.clear()
    useTaskStore.setState({ tasks: [], selectedTaskId: null })
  })

  describe('Rendering', () => {
    it('should render task form', () => {
      render(<TaskList />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      expect(input).toBeInTheDocument()
    })

    it('should show empty state when no tasks', () => {
      render(<TaskList />)

      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
    })

    it('should render task list when tasks exist', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
      })

      render(<TaskList />)

      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })
  })

  describe('Adding Tasks', () => {
    it('should add a new task when form is submitted', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      await user.type(input, 'New Task{Enter}')

      expect(screen.getByText('New Task')).toBeInTheDocument()
    })

    it('should hide empty state after adding first task', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()

      const input = screen.getByPlaceholderText(/add.*task/i)
      await user.type(input, 'First Task{Enter}')

      expect(screen.queryByText(/no tasks/i)).not.toBeInTheDocument()
    })
  })

  describe('Task Interactions', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
        result.current.addTask('Task 3')
      })
    })

    it('should toggle task completion when checkbox is clicked', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      // タスク名がline-throughになることを確認
      const taskName = screen.getByText('Task 1')
      expect(taskName).toHaveClass('line-through')
    })

    it('should select task when task item is clicked', async () => {
      const user = userEvent.setup()

      const { container } = render(<TaskList />)

      const task1 = screen.getByText('Task 1')
      await user.click(task1)

      // 選択状態になることを確認（ring-2クラスが追加される）
      // 親のdiv要素を探す
      const taskItems = container.querySelectorAll('.ring-2')
      expect(taskItems.length).toBeGreaterThan(0)
    })

    it('should delete task when delete button is clicked', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      expect(screen.getByText('Task 1')).toBeInTheDocument()

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])

      expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
    })

    it('should show empty state after deleting all tasks', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

      // 全タスクを削除
      for (const button of deleteButtons) {
        await user.click(button)
      }

      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state message', () => {
      render(<TaskList />)

      expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
    })

    it('should show helpful text in empty state', () => {
      render(<TaskList />)

      expect(screen.getByText(/add.*first.*task/i)).toBeInTheDocument()
    })
  })

  describe('Task Count Display', () => {
    it('should display task count when tasks exist', () => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
        result.current.addTask('Task 3')
      })

      render(<TaskList />)

      expect(screen.getByText(/3.*tasks/i)).toBeInTheDocument()
    })

    it('should update task count when tasks are added or deleted', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      const input = screen.getByPlaceholderText(/add.*task/i)
      await user.type(input, 'Task 1{Enter}')

      expect(screen.getByText(/1.*task/i)).toBeInTheDocument()

      await user.type(input, 'Task 2{Enter}')

      expect(screen.getByText(/2.*tasks/i)).toBeInTheDocument()
    })
  })

  describe('Completed Tasks Section', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useTaskStore())

      act(() => {
        result.current.addTask('Active Task')
        result.current.addTask('Completed Task 1')
        result.current.addTask('Completed Task 2')
      })
    })

    it('should show completed tasks in separate section', async () => {
      const user = userEvent.setup()

      render(<TaskList />)

      // タスクを完了にする
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1])
      await user.click(checkboxes[2])

      // 完了セクションのヘッダーを確認（h3タグ内の"Completed"テキスト）
      const completedHeadings = screen.getAllByRole('heading', { level: 3 })
      const hasCompletedHeading = completedHeadings.some((heading) =>
        heading.textContent?.match(/^completed$/i)
      )
      expect(hasCompletedHeading).toBe(true)
    })

    it('should hide completed section when no completed tasks', () => {
      render(<TaskList />)

      // h3の"Completed"ヘッダーが存在しないことを確認
      const completedHeadings = screen.queryAllByRole('heading', { level: 3 })
      const hasCompletedHeading = completedHeadings.some((heading) =>
        heading.textContent?.match(/^completed$/i)
      )
      expect(hasCompletedHeading).toBe(false)
    })
  })
})
