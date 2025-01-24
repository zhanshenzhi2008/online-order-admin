import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import { CouponType, CouponScope, CouponStatus, PromotionType, PromotionStatus, PointRuleType, PointRecordType } from '../types/marketing'
import type { 
  Coupon, 
  Promotion,
  FullReductionRule,
  PointRule,
  PointRecord,
  CouponListParams,
  PromotionListParams,
  FullReductionListParams
} from '../types/marketing'

// 生成优惠券数据
const generateCoupons = (count: number): Coupon[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    name: Mock.Random.ctitle(5, 10),
    type: Mock.Random.pick(['FIXED', 'PERCENTAGE', 'SHIPPING']) as CouponType,
    value: Mock.Random.float(5, 100, 2, 2),
    minAmount: Mock.Random.float(0, 500, 2, 2),
    perLimit: Mock.Random.integer(1, 5),
    scope: Mock.Random.pick(['ALL', 'CATEGORY', 'PRODUCT']) as CouponScope,
    categoryIds: [],
    productIds: [],
    startTime: Mock.Random.datetime(),
    endTime: Mock.Random.datetime(),
    totalCount: Mock.Random.integer(100, 1000),
    usedCount: Mock.Random.integer(0, 100),
    status: Mock.Random.pick(['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'FINISHED']) as CouponStatus,
    description: Mock.Random.cparagraph(1, 3),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成促销活动数据
const generatePromotions = (count: number): Promotion[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    name: Mock.Random.ctitle(5, 10),
    type: Mock.Random.pick(['FLASH_SALE', 'GROUP_BUY', 'BUNDLE', 'GIFT']) as PromotionType,
    startTime: Mock.Random.datetime(),
    endTime: Mock.Random.datetime(),
    status: Mock.Random.pick(['DRAFT', 'UPCOMING', 'ACTIVE', 'PAUSED', 'FINISHED']) as PromotionStatus,
    products: Array.from({ length: Mock.Random.integer(1, 5) }, () => ({
      id: Mock.Random.id(),
      name: Mock.Random.ctitle(3, 10),
      originalPrice: Mock.Random.float(100, 1000, 2, 2),
      promotionPrice: Mock.Random.float(50, 500, 2, 2)
    })),
    rules: {
      limitPerUser: Mock.Random.integer(1, 5),
      groupSize: Mock.Random.integer(2, 10),
      bundleDiscount: Mock.Random.float(0.5, 0.9, 1, 1),
      giftThreshold: Mock.Random.float(100, 500, 2, 2)
    },
    description: Mock.Random.cparagraph(1, 3),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成满减规则数据
const generateFullReductionRules = (count: number): FullReductionRule[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    name: Mock.Random.ctitle(5, 10),
    thresholds: Array.from({ length: Mock.Random.integer(1, 3) }, () => ({
      amount: Mock.Random.float(100, 1000, 2, 2),
      discount: Mock.Random.float(10, 200, 2, 2)
    })),
    startTime: Mock.Random.datetime(),
    endTime: Mock.Random.datetime(),
    status: Mock.Random.pick(['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'FINISHED']) as CouponStatus,
    description: Mock.Random.cparagraph(1, 3),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成积分规则数据
const generatePointRules = (): PointRule[] => {
  const types = ['SIGN_IN', 'PURCHASE', 'REVIEW', 'SHARE'] as PointRuleType[]
  return types.map(type => ({
    id: Mock.Random.id(),
    type,
    points: Mock.Random.integer(1, 100),
    enabled: Mock.Random.boolean(),
    description: Mock.Random.cparagraph(1, 2),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成积分记录数据
const generatePointRecords = (count: number): PointRecord[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    userId: Mock.Random.id(),
    username: Mock.Random.cname(),
    type: Mock.Random.pick(['EARN', 'SPEND']) as PointRecordType,
    points: Mock.Random.integer(1, 100),
    description: Mock.Random.csentence(10, 20),
    createTime: Mock.Random.datetime()
  }))
}

// Mock 接口
export default [
  // 优惠券相关接口
  {
    url: '/api/coupons',
    method: 'get',
    response: ({ query }: { query: CouponListParams }) => {
      const { page = 1, pageSize = 10 } = query
      const coupons = generateCoupons(100)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: coupons.slice(start, end),
          total: coupons.length
        }
      }
    }
  },
  {
    url: '/api/coupons/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const coupon = generateCoupons(1)[0]
      coupon.id = params.id
      return {
        code: 0,
        message: 'success',
        data: coupon
      }
    }
  },
  
  // 促销活动相关接口
  {
    url: '/api/promotions',
    method: 'get',
    response: ({ query }: { query: PromotionListParams }) => {
      const { page = 1, pageSize = 10 } = query
      const promotions = generatePromotions(100)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: promotions.slice(start, end),
          total: promotions.length
        }
      }
    }
  },
  {
    url: '/api/promotions/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const promotion = generatePromotions(1)[0]
      promotion.id = params.id
      return {
        code: 0,
        message: 'success',
        data: promotion
      }
    }
  },
  
  // 满减规则相关接口
  {
    url: '/marketing/full-reductions',
    method: 'get',
    response: ({ query }: { query: FullReductionListParams }) => {
      const { page = 1, pageSize = 10, name, status } = query
      let rules = generateFullReductionRules(100)
      
      // 根据查询条件筛选
      if (name) {
        rules = rules.filter(rule => rule.name.includes(name))
      }
      if (status) {
        rules = rules.filter(rule => rule.status === status)
      }
      
      const total = rules.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: rules.slice(start, end),
          total
        }
      }
    }
  },
  {
    url: '/marketing/full-reductions/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const rule = generateFullReductionRules(1)[0]
      rule.id = params.id
      return {
        code: 0,
        message: 'success',
        data: rule
      }
    }
  },
  {
    url: '/marketing/full-reductions',
    method: 'post',
    response: ({ body }: { body: Partial<FullReductionRule> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.id(),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/marketing/full-reductions/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<FullReductionRule> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/marketing/full-reductions/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },
  {
    url: '/marketing/full-reductions/:id/pause',
    method: 'put',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: 'PAUSED',
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/marketing/full-reductions/:id/resume',
    method: 'put',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: 'ACTIVE',
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  
  // 积分规则相关接口
  {
    url: '/api/point-rules',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: generatePointRules()
      }
    }
  },
  {
    url: '/api/point-rules/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<PointRule> }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          ...body
        }
      }
    }
  },
  
  // 积分记录相关接口
  {
    url: '/api/point-records',
    method: 'get',
    response: ({ query }: { query: { page: number; pageSize: number; userId?: string; username?: string; type?: PointRecordType; startTime?: string; endTime?: string } }) => {
      const { page = 1, pageSize = 10 } = query
      const records = generatePointRecords(100)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: records.slice(start, end),
          total: records.length
        }
      }
    }
  }
] as MockMethod[] 