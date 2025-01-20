import request from '@/utils/request'
import type { User, UserListParams, Feedback, FeedbackListParams } from '@/types/user'

// 获取用户列表
export function getUserList(params: UserListParams) {
  return request.get<{ list: User[]; total: number }>('/user/list', params)
}

// 获取用户详情
export function getUserDetail(id: string) {
  return request.get<User>(`/user/${id}`)
}

// 更新用户状态
export function updateUserStatus(id: string, status: string) {
  return request.put(`/user/${id}/status`, { status })
}

// 获取用户订单列表
export function getUserOrders(userId: string, params: { page: number; pageSize: number }) {
  return request.get(`/user/${userId}/orders`, params)
}

// 获取用户反馈列表
export function getFeedbackList(params: FeedbackListParams) {
  return request.get<{ list: Feedback[]; total: number }>('/feedback/list', params)
}

// 获取反馈详情
export function getFeedbackDetail(id: string) {
  return request.get<Feedback>(`/feedback/${id}`)
}

// 更新反馈状态
export function updateFeedbackStatus(id: string, status: string) {
  return request.put(`/feedback/${id}/status`, { status })
}

// 回复反馈
export function replyFeedback(id: string, reply: string) {
  return request.put(`/feedback/${id}/reply`, { reply })
}

// 关闭反馈
export function closeFeedback(id: string, reason: string) {
  return request.put(`/feedback/${id}/close`, { reason })
} 