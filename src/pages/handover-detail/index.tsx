import React, { useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useApp } from '@/store/AppContext'
import { formatDateTime, todayStr } from '@/utils'
import StatusTag from '@/components/StatusTag'
import PhotoUpload from '@/components/PhotoUpload'
import styles from './index.module.scss'

const HandoverDetailPage: React.FC = () => {
  const router = useRouter()
  const id = router.params.id || ''
  const isCreate = router.params.create === '1'

  const { handovers, currentUser, addHandover, confirmHandover } = useApp()
  const record = handovers.find((h) => h.id === id)

  const hour = new Date().getHours()
  const defaultShift = hour >= 6 && hour < 18 ? '白班→夜班' : '夜班→白班'

  const [form, setForm] = useState({
    shift: defaultShift,
    pouredArea: '',
    remainingVolume: '',
    pendingIssues: '',
    photos: [] as string[]
  })

  if (isCreate) {
    const handleSubmit = () => {
      if (!form.pouredArea.trim()) {
        Taro.showToast({ title: '请填写已浇区域', icon: 'none' })
        return
      }
      if (!form.remainingVolume.trim()) {
        Taro.showToast({ title: '请填写剩余方量', icon: 'none' })
        return
      }
      if (!form.pendingIssues.trim()) {
        Taro.showToast({ title: '请填写待处理问题', icon: 'none' })
        return
      }

      const rec = addHandover({
        date: todayStr(),
        shift: form.shift,
        pouredArea: form.pouredArea.trim(),
        remainingVolume: form.remainingVolume.trim(),
        pendingIssues: form.pendingIssues.trim(),
        photos: form.photos,
        fromUser: `${currentUser.name}（${hour >= 6 && hour < 18 ? '白班' : '夜班'}班组长）`
      })

      console.log('[Handover] created:', rec.id)

      Taro.showToast({ title: '交接单已创建', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }

    return (
      <View className={styles.page}>
        <View className={styles.tipCard}>
          <Text className={styles.tipTitle}>⚠️ 交接须知</Text>
          <Text className={styles.tipText}>
            请如实填写本班次浇筑进展和未处理问题，确保下一班次能顺利衔接，减少口头交接漏项。
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>交接信息</Text>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel)}>班次</Text>
            <View style={{ display: 'flex', gap: '16rpx' }}>
              {['白班→夜班', '夜班→白班'].map((s) => (
                <View
                  key={s}
                  style={{
                    flex: 1,
                    height: '72rpx',
                    borderRadius: '12rpx',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: form.shift === s ? '#1E6FFF' : '#F5F7FA',
                    color: form.shift === s ? '#fff' : '#4E5969',
                    fontSize: '28rpx',
                    fontWeight: form.shift === s ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setForm({ ...form, shift: s })}
                >
                  <Text>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>已浇区域</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请描述本班次已完成浇筑的区域和方量，如：3#楼负二层剪力墙约400㎡"
              value={form.pouredArea}
              onInput={(e) => setForm({ ...form, pouredArea: e.detail.value })}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>剩余方量</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请描述剩余未浇筑的部位和预计方量，如：3#楼约剩60方"
              value={form.remainingVolume}
              onInput={(e) => setForm({ ...form, remainingVolume: e.detail.value })}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.formLabel, styles.required)}>待处理问题</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请详细说明需要下一班关注的问题，如：5#楼因模板问题暂停，待整改后继续"
              value={form.pendingIssues}
              onInput={(e) => setForm({ ...form, pendingIssues: e.detail.value })}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.photoLabel}>现场照片（选填）</Text>
            <PhotoUpload
              photos={form.photos}
              onChange={(photos) => setForm({ ...form, photos })}
              max={6}
            />
          </View>
        </View>

        <View className={styles.bottomBar}>
          <View className={styles.primaryBtn} onClick={handleSubmit}>
            <Text>提交交接单</Text>
          </View>
        </View>
      </View>
    )
  }

  if (!record) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx 32rpx', textAlign: 'center' }}>
          <Text style={{ fontSize: '28rpx', color: '#86909C' }}>交接记录不存在</Text>
        </View>
      </View>
    )
  }

  const isForeman = currentUser.role === 'foreman'
  const canConfirm = isForeman && record.status === 'pending'

  const handleConfirm = () => {
    Taro.showModal({
      title: '确认接收',
      content: '确认已阅读交接内容并接班？',
      success: (res) => {
        if (res.confirm) {
          const h = new Date().getHours()
          confirmHandover(
            record.id,
            `${currentUser.name}（${h >= 6 && h < 18 ? '白班' : '夜班'}班组长）`
          )
          Taro.showToast({ title: '已确认接收', icon: 'success' })
        }
      }
    }).catch((err) => {
      console.error('[HandoverDetail] confirm failed:', err)
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.section}>
        <View className={styles.headerRow}>
          <Text className={styles.shiftLabel}>{record.shift}</Text>
          <StatusTag
            status={record.status}
            label={record.status === 'confirmed' ? '已确认' : '待确认'}
          />
        </View>

        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>交接日期</Text>
          <Text className={styles.infoValue}>{record.date}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>交班人</Text>
          <Text className={styles.infoValue}>{record.fromUser}</Text>
        </View>
        {record.toUser && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>接班人</Text>
            <Text className={styles.infoValue}>{record.toUser}</Text>
          </View>
        )}
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建时间</Text>
          <Text className={styles.infoValue}>{formatDateTime(record.createdAt)}</Text>
        </View>
        {record.confirmedAt && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>确认时间</Text>
            <Text className={styles.infoValue}>{formatDateTime(record.confirmedAt)}</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>交接内容</Text>

        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>已浇区域</Text>
          <Text className={styles.infoValue}>{record.pouredArea || '无'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>剩余方量</Text>
          <Text className={styles.infoValue}>{record.remainingVolume || '无'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>待处理问题</Text>
          <Text className={styles.infoValue}>{record.pendingIssues || '无'}</Text>
        </View>

        {record.photos.length > 0 && (
          <View className={styles.photoSection}>
            <Text className={styles.photoLabel}>现场照片</Text>
            <PhotoUpload photos={record.photos} readonly />
          </View>
        )}
      </View>

      {canConfirm && (
        <View className={styles.bottomBar}>
          <View className={styles.successBtn} onClick={handleConfirm}>
            <Text>确认接收</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default HandoverDetailPage
