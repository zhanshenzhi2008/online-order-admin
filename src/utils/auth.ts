import type { UserInfo } from '@/types/user'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// 获取 token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置 token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除 token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// 获取用户信息
export const getUser = (): UserInfo | null => {
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

// 设置用户信息
export const setUser = (user: UserInfo): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// 移除用户信息
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// 登出
export const logout = (): void => {
  removeToken()
  removeUser()
} 