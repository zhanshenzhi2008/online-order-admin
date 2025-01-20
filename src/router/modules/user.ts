import type { RouteRecordRaw } from 'vue-router'

// 用户详情路由（独立配置）
const userDetailRoute: RouteRecordRaw = {
  path: '/user/detail/:id',
  name: 'UserDetail',
  component: () => import('@/views/user/detail.vue'),
  meta: {
    title: '用户详情',
    icon: 'User',
    hidden: true,
    activeMenu: '/user/list'
  }
}

// 用户管理路由
const userRoutes: RouteRecordRaw = {
  path: '/user',
  name: 'User',
  component: () => import('@/layouts/index.vue'),
  redirect: '/user/list',
  meta: {
    title: '用户管理',
    icon: 'UserFilled',
    order: 4
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: '用户列表',
        icon: 'List'
      }
    },
    {
      path: 'feedback',
      name: 'UserFeedback',
      component: () => import('@/views/user/feedback.vue'),
      meta: {
        title: '用户反馈',
        icon: 'ChatDotRound'
      }
    }
  ]
}

export { userDetailRoute }
export default userRoutes 