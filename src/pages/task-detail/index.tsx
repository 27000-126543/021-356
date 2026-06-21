import React, { useState, useMemo } from 'react'
import { View, Text, Textarea, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useApp } from '@/store/AppContext'
import { CheckItem, TestInfo, ROLE_LABEL } from '@/types'
import { formatDateTime } from '@/utils'
import StatusTag from '@/components/StatusTag'
import CheckItemComponent from '@/components/CheckItem'
import PhotoUpload from '@/components/PhotoUpload'
import styles from './index.module.scss'

const TaskDetailPage: React.FC = () => {
  const router = useRouter()
  const taskId = router.params.id || ''
  const {
    currentUser,
    getTask,
    updateTaskTest,
    updateTaskChecks,
    updateTaskStatus,
    addPauseNotice,
    rectifyPause
  } = useApp()

  const task = getTask(taskId)

  const [testForm, setTestForm] = useState<TestInfo>(
    task?.test || { mixRatioNo: '', specimenCount: 1, slump: '', photos: [] }
  )
  const [checks, setChecks] = useState<CheckItem[]>(task?.checks || [])
  const [pauseContent, setPauseContent] = useState('')
  const [showPauseInput, setShowPauseInput] = useState(false)
  const [rectifyRemark, setRectifyRemark] = useState('')
  const [rectifyPhotos, setRectifyPhotos] = useState<string[]>([])
  const [activePauseId, setActivePauseId] = useState<string | null>(null)

  if (!task) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyTip}>任务不存在</View>
      </View>
    )
  }

  const isForeman = currentUser.role === 'foreman'
  const isTester = currentUser.role === 'tester'
  const isSupervisor = currentUser.role === 'supervisor'

  const handleSaveTest = () => {
    if (!testForm.mixRatioNo.trim()) {
      Taro.showToast({ title: '请填写配合比通知单编号', icon: 'none' })
      return
    }
    updateTaskTest(taskId, testForm)
    Taro.showToast({ title: '试验信息已保存', icon: 'success' })
  }

  const toggleCheck = (index: number) => {
    if (!isSupervisor) return
    const newChecks = [...checks]
    newChecks[index] = { ...newChecks[index], checked: !newChecks[index].checked }
    setChecks(newChecks)
    updateTaskChecks(taskId, newChecks)
  }

  const handlePause = () => {
    if (!pauseContent.trim()) {
      Taro.showToast({ title: '请填写暂停原因', icon: 'none' })
      return
    }
    addPauseNotice(taskId, {
      content: pauseContent.trim(),
      createdBy: `${ROLE_LABEL[currentUser.role]}-${currentUser.name}`
    })
    setPauseContent('')
    setShowPauseInput(false)
    Taro.showToast({ title: '已发送暂停提醒', icon: 'success' })
  }

  const handleStartRectify = (pauseId: string) => {
    setActivePauseId(pauseId)
    setRectifyRemark('')
    setRectifyPhotos([])
    updateTaskStatus(taskId, 'rectifying')
  }

  const handleSubmitRectify = (pauseId: string) => {
    if (!rectifyRemark.trim()) {
      Taro.showToast({ title: '请填写整改说明', icon: 'none' })
      return
    }
    if (rectifyPhotos.length === 0) {
      Taro.showToast({ title: '请上传整改照片', icon: 'none' })
      return
    }
    rectifyPause(taskId, pauseId, {
      remark: rectifyRemark.trim(),
      photos: rectifyPhotos
    })
    setActivePauseId(null)
    setRectifyRemark('')
    setRectifyPhotos([])
    Taro.showToast({ title: '整改已提交', icon: 'success' })
  }

  const handleStartPour = () => {
    updateTaskStatus(taskId, 'pouring')
    Taro.showToast({ title: '已开始浇筑', icon: 'success' })
  }

  const handleComplete = () => {
    Taro.showModal({
      title: '确认完成',
      content: '确定标记此浇筑任务为已完成？',
      success: (res) => {
        if (res.confirm) {
          updateTaskStatus(taskId, 'completed')
          Taro.showToast({ title: '任务已完成', icon: 'success' })
        }
      }
    }).catch((err) => {
      console.error('[TaskDetail] showModal failed:', err)
    })
  }

  const allChecksPassed = checks.every((c) => c.checked)
  const openPauses = task.pauses.filter((p) => !p.rectified)

  const bottomActions = useMemo(() => {
    const actions: { key: string; label: string; style: string; onClick: () => void }[] = []

    if (isForeman) {
      if (task.status === 'pending') {
        actions.push({
          key: 'start',
          label: '开始浇筑',
          style: 'primary',
          onClick: handleStartPour
        })
      }
      if (task.status === 'pouring' || task.status === 'rectifying') {
        if (allChecksPassed || isForeman) {
          actions.push({
            key: 'complete',
            label: '完成浇筑',
            style: 'success',
            onClick: handleComplete
          })
        }
      }
    }

    return actions
  }, [isForeman, task.status, allChecksPassed])

  return (
    <View className={styles.page}>
      <View className={styles.section}>
        <View className={styles.headerTop}>
          <Text className={styles.taskNo}>{task.taskNo}</Text>
          <StatusTag status={task.status} />
        </View>
        <Text className={styles.location}>{task.basic.location}</Text>

        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>泵车编号</Text>
          <Text className={styles.infoValue}>{task.basic.pumpNumber}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>预计时间</Text>
          <Text className={styles.infoValue}>{task.basic.estimatedStartTime}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>值班人员</Text>
          <Text className={styles.infoValue}>{task.basic.onDutyStaff}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>创建人</Text>
          <Text className={styles.infoValue}>
            {task.createdBy} · {formatDateTime(task.createdAt)}
          </Text>
        </View>
        {task.basic.notes && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>注意事项</Text>
            <Text className={styles.infoValue}>{task.basic.notes}</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>试验检测信息</Text>
          <Text className={classnames(styles.roleTag, styles.tester)}>试验员</Text>
        </View>

        {task.test && !isTester ? (
          <>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>配合比编号</Text>
              <Text className={styles.infoValue}>{task.test.mixRatioNo}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>试块组数</Text>
              <Text className={styles.infoValue}>{task.test.specimenCount} 组</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>坍落度</Text>
              <Text className={styles.infoValue}>{task.test.slump}</Text>
            </View>
            {task.test.photos.length > 0 && (
              <View className={styles.photoSection}>
                <Text className={styles.photoLabel}>现场照片</Text>
                <PhotoUpload photos={task.test.photos} readonly />
              </View>
            )}
          </>
        ) : isTester ? (
          <>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>配合比通知单编号</Text>
              <Input
                className={styles.formInput}
                placeholder="如：PHB-C35-20260612"
                value={testForm.mixRatioNo}
                onInput={(e) => setTestForm({ ...testForm, mixRatioNo: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>试块组数</Text>
              <View className={styles.formNumRow}>
                <View
                  className={styles.numBtn}
                  onClick={() =>
                    setTestForm({
                      ...testForm,
                      specimenCount: Math.max(1, testForm.specimenCount - 1)
                    })
                  }
                >
                  <Text>−</Text>
                </View>
                <Text className={styles.numValue}>{testForm.specimenCount}</Text>
                <View
                  className={styles.numBtn}
                  onClick={() =>
                    setTestForm({
                      ...testForm,
                      specimenCount: Math.min(10, testForm.specimenCount + 1)
                    })
                  }
                >
                  <Text>+</Text>
                </View>
                <Text style={{ color: '#86909C', fontSize: '26rpx' }}>组</Text>
              </View>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>坍落度检测结果</Text>
              <Input
                className={styles.formInput}
                placeholder="如：160±20mm，实测168mm"
                value={testForm.slump}
                onInput={(e) => setTestForm({ ...testForm, slump: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>现场照片</Text>
              <PhotoUpload
                photos={testForm.photos}
                onChange={(photos) => setTestForm({ ...testForm, photos })}
              />
            </View>
            <View className={classnames(styles.actionBtn, styles.primary)} onClick={handleSaveTest}>
              <Text>保存试验信息</Text>
            </View>
          </>
        ) : (
          <Text className={styles.emptyTip}>试验员尚未录入检测信息</Text>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>监理检查项</Text>
          <Text className={classnames(styles.roleTag, styles.supervisor)}>监理员</Text>
        </View>

        {checks.map((item, index) => (
          <CheckItemComponent
            key={item.key}
            item={item}
            disabled={!isSupervisor}
            onChange={() => toggleCheck(index)}
          />
        ))}

        {isSupervisor && (
          <>
            {!showPauseInput ? (
              <View
                className={classnames(styles.actionBtn, styles.danger)}
                onClick={() => setShowPauseInput(true)}
              >
                <Text>发起暂停提醒</Text>
              </View>
            ) : (
              <>
                <View className={styles.formItem} style={{ marginTop: '24rpx' }}>
                  <Text className={styles.formLabel}>问题描述</Text>
                  <Textarea
                    className={styles.formTextarea}
                    placeholder="请详细描述发现的问题..."
                    value={pauseContent}
                    onInput={(e) => setPauseContent(e.detail.value)}
                  />
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.danger)}
                  onClick={handlePause}
                >
                  <Text>确认发送暂停提醒</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.ghost)}
                  onClick={() => {
                    setShowPauseInput(false)
                    setPauseContent('')
                  }}
                >
                  <Text>取消</Text>
                </View>
              </>
            )}
          </>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>暂停与整改记录</Text>
          {openPauses.length > 0 && (
            <Text className={styles.sectionBadge} style={{ color: '#F53F3F', background: 'rgba(245,63,63,0.08)' }}>
              {openPauses.length} 项待整改
            </Text>
          )}
        </View>

        {task.pauses.length === 0 ? (
          <Text className={styles.emptyTip}>暂无暂停提醒</Text>
        ) : (
          task.pauses.map((p) => (
            <View
              key={p.id}
              className={classnames(styles.pauseItem, p.rectified && styles.rectified)}
            >
              <View className={styles.pauseHeader}>
                <Text className={styles.pauseContent}>{p.content}</Text>
                <Text
                  className={classnames(styles.pauseStatus, p.rectified ? styles.done : styles.open)}
                >
                  {p.rectified ? '已整改' : '待整改'}
                </Text>
              </View>
              <Text className={styles.pauseMeta}>
                {p.createdBy} · {formatDateTime(p.createdAt)}
              </Text>

              {p.rectified ? (
                <View className={styles.rectifySection}>
                  <Text className={styles.rectifyLabel}>整改回复</Text>
                  <Text className={styles.rectifyText}>{p.rectifiedRemark}</Text>
                  {p.rectifiedPhotos && p.rectifiedPhotos.length > 0 && (
                    <PhotoUpload photos={p.rectifiedPhotos} readonly />
                  )}
                  <Text className={styles.pauseMeta} style={{ marginTop: '12rpx' }}>
                    {formatDateTime(p.rectifiedAt || '')}
                  </Text>
                </View>
              ) : isForeman ? (
                activePauseId === p.id ? (
                  <View>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>整改说明</Text>
                      <Textarea
                        className={styles.formTextarea}
                        placeholder="请描述整改情况..."
                        value={rectifyRemark}
                        onInput={(e) => setRectifyRemark(e.detail.value)}
                      />
                    </View>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>整改照片</Text>
                      <PhotoUpload photos={rectifyPhotos} onChange={setRectifyPhotos} max={4} />
                    </View>
                    <View
                      className={classnames(styles.actionBtn, styles.success)}
                      onClick={() => handleSubmitRectify(p.id)}
                    >
                      <Text>提交整改</Text>
                    </View>
                    <View
                      className={classnames(styles.actionBtn, styles.ghost)}
                      onClick={() => {
                        setActivePauseId(null)
                        setRectifyRemark('')
                        setRectifyPhotos([])
                      }}
                    >
                      <Text>取消</Text>
                    </View>
                  </View>
                ) : (
                  <View
                    className={classnames(styles.actionBtn, styles.primary)}
                    onClick={() => handleStartRectify(p.id)}
                  >
                    <Text>开始整改</Text>
                  </View>
                )
              ) : null}
            </View>
          ))
        )}
      </View>

      {bottomActions.length > 0 && (
        <View className={styles.bottomBar}>
          {bottomActions.map((a) => (
            <View
              key={a.key}
              className={classnames(styles.bottomBtn, styles[a.style as 'primary'])}
              onClick={a.onClick}
            >
              <Text>{a.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default TaskDetailPage
