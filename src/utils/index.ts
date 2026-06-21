export const formatTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch (e) {
    console.error('[Utils] formatTime error:', e)
    return dateStr
  }
}

export const formatDateTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${MM}-${dd} ${hh}:${mm}`
  } catch (e) {
    console.error('[Utils] formatDateTime error:', e)
    return dateStr
  }
}

export const todayStr = (): string => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}`
}

export const genTaskNo = (): string => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 9000 + 1000)
  return `JZ${yyyy}${MM}${dd}${rand}`
}

export const genId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/**
 * 生成默认的预计开始时间字符串（YYYY-MM-DD HH:mm 格式）
 * - 将分钟向上取整到最近的 10 的倍数
 * - 如分钟进位后达到 60，则小时 +1，分钟归零
 * - 如小时进位后达到 24，则日期 +1（一般罕见，仅 23:50-23:59 会触发）
 */
export const getDefaultEstimateTime = (): string => {
  const d = new Date()
  let yyyy = d.getFullYear()
  let MM = d.getMonth()
  let dd = d.getDate()
  let hh = d.getHours()
  let mm = d.getMinutes()

  mm = Math.ceil(mm / 10) * 10
  if (mm >= 60) {
    mm = 0
    hh += 1
    if (hh >= 24) {
      hh = 0
      const next = new Date(yyyy, MM, dd + 1)
      yyyy = next.getFullYear()
      MM = next.getMonth()
      dd = next.getDate()
    }
  }

  const MMstr = String(MM + 1).padStart(2, '0')
  const ddstr = String(dd).padStart(2, '0')
  const hhstr = String(hh).padStart(2, '0')
  const mmstr = String(mm).padStart(2, '0')
  return `${yyyy}-${MMstr}-${ddstr} ${hhstr}:${mmstr}`
}
