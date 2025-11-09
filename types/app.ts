import { TimerState, TimerSettings } from './timer'
import { TaskState, PomodoroTask } from './task'

/**
 * アプリケーション全体の状態
 */
export interface AppState {
  /** タイマー状態 */
  timer: TimerState
  /** タスク状態 */
  task: TaskState
  /** 設定 */
  settings: TimerSettings
}

/**
 * LocalStorageに保存される永続化データ
 */
export interface PersistedData {
  /** データバージョン（マイグレーション用） */
  version: number
  /** タイマー状態 */
  timer: Omit<TimerState, 'lastUpdated'>
  /** タスク */
  tasks: PomodoroTask[]
  /** 選択中のタスクID */
  selectedTaskId: string | null
  /** 設定 */
  settings: TimerSettings
  /** 最後に保存した時刻（ISO 8601形式） */
  savedAt: string
}
