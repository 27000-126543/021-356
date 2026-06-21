import { HandoverRecord } from '@/types'
import { todayStr } from '@/utils'

export const mockHandovers: HandoverRecord[] = [
  {
    id: 'h1',
    date: todayStr(),
    shift: '白班→夜班',
    pouredArea: '3#楼负二层剪力墙约400㎡，5#楼一层顶板约300㎡',
    remainingVolume: '3#楼约剩60方，5#楼约剩120方',
    pendingIssues: '5#楼因模板问题暂停，待整改完成后继续；3#楼泵车管路需检查密封',
    photos: ['https://picsum.photos/id/1018/600/400'],
    status: 'pending',
    fromUser: '张建国（白班班组长）',
    createdAt: '2026-06-21T18:00:00'
  },
  {
    id: 'h2',
    date: '2026-06-20',
    shift: '夜班→白班',
    pouredArea: '2#楼桩基承台全部完成',
    remainingVolume: '无',
    pendingIssues: '无',
    photos: [],
    status: 'confirmed',
    fromUser: '王磊（夜班班组长）',
    toUser: '张建国（白班班组长）',
    createdAt: '2026-06-20T22:00:00',
    confirmedAt: '2026-06-21T06:10:00'
  }
]
