/**
 * LocalStorageのキー定義
 * ✅ C-1修正: 各ストアに別々のキーを使用
 */
export const STORAGE_KEYS = {
  /** タイマーデータ（timer-store用） */
  TIMER_DATA: 'pomodoro_timer_data',
  /** タスクデータ（task-store用） */
  TASK_DATA: 'pomodoro_task_data',
  /** バックグラウンド時刻（タイマー計算用） */
  BACKGROUND_TIME: 'pomodoro_background_time',
  /** 設定（settings-store用） */
  SETTINGS: 'pomodoro_settings',
} as const

/**
 * 現在のデータバージョン
 */
export const CURRENT_DATA_VERSION = 1

/**
 * タイマーのデフォルト時間（秒）
 */
export const TIMER_DURATIONS = {
  focus: 1500, // 25分
  shortBreak: 300, // 5分
  longBreak: 900, // 15分
} as const

/**
 * ポモドーロサイクルの設定
 */
export const POMODORO_CONFIG = {
  /** 1サイクルのセッション数 */
  SESSIONS_PER_CYCLE: 4,
  /** ロングブレイクを挟むセッション数 */
  SESSIONS_BEFORE_LONG_BREAK: 4,
} as const

/**
 * デフォルトタスク名
 */
export const DEFAULT_TASKS = [
  'Create proposal document',
  'Code review',
  'Meeting preparation',
] as const
