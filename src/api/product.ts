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
  return request({
    url: '/product/category/list',
    method: 'get',
    params
  })
}

// 获取所有分类（用于下拉选择）
export const getAllCategories = () => {
  return request({
    url: '/product/category/all',
    method: 'get'
  })
}

// 创建分类
export const createCategory = (data: Category) => {
  return request({
    url: '/product/category',
    method: 'post',
    data
  })
}

// 更新分类
export const updateCategory = (data: Category) => {
  return request({
    url: `/product/category/${data.id}`,
    method: 'put',
    data
  })
}

// 删除分类
export const deleteCategory = (id: number) => {
  return request({
    url: `/product/category/${id}`,
    method: 'delete'
  })
}

// 更新分类状态
export const updateCategoryStatus = (id: number, status: number) => {
  return request({
    url: `/product/category/${id}/status`,
    method: 'put',
    data: { status }
  })
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
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

// 获取商品详情
export const getProductDetail = (id: number) => {
  return request({
    url: `/product/${id}`,
    method: 'get'
  })
}

// 创建商品
export const createProduct = (data: Product) => {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

// 更新商品
export const updateProduct = (data: Product) => {
  return request({
    url: `/product/${data.id}`,
    method: 'put',
    data
  })
}

// 删除商品
export const deleteProduct = (id: number) => {
  return request({
    url: `/product/${id}`,
    method: 'delete'
  })
}

// 更新商品状态（上下架）
export const updateProductStatus = (id: number, status: number) => {
  return request({
    url: `/product/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 更新商品库存
export const updateProductStock = (id: number, stock: number) => {
  return request({
    url: `/product/${id}/stock`,
    method: 'put',
    data: { stock }
  })
}

// 更新商品价格
export const updateProductPrice = (id: number, price: number) => {
  return request({
    url: `/product/${id}/price`,
    method: 'put',
    data: { price }
  })
} 