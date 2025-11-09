/**
 * ポモドーロタスク
 */
export interface PomodoroTask {
  /** 一意識別子（UUID v4） */
  id: string
  /** タスク名 */
  name: string
  /** 完了状態 */
  isCompleted: boolean
  /** 完了したセッション数 */
  sessionsCompleted: number
  /** 作成日時（ISO 8601形式） */
  createdAt: string
  /** 更新日時（ISO 8601形式） */
  updatedAt: string
}

/**
 * タスク状態
 */
export interface TaskState {
  /** 全タスク */
  tasks: PomodoroTask[]
  /** 選択中のタスクID */
  selectedTaskId: string | null
}
