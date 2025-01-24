import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import type { CategoryForm, CategoryQuery, CategoryVO, GoodsForm, GoodsQuery, GoodsVO } from '@/api/goods'

// 生成分类数据
const generateCategories = (count: number): CategoryVO[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.integer(1, 1000),
    parentId: Mock.Random.integer(0, 10),
    name: Mock.Random.ctitle(2, 6),
    sort: Mock.Random.integer(1, 100),
    status: Mock.Random.integer(0, 1),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// 生成商品数据
const generateGoods = (count: number): GoodsVO[] => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.integer(1, 1000),
    categoryId: Mock.Random.integer(1, 100),
    categoryName: Mock.Random.ctitle(2, 6),
    name: Mock.Random.ctitle(5, 20),
    description: Mock.Random.cparagraph(1, 3),
    price: Mock.Random.float(1, 1000, 2, 2),
    stock: Mock.Random.integer(0, 1000),
    status: Mock.Random.integer(0, 1),
    images: Array.from({ length: Mock.Random.integer(1, 5) }, () => Mock.Random.image('200x200')),
    detail: Mock.Random.cparagraph(3, 7),
    createTime: Mock.Random.datetime(),
    updateTime: Mock.Random.datetime()
  }))
}

// Mock 接口
export default [
  // 分类相关接口
  {
    url: '/api/goods/category/list',
    method: 'get',
    response: ({ query }: { query: CategoryQuery }) => {
      const { name, status } = query
      let categories = generateCategories(50)
      
      if (name) {
        categories = categories.filter(category => category.name.includes(name))
      }
      if (status !== undefined) {
        categories = categories.filter(category => category.status === status)
      }
      
      return {
        code: 0,
        message: 'success',
        data: categories
      }
    }
  },
  {
    url: '/api/goods/category',
    method: 'post',
    response: ({ body }: { body: CategoryForm }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.integer(1, 1000),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/category/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: CategoryForm }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: parseInt(params.id),
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/category/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },
  {
    url: '/api/goods/category/:id/status',
    method: 'patch',
    response: ({ params, body }: { params: { id: string }; body: { status: number } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: parseInt(params.id),
          status: body.status,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },

  // 商品相关接口
  {
    url: '/api/goods/list',
    method: 'get',
    response: ({ query }: { query: GoodsQuery }) => {
      const { page = 1, pageSize = 10, categoryId, name, status, minPrice, maxPrice, minStock, maxStock } = query
      
      let goods = generateGoods(100)
      
      // 根据查询条件筛选
      if (categoryId) {
        goods = goods.filter(item => item.categoryId === categoryId)
      }
      if (name) {
        goods = goods.filter(item => item.name.includes(name))
      }
      if (status !== undefined) {
        goods = goods.filter(item => item.status === status)
      }
      if (minPrice !== undefined) {
        goods = goods.filter(item => item.price >= minPrice)
      }
      if (maxPrice !== undefined) {
        goods = goods.filter(item => item.price <= maxPrice)
      }
      if (minStock !== undefined) {
        goods = goods.filter(item => item.stock >= minStock)
      }
      if (maxStock !== undefined) {
        goods = goods.filter(item => item.stock <= maxStock)
      }
      
      const total = goods.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 0,
        message: 'success',
        data: goods.slice(start, end)
      }
    }
  },
  {
    url: '/api/goods',
    method: 'post',
    response: ({ body }: { body: GoodsForm }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: Mock.Random.integer(1, 1000),
          ...body,
          createTime: Mock.Random.datetime(),
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: GoodsForm }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: parseInt(params.id),
          ...body,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 0,
        message: 'success'
      }
    }
  },
  {
    url: '/api/goods/:id/status',
    method: 'patch',
    response: ({ params, body }: { params: { id: string }; body: { status: number } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: parseInt(params.id),
          status: body.status,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/:id/stock',
    method: 'patch',
    response: ({ params, body }: { params: { id: string }; body: { stock: number } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: parseInt(params.id),
          stock: body.stock,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/:id/price',
    method: 'patch',
    response: ({ params, body }: { params: { id: string }; body: { price: number } }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: parseInt(params.id),
          price: body.price,
          updateTime: Mock.Random.datetime()
        }
      }
    }
  },
  {
    url: '/api/goods/import',
    method: 'post',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: {
          successCount: Mock.Random.integer(10, 100),
          failCount: Mock.Random.integer(0, 10),
          failReasons: Array.from({ length: Mock.Random.integer(0, 5) }, () => ({
            row: Mock.Random.integer(1, 100),
            reason: Mock.Random.sentence(5, 10)
          }))
        }
      }
    }
  },
  {
    url: '/api/goods/export',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: new Blob(['模拟的商品数据文件内容'], { type: 'application/vnd.ms-excel' })
      }
    }
  }
] as MockMethod[] 