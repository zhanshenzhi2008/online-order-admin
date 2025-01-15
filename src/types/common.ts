// 分页参数
export interface PageParams {
  page?: number
  pageSize?: number
}

// 分页响应
export interface PageResult<T> {
  list: T[]
  total: number
}

// 通用响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 通用状态
export enum Status {
  DISABLED = 0,
  ENABLED = 1
}

// 文件类型
export interface FileInfo {
  url: string
  name: string
  size: number
}

// 选项类型
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

// 树节点类型
export interface TreeNode {
  id: number
  parentId: number
  children?: TreeNode[]
  [key: string]: any
} 