import React, { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useApp } from '@/store/AppContext'
import { todayStr } from '@/utils'
import styles from './index.module.scss'

const CreateTaskPage: React.FC = () => {
  const { currentUser, addTask } = useApp()

  const now = new Date()
  const defaultTime = `${todayStr()} ${String(now.getHours()).padStart(2, '0')}:${String(
    Math.ceil(now.getMinutes() / 10) * 10
  ).padStart(2, '0')}`

  const [form, setForm] = useState({
    location: '',
    pumpNumber: '',
    estimatedStartTime: defaultTime,
    onDutyStaff: currentUser.name,
    notes: ''
  })

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.location.trim()) {
      Taro.showToast({ title: '请填写浇筑部位', icon: 'none' })
      return
    }
    if (!form.pumpNumber.trim()) {
      Taro.showToast({ title: '请填写泵车编号', icon: 'none' })
      return
    }
    if (!form.estimatedStartTime.trim()) {
      Taro.showToast({ title: '请填写预计开始时间', icon: 'none' })
      return
    }
    if (!form.onDutyStaff.trim()) {
      Taro.showToast({ title: '请填写值班人员', icon: 'none' })
      return
    }

    const task = addTask(
      {
        location: form.location.trim(),
        pumpNumber: form.pumpNumber.trim(),
        estimatedStartTime: form.estimatedStartTime.trim(),
        onDutyStaff: form.onDutyStaff.trim(),
        notes: form.notes.trim()
      },
      currentUser.name
    )

    console.log('[CreateTask] task created:', task.taskNo)

    Taro.showToast({ title: '任务创建成功', icon: 'success' })
    setTimeout(() => {
      Taro.redirectTo({ url: `/pages/task-detail/index?id=${task.id}` })
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>💡 填写说明</Text>
        <Text className={styles.tipText}>
          请准确填写浇筑部位、泵车信息和值班人员，以便试验员和监理员及时协同处理。
        </Text>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.required)}>浇筑部位</Text>
          <Input
            className={styles.formInput}
            placeholder="如：3#楼负二层剪力墙 C35"
            value={form.location}
            onInput={(e) => updateField('location', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.required)}>泵车编号</Text>
          <Input
            className={styles.formInput}
            placeholder="如：泵车A-08"
            value={form.pumpNumber}
            onInput={(e) => updateField('pumpNumber', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.required)}>预计开始时间</Text>
          <Input
            className={styles.formInput}
            placeholder="如：2026-06-21 08:30"
            value={form.estimatedStartTime}
            onInput={(e) => updateField('estimatedStartTime', e.detail.value)}
          />
          <Text className={styles.hint}>格式：YYYY-MM-DD HH:mm</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={classnames(styles.formLabel, styles.required)}>值班人员</Text>
          <Input
            className={styles.formInput}
            placeholder="多个人员用顿号分隔，如：张三、李四"
            value={form.onDutyStaff}
            onInput={(e) => updateField('onDutyStaff', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>注意事项</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="选填，浇筑过程中需要特别注意的事项..."
            value={form.notes}
            onInput={(e) => updateField('notes', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>创建任务</Text>
        </View>
      </View>
    </View>
  )
}

export default CreateTaskPage
