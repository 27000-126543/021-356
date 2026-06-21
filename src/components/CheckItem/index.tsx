import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { CheckItem as CheckItemType } from '@/types'
import styles from './index.module.scss'

interface CheckItemProps {
  item: CheckItemType
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

const CheckItemComponent: React.FC<CheckItemProps> = ({ item, disabled, onChange }) => {
  return (
    <View
      className={classnames(styles.row, disabled && styles.disabled)}
      onClick={() => !disabled && onChange && onChange(!item.checked)}
    >
      <View
        className={classnames(
          styles.checkbox,
          item.checked && styles.checked,
          disabled && item.checked && styles.disabledChecked
        )}
      >
        {item.checked && (
          <Text className={styles.checkIcon}>✓</Text>
        )}
      </View>
      <Text className={classnames(styles.label, item.checked && styles.labelChecked)}>
        {item.label}
      </Text>
    </View>
  )
}

export default CheckItemComponent
