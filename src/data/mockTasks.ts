import { PourTask, CHECK_ITEMS_TEMPLATE } from '@/types'
import { todayStr } from '@/utils'

export const mockTasks: PourTask[] = [
  {
    id: 't1',
    taskNo: 'JZ202606213821',
    basic: {
      location: '3#楼负二层剪力墙 C35',
      pumpNumber: '泵车A-08',
      estimatedStartTime: '2026-06-21 08:30',
      onDutyStaff: '张建国、李明、王磊',
      notes: '注意浇筑速度，控制分层厚度不超过500mm'
    },
    test: {
      mixRatioNo: 'PHB-C35-20260612',
      specimenCount: 3,
      slump: '160±20mm，实测168mm',
      photos: [
        'https://picsum.photos/id/1036/600/400',
        'https://picsum.photos/id/1039/600/400'
      ]
    },
    checks: CHECK_ITEMS_TEMPLATE.map((c, i) => ({
      ...c,
      checked: i < 3
    })),
    pauses: [],
    status: 'pouring',
    createdAt: '2026-06-21T08:15:00',
    createdBy: '张建国',
    date: todayStr()
  },
  {
    id: 't2',
    taskNo: 'JZ202606214512',
    basic: {
      location: '5#楼一层顶板 C30',
      pumpNumber: '泵车B-03',
      estimatedStartTime: '2026-06-21 14:00',
      onDutyStaff: '赵伟、孙强',
      notes: '顶板浇筑后12小时内覆盖养护'
    },
    test: undefined,
    checks: CHECK_ITEMS_TEMPLATE.map((c) => ({ ...c, checked: false })),
    pauses: [
      {
        id: 'p1',
        content: '发现局部模板未清理干净，有木屑残留',
        createdAt: '2026-06-21T14:20:00',
        createdBy: '监理-陈工',
        rectified: false
      }
    ],
    status: 'paused',
    createdAt: '2026-06-21T13:30:00',
    createdBy: '赵伟',
    date: todayStr()
  },
  {
    id: 't3',
    taskNo: 'JZ202606212033',
    basic: {
      location: '2#楼桩基承台 C40',
      pumpNumber: '泵车A-02',
      estimatedStartTime: '2026-06-21 06:00',
      onDutyStaff: '刘海、周斌',
      notes: '大体积混凝土需连续浇筑，注意测温'
    },
    test: {
      mixRatioNo: 'PHB-C40-20260608',
      specimenCount: 5,
      slump: '180±20mm，实测175mm',
      photos: ['https://picsum.photos/id/1044/600/400']
    },
    checks: CHECK_ITEMS_TEMPLATE.map((c) => ({ ...c, checked: true })),
    pauses: [
      {
        id: 'p2',
        content: '钢筋保护层垫块间距过大',
        createdAt: '2026-06-21T06:30:00',
        createdBy: '监理-陈工',
        rectified: true,
        rectifiedAt: '2026-06-21T07:10:00',
        rectifiedRemark: '已加密垫块，每800mm布置一处',
        rectifiedPhotos: ['https://picsum.photos/id/1082/600/400']
      }
    ],
    status: 'completed',
    createdAt: '2026-06-21T05:40:00',
    createdBy: '刘海',
    date: todayStr()
  },
  {
    id: 't4',
    taskNo: 'JZ202606217781',
    basic: {
      location: '1#楼二层柱 C35',
      pumpNumber: '泵车B-05',
      estimatedStartTime: '2026-06-21 16:30',
      onDutyStaff: '吴刚、郑涛',
      notes: ''
    },
    test: undefined,
    checks: CHECK_ITEMS_TEMPLATE.map((c) => ({ ...c, checked: false })),
    pauses: [],
    status: 'pending',
    createdAt: '2026-06-21T16:00:00',
    createdBy: '吴刚',
    date: todayStr()
  }
]
