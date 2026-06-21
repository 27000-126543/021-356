import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useApp } from '@/store/AppContext'
import { todayStr } from '@/utils'
import { ROLE_LABEL } from '@/types'
import TaskCard from '@/components/TaskCard'
import RoleTabs from '@/components/RoleTabs'
import styles from './index.module.scss'

const HomePage: React.FC = () => {
  const { currentUser, switchRole, tasks } = useApp()

  const today = todayStr()
  const todayTasks = tasks.filter((t) => t.date === today)

  const pouringCount = todayTasks.filter((t) => t.status === 'pouring').length
  const pausedCount = todayTasks.filter((t) => t.status === 'paused' || t.status === 'rectifying').length
  const pendingCount = todayTasks.filter((t) => t.status === 'pending').length

  const sortedTasks = [...todayTasks].sort((a, b) => {
    const order = { paused: 0, rectifying: 1, pouring: 2, pending: 3, completed: 4 }
    return order[a.status] - order[b.status]
  })

  const goDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/task-detail/index?id=${id}` })
  }

  const goCreate = () => {
    if (currentUser.role !== 'foreman') {
      Taro.showToast({ title: '仅班组长可创建任务', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/create-task/index' })
  }

  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()]
  const dateStr = today.replace(/-/g, ' / ')

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.topRow}>
          <View className={styles.greeting}>
            <Text className={styles.dateText}>{dateStr} 周{weekDay}</Text>
            <Text className={styles.title}>今日浇筑任务</Text>
          </View>
          <View className={styles.roleInfo}>
            <Text className={styles.roleLabel}>当前身份</Text>
            <Text className={styles.userName}>
              {currentUser.name} · {ROLE_LABEL[currentUser.role]}
            </Text>
          </View>
        </View>

        <RoleTabs current={currentUser.role} onChange={switchRole} />
      </View>

      <View className={styles.statsRow} style={{ padding: '0 32rpx' }}>
        <View className={styles.statCard}>
          <Text className={styles.statNum + ' ' + styles.pouring}>{pouringCount}</Text>
          <Text className={styles.statLabel}>浇筑中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum + ' ' + styles.paused}>{pausedCount}</Text>
          <Text className={styles.statLabel}>待整改</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum + ' ' + styles.pending}>{pendingCount}</Text>
          <Text className={styles.statLabel}>待开始</Text>
        </View>
      </View>

      <View className={styles.listTitle}>任务清单（{sortedTasks.length}）</View>

      <View className={styles.listWrap}>
        {sortedTasks.length === 0 ? (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>今日暂无浇筑任务</Text>
          </View>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => goDetail(task.id)} />
          ))
        )}
      </View>

      {currentUser.role === 'foreman' && (
        <View className={styles.fab} onClick={goCreate}>
          <View className={styles.fabInner}>
            <Text className={styles.fabIcon}>+</Text>
            <Text className={styles.fabLabel}>新任务</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default HomePage
