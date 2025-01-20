import type { RouteRecordRaw } from 'vue-router'

const marketingRoutes: RouteRecordRaw = {
  path: '/marketing',
  name: 'Marketing',
  component: () => import('@/layouts/index.vue'),
  redirect: '/marketing/coupons',
  meta: {
    title: '营销管理',
    icon: 'Present',
    order: 7
  },
  children: [
    {
      path: 'coupons',
      name: 'Coupons',
      component: () => import('@/views/marketing/coupons/index.vue'),
      meta: {
        title: '优惠券管理',
        icon: 'Ticket'
      }
    },
    {
      path: 'promotions',
      name: 'Promotions',
      component: () => import('@/views/marketing/promotions/index.vue'),
      meta: {
        title: '活动管理',
        icon: 'Calendar'
      }
    },
    {
      path: 'full-reductions',
      name: 'FullReductions',
      component: () => import('@/views/marketing/full-reductions/index.vue'),
      meta: {
        title: '满减管理',
        icon: 'Discount'
      }
    },
    {
      path: 'points',
      name: 'Points',
      component: () => import('@/views/marketing/points/index.vue'),
      meta: {
        title: '积分管理',
        icon: 'Medal'
      },
      children: [
        {
          path: 'rules',
          name: 'PointRules',
          component: () => import('@/views/marketing/points/rules.vue'),
          meta: {
            title: '积分规则',
            icon: 'Setting'
          }
        },
        {
          path: 'records',
          name: 'PointRecords',
          component: () => import('@/views/marketing/points/records.vue'),
          meta: {
            title: '积分记录',
            icon: 'Document'
          }
        }
      ]
    }
  ]
}

export default marketingRoutes 