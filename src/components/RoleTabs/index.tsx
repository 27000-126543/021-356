import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { UserRole, ROLE_LABEL } from '@/types'
import styles from './index.module.scss'

interface RoleTabsProps {
  current: UserRole
  onChange?: (role: UserRole) => void
}

const roles: { key: UserRole; color: string }[] = [
  { key: 'foreman', color: '#1E6FFF' },
  { key: 'tester', color: '#722ED1' },
  { key: 'supervisor', color: '#0FC6C2' }
]

const RoleTabs: React.FC<RoleTabsProps> = ({ current, onChange }) => {
  return (
    <View className={styles.wrap}>
      {roles.map((r) => {
        const active = r.key === current
        return (
          <View
            key={r.key}
            className={classnames(styles.tab, active && styles.active)}
            style={active ? { backgroundColor: r.color, borderColor: r.color } : {}}
            onClick={() => onChange && onChange(r.key)}
          >
            <Text
              className={classnames(styles.tabText, active && styles.activeText)}
              style={active ? { color: '#fff' } : {}}
            >
              {ROLE_LABEL[r.key]}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default RoleTabs
