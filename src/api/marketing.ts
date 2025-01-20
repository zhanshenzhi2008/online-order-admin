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
  return request<CouponListResponse>({
    url: '/marketing/coupons',
    method: 'get',
    params
  })
}

export function getCouponDetail(id: string) {
  return request<Coupon>({
    url: `/marketing/coupons/${id}`,
    method: 'get'
  })
}

export function createCoupon(data: Omit<Coupon, 'id' | 'usedCount' | 'status' | 'createTime' | 'updateTime'>) {
  return request<Coupon>({
    url: '/marketing/coupons',
    method: 'post',
    data
  })
}

export function updateCoupon(id: string, data: Partial<Omit<Coupon, 'id' | 'usedCount' | 'createTime' | 'updateTime'>>) {
  return request<Coupon>({
    url: `/marketing/coupons/${id}`,
    method: 'put',
    data
  })
}

export function deleteCoupon(id: string) {
  return request({
    url: `/marketing/coupons/${id}`,
    method: 'delete'
  })
}

export function pauseCoupon(id: string) {
  return request<Coupon>({
    url: `/marketing/coupons/${id}/pause`,
    method: 'put'
  })
}

export function resumeCoupon(id: string) {
  return request<Coupon>({
    url: `/marketing/coupons/${id}/resume`,
    method: 'put'
  })
}

// 活动相关接口
export function getPromotionList(params: PromotionListParams) {
  return request<PromotionListResponse>({
    url: '/marketing/promotions',
    method: 'get',
    params
  })
}

export function getPromotionDetail(id: string) {
  return request<Promotion>({
    url: `/marketing/promotions/${id}`,
    method: 'get'
  })
}

export function createPromotion(data: Omit<Promotion, 'id' | 'status' | 'createTime' | 'updateTime'>) {
  return request<Promotion>({
    url: '/marketing/promotions',
    method: 'post',
    data
  })
}

export function updatePromotion(id: string, data: Partial<Omit<Promotion, 'id' | 'createTime' | 'updateTime'>>) {
  return request<Promotion>({
    url: `/marketing/promotions/${id}`,
    method: 'put',
    data
  })
}

export function deletePromotion(id: string) {
  return request({
    url: `/marketing/promotions/${id}`,
    method: 'delete'
  })
}

// 满减规则相关接口
export function getFullReductionList(params: FullReductionListParams) {
  return request<FullReductionListResponse>({
    url: '/marketing/full-reductions',
    method: 'get',
    params
  })
}

export function getFullReductionDetail(id: string) {
  return request<FullReductionRule>({
    url: `/marketing/full-reductions/${id}`,
    method: 'get'
  })
}

export function createFullReduction(data: Omit<FullReductionRule, 'id' | 'createTime' | 'updateTime'>) {
  return request<FullReductionRule>({
    url: '/marketing/full-reductions',
    method: 'post',
    data
  })
}

export function updateFullReduction(
  id: string,
  data: Partial<Omit<FullReductionRule, 'id' | 'createTime' | 'updateTime'>>
) {
  return request<FullReductionRule>({
    url: `/marketing/full-reductions/${id}`,
    method: 'put',
    data
  })
}

export function deleteFullReduction(id: string) {
  return request({
    url: `/marketing/full-reductions/${id}`,
    method: 'delete'
  })
}

export function pauseFullReduction(id: string) {
  return request<FullReductionRule>({
    url: `/marketing/full-reductions/${id}/pause`,
    method: 'put'
  })
}

export function resumeFullReduction(id: string) {
  return request<FullReductionRule>({
    url: `/marketing/full-reductions/${id}/resume`,
    method: 'put'
  })
}

// 积分规则相关接口
export function getPointRuleList() {
  return request<PointRule[]>({
    url: '/marketing/point-rules',
    method: 'get'
  })
}

export function updatePointRule(id: string, data: Partial<Omit<PointRule, 'id' | 'type' | 'createTime' | 'updateTime'>>) {
  return request<PointRule>({
    url: `/marketing/point-rules/${id}`,
    method: 'put',
    data
  })
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
  return request<{ list: PointRecord[]; total: number }>({
    url: '/marketing/point-records',
    method: 'get',
    params
  })
}

export function getUserPoints(userId: string) {
  return request<{ points: number }>({
    url: `/marketing/points/${userId}`,
    method: 'get'
  })
} 