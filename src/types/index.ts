export type UserRole = 'foreman' | 'tester' | 'supervisor'

export interface User {
  id: string
  name: string
  role: UserRole
  phone: string
  avatar?: string
}

export type TaskStatus =
  | 'pending'
  | 'pouring'
  | 'paused'
  | 'rectifying'
  | 'completed'

export interface TaskBasicInfo {
  location: string
  pumpNumber: string
  estimatedStartTime: string
  onDutyStaff: string
  notes: string
}

export interface TestInfo {
  mixRatioNo: string
  specimenCount: number
  slump: string
  photos: string[]
}

export type CheckItemKey =
  | 'formClean'
  | 'rebarCover'
  | 'embeddedParts'
  | 'pourOrder'
  | 'vibration'

export interface CheckItem {
  key: CheckItemKey
  label: string
  checked: boolean
  remark?: string
}

export interface PauseNotice {
  id: string
  content: string
  createdAt: string
  createdBy: string
  rectified: boolean
  rectifiedAt?: string
  rectifiedPhotos?: string[]
  rectifiedRemark?: string
}

export interface PourTask {
  id: string
  taskNo: string
  basic: TaskBasicInfo
  test?: TestInfo
  checks: CheckItem[]
  pauses: PauseNotice[]
  status: TaskStatus
  createdAt: string
  createdBy: string
  date: string
}

export type HandoverStatus = 'pending' | 'confirmed'

export interface HandoverRecord {
  id: string
  date: string
  shift: string
  pouredArea: string
  remainingVolume: string
  pendingIssues: string
  photos: string[]
  status: HandoverStatus
  fromUser: string
  toUser?: string
  createdAt: string
  confirmedAt?: string
}

export const CHECK_ITEMS_TEMPLATE: Omit<CheckItem, 'checked'>[] = [
  { key: 'formClean', label: '模板清理' },
  { key: 'rebarCover', label: '钢筋保护层' },
  { key: 'embeddedParts', label: '预埋件' },
  { key: 'pourOrder', label: '浇筑顺序' },
  { key: 'vibration', label: '振捣情况' }
]

export const ROLE_LABEL: Record<UserRole, string> = {
  foreman: '班组长',
  tester: '试验员',
  supervisor: '监理员'
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: '待开始',
  pouring: '浇筑中',
  paused: '已暂停',
  rectifying: '整改中',
  completed: '已完成'
}

export const STATUS_COLOR: Record<TaskStatus, string> = {
  pending: '#86909C',
  pouring: '#1E6FFF',
  paused: '#F53F3F',
  rectifying: '#FF7D00',
  completed: '#00B42A'
}
