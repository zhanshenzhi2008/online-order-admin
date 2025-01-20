// 优惠券类型
export enum CouponType {
  FIXED = 'FIXED', // 固定金额
  PERCENTAGE = 'PERCENTAGE', // 折扣比例
  SHIPPING = 'SHIPPING' // 包邮券
}

// 优惠券使用范围
export enum CouponScope {
  ALL = 'ALL', // 全场通用
  CATEGORY = 'CATEGORY', // 指定分类
  PRODUCT = 'PRODUCT' // 指定商品
}

// 优惠券状态
export enum CouponStatus {
  DRAFT = 'DRAFT', // 草稿
  ACTIVE = 'ACTIVE', // 进行中
  PAUSED = 'PAUSED', // 已暂停
  EXPIRED = 'EXPIRED', // 已过期
  FINISHED = 'FINISHED' // 已结束
}

// 优惠券信息
export interface Coupon {
  id: string
  name: string // 优惠券名称
  type: CouponType // 优惠券类型
  value: number // 优惠金额或折扣比例
  minAmount: number // 最低使用金额
  scope: CouponScope // 使用范围
  categoryIds?: string[] // 适用分类ID列表
  productIds?: string[] // 适用商品ID列表
  totalCount: number // 发放总量
  usedCount: number // 已使用数量
  perLimit: number // 每人限领数量
  startTime: string // 有效期开始时间
  endTime: string // 有效期结束时间
  description: string // 使用说明
  status: CouponStatus // 状态
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

// 优惠券列表查询参数
export interface CouponListParams {
  page: number
  pageSize: number
  name?: string
  type?: CouponType
  status?: CouponStatus
  startTime?: string
  endTime?: string
}

// 优惠券列表响应
export interface CouponListResponse {
  list: Coupon[]
  total: number
}

// 活动类型
export enum PromotionType {
  FLASH_SALE = 'FLASH_SALE', // 限时特价
  GROUP_BUY = 'GROUP_BUY', // 团购
  BUNDLE = 'BUNDLE', // 优惠套装
  GIFT = 'GIFT' // 赠品
}

// 活动状态
export enum PromotionStatus {
  DRAFT = 'DRAFT', // 草稿
  UPCOMING = 'UPCOMING', // 未开始
  ACTIVE = 'ACTIVE', // 进行中
  PAUSED = 'PAUSED', // 已暂停
  FINISHED = 'FINISHED' // 已结束
}

export interface PromotionProduct {
  id: string
  name: string
  originalPrice: number
  promotionPrice: number
}

// 活动信息
export interface Promotion {
  id: string
  name: string // 活动名称
  type: PromotionType // 活动类型
  status: PromotionStatus // 状态
  startTime: string // 开始时间
  endTime: string // 结束时间
  products: PromotionProduct[] // 活动商品
  rules: {
    limitPerUser?: number // 每人限购数量
    groupSize?: number // 团购人数
    bundleDiscount?: number // 套餐折扣
    giftThreshold?: number // 赠品门槛
  }
  description: string // 活动说明
  createTime: string
  updateTime: string
}

// 满减规则相关类型
export interface FullReductionThreshold {
  amount: number // 满足金额
  discount: number // 优惠金额
}

export interface FullReductionRule {
  id: string
  name: string // 规则名称
  thresholds: FullReductionThreshold[] // 满减阈值列表
  startTime: string // 开始时间
  endTime: string // 结束时间
  status: CouponStatus // 状态
  description: string // 规则说明
  createTime: string
  updateTime: string
}

// 满减规则列表查询参数
export interface FullReductionListParams {
  page: number
  pageSize: number
  status?: CouponStatus
  name?: string
}

// 满减规则列表响应
export interface FullReductionListResponse {
  list: FullReductionRule[]
  total: number
}

// 积分规则类型
export enum PointRuleType {
  SIGN_IN = 'SIGN_IN', // 签到
  PURCHASE = 'PURCHASE', // 购物
  REVIEW = 'REVIEW', // 评价
  SHARE = 'SHARE' // 分享
}

// 积分规则
export interface PointRule {
  id: string
  type: PointRuleType // 规则类型
  points: number // 积分数量
  description: string // 规则说明
  enabled: boolean // 是否启用
  createTime: string
  updateTime: string
}

// 积分记录类型
export enum PointRecordType {
  EARN = 'EARN', // 获取
  SPEND = 'SPEND' // 消费
}

// 积分记录
export interface PointRecord {
  id: string
  userId: string // 用户ID
  username: string // 用户名
  type: PointRecordType // 记录类型
  points: number // 积分数量
  description: string // 记录说明
  createTime: string
}

export interface PromotionListParams {
  page: number
  pageSize: number
  name?: string
  type?: PromotionType
  status?: PromotionStatus
  startTime?: string
  endTime?: string
}

export interface PromotionListResponse {
  list: Promotion[]
  total: number
} 