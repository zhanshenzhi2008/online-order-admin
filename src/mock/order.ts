import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import { OrderStatus } from '../types/order'
import type { Order, OrderListParams } from '../types/order'

const orderStatus: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PAID,
  OrderStatus.PREPARING,
  OrderStatus.DELIVERING,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED
]

// 生成模拟订单数据
const generateOrders = (count: number): Order[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    orderNo: Mock.Random.string('upper', 8),
    userId: Mock.Random.id(),
    userName: Mock.Random.cname(),
    userPhone: Mock.Random.string('number', 11),
    userAddress: `${Mock.Random.province()}${Mock.Random.city()}${Mock.Random.county()}${Mock.Random.ctitle(10, 30)}`,
    totalAmount: Mock.Random.float(10, 1000, 2, 2),
    status: Mock.Random.pick(orderStatus),
    paymentMethod: Mock.Random.pick(['微信支付', '支付宝', '银行卡']),
    paymentTime: Mock.Random.datetime(),
    deliveryTime: Mock.Random.datetime(),
    completionTime: Mock.Random.datetime(),
    remark: Mock.Random.ctitle(10, 30),
    items: Array.from({ length: Mock.Random.integer(1, 5) }, () => ({
      id: Mock.Random.id(),
      orderId: Mock.Random.id(),
      productId: Mock.Random.id(),
      productName: Mock.Random.ctitle(3, 10),
      productImage: Mock.Random.image('200x200'),
      price: Mock.Random.float(10, 200, 2, 2),
      quantity: Mock.Random.integer(1, 5),
      subtotal: Mock.Random.float(10, 1000, 2, 2)
    })),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// Mock 接口
export default [
  // 获取订单列表
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }: { query: OrderListParams }) => {
      const { page = 1, pageSize = 10, status, orderNo, userName, userPhone, startTime, endTime } = query
      
      let orders = generateOrders(100)
      
      // 根据查询条件筛选
      if (status) {
        orders = orders.filter(order => order.status === status)
      }
      if (orderNo) {
        orders = orders.filter(order => order.orderNo.includes(orderNo))
      }
      if (userName) {
        orders = orders.filter(order => order.userName.includes(userName))
      }
      if (userPhone) {
        orders = orders.filter(order => order.userPhone.includes(userPhone))
      }
      if (startTime && endTime) {
        orders = orders.filter(order => {
          const orderTime = new Date(order.createTime).getTime()
          return orderTime >= new Date(startTime).getTime() && orderTime <= new Date(endTime).getTime()
        })
      }
      
      const total = orders.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: {
          list: orders.slice(start, end),
          total
        }
      }
    }
  },
  
  // 获取订单详情
  {
    url: '/api/orders/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const order = generateOrders(1)[0]
      order.id = params.id
      
      return {
        code: 0,
        message: 'success',
        data: order
      }
    }
  },
  
  // 更新订单状态
  {
    url: '/api/orders/:id/status',
    method: 'put',
    response: ({ params, body }: { params: { id: string }, body: { status: OrderStatus } }) => {
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
  
  // 取消订单
  {
    url: '/api/orders/:id/cancel',
    method: 'put',
    response: ({ params, body }: { params: { id: string }, body: { reason: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: OrderStatus.CANCELLED,
          cancelReason: body.reason,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },

  // 退款订单
  {
    url: '/api/orders/:id/refund',
    method: 'put',
    response: ({ params, body }: { params: { id: string }, body: { reason: string } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: params.id,
          status: OrderStatus.REFUNDED,
          refundReason: body.reason,
          refundTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  
  // 导出订单
  {
    url: '/api/orders/export',
    method: 'get',
    response: ({ query }: { query: OrderListParams }) => {
      // 实际场景中应该返回二进制文件
      // 这里模拟返回成功消息
      return {
        code: 0,
        message: 'success',
        data: new Blob(['模拟的订单数据文件内容'], { type: 'application/vnd.ms-excel' })
      }
    }
  }
] as MockMethod[] 