import request from '@/utils/request'
import type { PageParams } from '@/types/common'

// 商品分类相关接口
export interface CategoryForm {
  id?: number
  parentId: number
  name: string
  sort: number
  status: number
}

export interface CategoryQuery extends PageParams {
  name?: string
  status?: number
}

export interface CategoryVO {
  id: number
  parentId: number
  name: string
  sort: number
  status: number
  createTime: string
  updateTime: string
}

// 获取分类列表
export const getCategoryList = (params: CategoryQuery) => {
  return request.get<CategoryVO[]>('/goods/category/list', { params })
}

// 创建分类
export const createCategory = (data: CategoryForm) => {
  return request.post('/goods/category', data)
}

// 更新分类
export const updateCategory = (data: CategoryForm) => {
  return request.put(`/goods/category/${data.id}`, data)
}

// 删除分类
export const deleteCategory = (id: number) => {
  return request.delete(`/goods/category/${id}`)
}

// 更新分类状态
export const updateCategoryStatus = (id: number, status: number) => {
  return request.patch(`/goods/category/${id}/status`, { status })
}

// 商品相关接口
export interface GoodsForm {
  id?: number
  categoryId: number
  name: string
  description: string
  price: number
  stock: number
  status: number
  images: string[]
  detail: string
}

export interface GoodsQuery extends PageParams {
  categoryId?: number
  name?: string
  status?: number
  minPrice?: number
  maxPrice?: number
  minStock?: number
  maxStock?: number
}

export interface GoodsVO {
  id: number
  categoryId: number
  categoryName: string
  name: string
  description: string
  price: number
  stock: number
  status: number
  images: string[]
  detail: string
  createTime: string
  updateTime: string
}

// 获取商品列表
export const getGoodsList = (params: GoodsQuery) => {
  return request.get<GoodsVO[]>('/goods/list', { params })
}

// 创建商品
export const createGoods = (data: GoodsForm) => {
  return request.post('/goods', data)
}

// 更新商品
export const updateGoods = (data: GoodsForm) => {
  return request.put(`/goods/${data.id}`, data)
}

// 删除商品
export const deleteGoods = (id: number) => {
  return request.delete(`/goods/${id}`)
}

// 更新商品状态
export const updateGoodsStatus = (id: number, status: number) => {
  return request.patch(`/goods/${id}/status`, { status })
}

// 更新商品库存
export const updateGoodsStock = (id: number, stock: number) => {
  return request.patch(`/goods/${id}/stock`, { stock })
}

// 更新商品价格
export const updateGoodsPrice = (id: number, price: number) => {
  return request.patch(`/goods/${id}/price`, { price })
}

// 批量导入商品
export const importGoods = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/goods/import', formData)
}

// 导出商品
export const exportGoods = (params: GoodsQuery) => {
  return request.get('/goods/export', {
    params,
    responseType: 'blob'
  })
} 