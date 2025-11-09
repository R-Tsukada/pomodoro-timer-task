import { describe, it, expect } from 'vitest'
import { createDefaultTasks, getDefaultData } from '@/lib/default-data'
import { DEFAULT_TASKS, CURRENT_DATA_VERSION, TIMER_DURATIONS } from '@/lib/constants'

describe('createDefaultTasks', () => {
  it('should create 3 default tasks', () => {
    const tasks = createDefaultTasks()

    expect(tasks).toHaveLength(3)
  })

  it('should use DEFAULT_TASKS constant for task names', () => {
    const tasks = createDefaultTasks()

    expect(tasks[0].name).toBe(DEFAULT_TASKS[0])
    expect(tasks[1].name).toBe(DEFAULT_TASKS[1])
    expect(tasks[2].name).toBe(DEFAULT_TASKS[2])
  })

  it('should create tasks with correct initial state', () => {
    const tasks = createDefaultTasks()

    tasks.forEach((task) => {
      expect(task.id).toBeDefined()
      expect(task.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      ) // UUID v4 format
      expect(task.isCompleted).toBe(false)
      expect(task.sessionsCompleted).toBe(0)
      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) // ISO 8601 format
      expect(task.updatedAt).toBe(task.createdAt) // createdAt and updatedAt should be the same initially
    })
  })

  it('should create tasks with unique IDs', () => {
    const tasks = createDefaultTasks()

    const ids = tasks.map((task) => task.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(tasks.length)
  })

  it('should create new IDs on each call', () => {
    const tasks1 = createDefaultTasks()
    const tasks2 = createDefaultTasks()

    expect(tasks1[0].id).not.toBe(tasks2[0].id)
    expect(tasks1[1].id).not.toBe(tasks2[1].id)
    expect(tasks1[2].id).not.toBe(tasks2[2].id)
  })
})

describe('getDefaultData', () => {
  it('should return PersistedData with correct version', () => {
    const data = getDefaultData()

    expect(data.version).toBe(CURRENT_DATA_VERSION)
  })

  it('should return default timer state', () => {
    const data = getDefaultData()

    expect(data.timer.currentMode).toBe('focus')
    expect(data.timer.timeRemaining).toBe(TIMER_DURATIONS.focus)
    expect(data.timer.isRunning).toBe(false)
    expect(data.timer.completedSessionsInCycle).toBe(0)
    expect(data.timer.completedCycles).toBe(0)
  })

  it('should return default tasks', () => {
    const data = getDefaultData()

    expect(data.tasks).toHaveLength(3)
    expect(data.tasks[0].name).toBe(DEFAULT_TASKS[0])
    expect(data.tasks[1].name).toBe(DEFAULT_TASKS[1])
    expect(data.tasks[2].name).toBe(DEFAULT_TASKS[2])
  })

  it('should select first task by default', () => {
    const data = getDefaultData()

    expect(data.selectedTaskId).toBe(data.tasks[0].id)
  })

  it('should return default settings', () => {
    const data = getDefaultData()

    expect(data.settings.duration.focus).toBe(TIMER_DURATIONS.focus)
    expect(data.settings.duration.shortBreak).toBe(TIMER_DURATIONS.shortBreak)
    expect(data.settings.duration.longBreak).toBe(TIMER_DURATIONS.longBreak)
    expect(data.settings.autoStart).toBe(true)
    expect(data.settings.soundEnabled).toBe(true)
    expect(data.settings.notificationEnabled).toBe(true)
  })

  it('should have savedAt timestamp', () => {
    const data = getDefaultData()

    expect(data.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) // ISO 8601 format
  })

  it('should create new tasks on each call', () => {
    const data1 = getDefaultData()
    const data2 = getDefaultData()

    expect(data1.tasks[0].id).not.toBe(data2.tasks[0].id)
    expect(data1.selectedTaskId).not.toBe(data2.selectedTaskId)
  })

  it('should have consistent structure', () => {
    const data = getDefaultData()

    // PersistedData型の全プロパティが存在することを確認
    expect(data).toHaveProperty('version')
    expect(data).toHaveProperty('timer')
    expect(data).toHaveProperty('tasks')
    expect(data).toHaveProperty('selectedTaskId')
    expect(data).toHaveProperty('settings')
    expect(data).toHaveProperty('savedAt')
  })
})
