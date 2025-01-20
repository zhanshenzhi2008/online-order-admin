// 评价状态枚举
export enum ReviewStatus {
  PENDING = 'pending',   // 待审核
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected'  // 已拒绝
}

// 评分等级
export type RatingLevel = 1 | 2 | 3 | 4 | 5

// 评价信息接口
export interface Review {
  id: string
  userId: string
  username: string
  orderId: string
  orderNo: string
  rating: RatingLevel
  content: string
  images?: string[]
  reply?: string
  replyTime?: string
  status: ReviewStatus
  createTime: string
  updateTime: string
}

// 评价列表查询参数
export interface ReviewListParams {
  page: number
  pageSize: number
  userId?: string
  username?: string
  orderNo?: string
  rating?: RatingLevel
  status?: ReviewStatus
  startTime?: string
  endTime?: string
} 