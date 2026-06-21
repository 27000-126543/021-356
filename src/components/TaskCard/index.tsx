import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { PourTask } from '@/types'
import StatusTag from '@/components/StatusTag'
import { formatTime } from '@/utils'
import styles from './index.module.scss'

interface TaskCardProps {
  task: PourTask
  onClick?: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const uncheckedCount = task.checks.filter((c) => !c.checked).length
  const openPauseCount = task.pauses.filter((p) => !p.rectified).length

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.taskNo}>
          <Text className={styles.taskNoText}>{task.taskNo}</Text>
        </View>
        <StatusTag status={task.status} />
      </View>

      <View className={styles.location}>
        <Text>{task.basic.location}</Text>
      </View>

      <View className={styles.metaRow}>
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>泵车</Text>
          <Text className={styles.metaValue}>{task.basic.pumpNumber}</Text>
        </View>
        <View className={styles.metaDivider} />
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>预计</Text>
          <Text className={styles.metaValue}>{formatTime(task.basic.estimatedStartTime)}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.footerLeft}>
          <Text className={styles.staff}>值班：{task.basic.onDutyStaff}</Text>
        </View>
        <View className={styles.footerRight}>
          {openPauseCount > 0 && (
            <View className={classnames(styles.badge, styles.danger)}>
              <Text>{openPauseCount}项待整改</Text>
            </View>
          )}
          {uncheckedCount > 0 && openPauseCount === 0 && (
            <View className={classnames(styles.badge, styles.warning)}>
              <Text>{uncheckedCount}项待检查</Text>
            </View>
          )}
          {task.test && (
            <View className={classnames(styles.badge, styles.info)}>
              <Text>试验已录入</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default TaskCard
