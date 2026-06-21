import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  UserRole,
  User,
  PourTask,
  HandoverRecord,
  TaskBasicInfo,
  TestInfo,
  CheckItem,
  PauseNotice
} from '@/types'
import { mockTasks } from '@/data/mockTasks'
import { mockHandovers } from '@/data/mockHandovers'
import { genId } from '@/utils'

interface AppContextValue {
  currentUser: User
  switchRole: (role: UserRole) => void
  tasks: PourTask[]
  addTask: (basic: TaskBasicInfo, createdBy: string) => PourTask
  getTask: (id: string) => PourTask | undefined
  updateTaskTest: (taskId: string, test: TestInfo) => void
  updateTaskChecks: (taskId: string, checks: CheckItem[]) => void
  updateTaskStatus: (taskId: string, status: PourTask['status']) => void
  addPauseNotice: (taskId: string, notice: Omit<PauseNotice, 'id' | 'createdAt' | 'rectified'>) => void
  rectifyPause: (
    taskId: string,
    pauseId: string,
    data: { remark: string; photos: string[] }
  ) => void
  handovers: HandoverRecord[]
  addHandover: (record: Omit<HandoverRecord, 'id' | 'status' | 'createdAt'>) => HandoverRecord
  confirmHandover: (id: string, toUser: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const defaultUsers: Record<UserRole, User> = {
  foreman: { id: 'u1', name: '张建国', role: 'foreman', phone: '138****1234' },
  tester: { id: 'u2', name: '李实验', role: 'tester', phone: '139****5678' },
  supervisor: { id: 'u3', name: '陈工', role: 'supervisor', phone: '137****9012' }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers.foreman)
  const [tasks, setTasks] = useState<PourTask[]>(mockTasks)
  const [handovers, setHandovers] = useState<HandoverRecord[]>(mockHandovers)

  const switchRole = useCallback((role: UserRole) => {
    setCurrentUser(defaultUsers[role])
  }, [])

  const addTask = useCallback(
    (basic: TaskBasicInfo, createdBy: string): PourTask => {
      const d = new Date()
      const yyyy = d.getFullYear()
      const MM = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const rand = Math.floor(Math.random() * 9000 + 1000)
      const task: PourTask = {
        id: genId(),
        taskNo: `JZ${yyyy}${MM}${dd}${rand}`,
        basic,
        test: undefined,
        checks: [
          { key: 'formClean', label: '模板清理', checked: false },
          { key: 'rebarCover', label: '钢筋保护层', checked: false },
          { key: 'embeddedParts', label: '预埋件', checked: false },
          { key: 'pourOrder', label: '浇筑顺序', checked: false },
          { key: 'vibration', label: '振捣情况', checked: false }
        ],
        pauses: [],
        status: 'pending',
        createdAt: d.toISOString(),
        createdBy,
        date: `${yyyy}-${MM}-${dd}`
      }
      setTasks((prev) => [task, ...prev])
      return task
    },
    []
  )

  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])

  const updateTaskTest = useCallback((taskId: string, test: TestInfo) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, test } : t))
    )
  }, [])

  const updateTaskChecks = useCallback((taskId: string, checks: CheckItem[]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checks } : t))
    )
  }, [])

  const updateTaskStatus = useCallback((taskId: string, status: PourTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    )
  }, [])

  const addPauseNotice = useCallback(
    (
      taskId: string,
      notice: Omit<PauseNotice, 'id' | 'createdAt' | 'rectified'>
    ) => {
      const newNotice: PauseNotice = {
        ...notice,
        id: genId(),
        createdAt: new Date().toISOString(),
        rectified: false
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: 'paused', pauses: [...t.pauses, newNotice] }
            : t
        )
      )
    },
    []
  )

  const rectifyPause = useCallback(
    (
      taskId: string,
      pauseId: string,
      data: { remark: string; photos: string[] }
    ) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t
          const newPauses = t.pauses.map((p) =>
            p.id === pauseId
              ? {
                  ...p,
                  rectified: true,
                  rectifiedAt: new Date().toISOString(),
                  rectifiedRemark: data.remark,
                  rectifiedPhotos: data.photos
                }
              : p
          )
          const allRectified = newPauses.every((p) => p.rectified)
          return {
            ...t,
            pauses: newPauses,
            status: allRectified && t.status !== 'completed' ? 'pouring' : t.status
          }
        })
      )
    },
    []
  )

  const addHandover = useCallback(
    (record: Omit<HandoverRecord, 'id' | 'status' | 'createdAt'>): HandoverRecord => {
      const newRecord: HandoverRecord = {
        ...record,
        id: genId(),
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      setHandovers((prev) => [newRecord, ...prev])
      return newRecord
    },
    []
  )

  const confirmHandover = useCallback((id: string, toUser: string) => {
    setHandovers((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              status: 'confirmed',
              toUser,
              confirmedAt: new Date().toISOString()
            }
          : h
      )
    )
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        tasks,
        addTask,
        getTask,
        updateTaskTest,
        updateTaskChecks,
        updateTaskStatus,
        addPauseNotice,
        rectifyPause,
        handovers,
        addHandover,
        confirmHandover
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
