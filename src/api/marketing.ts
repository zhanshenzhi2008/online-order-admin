import request from '@/utils/request'
import type {
  Coupon,
  CouponListParams,
  CouponListResponse,
  Promotion,
  PromotionListParams,
  PromotionListResponse,
  FullReductionRule,
  FullReductionListParams,
  FullReductionListResponse,
  PointRule,
  PointRecord
} from '@/types/marketing'

// 优惠券相关接口
export function getCouponList(params: CouponListParams) {
  return request.get<CouponListResponse>('/marketing/coupons', params)
}

export function getCouponDetail(id: string) {
  return request.get<Coupon>(`/marketing/coupons/${id}`)
}

export function createCoupon(data: Omit<Coupon, 'id' | 'usedCount' | 'status' | 'createTime' | 'updateTime'>) {
  return request.post<Coupon>('/marketing/coupons', data)
}

export function updateCoupon(id: string, data: Partial<Omit<Coupon, 'id' | 'usedCount' | 'createTime' | 'updateTime'>>) {
  return request.put<Coupon>(`/marketing/coupons/${id}`, data)
}

export function deleteCoupon(id: string) {
  return request.delete(`/marketing/coupons/${id}`)
}

export function pauseCoupon(id: string) {
  return request.put<Coupon>(`/marketing/coupons/${id}/pause`)
}

export function resumeCoupon(id: string) {
  return request.put<Coupon>(`/marketing/coupons/${id}/resume`)
}

// 活动相关接口
export function getPromotionList(params: PromotionListParams) {
  return request.get<PromotionListResponse>('/marketing/promotions', params)
}

export function getPromotionDetail(id: string) {
  return request.get<Promotion>(`/marketing/promotions/${id}`)
}

export function createPromotion(data: Omit<Promotion, 'id' | 'status' | 'createTime' | 'updateTime'>) {
  return request.post<Promotion>('/marketing/promotions', data)
}

export function updatePromotion(id: string, data: Partial<Omit<Promotion, 'id' | 'createTime' | 'updateTime'>>) {
  return request.put<Promotion>(`/marketing/promotions/${id}`, data)
}

export function deletePromotion(id: string) {
  return request.delete(`/marketing/promotions/${id}`)
}

// 满减规则相关接口
export function getFullReductionList(params: FullReductionListParams) {
  return request.get<FullReductionListResponse>('/marketing/full-reductions', params)
}

export function getFullReductionDetail(id: string) {
  return request.get<FullReductionRule>(`/marketing/full-reductions/${id}`)
}

export function createFullReduction(data: Omit<FullReductionRule, 'id' | 'createTime' | 'updateTime'>) {
  return request.post<FullReductionRule>('/marketing/full-reductions', data)
}

export function updateFullReduction(
  id: string,
  data: Partial<Omit<FullReductionRule, 'id' | 'createTime' | 'updateTime'>>
) {
  return request.put<FullReductionRule>(`/marketing/full-reductions/${id}`, data)
}

export function deleteFullReduction(id: string) {
  return request.delete(`/marketing/full-reductions/${id}`)
}

export function pauseFullReduction(id: string) {
  return request.put<FullReductionRule>(`/marketing/full-reductions/${id}/pause`)
}

export function resumeFullReduction(id: string) {
  return request.put<FullReductionRule>(`/marketing/full-reductions/${id}/resume`)
}

// 积分规则相关接口
export function getPointRuleList() {
  return request.get<PointRule[]>('/marketing/point-rules')
}

export function updatePointRule(id: string, data: Partial<Omit<PointRule, 'id' | 'type' | 'createTime' | 'updateTime'>>) {
  return request.put<PointRule>(`/marketing/point-rules/${id}`, data)
}

// 积分记录相关接口
export function getPointRecordList(params: {
  page: number
  pageSize: number
  userId?: string
  username?: string
  type?: string
  startTime?: string
  endTime?: string
}) {
  return request.get<{ list: PointRecord[]; total: number }>('/marketing/point-records', params)
}

export function getUserPoints(userId: string) {
  return request.get<{ points: number }>(`/marketing/points/${userId}`)
} 