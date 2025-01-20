import request from '@/utils/request'
import type { Review, ReviewListParams, ReviewStatus } from '@/types/review'

// 获取评价列表
export function getReviewList(params: ReviewListParams) {
  return request.get<{ list: Review[]; total: number }>('/review/list', params)
}

// 获取评价详情
export function getReviewDetail(id: string) {
  return request.get<Review>(`/review/${id}`)
}

// 回复评价
export function replyReview(id: string, reply: string) {
  return request.put(`/review/${id}/reply`, { reply })
}

// 审核评价
export function auditReview(id: string, status: ReviewStatus, reason?: string) {
  return request.put(`/review/${id}/audit`, { status, reason })
}

// 删除评价
export function deleteReview(id: string) {
  return request.delete(`/review/${id}`)
} 