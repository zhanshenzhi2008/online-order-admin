// 销售统计数据
export interface SalesStatistics {
  totalSales: number // 总销售额
  todaySales: number // 今日销售额
  monthSales: number // 本月销售额
  yearSales: number // 本年销售额
  salesTrend: Array<{
    date: string
    amount: number
  }> // 销售趋势
  categoryDistribution: Array<{
    category: string
    amount: number
    percentage: number
  }> // 品类分布
}

// 商品统计数据
export interface ProductStatistics {
  totalProducts: number // 总商品数
  activeProducts: number // 在售商品数
  outOfStockProducts: number // 缺货商品数
  topSelling: Array<{
    id: string
    name: string
    sales: number
    amount: number
  }> // 热销商品
  lowStock: Array<{
    id: string
    name: string
    stock: number
    threshold: number
  }> // 库存预警
}

// 用户统计数据
export interface UserStatistics {
  totalUsers: number // 总用户数
  activeUsers: number // 活跃用户数
  newUsers: number // 新增用户数
  userTrend: Array<{
    date: string
    newUsers: number
    activeUsers: number
  }> // 用户趋势
  userDistribution: Array<{
    type: string
    count: number
    percentage: number
  }> // 用户分布
}

// 订单统计数据
export interface OrderStatistics {
  totalOrders: number // 总订单数
  todayOrders: number // 今日订单数
  monthOrders: number // 本月订单数
  yearOrders: number // 本年订单数
  orderTrend: Array<{
    date: string
    count: number
    amount: number
  }> // 订单趋势
  statusDistribution: Array<{
    status: string
    count: number
    percentage: number
  }> // 订单状态分布
  paymentDistribution: Array<{
    method: string
    count: number
    amount: number
    percentage: number
  }> // 支付方式分布
}

// 统计时间范围
export enum StatTimeRange {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last7days',
  LAST_30_DAYS = 'last30days',
  THIS_MONTH = 'thisMonth',
  LAST_MONTH = 'lastMonth',
  THIS_YEAR = 'thisYear'
} 