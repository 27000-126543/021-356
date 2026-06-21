import React from 'react'
import { View, Text } from '@tarojs/components'
import { TaskStatus, STATUS_LABEL, STATUS_COLOR } from '@/types'
import styles from './index.module.scss'

interface StatusTagProps {
  status: TaskStatus | 'confirmed' | 'pending'
  label?: string
}

const StatusTag: React.FC<StatusTagProps> = ({ status, label }) => {
  let color = '#86909C'
  let bg = 'rgba(134, 144, 156, 0.08)'
  let text = label

  if (status === 'confirmed') {
    color = '#00B42A'
    bg = 'rgba(0, 180, 42, 0.08)'
    text = text || '已确认'
  } else if (status === 'pending' && !label) {
    color = '#FF7D00'
    bg = 'rgba(255, 125, 0, 0.08)'
    text = '待确认'
  } else {
    color = STATUS_COLOR[status as TaskStatus]
    text = text || STATUS_LABEL[status as TaskStatus]
    bg = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`
  }

  return (
    <View className={styles.tag} style={{ color, backgroundColor: bg }}>
      <Text>{text}</Text>
    </View>
  )
}

export default StatusTag
