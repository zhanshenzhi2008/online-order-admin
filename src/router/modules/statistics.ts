import type { RouteRecordRaw } from 'vue-router'

const statisticsRoutes: RouteRecordRaw = {
  path: '/statistics',
  name: 'Statistics',
  component: () => import('@/layouts/index.vue'),
  redirect: '/statistics/sales',
  meta: {
    title: '数据统计',
    icon: 'DataLine',
    order: 6
  },
  children: [
    {
      path: 'sales',
      name: 'SalesStatistics',
      component: () => import('@/views/statistics/sales.vue'),
      meta: {
        title: '销售统计',
        icon: 'Money'
      }
    },
    {
      path: 'products',
      name: 'ProductStatistics',
      component: () => import('@/views/statistics/products.vue'),
      meta: {
        title: '商品统计',
        icon: 'ShoppingCart'
      }
    },
    {
      path: 'users',
      name: 'UserStatistics',
      component: () => import('@/views/statistics/users.vue'),
      meta: {
        title: '用户统计',
        icon: 'User'
      }
    },
    {
      path: 'orders',
      name: 'OrderStatistics',
      component: () => import('@/views/statistics/orders.vue'),
      meta: {
        title: '订单统计',
        icon: 'List'
      }
    }
  ]
}

export default statisticsRoutes 