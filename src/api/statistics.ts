import request from '@/utils/request'
import { StatTimeRange } from '@/types/statistics'
import type {
  SalesStatistics,
  ProductStatistics,
  UserStatistics,
  OrderStatistics
} from '@/types/statistics'

// 获取销售统计数据
export function getSalesStatistics(timeRange: StatTimeRange = StatTimeRange.LAST_30_DAYS) {
  return request.get<SalesStatistics>('/statistics/sales', { timeRange })
}

// 获取商品统计数据
export function getProductStatistics() {
  return request.get<ProductStatistics>('/statistics/products')
}

// 获取用户统计数据
export function getUserStatistics(timeRange: StatTimeRange = StatTimeRange.LAST_30_DAYS) {
  return request.get<UserStatistics>('/statistics/users', { timeRange })
}

// 获取订单统计数据
export function getOrderStatistics(timeRange: StatTimeRange = StatTimeRange.LAST_30_DAYS) {
  return request.get<OrderStatistics>('/statistics/orders', { timeRange })
}

// 获取销售趋势数据
export function getSalesTrend(
  startDate: string,
  endDate: string,
  type: 'day' | 'month' | 'year' = 'day'
) {
  return request.get<SalesStatistics['salesTrend']>('/statistics/sales/trend', {
    startDate,
    endDate,
    type
  })
}

// 获取用户趋势数据
export function getUserTrend(
  startDate: string,
  endDate: string,
  type: 'day' | 'month' | 'year' = 'day'
) {
  return request.get<UserStatistics['userTrend']>('/statistics/users/trend', {
    startDate,
    endDate,
    type
  })
}

// 获取订单趋势数据
export function getOrderTrend(
  startDate: string,
  endDate: string,
  type: 'day' | 'month' | 'year' = 'day'
) {
  return request.get<OrderStatistics['orderTrend']>('/statistics/orders/trend', {
    startDate,
    endDate,
    type
  })
}

// 获取商品销售排行
export function getProductRanking(
  timeRange: StatTimeRange = StatTimeRange.LAST_30_DAYS,
  limit: number = 10
) {
  return request.get<ProductStatistics['topSelling']>('/statistics/products/ranking', {
    timeRange,
    limit
  })
}

// 获取库存预警商品
export function getLowStockProducts(limit: number = 10) {
  return request.get<ProductStatistics['lowStock']>('/statistics/products/low-stock', {
    limit
  })
} 