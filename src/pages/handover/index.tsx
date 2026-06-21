import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useApp } from '@/store/AppContext'
import { formatDateTime } from '@/utils'
import StatusTag from '@/components/StatusTag'
import styles from './index.module.scss'

const HandoverPage: React.FC = () => {
  const { handovers, currentUser } = useApp()

  const goDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/handover-detail/index?id=${id}` })
  }

  const goCreate = () => {
    Taro.navigateTo({ url: '/pages/handover-detail/index?create=1' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>班次交接</Text>
        <Text className={styles.pageDesc}>夜间换班时填写交接单，避免口头交接漏项</Text>
      </View>

      {handovers.length === 0 ? (
        <View className={styles.empty}>
          <Text className={styles.emptyText}>暂无交接记录</Text>
          <Text className={styles.emptyHint}>点击右下角按钮创建交接单</Text>
        </View>
      ) : (
        handovers.map((h) => (
          <View key={h.id} className={styles.card} onClick={() => goDetail(h.id)}>
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.shiftLabel}>{h.shift}</Text>
                <Text className={styles.dateText}>  ·  {h.date}</Text>
              </View>
              <StatusTag status={h.status} label={h.status === 'confirmed' ? '已确认' : '待确认'} />
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>已浇区域</Text>
                <Text className={styles.infoValue}>{h.pouredArea || '无'}</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>剩余方量</Text>
                <Text className={styles.infoValue}>{h.remainingVolume || '无'}</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>待处理问题</Text>
                <Text className={styles.infoValue}>{h.pendingIssues || '无'}</Text>
              </View>
            </View>

            <View className={styles.footer}>
              <Text className={styles.userText}>
                交班：{h.fromUser}
                {h.toUser ? `  →  接班：${h.toUser}` : ''}
              </Text>
              <Text className={styles.userText}>{formatDateTime(h.createdAt)}</Text>
            </View>
          </View>
        ))
      )}

      {currentUser.role === 'foreman' && (
        <View className={styles.fab} onClick={goCreate}>
          <Text className={styles.fabText}>+ 创建交接单</Text>
        </View>
      )}
    </View>
  )
}

export default HandoverPage
