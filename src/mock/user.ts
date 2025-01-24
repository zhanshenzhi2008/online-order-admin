import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import type { User, UserListParams, Feedback, FeedbackListParams } from '@/types/user'
import { OrderStatus } from '@/types/order'

// 生成用户数据
const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    username: Mock.Random.word(5, 10),
    nickname: Mock.Random.cname(),
    avatar: Mock.Random.image('100x100'),
    gender: Mock.Random.pick(['male', 'female', 'unknown']),
    phone: Mock.Random.string('number', 11),
    email: Mock.Random.email(),
    status: Mock.Random.pick(['active', 'inactive', 'blocked']),
    points: Mock.Random.integer(0, 10000),
    lastLoginTime: Mock.Random.datetime(),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成用户订单数据
const generateUserOrders = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    orderNo: Mock.Random.string('upper', 8),
    totalAmount: Mock.Random.float(10, 1000, 2, 2),
    status: Mock.Random.pick(Object.values(OrderStatus)),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成反馈数据
const generateFeedbacks = (count: number): Feedback[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    userId: Mock.Random.id(),
    username: Mock.Random.cname(),
    type: Mock.Random.pick(['complaint', 'suggestion', 'consultation']),
    content: Mock.Random.cparagraph(1, 3),
    images: Array.from({ length: Mock.Random.integer(0, 3) }, () => Mock.Random.image('200x200')),
    status: Mock.Random.pick(['pending', 'processing', 'resolved', 'closed']),
    reply: Mock.Random.cparagraph(1, 2),
    replyTime: Mock.Random.datetime(),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// Mock 接口
export default [
  // 用户列表
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }: { query: UserListParams }) => {
      const { page = 1, pageSize = 10, username, phone, status, startTime, endTime } = query
      
      let users = generateUsers(100)
      
      // 根据查询条件筛选
      if (username) {
        users = users.filter(user => user.username.includes(username))
      }
      if (phone) {
        users = users.filter(user => user.phone.includes(phone))
      }
      if (status) {
        users = users.filter(user => user.status === status)
      }
      if (startTime && endTime) {
        users = users.filter(user => {
          const createTime = new Date(user.createTime).getTime()
          return createTime >= new Date(startTime).getTime() && createTime <= new Date(endTime).getTime()
        })
      }
      
      const total = users.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: users.slice(start, end),
          total
        }
      }
    }
  },

  // 用户详情
  {
    url: '/api/user/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const user = generateUsers(1)[0]
      user.id = params.id
      
      return {
        code: 0,
        message: 'success',
        data: user
      }
    }
  },

  // 更新用户状态
  {
    url: '/api/user/:id/status',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: { status: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: body.status,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },

  // 用户订单列表
  {
    url: '/api/user/:userId/orders',
    method: 'get',
    response: ({ params, query }: { params: { userId: string }; query: { page: number; pageSize: number } }) => {
      const { page = 1, pageSize = 10 } = query
      const orders = generateUserOrders(50)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: orders.slice(start, end),
          total: orders.length
        }
      }
    }
  },

  // 反馈列表
  {
    url: '/api/feedback/list',
    method: 'get',
    response: ({ query }: { query: FeedbackListParams }) => {
      const { page = 1, pageSize = 10, username, type, status, startTime, endTime } = query
      
      let feedbacks = generateFeedbacks(100)
      
      // 根据查询条件筛选
      if (username) {
        feedbacks = feedbacks.filter(feedback => feedback.username.includes(username))
      }
      if (type) {
        feedbacks = feedbacks.filter(feedback => feedback.type === type)
      }
      if (status) {
        feedbacks = feedbacks.filter(feedback => feedback.status === status)
      }
      if (startTime && endTime) {
        feedbacks = feedbacks.filter(feedback => {
          const createTime = new Date(feedback.createTime).getTime()
          return createTime >= new Date(startTime).getTime() && createTime <= new Date(endTime).getTime()
        })
      }
      
      const total = feedbacks.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: feedbacks.slice(start, end),
          total
        }
      }
    }
  },

  // 反馈详情
  {
    url: '/api/feedback/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const feedback = generateFeedbacks(1)[0]
      feedback.id = params.id
      
      return {
        code: 0,
        message: 'success',
        data: feedback
      }
    }
  },

  // 更新反馈状态
  {
    url: '/api/feedback/:id/status',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: { status: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: body.status,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },

  // 回复反馈
  {
    url: '/api/feedback/:id/reply',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: { reply: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          reply: body.reply,
          replyTime: Mock.Random.datetime(),
          status: 'resolved',
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },

  // 关闭反馈
  {
    url: '/api/feedback/:id/close',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: { reason: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: 'closed',
          closeReason: body.reason,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  }
] as MockMethod[] 