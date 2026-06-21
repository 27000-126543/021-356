export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${MM}-${dd} ${hh}:${mm}`
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
