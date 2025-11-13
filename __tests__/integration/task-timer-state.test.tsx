import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimerStore } from '@/stores/timer-store'
import { useTaskStore } from '@/stores/task-store'

describe('Task-specific Timer State (TDD)', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useTimerStore.persist.clearStorage()
    useTaskStore.persist.clearStorage()

    // ストアの状態を初期化（メモリ内の状態もクリア）
    useTimerStore.setState({
      currentMode: 'focus',
      timeRemaining: 1500,
      isRunning: false,
      completedSessionsInCycle: 0,
      completedCycles: 0,
      lastUpdated: new Date().toISOString(),
      settings: {
        duration: {
          focus: 1500,
          shortBreak: 300,
          longBreak: 900,
        },
        autoStart: false,
        soundEnabled: true,
        notificationEnabled: true,
      },
    })

    // タスクストアも初期化
    useTaskStore.setState({
      tasks: [],
      selectedTaskId: null,
    })
  })

  it('should save and restore timer state per task', () => {
    const { result: timerResult } = renderHook(() => useTimerStore())
    const { result: taskResult } = renderHook(() => useTaskStore())

    // タスクA, Bを追加
    act(() => {
      taskResult.current.addTask('Task A')
      taskResult.current.addTask('Task B')
    })

    const taskA = taskResult.current.tasks[0]
    const taskB = taskResult.current.tasks[1]

    // === タスクAを選択してセッションを進める ===
    act(() => {
      taskResult.current.selectTask(taskA.id)
    })

    // タスクAで4セッション完了 → Long Breakに遷移
    act(() => {
      timerResult.current.setCompletedSessions(3)
      timerResult.current.switchMode('focus')
      timerResult.current.completeSession() // 4セッション目完了 → Long Break
    })

    expect(timerResult.current.currentMode).toBe('longBreak')
    expect(timerResult.current.completedSessionsInCycle).toBe(4)
    expect(timerResult.current.timeRemaining).toBe(900) // 15分

    // タイマーを少し進める（10分経過）
    act(() => {
      timerResult.current.setTimeRemaining(300) // 残り5分
    })

    // この時点でのタスクAの状態を記録
    const taskATimerState = {
      mode: timerResult.current.currentMode,
      timeRemaining: timerResult.current.timeRemaining,
      completedSessions: timerResult.current.completedSessionsInCycle,
    }

    // === タスクBに切り替え ===
    act(() => {
      // タスク切り替え前に現在のタイマー状態をタスクAに保存
      taskResult.current.saveTimerState(taskA.id, {
        currentMode: timerResult.current.currentMode,
        timeRemaining: timerResult.current.timeRemaining,
        completedSessionsInCycle: timerResult.current.completedSessionsInCycle,
      })

      taskResult.current.selectTask(taskB.id)

      // タスクBのタイマー状態を復元（初期状態）
      const taskBState = taskResult.current.getTimerState(taskB.id)
      if (taskBState) {
        timerResult.current.switchMode(taskBState.currentMode)
        timerResult.current.setTimeRemaining(taskBState.timeRemaining)
        timerResult.current.setCompletedSessions(taskBState.completedSessionsInCycle)
      }
    })

    // タスクBは0セッション → Focus状態
    expect(timerResult.current.currentMode).toBe('focus')
    expect(timerResult.current.completedSessionsInCycle).toBe(0)
    expect(timerResult.current.timeRemaining).toBe(1500) // 25分

    // === タスクAに戻る ===
    act(() => {
      // タスク切り替え前に現在のタイマー状態をタスクBに保存
      taskResult.current.saveTimerState(taskB.id, {
        currentMode: timerResult.current.currentMode,
        timeRemaining: timerResult.current.timeRemaining,
        completedSessionsInCycle: timerResult.current.completedSessionsInCycle,
      })

      taskResult.current.selectTask(taskA.id)

      // タスクAのタイマー状態を復元
      const taskAState = taskResult.current.getTimerState(taskA.id)
      if (taskAState) {
        timerResult.current.switchMode(taskAState.currentMode)
        timerResult.current.setTimeRemaining(taskAState.timeRemaining)
        timerResult.current.setCompletedSessions(taskAState.completedSessionsInCycle)
      }
    })

    // タスクAの状態が復元される
    expect(timerResult.current.currentMode).toBe(taskATimerState.mode)
    expect(timerResult.current.timeRemaining).toBe(taskATimerState.timeRemaining)
    expect(timerResult.current.completedSessionsInCycle).toBe(taskATimerState.completedSessions)
  })

  it('should use default timer state for new tasks', () => {
    const { result: taskResult } = renderHook(() => useTaskStore())

    act(() => {
      taskResult.current.addTask('New Task')
    })

    const newTask = taskResult.current.tasks[0]

    // 新しいタスクのデフォルト状態を取得
    const defaultState = taskResult.current.getTimerState(newTask.id)

    expect(defaultState).toEqual({
      currentMode: 'focus',
      timeRemaining: 1500,
      completedSessionsInCycle: 0,
    })
  })
})
