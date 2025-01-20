import request from '@/utils/request'
import type { Order, OrderListParams, OrderStatistics } from '@/types/order'

// 获取订单列表
export function getOrderList(params: OrderListParams) {
  return request.get<{ list: Order[]; total: number }>('/order/list', params)
}

// 获取订单详情
export function getOrderDetail(id: string) {
  return request.get<Order>(`/order/${id}`)
}

// 更新订单状态
export function updateOrderStatus(id: string, status: string) {
  return request.put(`/order/${id}/status`, { status })
}

// 取消订单
export function cancelOrder(id: string, reason: string) {
  return request.put(`/order/${id}/cancel`, { reason })
}

// 退款订单
export function refundOrder(id: string, reason: string) {
  return request.put(`/order/${id}/refund`, { reason })
}

// 获取订单统计数据
export function getOrderStatistics(params: { startTime?: string; endTime?: string }) {
  return request.get<OrderStatistics>('/order/statistics', params)
}

// 导出订单数据
export function exportOrders(params: OrderListParams) {
  return request.get('/order/export', {
    ...params,
    responseType: 'blob'
  })
} 