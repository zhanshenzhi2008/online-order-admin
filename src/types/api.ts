// Common
export interface Response<T = any> {
  code: number
  message: string
  data: T
}

export interface PageParams {
  page: number
  size: number
}

export interface PageResult<T> {
  total: number
  list: T[]
}

// User
export interface LoginParams {
  phone: string
  code: string
}

export interface UserInfo {
  id: string
  phone: string
  nickname: string
  avatar: string
  gender: number
  status: number
  roles: string[]
  permissions: string[]
  lastLoginTime: string
  createTime: string
  updateTime: string
}

// Shop
export interface Shop {
  id: string
  name: string
  logo: string
  description: string
  notice: string
  phone: string
  address: string
  longitude: number
  latitude: number
  status: number
  openTime: string
  closeTime: string
  deliveryFee: number
  minOrder: number
  maxDeliveryDistance: number
  score: number
  sales: number
  createTime: string
  updateTime: string
}

// Category
export interface Category {
  id: string
  shopId: string
  name: string
  description: string
  image: string
  sort: number
  status: number
  createTime: string
  updateTime: string
}

// Food
export interface Food {
  id: string
  shopId: string
  categoryId: string
  name: string
  description: string
  image: string
  price: number
  originalPrice: number
  specs: any[]
  additions: any[]
  stock: number
  sales: number
  status: number
  sort: number
  createTime: string
  updateTime: string
}

// Order
export interface Order {
  id: string
  orderNo: string
  userId: string
  shopId: string
  addressId: string
  items: OrderItem[]
  totalAmount: number
  payAmount: number
  deliveryFee: number
  status: string
  paymentMethod: string
  paymentTime: string
  deliveryTime: string
  completedTime: string
  remark: string
  createTime: string
  updateTime: string
}

export interface OrderItem {
  id: string
  orderId: string
  foodId: string
  name: string
  image: string
  price: number
  quantity: number
  specs: any[]
  additions: any[]
}

// Statistics
export interface DashboardData {
  todayOrderCount: number
  todayOrderAmount: number
  todayNewUserCount: number
  totalOrderCount: number
  totalOrderAmount: number
  totalUserCount: number
  orderTrend: OrderTrend[]
  userTrend: UserTrend[]
  salesRanking: SalesRanking[]
}

export interface OrderTrend {
  date: string
  count: number
  amount: number
}

export interface UserTrend {
  date: string
  count: number
}

export interface SalesRanking {
  id: string
  name: string
  image: string
  sales: number
  amount: number
}

// Upload
export interface UploadResult {
  url: string
  path: string
  name: string
  size: number
  type: string
} 