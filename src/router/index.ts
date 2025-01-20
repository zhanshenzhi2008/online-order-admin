import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import orderRoutes, { orderDetailRoute } from './modules/order'
import userRoutes, { userDetailRoute } from './modules/user'
import reviewRoutes from './modules/review'
import statisticsRoutes from './modules/statistics'
import marketingRoutes from './modules/marketing'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'House' }
      }
    ]
  },
  orderRoutes,
  orderDetailRoute,
  userRoutes,
  userDetailRoute,
  reviewRoutes,
  statisticsRoutes,
  marketingRoutes,
  {
    path: '/system',
    component: () => import('@/layouts/index.vue'),
    redirect: '/system/admin',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/system/admin/index.vue'),
        meta: { title: '管理员管理', icon: 'User' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '权限管理', icon: 'Lock' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/system/config/index.vue'),
        meta: { title: '系统配置', icon: 'Tools' }
      }
    ]
  },
  {
    path: '/goods',
    component: () => import('@/layouts/index.vue'),
    redirect: '/goods/category',
    meta: { title: '商品管理', icon: 'ShoppingBag' },
    children: [
      {
        path: 'category',
        name: 'GoodsCategory',
        component: () => import('@/views/goods/category/index.vue'),
        meta: { title: '商品分类', icon: 'Menu' }
      },
      {
        path: 'list',
        name: 'GoodsList',
        component: () => import('@/views/goods/list/index.vue'),
        meta: { title: '商品列表', icon: 'List' }
      },
      {
        path: 'stock',
        name: 'GoodsStock',
        component: () => import('@/views/goods/stock/index.vue'),
        meta: { title: '库存管理', icon: 'Box' }
      },
      {
        path: 'price',
        name: 'GoodsPrice',
        component: () => import('@/views/goods/price/index.vue'),
        meta: { title: '价格管理', icon: 'Money' }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // 开启进度条
    NProgress.start()

    // 设置页面标题
    document.title = `${to.meta.title || ''} - 后台管理系统`

    // 检查是否需要登录
    if (to.path === '/login') {
      if (isAuthenticated()) {
        next('/')
      } else {
        next()
      }
      return
    }

    if (!isAuthenticated()) {
      next('/login')
      return
    }

    next()
  }
)

router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router 