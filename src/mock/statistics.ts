import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import type { SalesStatistics, ProductStatistics, UserStatistics, OrderStatistics, StatTimeRange } from '../types/statistics'

// 生成销售统计数据
const generateSalesStatistics = (timeRange: StatTimeRange): SalesStatistics => {
  return {
    totalSales: Mock.Random.float(10000, 1000000, 2, 2),
    todaySales: Mock.Random.float(1000, 10000, 2, 2),
    monthSales: Mock.Random.float(50000, 500000, 2, 2),
    yearSales: Mock.Random.float(500000, 5000000, 2, 2),
    salesTrend: Array.from({ length: 30 }, () => ({
      date: Mock.Random.date(),
      amount: Mock.Random.float(1000, 10000, 2, 2)
    })),
    categoryDistribution: Array.from({ length: 5 }, () => ({
      category: Mock.Random.ctitle(2, 4),
      amount: Mock.Random.float(1000, 10000, 2, 2),
      percentage: Mock.Random.float(0, 100, 2, 2)
    }))
  }
}

// 生成商品统计数据
const generateProductStatistics = (): ProductStatistics => {
  return {
    totalProducts: Mock.Random.integer(100, 1000),
    activeProducts: Mock.Random.integer(50, 500),
    outOfStockProducts: Mock.Random.integer(0, 50),
    stockWarningProducts: Mock.Random.integer(10, 100),
    topSelling: Array.from({ length: 10 }, () => ({
      id: Mock.Random.id(),
      name: Mock.Random.ctitle(3, 10),
      sales: Mock.Random.integer(100, 1000),
      amount: Mock.Random.float(1000, 10000, 2, 2)
    })),
    lowStock: Array.from({ length: 10 }, () => ({
      id: Mock.Random.id(),
      name: Mock.Random.ctitle(3, 10),
      stock: Mock.Random.integer(1, 10),
      threshold: Mock.Random.integer(10, 20)
    }))
  }
}

// 生成用户统计数据
const generateUserStatistics = (timeRange: StatTimeRange): UserStatistics => {
  return {
    totalUsers: Mock.Random.integer(1000, 10000),
    activeUsers: Mock.Random.integer(500, 5000),
    newUsers: Mock.Random.integer(10, 100),
    userTrend: Array.from({ length: 30 }, () => ({
      date: Mock.Random.date(),
      newUsers: Mock.Random.integer(1, 50),
      activeUsers: Mock.Random.integer(50, 200)
    })),
    userDistribution: Array.from({ length: 5 }, () => ({
      type: Mock.Random.pick(['男', '女', '未知', '18-25岁', '26-35岁']),
      count: Mock.Random.integer(100, 1000),
      percentage: Mock.Random.float(0, 100, 2, 2)
    }))
  }
}

// 生成订单统计数据
const generateOrderStatistics = (timeRange: StatTimeRange): OrderStatistics => {
  return {
    totalOrders: Mock.Random.integer(1000, 10000),
    todayOrders: Mock.Random.integer(10, 100),
    monthOrders: Mock.Random.integer(500, 5000),
    yearOrders: Mock.Random.integer(5000, 50000),
    orderTrend: Array.from({ length: 30 }, () => ({
      date: Mock.Random.date(),
      count: Mock.Random.integer(10, 100),
      amount: Mock.Random.float(1000, 10000, 2, 2)
    })),
    statusDistribution: [
      { status: '待支付', count: Mock.Random.integer(10, 100), percentage: Mock.Random.float(0, 100, 2, 2) },
      { status: '已支付', count: Mock.Random.integer(10, 100), percentage: Mock.Random.float(0, 100, 2, 2) },
      { status: '制作中', count: Mock.Random.integer(10, 100), percentage: Mock.Random.float(0, 100, 2, 2) },
      { status: '配送中', count: Mock.Random.integer(10, 100), percentage: Mock.Random.float(0, 100, 2, 2) },
      { status: '已完成', count: Mock.Random.integer(100, 1000), percentage: Mock.Random.float(0, 100, 2, 2) },
      { status: '已取消', count: Mock.Random.integer(10, 100), percentage: Mock.Random.float(0, 100, 2, 2) },
      { status: '已退款', count: Mock.Random.integer(10, 100), percentage: Mock.Random.float(0, 100, 2, 2) }
    ],
    paymentDistribution: [
      { method: '微信支付', count: Mock.Random.integer(100, 1000), amount: Mock.Random.float(10000, 100000, 2, 2), percentage: Mock.Random.float(0, 100, 2, 2) },
      { method: '支付宝', count: Mock.Random.integer(100, 1000), amount: Mock.Random.float(10000, 100000, 2, 2), percentage: Mock.Random.float(0, 100, 2, 2) },
      { method: '银行卡', count: Mock.Random.integer(10, 100), amount: Mock.Random.float(1000, 10000, 2, 2), percentage: Mock.Random.float(0, 100, 2, 2) }
    ]
  }
}

// Mock 接口
export default [
  // 销售统计
  {
    url: '/api/statistics/sales',
    method: 'get',
    response: ({ query }: { query: { timeRange?: StatTimeRange } }) => {
      const { timeRange = 'LAST_7_DAYS' } = query
      return {
        code: 0,
        message: 'success',
        data: generateSalesStatistics(timeRange)
      }
    }
  },
  
  // 商品统计
  {
    url: '/api/statistics/products',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: generateProductStatistics()
      }
    }
  },
  
  // 用户统计
  {
    url: '/api/statistics/users',
    method: 'get',
    response: ({ query }: { query: { timeRange?: StatTimeRange } }) => {
      const { timeRange = 'LAST_7_DAYS' } = query
      return {
        code: 0,
        message: 'success',
        data: generateUserStatistics(timeRange)
      }
    }
  },
  
  // 订单统计
  {
    url: '/api/statistics/orders',
    method: 'get',
    response: ({ query }: { query: { timeRange?: StatTimeRange } }) => {
      const { timeRange = 'LAST_7_DAYS' } = query
      return {
        code: 0,
        message: 'success',
        data: generateOrderStatistics(timeRange)
      }
    }
  },
  
  // 销售趋势
  {
    url: '/api/statistics/sales/trend',
    method: 'get',
    response: ({ query }: { query: { startDate: string; endDate: string; type: 'day' | 'month' | 'year' } }) => {
      const { startDate, endDate, type = 'day' } = query
      return {
        code: 0,
        message: 'success',
        data: Array.from({ length: 30 }, () => ({
          date: Mock.Random.date(),
          amount: Mock.Random.float(1000, 10000, 2, 2)
        }))
      }
    }
  },
  
  // 用户趋势
  {
    url: '/api/statistics/users/trend',
    method: 'get',
    response: ({ query }: { query: { startDate: string; endDate: string; type: 'day' | 'month' | 'year' } }) => {
      const { startDate, endDate, type = 'day' } = query
      return {
        code: 0,
        message: 'success',
        data: Array.from({ length: 30 }, () => ({
          date: Mock.Random.date(),
          count: Mock.Random.integer(1, 100)
        }))
      }
    }
  },
  
  // 订单趋势
  {
    url: '/api/statistics/orders/trend',
    method: 'get',
    response: ({ query }: { query: { startDate: string; endDate: string; type: 'day' | 'month' | 'year' } }) => {
      const { startDate, endDate, type = 'day' } = query
      return {
        code: 0,
        message: 'success',
        data: Array.from({ length: 30 }, () => ({
          date: Mock.Random.date(),
          count: Mock.Random.integer(10, 100),
          amount: Mock.Random.float(1000, 10000, 2, 2)
        }))
      }
    }
  }
] as MockMethod[] 