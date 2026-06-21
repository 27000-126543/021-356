export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/handover/index',
    'pages/mine/index',
    'pages/task-detail/index',
    'pages/create-task/index',
    'pages/handover-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '浇筑旁站',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E6FFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '浇筑'
      },
      {
        pagePath: 'pages/handover/index',
        text: '交接'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
