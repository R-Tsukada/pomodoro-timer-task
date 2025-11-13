/**
 * タイマーのモード
 */
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

/**
 * モード設定
 */
export interface TimerModeConfig {
  focus: number // デフォルト: 25 * 60 (1500秒)
  shortBreak: number // デフォルト: 5 * 60 (300秒)
  longBreak: number // デフォルト: 15 * 60 (900秒)
}

/**
 * タイマー状態
 */
export interface TimerState {
  /** 現在のモード */
  currentMode: TimerMode
  /** 残り時間（秒） */
  timeRemaining: number
  /** タイマーが実行中かどうか */
  isRunning: boolean
  /** 完了したセッション数（0-4） */
  completedSessionsInCycle: number
  /** 完了したサイクル数 */
  completedCycles: number
  /** 最後に更新された時刻（ISO 8601形式） */
  lastUpdated: string
}

/**
 * タイマー設定
 */
export interface TimerSettings {
  /** 各モードの時間設定（秒） */
  duration: TimerModeConfig
  /** 自動開始を有効にするか */
  autoStart: boolean
  /** 音声を有効にするか */
  soundEnabled: boolean
  /** 通知を有効にするか */
  notificationEnabled: boolean
}

/**
 * タスク固有のタイマー状態
 */
export interface TaskTimerState {
  /** 現在のモード */
  currentMode: TimerMode
  /** 残り時間（秒） */
  timeRemaining: number
  /** 完了したセッション数（0-4） */
  completedSessionsInCycle: number
}
