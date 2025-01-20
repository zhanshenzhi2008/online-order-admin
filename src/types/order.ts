// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',    // 待支付
  PAID = 'paid',         // 已支付
  PREPARING = 'preparing', // 制作中
  DELIVERING = 'delivering', // 配送中
  COMPLETED = 'completed',  // 已完成
  CANCELLED = 'cancelled',  // 已取消
  REFUNDED = 'refunded'    // 已退款
}

// 订单项接口
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// 订单接口
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  paymentTime?: string;
  deliveryTime?: string;
  completionTime?: string;
  remark?: string;
  items: OrderItem[];
  createTime: string;
  updateTime: string;
}

// 订单列表查询参数
export interface OrderListParams {
  page: number;
  pageSize: number;
  orderNo?: string;
  status?: OrderStatus;
  userName?: string;
  userPhone?: string;
  startTime?: string;
  endTime?: string;
}

// 订单统计数据
export interface OrderStatistics {
  totalOrders: number;
  totalAmount: number;
  statusCounts: Record<OrderStatus, number>;
  dailyOrders: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    salesCount: number;
    salesAmount: number;
  }>;
} 