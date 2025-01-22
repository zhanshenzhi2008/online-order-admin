import request from '@/utils/request'
import type { PageParams } from '@/types/common'

/**
 * 商品分类相关接口
 */

// 分类列表查询参数
export interface CategoryQuery extends PageParams {
  name?: string
  status?: number
}

// 分类信息
export interface Category {
  id?: number
  parentId: number
  name: string
  sort: number
  status: number
  createTime?: string
  updateTime?: string
}

// 获取分类列表
export const getCategoryList = (params: CategoryQuery) => {
  return request.get('/product/category/list', params)
}

// 获取所有分类（用于下拉选择）
export const getAllCategories = () => {
  return request.get('/product/category/all')
}

// 创建分类
export const createCategory = (data: Category) => {
  return request.post('/product/category', data)
}

// 更新分类
export const updateCategory = (data: Category) => {
  return request.put(`/product/category/${data.id}`, data)
}

// 删除分类
export const deleteCategory = (id: number) => {
  return request.delete(`/product/category/${id}`)
}

// 更新分类状态
export const updateCategoryStatus = (id: number, status: number) => {
  return request.put(`/product/category/${id}/status`, { status })
}

/**
 * 商品相关接口
 */

// 商品列表查询参数
export interface ProductQuery extends PageParams {
  name?: string
  categoryId?: number
  status?: number
  minPrice?: number
  maxPrice?: number
}

// 商品信息
export interface Product {
  id?: number
  categoryId: number
  name: string
  description: string
  price: number
  stock: number
  status: number
  images: string[]
  createTime?: string
  updateTime?: string
}

// 获取商品列表
export const getProductList = (params: ProductQuery) => {
  return request.get('/product/list', params)
}

// 获取商品详情
export const getProductDetail = (id: number) => {
  return request.get(`/product/${id}`)
}

// 创建商品
export const createProduct = (data: Product) => {
  return request.post('/product', data)
}

// 更新商品
export const updateProduct = (data: Product) => {
  return request.put(`/product/${data.id}`, data)
}

// 删除商品
export const deleteProduct = (id: number) => {
  return request.delete(`/product/${id}`)
}

// 更新商品状态（上下架）
export const updateProductStatus = (id: number, status: number) => {
  return request.put(`/product/${id}/status`, { status })
}

// 更新商品库存
export const updateProductStock = (id: number, stock: number) => {
  return request.put(`/product/${id}/stock`, { stock })
}

// 更新商品价格
export const updateProductPrice = (id: number, price: number) => {
  return request.put(`/product/${id}/price`, { price })
} 