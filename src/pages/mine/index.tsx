import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useApp } from '@/store/AppContext'
import { ROLE_LABEL } from '@/types'
import { todayStr } from '@/utils'
import RoleTabs from '@/components/RoleTabs'
import styles from './index.module.scss'

const iconMap: Record<string, { bg: string; text: string }> = {
  '浇筑记录': { bg: 'rgba(30, 111, 255, 0.08)', text: '📋' },
  '试验记录': { bg: 'rgba(114, 46, 209, 0.08)', text: '🧪' },
  '交接历史': { bg: 'rgba(15, 198, 194, 0.08)', text: '🔄' },
  '消息通知': { bg: 'rgba(255, 125, 0, 0.08)', text: '🔔' },
  '关于': { bg: 'rgba(0, 180, 42, 0.08)', text: 'ℹ️' }
}

const resetIcon = { bg: 'rgba(245, 63, 63, 0.08)', text: '♻️' }

const MinePage: React.FC = () => {
  const { currentUser, switchRole, tasks, handovers, resetToMock } = useApp()

  const today = todayStr()
  const stats = useMemo(() => {
    const todayTasks = tasks.filter((t) => t.date === today)
    return {
      tasks: todayTasks.length,
      tests: todayTasks.filter((t) => t.test).length,
      handovers: handovers.filter((h) => h.date === today).length
    }
  }, [tasks, handovers, today])

  const menuItems = ['浇筑记录', '试验记录', '交接历史', '消息通知', '关于']
  const utilItems = ['重置示例数据']

  const handleMenuClick = (label: string) => {
    if (label === '重置示例数据') {
      Taro.showModal({
        title: '确认重置',
        content: '将清空当前所有数据并恢复为示例数据，确定执行？',
        confirmColor: '#F53F3F',
        success: (res) => {
          if (res.confirm) resetToMock()
        }
      }).catch((e) => console.error('[Mine] reset confirm error:', e))
      return
    }
    Taro.showToast({ title: `${label}功能开发中`, icon: 'none' })
  }

  const roleColor = {
    foreman: '#1E6FFF',
    tester: '#722ED1',
    supervisor: '#0FC6C2'
  }[currentUser.role]

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userCard}>
          <View className={styles.avatar} style={{ background: `${roleColor}33` }}>
            <Text className={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
          </View>
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{currentUser.name}</Text>
            <View>
              <Text className={styles.userRole} style={{ background: `${roleColor}33` }}>
                {ROLE_LABEL[currentUser.role]}
              </Text>
            </View>
            <Text className={styles.phone}>{currentUser.phone}</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsWrap}>
        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.tasks}</Text>
            <Text className={styles.statLabel}>今日任务</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.tests}</Text>
            <Text className={styles.statLabel}>试验已录</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.handovers}</Text>
            <Text className={styles.statLabel}>今日交接</Text>
          </View>
        </View>
      </View>

      <View className={styles.roleSection}>
        <View className={styles.roleCard}>
          <Text className={styles.roleTitle}>切换身份</Text>
          <RoleTabs current={currentUser.role} onChange={switchRole} />
          <View className={styles.tip}>
            💡 切换身份可体验不同角色功能，实际使用中由系统根据登录账号自动分配角色。
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>功能菜单</Text>
        <View className={styles.listCard}>
          {menuItems.map((label) => (
            <View
              key={label}
              className={styles.listItem}
              onClick={() => handleMenuClick(label)}
            >
              <View
                className={styles.itemIcon}
                style={{ background: iconMap[label].bg }}
              >
                <Text className={styles.itemIconText}>{iconMap[label].text}</Text>
              </View>
              <Text className={styles.itemLabel}>{label}</Text>
              <Text className={styles.itemArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>工具</Text>
        <View className={styles.listCard}>
          {utilItems.map((label) => (
            <View
              key={label}
              className={styles.listItem}
              onClick={() => handleMenuClick(label)}
            >
              <View
                className={styles.itemIcon}
                style={{ background: resetIcon.bg }}
              >
                <Text className={styles.itemIconText}>{resetIcon.text}</Text>
              </View>
              <Text className={styles.itemLabel} style={{ color: '#F53F3F' }}>{label}</Text>
              <Text className={styles.itemArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default MinePage
