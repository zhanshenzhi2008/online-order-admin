import type { RouteRecordRaw } from 'vue-router'

// 评价管理路由
const reviewRoutes: RouteRecordRaw = {
  path: '/review',
  name: 'Review',
  component: () => import('@/layouts/index.vue'),
  redirect: '/review/list',
  meta: {
    title: '评价管理',
    icon: 'Star',
    order: 5
  },
  children: [
    {
      path: 'list',
      name: 'ReviewList',
      component: () => import('@/views/review/index.vue'),
      meta: {
        title: '评价列表',
        icon: 'List'
      }
    }
  ]
}

export default reviewRoutes 