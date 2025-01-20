import type { RouteRecordRaw } from 'vue-router'

// 订单详情路由（独立配置）
const orderDetailRoute: RouteRecordRaw = {
  path: '/order/detail/:id',
  name: 'OrderDetail',
  component: () => import('@/views/order/detail.vue'),
  meta: {
    title: '订单详情',
    icon: 'Document',
    hidden: true,
    activeMenu: '/order/list'
  }
}

// 订单管理路由
const orderRoutes: RouteRecordRaw = {
  path: '/order',
  name: 'Order',
  component: () => import('@/layouts/index.vue'),
  redirect: '/order/list',
  meta: {
    title: '订单管理',
    icon: 'ShoppingCart',
    order: 3
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/index.vue'),
      meta: {
        title: '订单列表',
        icon: 'List'
      }
    },
    {
      path: 'status',
      name: 'OrderStatus',
      component: () => import('@/views/order/status.vue'),
      meta: {
        title: '状态管理',
        icon: 'Setting'
      }
    },
    {
      path: 'statistics',
      name: 'OrderStatistics',
      component: () => import('@/views/order/statistics.vue'),
      meta: {
        title: '订单统计',
        icon: 'PieChart'
      }
    }
  ]
}

export { orderDetailRoute }
export default orderRoutes 